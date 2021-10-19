const database = require("./db/database");
const valid = require("./valid");
const error = require("./error");
const boardConfig = require("./config/board");
module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("createBoard", async (callback) => {
      try {
        if (!valid.callback(callback, socket)) return;

        let { success, board, token } = await database.createBoard(socket.id);
        callback(success, board, token);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("addUser", async (board, callback) => {
      try {
        if (!valid.board(board) || !valid.callback(callback, socket)) return;

        let { success, token } = await database.addUser(board, socket.id);
        callback(success, token);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("checkBoard", async (board, callback) => {
      try {
        if (!valid.board(board) || !valid.callback(callback, socket)) return;

        callback(await database.boardExists(board));
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("authMe", async (board, user, callback) => {
      console.log(socket.rooms);
      try {
        if (!valid.board(board) || !valid.callback(callback, socket)) return;

        if (!valid.user(user)) {
          let { success, token } = await database.addUser(board, socket.id);
          callback(success, { token, perm: 0, drawingProperties: boardConfig.defaultDrawingProperties }, false);
        }

        socket.join(board);

        let userExists = await database.userExists(board, user.token);
        if (!userExists.success) return callback(userExists.success);

        if (userExists.exists) {
          let updateSocket = await database.updateSocket(board, user.token, socket.id);
          if (!updateSocket.success) return callback(updateSocket.success);

          let perm = 0;
          switch (user.perm) {
            case 1:
              let isSuperUser = await database.isSuperUser(board, user.token);
              if (!isSuperUser.success) return callback(isSuperUser.success);
              if (isSuperUser.isSuperUser) perm = 1;
              break;
            case 2:
              let isAdmin = await database.isAdmin(board, user.token);
              if (!isAdmin.success) return callback(isAdmin.success);
              if (isAdmin.isAdmin) perm = 2;
              break;
            default:
              break;
          }
          user.perm = perm;
          let foundUser = await database.getUser(board, user.token);
          if (!foundUser.success) return callback(foundUser.success);
          user.nick = foundUser.user.nick;

          if (user.nick) {
            user.drawingProperties = foundUser.user.drawingProperties;
            return callback(true, user, true);
          }
          user.drawingProperties = boardConfig.defaultDrawingProperties;
          return callback(true, user, false);
        } else {
          let { success, token } = await database.addUser(board, socket.id);
          callback(success, { token, perm: 0, drawingProperties: boardConfig.defaultDrawingProperties }, false);
        }
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("updateNick", async (board, token, nick, callback) => {
      try {
        if (!valid.board(board) || !valid.token(token) || !valid.nick(nick) || !valid.callback(callback, socket)) return;

        let { success, nickChanged } = await database.updateNick(board, token, nick);
        callback(success, nickChanged);

        io.to(board).emit("newUser", nick);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("mouse", async (auth, mouse) => {
      //TODO validate mouse
      try {
        if (!auth || !valid.board(auth.board) || !valid.token(auth.token)) return;
        let { success, isSuperUser } = await database.isSuperUser(auth.board, auth.token);
        if (!success) throw `err isSuperUser, db`;

        if (isSuperUser) return io.to(auth.board).emit("mouse", mouse);

        console.log(`permision denited ${socket} (or user desnt exists)`);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("getBasicData", async (board, callback) => {
      try {
        if (!valid.board(board) || !valid.callback(callback)) return;
        let adminSocket = await database.getAdminSocket(board);
        if (!adminSocket.success) return callback(adminSocket.err);

        if (adminSocket.socket !== socket.id) {
          io.to(adminSocket.socket).emit("getImg", board, socket.id);
        } else {
          let { success, users } = await database.getBasicData(board);
          if (!success) return io.to(socket.id).emit("basicData", success);

          io.to(socket.id).emit("basicData", true, users);
        }

        return callback(true);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("sendBasicData", async (board, token, socket, img) => {
      try {
        if (!valid.board(board) || !valid.token(token) || !valid.socketId(socket)) return;

        let admin = await database.isAdmin(board, token);
        if (!admin.success) return io.to(socket).emit("basicData", success);
        if (!admin.isAdmin) return;

        let { success, users } = await database.getBasicData(board);
        if (!success) return io.to(socket).emit("basicData", success);

        io.to(socket).emit("basicData", true, users, img);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
    socket.on("changePowers", async (board, adminToken, nick) => {
      try {
        if (!valid.board(board) || !valid.token(adminToken) || !valid.nick(nick)) return;

        let { success, changed } = await database.changePowers(board, adminToken, nick);
        if (success && changed) socket.to(board).emit("changePowers", nick);
      } catch (err) {
        console.log(err);
        error.socket(err);
      }
    });
  });
};
