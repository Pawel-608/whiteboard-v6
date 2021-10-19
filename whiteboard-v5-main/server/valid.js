const error = require("./error");
const boardConf = require("./config/board");

let nickRegex = new RegExp("[<,>.=,/]{1}");
let board = (board) => {
  if (typeof board == "number") board = board.toString();
  if (typeof board == "string" && board.length == boardConf.defaultLength) return true;

  error.valid(`invalid board: ${board}`);
  return false;
};
let callback = (callback, socket) => {
  if (typeof callback !== "function") {
    error.socket(`Callback: ${callback} is not a function ${typeof callback}`, socket);
    return false;
  }
  return true;
};
let token = (token) => {
  if (typeof token == "string" && token.length == 36) return true;
  error.valid(`invalid token: ${token}`);
  return false;
};
let nick = (nick) => {
  console.log(nick);
  if (typeof nick == "number") nick = nick.toString();
  console.log(nickRegex.test(nick));
  if (typeof nick == "string" && !(nick.length < 5 || nick.length > 20) && !nickRegex.test(nick)) return true;
  error.valid(`invalid nick: ${nick}`);
  return false;
};
let perm = (perm) => {
  if (perm == 0 || perm == 1 || perm == 2) return true;

  error.valid(`invalid perm: ${perm}`);
  return false;
};
let user = (user) => {
  if (!user) return false;

  if (user.nick) {
    if (token(user.token) && nick(user.nick) && perm(user.perm)) return true;
  } else {
    if (token(user.token) && perm(user.perm)) return true;
  }
  error.valid(`invalid user: ${user}`);
  return false;
};
let socketId = (socketId) => {
  if (typeof socketId == "number") socketId.toString();
  if (socketId && typeof socketId == "string" && socketId.length == 20) return true;

  error.valid(`invalid socket: ${socketId}`);
  return false;
};
module.exports = { board, callback, user, nick, token, socketId };
