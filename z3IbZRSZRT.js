var canvas, context
var tileStateArray
var tilesAcross, tilesDown, tileSize

function initializeCanvas() {
  canvas = document.getElementById("conway");
  canvas.width = 4*canvas.parentElement.getBoundingClientRect().width;
  canvas.height = canvas.width;
  tileSize = canvas.width/100;
  tilesAcross = 100;
  tilesDown = 100;
  context = canvas.getContext("2d");
}

function initializeTiles(){
function randomBoolAry(){
  var newAry = new Array(tilesDown)
  for (var i = 0; i < newAry.length; i++){ newAry[i] = Math.random() < 0.3 }
  return newAry
}
var colors = new Array(tilesAcross)
for (var x = 0; x < colors.length; x++){ colors[x] = randomBoolAry() }
  return colors
}

function tileBoard(){
  context.strokeStyle = "black";
  for (let x = 0; x < tilesAcross; x++) {
    for (let y = 0; y < tilesDown; y++) {
      context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);

      context.fillStyle = tileStateArray[x][y] ? "black" : "white";
      context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
}

function livingNeighbors(x,y,oldTileStateArray){
  function coordinateIsAlive(coordinate){
    return oldTileStateArray[coordinate[0]][coordinate[1]]
  }

  function allNeighboringCells() {
    var cellList = []
    var maxX = tilesAcross - 1
    var maxY = tilesDown - 1

    if (x != 0) { cellList.push([x - 1, y])}
    if (y != 0) { cellList.push([x, y - 1])}
    if (x != maxX) { cellList.push([x + 1, y])}
    if (y != maxY) { cellList.push([x, y + 1])}

    if (x != 0 && y != 0)         { cellList.push([x - 1, y - 1])}
    if (x != 0 && y != maxY)     { cellList.push([x - 1, y + 1])}
    if (x != maxX && y != 0)     { cellList.push([x + 1, y - 1])}
    if (x != maxX && y != maxY) { cellList.push([x + 1, y + 1])}
    return cellList
  }

  var neighborCoords = allNeighboringCells(x,y)
  return neighborCoords.filter(coordinateIsAlive).length;
}

function updateTileStateArray(){

function copyAry(ary) { return JSON.parse(JSON.stringify(ary)) }

function updateTileState(x,y, oldTileStateArray){
  var neighborCount = livingNeighbors(x,y,oldTileStateArray)
  if (oldTileStateArray[x][y]) {
    return neighborCount == 2 || neighborCount == 3
  } else {
    return neighborCount == 3
  }
}

var oldTileStateArray = copyAry(tileStateArray)
for(var x = 0; x < tileStateArray.length; x++){
    for(var y = 0; y < tileStateArray[0].length; y++){
    tileStateArray[x][y] = updateTileState(x,y,oldTileStateArray)
    }
}
}

function initializeEverything() {
  initializeCanvas()
  tileStateArray = initializeTiles()
  tileBoard()

  setInterval(function() {
      updateTileStateArray()
      tileBoard()
  }, 100);
}

initializeEverything()

function setCanvasSize() {
    canvas.width = 4*canvas.parentElement.getBoundingClientRect().width;
    canvas.height = canvas.width;
    tileSize = canvas.width/100;
}

window.addEventListener('resize', setCanvasSize);