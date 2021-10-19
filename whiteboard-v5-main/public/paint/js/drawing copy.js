class LinearFunction {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }
  getPerpendicularFunctionFormula(point) {
    let reverseA = -1 / this.a;
    let b = -(reverseA * point.x) + point.y;
    return new LinearFunction(reverseA, b);
  }
  static translate(functionFormula, vector) {
    return new LinearFunction(functionFormula.a, functionFormula.a * -vector.x + vector.y + functionFormula.b);
  }
  static getFormula(point_1, point_2) {
    let a = (point_2.y - point_1.y) / (point_2.x - point_1.x);
    let b = -(a * point_1.x) + point_1.y;
    return new LinearFunction(a, b);
  }
  static getCommonPoint(functionFormula_1, functionFormula_2) {
    let x = (functionFormula_2.b - functionFormula_1.b) / (functionFormula_1.a - functionFormula_2.a);
    let y = functionFormula_1.a * x + functionFormula_1.b;
    return new V2(x, y);
  }
}
class Drawing {
  constructor(whiteboard) {
    this.whiteboard = whiteboard;
    this.tools = {
      brush: this.brush.bind(this),
      eraser: this.eraser.bind(this),
    };
    this.prepareTools = { eraser: this.prepareEraser.bind(this) };

    this.setup();
  }
  setup() {
    //This function allows to remove event listener (You can not remove listener witch using anonymous arrow function)
    let callOnPaint = () => {
      this.tools[this.whiteboard.tool]();
    };

    this.mouse;
    this.ppts = [];
    this.ppts1 = []; //FIXME
    this.ppts2 = []; //FIXME

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

        window.addEventListener("pointermove", callOnPaint, false);

        this.mouse = Mouse.getPos(e);
        this.ppts.push(this.mouse);

        this.tools[this.whiteboard.tool]();
      },
      false
    );

    window.addEventListener(
      "pointerup",
      () => {
        window.removeEventListener("pointermove", callOnPaint, false);

        Canvas.mainCanvas.ctx.drawImage(this.whiteboard.canvas, 0, 0);

        this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);

        this.ppts = [];
        this.ppts1 = []; //FIXME
        this.ppts2 = []; //FIXME

        if (!this.doOnEnd) return;
        this.doOnEnd();
        delete this.doOnEnd;
      },
      false
    );
  }
  onPaint() {
    this.ppts.push(this.mouse);

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
  onPaint2() {
    this.ppts.push(this.mouse);

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
    for (let i = 1; i < this.ppts.length - 2; i++) {
      let c = (this.ppts[i].x + this.ppts[i + 1].x) / 2;
      let d = (this.ppts[i].y + this.ppts[i + 1].y) / 2;
      let e = (this.ppts[i].x + this.ppts[i - 1].x) / 2;
      let f = (this.ppts[i].y + this.ppts[i - 1].y) / 2;
      // this.whiteboard.ctx.moveTo(c - 10, d - 10);
      this.whiteboard.ctx.bezierCurveTo(this.ppts[i].x - 10, this.ppts[i].y - 10, this.ppts[i].x - 10, this.ppts[i].y - 10, c - 10, d - 10);
      this.whiteboard.ctx.lineTo(c + 10, d + 10);
      this.whiteboard.ctx.bezierCurveTo(this.ppts[i].x + 10, this.ppts[i].y + 10, this.ppts[i].x + 10, this.ppts[i].y + 10, e + 10, f + 10);
      this.whiteboard.ctx.lineTo(c - 10, d - 10);
      // this.whiteboard.ctx.bezierCurveTo(this.ppts[i].x - 10, this.ppts[i].y - 10, this.ppts[i].x - 10, this.ppts[i].y - 10, c - 10, d - 10);
    }
    // for (let i = this.ppts.length - 2; i > 1; i--) {
    //   let c = (this.ppts[i].x + this.ppts[i - 1].x) / 2;
    //   let d = (this.ppts[i].y + this.ppts[i - 1].y) / 2;
    //   this.whiteboard.ctx.bezierCurveTo(this.ppts[i].x + 10, this.ppts[i].y + 10, this.ppts[i].x + 10, this.ppts[i].y + 10, c + 10, d + 10);
    // }

    // this.whiteboard.ctx.bezierCurveTo(
    //   this.ppts[1].x - 10,
    //   this.ppts[1].y - 10,
    //   this.ppts[1].x - 10,
    //   this.ppts[1].y - 10,
    //   this.ppts[0].x - 10,
    //   this.ppts[0].y - 10
    // );
    this.whiteboard.ctx.stroke();
    this.whiteboard.ctx.fill();
  }
  brush() {
    this.onPaint();
  }
  prepareEraser() {
    this.lastColor = this.whiteboard.ctx.strokeStyle;
    this.doOnEnd = () => this.whiteboard.setColor(this.lastColor);
    this.whiteboard.setColor("#ffffff");
    //** white pixels are removing in Canvas.getMainImgSrc method
  }
  eraser() {
    //TODO add eraser cursor
    this.onPaint();
  }

  getQuadraticBezierXYatT(startPt, controlPt, endPt, T) {
    // console.log(startPt, controlPt, endPt, T);
    let x = Math.pow(1 - T, 2) * startPt.x + 2 * (1 - T) * T * controlPt.x + Math.pow(T, 2) * endPt.x;
    let y = Math.pow(1 - T, 2) * startPt.y + 2 * (1 - T) * T * controlPt.y + Math.pow(T, 2) * endPt.y;
    let pressure = ((startPt.pressure + endPt.pressure) / 2) * T;
    return new V2p(x, y, pressure);
  }
  getPoints(startPoint, controlPoint, endPoint) {
    let lineWidth_start = this.whiteboard.lineWidth * startPoint.pressure;
    let lineWidth_end = this.whiteboard.lineWidth * endPoint.pressure;

    let function_start = LinearFunction.getFormula(startPoint, controlPoint);
    let function_end = LinearFunction.getFormula(endPoint, controlPoint);

    let perpendicularFunction_start = function_start.getPerpendicularFunctionFormula(startPoint);
    let perpendicularFunction_end = function_end.getPerpendicularFunctionFormula(endPoint);

    let startPoint_1 = LinearFunction.getCommonPoint(
      LinearFunction.translate(function_start, new V2(lineWidth_start / 2, lineWidth_start / 2)),
      perpendicularFunction_start
    );
    let startPoint_2 = LinearFunction.getCommonPoint(
      LinearFunction.translate(function_start, new V2(-(lineWidth_start / 2), -(lineWidth_start / 2))),
      perpendicularFunction_start
    );
    let endPoint_1 = LinearFunction.getCommonPoint(
      LinearFunction.translate(function_end, new V2(lineWidth_end / 2, lineWidth_end / 2)),
      perpendicularFunction_end
    );
    let endPoint_2 = LinearFunction.getCommonPoint(
      LinearFunction.translate(function_end, new V2(-(lineWidth_end / 2), -(lineWidth_end / 2))),
      perpendicularFunction_end
    );

    let controlPoint_1 = V2.translate(controlPoint, new V2((lineWidth_start + lineWidth_end) / 4, (lineWidth_start + lineWidth_end) / 4)); //FIXME translate y too
    let controlPoint_2 = V2.translate(controlPoint, new V2(-((lineWidth_start + lineWidth_end) / 4), -((lineWidth_start + lineWidth_end) / 4)));

    //** */
    // let startPoint_1 = LinearFunction.getCommonPoint(
    //   LinearFunction.translate(function_start, new V2(lineWidth_start / 2, 0)),
    //   perpendicularFunction_start
    // );
    // let startPoint_2 = LinearFunction.getCommonPoint(
    //   LinearFunction.translate(function_start, new V2(-(lineWidth_start / 2), 0)),
    //   perpendicularFunction_start
    // );
    // let endPoint_1 = LinearFunction.getCommonPoint(LinearFunction.translate(function_end, new V2(lineWidth_end / 2, 0)), perpendicularFunction_end);
    // let endPoint_2 = LinearFunction.getCommonPoint(
    //   LinearFunction.translate(function_end, new V2(-(lineWidth_end / 2), 0)),
    //   perpendicularFunction_end
    // );

    // let controlPoint_1 = V2.translate(controlPoint, new V2((lineWidth_start + lineWidth_end) / 4, 0)); //FIXME translate y too
    // let controlPoint_2 = V2.translate(controlPoint, new V2(-((lineWidth_start + lineWidth_end) / 4), 0));
    //** */
    if (startPoint_1 == NaN || startPoint_2 == NaN || controlPoint_1 == NaN || controlPoint_2 == NaN || endPoint_1 == NaN || endPoint_2 == NaN) {
      console.log({
        lineWidth_start,
        lineWidth_end,
        function_start,
        function_end,
        perpendicularFunction_start,
        perpendicularFunction_end,
        startPoint_1,
        startPoint_2,
        endPoint_1,
        endPoint_2,
        controlPoint_1,
        controlPoint_2,
        lineWidth: this.whiteboard.lineWidth,
      });
    }

    return {
      start: {
        1: startPoint_1,
        2: startPoint_2,
      },
      control: {
        1: controlPoint_1,
        2: controlPoint_2,
      },
      end: {
        1: endPoint_1,
        2: endPoint_2,
      },
    };
  }
  onPaintPression() {
    this.ppts.push(this.mouse);

    if (this.ppts.length < 3) {
      let b = this.ppts[0];

      this.whiteboard.ctx.beginPath();
      this.whiteboard.ctx.arc(b.x, b.y, (this.whiteboard.ctx.lineWidth * b.pressure) / 2, 0, Math.PI * 2, !0);
      this.whiteboard.ctx.fill();
      return;
    }

    this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);

    // this.drawQuadraticCurve(this.getPoints(this.ppts[0], this.ppts[1], V2p.getPointsAverage(this.ppts[1], this.ppts[2])));
    this.formatPoints(this.getPoints(this.ppts[0], this.ppts[1], V2p.getPointsAverage(this.ppts[1], this.ppts[2])));

    this.whiteboard.ctx.lineWidth = 1; //FIXME

    for (let i = 1; i < this.ppts.length - 2; i++) {
      this.formatPoints(
        this.getPoints(V2p.getPointsAverage(this.ppts[i - 1], this.ppts[i]), this.ppts[i], V2p.getPointsAverage(this.ppts[i], this.ppts[i + 1]))
      );
      // this.drawQuadraticCurve(
      //   this.getPoints(V2p.getPointsAverage(this.ppts[i - 1], this.ppts[i]), this.ppts[i], V2p.getPointsAverage(this.ppts[i], this.ppts[i + 1]))
      // );
    }

    let i = this.ppts.length - 2;
    this.formatPoints(this.getPoints(V2p.getPointsAverage(this.ppts[i - 1], this.ppts[i]), this.ppts[i], this.ppts[i + 1]));
    // this.drawQuadraticCurve(this.getPoints(V2p.getPointsAverage(this.ppts[i - 1], this.ppts[i]), this.ppts[i], this.ppts[i + 1]));
    this.drawQuadraticCurveFromArray();
  }
  drawQuadraticCurve(points) {
    this.whiteboard.ctx.moveTo(points.start[1].x, points.start[1].y);
    this.whiteboard.ctx.quadraticCurveTo(points.control[1].x, points.control[1].y, points.end[1].x, points.end[1].y);
    this.whiteboard.ctx.stroke();
    this.whiteboard.ctx.moveTo(points.start[2].x, points.start[2].y);
    this.whiteboard.ctx.quadraticCurveTo(points.control[2].x, points.control[2].y, points.end[2].x, points.end[2].y);
    this.whiteboard.ctx.stroke();
  }
  drawQuadraticCurveFromArray() {
    this.whiteboard.ctx.clearRect(0, 0, this.whiteboard.canvas.width, this.whiteboard.canvas.height);

    this.ppts1.forEach((points) => {
      this.whiteboard.ctx.beginPath();
      this.whiteboard.ctx.moveTo(points.start.x, points.start.y);
      this.whiteboard.ctx.quadraticCurveTo(points.control.x, points.control.y, points.end.x, points.end.y);
      this.whiteboard.ctx.stroke();
      this.whiteboard.ctx.closePath();
    });
  }
  formatPoints(points) {
    this.ppts1.push({ start: points.start[1], control: points.control[1], end: points.end[1] });
    this.ppts2.push({ start: points.start[2], control: points.control[2], end: points.end[2] });
  }
}
