class Canvas {
  static mainCanvas;

  static saveMain() {
    let img = Canvas.getMainImgSrc();
    Storage.set("img", img);
  }
  static redrawMain(imgSrc = Storage.get("img")) {
    if (!imgSrc) return;

    let img = new Image();
    img.src = imgSrc;
    img.addEventListener("load", () => Canvas.mainCanvas.ctx.drawImage(img, 0, 0));
  }
  static clearMain() {
    Canvas.mainCanvas.ctx.clearRect(0, 0, Canvas.mainCanvas.canvas.width, Canvas.mainCanvas.canvas.height);
  }
  static getMainImgSrc() {
    let imgd = Canvas.mainCanvas.ctx.getImageData(0, 0, Canvas.mainCanvas.canvas.width, Canvas.mainCanvas.canvas.height),
      pix = imgd.data,
      newColor = { r: 0, g: 0, b: 0, a: 0 };

    for (let i = 0; i < pix.length; i += 4) {
      let r = pix[i],
        g = pix[i + 1],
        b = pix[i + 2];

      if (r == 255 && g == 255 && b == 255) {
        // Change the white to the new color.
        pix[i] = newColor.r;
        pix[i + 1] = newColor.g;
        pix[i + 2] = newColor.b;
        pix[i + 3] = newColor.a;
      }
    }

    Canvas.mainCanvas.ctx.clearRect(0, 0, Canvas.mainCanvas.canvas.width, Canvas.mainCanvas.canvas.height);
    Canvas.mainCanvas.ctx.putImageData(imgd, 0, 0);

    return Canvas.mainCanvas.canvas.toDataURL("image/png");
  }

  constructor(isMainCanvas) {
    this.createCanvas();
    if (isMainCanvas) Canvas.mainCanvas = this;
  }
  createCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = window.screen.availWidth;
    this.canvas.height = window.screen.availHeight;
    this.ctx = this.canvas.getContext("2d");
    // this.ctx.imageSmoothingQuality = "high";

    document.body.appendChild(this.canvas);
  }
}
class Whiteboard extends Canvas {
  constructor({ isMainCanvas = false, isLocal = false, nick = "" }, color, lineWidth, tool) {
    super(isMainCanvas);
    if (isMainCanvas) return;
    if (nick) this.nick = nick;

    //**IF properties Are UNDEFINED CREATING BLANK CANVAS
    if (color && lineWidth && tool) this.setProperties(color, lineWidth, tool);

    this.setupDrawing(isLocal);
    if (isLocal) this.setupLocal();
  }
  setupLocal() {
    this.setupControls();
    this.setupTools();
  }
  setupControls() {
    elements.controls.lineWidth.I.addEventListener("change", (e) => Controls.changeLineWidth(e, this));
    elements.controls.color.I.addEventListener("change", (e) => Controls.changeColor(e, this));
  }
  setupTools() {
    elements.tools.addEventListener("click", (e) => this.setTool(e.target.className));
    window.addEventListener("keypress", (e) => {
      shortcuts.forEach((shortcut) => {
        if (e.key.toLowerCase() == shortcut.key && whiteboardConfig.shotrcutsEnabled) this.setTool(shortcut.name);
      });
    });
  }
  setupDrawing(isLocal) {
    this.drawing = new Drawing(this, isLocal);
  }
  setProperties(color, lineWidth, tool, lineJoin = whiteboardConfig.lineJoin, lineCap = whiteboardConfig.lineCap) {
    this.setColor(color);
    this.setLineWidth(lineWidth);
    this.setTool(tool);
    this.setLineJoin(lineJoin);
    this.setLineCap(lineCap);
  }
  setColor(color) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
  }
  setLineWidth(lineWidth) {
    //TODO add pressure control
    this.lineWidth = lineWidth;
    this.ctx.lineWidth = lineWidth;
  }
  setLineJoin(lineJoin) {
    this.ctx.lineJoin = lineJoin;
  }
  setLineCap(lineCap) {
    this.ctx.lineCap = lineCap;
  }
  setTool(tool) {
    if (tool == "tools") return; //If user click on nav( not on tool icon ) just return
    if (tool == "hide clear") {
      Socket.clearCanvas();
      Whiteboard.clearMain();
      tool = "eraser";
    }
    let previousTool = this.tool;
    Tools.change(previousTool, tool);
    this.tool = tool;
  }
}
