var movingCircleLabel;
var dragging = false; var downState = null; var readyToDrag = false;
var pageJustLoaded = true;
var dragState;
var coords;

var backCanvas = document.createElement('canvas');
var backCtx = backCanvas.getContext('2d');
function saveCanvas() {
  backCanvas.width = canvas.width;
  backCanvas.height = canvas.height;
  backCtx.drawImage(canvas, 0,0);
}
function restoreCanvas(){ context.drawImage(backCanvas, 0,0);}

function setDragStartState(pt) {
  var [a,b] = indicesFromCoord(pt.x, pt.y);
  if (withinCircle(pt, a, b) && labels[index(a,b)] != 0) {
    const c = circleCenter(a, b)
    dragState = { a: a, b: b, xDel: c.x - pt.x, yDel: c.y - pt.y }
    movingCircleLabel = labels[index(a,b)];
    readyToDrag = true;
    labels[index(a,b)] = 0;
    refreshCanvas();
    saveCanvas();
    labels[index(a,b)] = movingCircleLabel;
    refreshCanvas();
  } else {
    movingCircleLabel = 0;
    readyToDrag = false;
  }
}

function handleMouseDown(event) {
  pageJustLoaded = false;
  // Just in case the user clicks on the game before moving the mouse.
  coords = getCanvasCoords(event);
  var [a,b] = indicesFromCoord(coords.x, coords.y);
  downState = { a: a, b: b };
  dragging = false;
  readyToDrag = false; // Turn this on in setDragStartState if we click on something draggable.
  // var label = labels[index(a,b)]
  // if (event.shiftKey && label != 0) { colorValue(label) }
  if (event.which == 1 || event.type == "touchstart") {
    setDragStartState(coords)
  } else if (event.which == 3) {
    handleRightClick()
  }
}

function handleMouseMove(event){
  coords = getCanvasCoords(event);
  if (event.touches) { event.preventDefault(); }
  if (downState && readyToDrag){
    dragging = true;
    restoreCanvas();
    const pt = {x: coords.x + dragState.xDel, y: coords.y + dragState.yDel}
    const color = colorForIndex(movingCircleLabel)
    drawGameCircleAtXY(movingCircleLabel, pt, color)
  }
}

function decrementLabelState(a,b){
  var i = index(a,b);
  (labels[i] > 0) ? labels[i]-- : labels[i] = maxVertex;
}

function handleDragging() {
  const pt = {x: coords.x+dragState.xDel, y: coords.y+dragState.yDel}
  var [a,b] = indicesFromCoord(pt.x, pt.y);
  if (withinCircle(pt, a, b)){
    labels[index(dragState.a, dragState.b)] = 0;
    labels[index(a,b)] = movingCircleLabel;
    movingCircleLabel = 0;
    refreshCanvas();
  }
}

function handleEndOfClick(event) {
  var [a,b] = indicesFromCoord(coords.x, coords.y);
  if (withinCircle(coords, a, b) && downState.a === a && downState.b === b) {
    if (event.which == 1){ decrementLabelState(a,b); }
    refreshCanvas();
  }
}

function handleMouseUp(event){
  // If the page just loaded, then there's no corresponding mouseDown event.
  if (downState) {
    refreshCanvas();
    saveCanvas();
    if (dragging){ handleDragging() }
    else { handleEndOfClick(event) }
    downState = null;
  }
  dragging = false;
}
