var canvas, context
var tilesAcross, tilesDown, tileSize
var borderWidth = 5
var originalColor = "#AAA"
var newColor = "#18C"
function initializeCanvas() {
  canvas = document.getElementById("maze");
  canvas.width  = canvas.parentElement.clientWidth

  tilesAcross = Math.round((canvas.width)/50);
  tileSize = canvas.width/tilesAcross;
  tilesDown = 30;
  tilesDown = Math.floor(window.innerHeight/tileSize) - 2
  canvas.height = tileSize * tilesDown
  context = canvas.getContext("2d");
}

function scrollCompensate() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
}

function initializeTiles(){
  function randomBoolAry(){
    var newAry = new Array(tilesDown)
    for (var i = 0; i < newAry.length; i++){ newAry[i] = Math.round(Math.random()) }
    return newAry
  }
  var lineDirections = new Array(tilesAcross)
  for (var x = 0; x < lineDirections.length; x++){ lineDirections[x] = randomBoolAry() }
  return lineDirections
}

function drawAt(ary){
  var x = ary[0]
  var y = ary[1]
  context.strokeStyle = originalColor;
  context.lineWidth = borderWidth;
  context.lineCap="round";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function drawAt2(ary){
  var x = ary[0]
  var y = ary[1]
  context.strokeStyle = newColor;
  context.lineWidth = borderWidth;
  context.lineCap="round";

  (tileStateArray[x][y]) ? drawNW(x,y) : drawNE(x,y)
}

function isInBounds(array){
  var xInBounds = 0 <= array[0] && array[0] < tilesAcross
  var yInBounds = 0 <= array[1] && array[1] < tilesDown
  return xInBounds && yInBounds
}

function allAdjacent(x, y){
  function isConnected(ary){
    return tileStateArray[x][y] != tileStateArray[ary[0]][ary[1]]
  }
  var parallel = [[x + 1, y], [x, y - 1], [x - 1, y], [x, y + 1]]
  return parallel.filter(isInBounds).filter(isConnected)
}

function allOnLine(x, y) {
  function isConnected(ary){
    return tileStateArray[x][y] == tileStateArray[ary[0]][ary[1]]
  }
  if (tileStateArray[x][y]) {
    var perpendicular = [[x-1, y-1], [x+1, y+1]]
  } else {
    var perpendicular = [[x-1, y+1], [x+1, y-1]]
  }
  return perpendicular.filter(isInBounds).filter(isConnected)
}

function touchingSection(ary){
  var x = ary[0]
  var y = ary[1]
  return [[x, y]]
    .concat(allOnLine(x, y))
    .concat(allAdjacent(x, y))
    .sort()
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

Array.prototype.flatMap = function(lambda) {
    return Array.prototype.concat.apply([], this.map(lambda));
};

// This works, but the performance is dismal!
function allTouching(x, y){
  function recurse(known) {
    var newValues = Array.from(
      new Map(
        known
          .flatMap(touchingSection)   // flatten
          .sort()                     // sort
          .map(item => [JSON.stringify(item), item]) // key by stringified
      ).values()
    );
    if (JSON.stringify(newValues) === JSON.stringify(known)) { return known }
    else { return recurse(newValues) }
  }
  return recurse([[x, y]])
}

function drawNW(x, y){
  context.beginPath();
  context.moveTo(x * tileSize, y * tileSize);
  context.lineTo((x + 1) * tileSize, (y + 1) * tileSize);
  context.stroke()
}

function drawNE(x,y){
  context.beginPath();
  context.moveTo((x + 1) * tileSize, y * tileSize);
  context.lineTo(x * tileSize, (y + 1) * tileSize);
  context.stroke()
}

function tileBoard(){

  for (var x = 0; x < tilesAcross; x++){
    for (var y = 0; y < tilesDown; y++){
      drawAt([x,y])
    }
  }
}

function getCanvasCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;   // account for CSS scaling
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

var handleMouseUp = function(event) {
  var coords = getCanvasCoords(canvas, event);
  var canvasX = coords.x;
  var canvasY = coords.y;
  var a = Math.floor(canvasX/tileSize)
  var b = Math.floor(canvasY/tileSize)
  if (event.which == 1) {
    allTouching(a, b).forEach(drawAt2)
  } else {
    allTouching(a, b).forEach(drawAt)
  }
}

initializeCanvas()
var tileStateArray = initializeTiles()
tileBoard()

// Disable the menu when user right-clicks.
canvas.oncontextmenu = function(event) {
  return false;
}

canvas.addEventListener('mouseup', handleMouseUp, false);
