var canvas;
var canvasArea;

function setup() {
  fb_setup();

  canvasArea = document.getElementById("d_canvasArea");
  console.log(canvasArea);
  canvas = createCanvas(canvasArea.offsetWidth - 1, canvasArea.offsetHeight - 1);
  canvas.parent("d_canvasArea");
}

function draw() {
  mm_draw();
}

function myFunction() {
  console.log("function called")
}