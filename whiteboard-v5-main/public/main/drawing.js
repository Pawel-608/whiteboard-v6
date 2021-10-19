if ("ontouchstart" in document.documentElement) {
  document.body.style.overflow = "hidden";
}

canvas = document.createElement("canvas");
canvas.width = window.screen.availWidth;
canvas.height = window.screen.availHeight * 2;
ctx = canvas.getContext("2d");

document.body.appendChild(canvas);

canvas2 = document.createElement("canvas");
canvas2.width = window.screen.availWidth;
canvas2.height = window.screen.availHeight * 2;
ctx2 = canvas2.getContext("2d");

document.body.appendChild(canvas2);

ctx2.lineWidth = 2;
ctx2.strokeStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let mouse,
  ppts = [];

let pptsA = [];

window.addEventListener(
  "pointermove",
  (e) => {
    mouse = { x: e.pageX, y: e.pageY };
  },
  false
);

window.addEventListener(
  "pointerdown",
  (e) => {
    window.addEventListener("pointermove", draw, false);

    mouse = { x: e.pageX, y: e.pageY };
    ppts.push(mouse);

    draw();
  },
  false
);

window.addEventListener(
  "pointerup",
  () => {
    window.removeEventListener("pointermove", draw, false);

    ctx.drawImage(canvas2, 0, 0);

    ctx2.clearRect(0, 0, window.width, window.height * 2);

    pptsA.push(ppts);
    ppts = [];
  },
  false
);
let draw = () => {
  ppts.push(mouse);

  if (ppts.length < 3) {
    let b = ppts[0];

    ctx2.beginPath();
    ctx2.arc(b.x, b.y, 2 / 2, 0, Math.PI * 2, !0);
    ctx2.fill();
    ctx2.closePath();
    return;
  }

  ctx2.clearRect(0, 0, canvas2.width, canvas2.height * 2);

  ctx2.beginPath();
  ctx2.moveTo(ppts[0].x, ppts[0].y);

  let i = 1;
  for (; i < ppts.length - 2; i++) {
    let c = (ppts[i].x + ppts[i + 1].x) / 2;
    let d = (ppts[i].y + ppts[i + 1].y) / 2;
    ctx2.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
  }
  ctx2.quadraticCurveTo(ppts[i].x, ppts[i].y, ppts[i + 1].x, ppts[i + 1].y);
  ctx2.stroke();
};

//
//
//
//
//
//
// Draw logo
let drawL = (pptsA) => {
  if (pptsA.length < 3) {
    let b = pptsA[0];

    ctx2.beginPath();
    ctx2.arc(b.x, b.y, 2 / 2, 0, Math.PI * 2, !0);
    ctx2.fill();
    ctx2.closePath();
    return;
  }

  ctx2.beginPath();
  ctx2.moveTo(pptsA[0].x, pptsA[0].y);

  let i = 1;
  for (; i < pptsA.length - 2; i++) {
    let c = (pptsA[i].x + pptsA[i + 1].x) / 2;
    let d = (pptsA[i].y + pptsA[i + 1].y) / 2;
    ctx2.quadraticCurveTo(pptsA[i].x, pptsA[i].y, c, d);
  }
  ctx2.quadraticCurveTo(pptsA[i].x, pptsA[i].y, pptsA[i + 1].x, pptsA[i + 1].y);
  ctx2.stroke();
};

let yRange = { start: 0, end: 0 };
let xRange = { start: 0, end: 0.3661458492279053 };

let offsetX = window.screen.availWidth * 0.5 - (xRange.end * window.screen.availWidth) / 2;
let offsetY = 0; //orginal img proportions
newlogo.forEach((pptsA) =>
  pptsA.forEach((mouse) => {
    mouse.x = mouse.x * window.screen.availWidth + offsetX;
    mouse.y = mouse.y * window.screen.availWidth * 0.5364583333333333333333333333333; //orginal x to y proportions
  })
);
newlogo.forEach((element) => {
  drawL(element);
});

ctx.drawImage(canvas2, 0, 0);
ctx2.clearRect(0, 0, window.width, window.height * 2);
