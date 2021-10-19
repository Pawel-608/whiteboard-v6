const mongoose = require("mongoose");
const models = require("./models");
const uuid = require("uuid");
const error = require("../error");
const boardConfig = require("../config/board");
const { Board } = require("./models");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

try {
  mongoose.connect("mongodb://127.0.0.1:27017/whiteboard", { useUnifiedTopology: true });
} catch (err) {
  console.log(err);
  error.db(err);
}
let getMainToken = async () => {
  try {
    let token = await getToken(),
      board = token.substr(0, 8);

    if (await Board.exists({ board: board })) return getMainToken();

    return { token, board };
  } catch (err) {
    console.log(err);
    error.db(err);
  }
};
let getToken = async () => {
  try {
    let token = uuid.v4();

    if (await Board.exists({ "users.token": token })) return getToken();

    return token;
  } catch (err) {
    console.log(err);
    error.db(err);
  }
};

let createBoard = async (socketId) => {
  try {
    const { token, board } = await getMainToken();

    let newBoard = new models.Board({
      board: board,
      superUsers: [{ token }],
      admin: { token },
    });

    await newBoard.save();
    let { success } = await addUser(board, socketId, token);

    return { success, board, token };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let addUser = async (board, socketId, token = "") => {
  try {
    if (!token) token = await getToken();

    await Board.updateOne({ board }, { $push: { users: { token, socket: socketId, drawingProperties: boardConfig.defaultDrawingProperties } } });

    return { success: true, token };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let addSuperUser = async (board, token) => {
  try {
    await Board.updateOne({ board }, { $push: { superUsers: { token } } });
    return { success: true };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let deleteSuperUser = async (board, token) => {
  try {
    await Board.updateOne({ board }, { $pull: { superUsers: { token } } });
    return { success: true };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let isSuperUser = async (board, token) => {
  try {
    if (await Board.exists({ board, "superUsers.token": token })) return { success: true, isSuperUser: true };
    return { success: true, isSuperUser: false };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let isAdmin = async (board, token) => {
  try {
    if (await Board.exists({ board, admin: { token } })) return { success: true, isAdmin: true };
    return { success: true, isAdmin: false };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let boardExists = async (board) => {
  try {
    let exists = await Board.exists({ board });
    return { success: true, exists };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let userExists = async (board, token) => {
  try {
    let exists = await Board.exists({ board, "users.token": token });
    return { success: true, exists };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let getBoard = async (board) => {
  try {
    let user = await Board.findOne({ board });
    return { success: true, user };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let getUser = async (board, token) => {
  try {
    let foundBoard = await Board.findOne({ board, "users.token": token }),
      user;

    if (foundBoard) user = foundBoard.users.find((elem) => elem.token == token);

    return { success: true, user };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let isNickUnique = async (board, nick) => {
  try {
    let exists = await Board.exists({ board, "users.nick": nick });
    console.log("Is nick unique", !exists);
    return { success: true, isUnique: !exists };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let updateNick = async (board, token, nick) => {
  try {
    let { success, isUnique } = await isNickUnique(board, nick);
    if (!success) return { success };
    if (!isUnique) return { success: true, nickChanged: false };

    console.log(
      "updating nick:",
      await Board.updateOne(
        { board, "users.token": token },
        {
          $set: {
            "users.$.nick": nick,
          },
        }
      )
    );
    return { success: true, nickChanged: true };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let updateSocket = async (board, token, socketId) => {
  try {
    console.log(
      await Board.updateOne(
        { board, "users.token": token },
        {
          $set: {
            "users.$.socket": socketId,
          },
        }
      )
    );
    return { success: true };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let getBasicData = async (board) => {
  try {
    let boardData = await Board.findOne({ board });

    let superUsersTokens = [],
      users = [],
      adminSocket = "",
      adminToken = boardData.admin.token;

    boardData.superUsers.forEach((superUser) => {
      superUsersTokens.push(superUser.token);
    });
    boardData.users.forEach((user) => {
      if (!user.nick) return;
      let userToReturn = { nick: user.nick };
      superUsersTokens.forEach((token) => {
        if (token == user.token) userToReturn.isSuperUser = true;
      });
      if (user.token == adminToken) userToReturn.isAdmin = true;
      users.push(userToReturn);
    });

    return { success: true, users, adminSocket };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let getAdminSocket = async (board) => {
  try {
    let boardData = await Board.findOne({ board });
    let token = boardData.admin.token;
    let admin = boardData.users.find((user) => user.token == token);

    return { success: true, socket: admin.socket };
  } catch (err) {
    console.log(err);
    error.db(err);
    return { success: false };
  }
};
let changePowers = async (board, adminToken, nick) => {
  let boardData = await Board.findOne({ board, "admin.token": adminToken, "users.nick": nick });
  if (!boardData) {
    error.db("chaneg powers, permission denited");
    return { success: true, changed: false };
  }
  let userToken = boardData.users.find((user) => user.nick == nick).token;

  if (adminToken == userToken) {
    console.log("can not change admin powers");
    return { success: true, changed: false };
  }

  if (boardData.superUsers.find((user) => user.token == userToken)) {
    deleteSuperUser(board, userToken);
  } else {
    addSuperUser(board, userToken);
  }
  return { success: true, changed: true };
};
module.exports = {
  createBoard,
  addUser,
  boardExists,
  userExists,
  addSuperUser,
  deleteSuperUser,
  isAdmin,
  isSuperUser,
  getUser,
  getBoard,
  updateNick,
  updateSocket,
  getBasicData,
  getAdminSocket,
  changePowers,
};
