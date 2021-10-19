class Controls {
  static changeColor(e, whiteboard) {
    whiteboard.setColor(e.target.value);
    elements.controls.color.O.style.backgroundColor = e.target.value;
    if (whiteboard.tool == "eraser") {
      //TODO When im changing color and using mouse it draw its fix for that //FIXME
      whiteboard.drawing.lastColor = e.target.value;
      whiteboard.setColor("#ffffff");
    }
  }
  static changeLineWidth(e, whiteboard) {
    whiteboard.setLineWidth(e.target.value);
    elements.controls.lineWidth.O.value = e.target.value;
  }
}
