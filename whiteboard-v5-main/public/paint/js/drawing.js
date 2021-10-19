class Drawing {
  constructor(whiteboard, isLocal) {
    this.whiteboard = whiteboard;
    console.log("isocal", isLocal);
    if (!isLocal) return this.setup();

    this.tools = {
      brush: this.brush.bind(this),
      eraser: this.eraser.bind(this),
    };
    this.prepareTools = { eraser: this.prepareEraser.bind(this) };

    this.setupLocal();
  }
  setup() {
    this.ppts = [];
    Socket.socket.on("mouse", (mouse) => {
      if (mouse.clear) return Canvas.clearMain(); //FIXME its doing it several times
      if (mouse.nick !== this.whiteboard.nick) return;
      if (mouse.start) {
        this.whiteboard.ctx.lineWidth = mouse.properties.lineWidth;
        this.whiteboard.ctx.strokeStyle = mouse.properties.color;
        this.whiteboard.ctx.fillStyle = mouse.properties.color;
      }
      this.ppts.push(mouse);
      this.onPaint();

      if (mouse.end) {
        this.ppts = [];
        Canvas.mainCanvas.ctx.drawImage(this.whiteboard.canvas, 0, 0);
        this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);
        Canvas.saveMain();
      }
    });
  }
  setupLocal() {
    this.mouse;
    this.ppts = [];

    window.addEventListener(
      "pointermove",
      (e) => {
        this.mouse = Mouse.getPos(e);
      },
      false
    );

    window.addEventListener(
      "pointerdown",
      (e) => {
        if (this.prepareTools[this.whiteboard.tool]) this.prepareTools[this.whiteboard.tool]();

        window.addEventListener("pointermove", this.tools[this.whiteboard.tool], false);

        this.mouse = Mouse.getPos(e);
        this.ppts.push(this.mouse);
        ////////////////////////!
        //Problems with color input :/ workaround down here
        console.log(this.whiteboard.tool);
        if (this.whiteboard.tool !== "eraser") {
          console.log("color:", elements.controls.color.I.value);
          this.mouse.properties = { color: elements.controls.color.I.value, lineWidth: this.whiteboard.lineWidth };
          console.log("cooolor: ", this.mouse.properties);
        } else {
          this.mouse.properties = { color: this.whiteboard.ctx.strokeStyle, lineWidth: this.whiteboard.lineWidth };
        }
        this.mouse.start = true;
        ////////////////////////!

        this.tools[this.whiteboard.tool]();
      },
      false
    );

    window.addEventListener(
      "pointerup",
      () => {
        window.removeEventListener("pointermove", this.tools[this.whiteboard.tool], false);

        Canvas.mainCanvas.ctx.drawImage(this.whiteboard.canvas, 0, 0);

        this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);

        Canvas.saveMain();
        //////////////////////////////////!
        if (whiteboardConfig.canDraw) {
          this.mouse.end = true;
          Socket.sendMouse(this.mouse);
        }
        //////////////////////////////////!
        this.ppts = [];

        if (!this.doOnEnd) return;
        this.doOnEnd();
        delete this.doOnEnd;
      },
      false
    );
  }
  prepareToPaint() {
    if (!whiteboardConfig.canDraw) return;
    this.ppts.push(this.mouse);
    ////////////////////!
    Socket.sendMouse(this.mouse);
    ////////////////////!
    this.onPaint();
  }
  onPaint() {
    if (this.ppts.length < 3) {
      let b = this.ppts[0];

      this.whiteboard.ctx.beginPath();
      this.whiteboard.ctx.arc(b.x, b.y, this.whiteboard.ctx.lineWidth / 2, 0, Math.PI * 2, !0);
      this.whiteboard.ctx.fill();
      this.whiteboard.ctx.closePath();
      return;
    }

    this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);

    this.whiteboard.ctx.beginPath();
    this.whiteboard.ctx.moveTo(this.ppts[0].x, this.ppts[0].y);

    for (let i = 1; i < this.ppts.length - 2; i++) {
      let c = (this.ppts[i].x + this.ppts[i + 1].x) / 2;
      let d = (this.ppts[i].y + this.ppts[i + 1].y) / 2;
      this.whiteboard.ctx.quadraticCurveTo(this.ppts[i].x, this.ppts[i].y, c, d);
    }

    // For the last 2 points
    let i = this.ppts.length - 2;
    this.whiteboard.ctx.quadraticCurveTo(this.ppts[i].x, this.ppts[i].y, this.ppts[i + 1].x, this.ppts[i + 1].y);
    this.whiteboard.ctx.stroke();
  }
  brush() {
    this.prepareToPaint();
  }
  prepareEraser() {
    this.lastColor = this.whiteboard.ctx.strokeStyle;
    this.doOnEnd = () => this.whiteboard.setColor(this.lastColor);
    this.whiteboard.setColor("#ffffff");
    //** white pixels are removing in Canvas.getMainImgSrc method
  }
  eraser() {
    //TODO add eraser cursor
    this.prepareToPaint();
  }
}
