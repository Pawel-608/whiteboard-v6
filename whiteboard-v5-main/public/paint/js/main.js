class Main {
  constructor() {
    // window.addEventListener("beforeunload", function (e) {
    //   e.preventDefault();
    //   e.returnValue = "";
    //   console.log("trying to exit");
    // });

    this.setBoard();
    let me = Storage.get("me");
    if (!me) {
      Storage.set("me", { perm: 0 });
    } else if (me.perm == undefined) {
      me.perm = 0;
      Storage.set("me", me);
    }

    new Whiteboard({ isMainCanvas: true });
    this.downloadSetup();

    this.auth();
  }
  setBoard() {
    let boardRegex = new RegExp("[a-zA-Z0-9]{8}", "g");
    let board = location.href.match(boardRegex);
    Storage.set("board", board[board.length - 1]);
  }
  auth() {
    Socket.authMe();
  }
  downloadSetup() {
    elements.download.addEventListener("click", () => {
      let image = Canvas.getMainImgSrc();
      elements.download.href = image;
    });
  }
}
new Main();
