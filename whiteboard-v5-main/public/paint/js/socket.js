class Socket {
  static socket = io();
  static authMe(whiteboard) {
    let me = Storage.get("me");
    let board = Storage.get("board");
    this.socket.emit("authMe", board, me, (success, meAuth, hasNick) => {
      if (!success) return (location.href = `${location.origin}/err`);

      new Whiteboard({ isLocal: true }, meAuth.drawingProperties.color, meAuth.drawingProperties.lineWidth, meAuth.drawingProperties.tool);

      if (meAuth.perm == 2) {
        this.sendImg();
        Canvas.redrawMain();
      }
      console.log(meAuth);
      Storage.set("me", meAuth);
      if (hasNick) {
        whiteboardConfig.shotrcutsEnabled = true;
        Nick.hideCurtain();
        Socket.getBasicData();
      } else {
        new Nick();
      }
    });
  }
  static updateMyNick(nick, callback) {
    let token = Storage.get("me").token;
    let board = Storage.get("board");
    this.socket.emit("updateNick", board, token, nick, callback);
  }
  static getBasicData() {
    console.log("get basics");
    let board = Storage.get("board");
    this.socket.emit("getBasicData", board, (success) => {
      if (!success) return (location.href = `${location.origin}/err`);
    });
    this.socket.on("basicData", (success, users, img) => {
      if (!success) return (location.href = `${location.origin}/err`);
      new Settings(users);
      if (img) Whiteboard.redrawMain(img);

      if (Storage.get("me").perm !== 0) Inputs.show();
    });
  }
  static sendMouse(mouse) {
    let nick = Storage.get("me").nick;
    mouse.nick = nick; //TODO ceate class to with tjis property
    let token = Storage.get("me").token;
    let board = Storage.get("board");
    let auth = { token, board };
    this.socket.emit("mouse", auth, mouse);
  }
  static clearCanvas() {
    let token = Storage.get("me").token;
    let board = Storage.get("board");
    let auth = { token, board };
    this.socket.emit("mouse", auth, { clear: true });
  }
  static sendImg() {
    Socket.socket.on("getImg", (board, socket) => {
      let img = Storage.get("img");
      let token = Storage.get("me").token;
      Socket.socket.emit("sendBasicData", board, token, socket, img);
    });
  }
  static changePowers(nick) {
    let token = Storage.get("me").token;
    let board = Storage.get("board");
    Socket.socket.emit("changePowers", board, token, nick);
  }
  static onChangePowers() {
    this.socket.on("changePowers", (nick) => {
      Settings.changePowers(nick);
      let me = Storage.get("me");
      if (me.nick == nick) {
        switch (me.perm) {
          case 0:
            me.perm = 1;
            Storage.set("me", me);
            whiteboardConfig.canDraw = true;
            Inputs.show();
            break;
          case 1:
            me.perm = 0;
            Storage.set("me", me);
            whiteboardConfig.canDraw = false;
            Inputs.hide();
            break;
          default:
            break;
        }
      }
    });
  }
  static onNewUser() {
    this.socket.on("newUser", (nick) => {
      Settings.onNewUser(nick);
    });
  }
}
