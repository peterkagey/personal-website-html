var movingCircleLabel;
var dragging = false; var downState = null;
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
  if (withinCircle(pt, a, b) && b != 0) {
    const c = circleCenter(a, b)
    dragState = { a: a, b: b, xDel: c.x - pt.x, yDel: c.y - pt.y }
    movingCircleLabel = labels[index(a,b)];
    labels[index(a,b)] = 0;
    refreshCanvas();
    saveCanvas();
    labels[index(a,b)] = movingCircleLabel;
  } else {
    movingCircleLabel = 0;
  }
}

function handleMouseDown(event) {
  pageJustLoaded = false;
  // Just in case the user clicks on the game before moving the mouse.
  coords = getCanvasCoords(event);
  var [a,b] = indicesFromCoord(coords.x, coords.y);
  downState = {a: a, b: b}; dragging = false;
  // var label = labels[index(a,b)]
  // if (event.shiftKey && label != 0) { colorValue(label) }
  if (event.which == 1)      { handleLeftClick(event) }
  else if (event.which == 3) { handleRightClick(event) }
  refreshCanvas();
}

function handleMouseMove(event){
  coords = getCanvasCoords(event);
  if (downState && event.which == 1 && movingCircleLabel > 0){
    dragging = true;
    restoreCanvas();
    drawGameCircleAtXY(movingCircleLabel, coords.x + dragState.xDel, coords.y + dragState.yDel, gameCircleFill)
  }
}

function decrementLabelState(a,b){
  var i = index(a,b);
  (labels[i] > 0) ? labels[i]-- : labels[i] = maxVertex;
}

function handleDragging() {
  const pt = {x: coords.x+dragState.xDel, y: coords.y+dragState.yDel}
  var [a,b] = indicesFromCoord(pt.x, pt.y);
  if (withinCircle(pt, a, b) && b > 0 ){
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
