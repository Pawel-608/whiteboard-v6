let i = -1;

class Mouse {
  static getPos(event) {
    if (Math.floor(i) === 1) i = -1;
    return new V2(event.pageX, event.pageY);
    // i += 0.01;
    // return new V2p(event.pageX, event.pageY, Math.pow(i, 2));

    // return new V2p(event.pageX, event.pageY, event.pressure) //FIXME
  }
  static setCursor(style) {
    document.body.style.cursor = style;
  }
}
class V2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static translate(point, vector) {
    let x = point.x + vector.x;
    let y = point.y + vector.y;
    return new V2(x, y);
  }
  static getPointsAverage(v2_1, v2_2) {
    if (!(v2_1 instanceof V2p)) console.log(v2_1.x, v2_2.x);

    let x = (v2_1.x + v2_2.x) / 2;
    let y = (v2_1.y + v2_2.y) / 2;
    return new V2(x, y);
  }
}
class V2p extends V2 {
  constructor(x, y, pressure) {
    super(x, y);
    this.pressure = pressure;
  }
  static getPointsAverage(v2p_1, v2p_2) {
    let v2 = V2.getPointsAverage(v2p_1, v2p_2);
    let pressure = (v2p_1.pressure + v2p_2.pressure) / 2;
    return new V2p(v2.x, v2.y, pressure);
  }
}
class Valid {
  static isJSON(string) {
    try {
      JSON.parse(string);
    } catch (e) {
      return false;
    }
    return true;
  }
}
class Storage {
  static set(key, value) {
    if (typeof value !== "object") localStorage.setItem(key, value);
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
  }
  static get(key) {
    let item = localStorage.getItem(key);

    if (!Valid.isJSON(item)) return item;
    return JSON.parse(item);
  }
}
class Inputs {
  static show() {
    whiteboardConfig.canDraw = true;
    elements.controls.controls.style.display = "";
    elements.tools.style.display = "";
  }
  static hide() {
    whiteboardConfig.canDraw = false;
    elements.controls.controls.style.display = "none";
    elements.tools.style.display = "none";
  }
}
class Tools {
  static change(previousTool, tool) {
    if (previousTool) this.tonedown(previousTool);
    this.highlight(tool);
  }
  static highlight(tool) {
    elements.tool[tool].style = "background-color: rgba(0,0,0,.33);border-radius: 2em;transition:background 0.5s;background-size: 70%;";
  }
  static tonedown(tool) {
    elements.tool[tool].style = "";
  }
}
