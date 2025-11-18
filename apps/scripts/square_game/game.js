const canvas = document.getElementById("square_game_canvas");
canvas.tabIndex = 0;
const context = canvas.getContext("2d");
var gridWidth; var gridHeight;
var r;
const colors = {
  circleBorder: '#333',
  background: '#222',
  text: 'white',
  badConnection: '#d43',
  goodConnection: '#ccc',
}
var labels = [];
var gameMatrix;
var maxVertex = 4;
var fontSize = 20; var borderWidth = 2;

function setCircleRadius(){
  r = 0.5/1.25*canvas.width/gridWidth;
  fontSize = Math.round(4 * r / 5);
  borderWidth = r / 12
}

function initializeEmptyBoard() {
  initializeBoard("1,2,0,0,3,1", 3)
}

function initializeBoard(solutionString, solutionWidth){
  var solutionGrid = parsedSolution(solutionString, solutionWidth);
  const solutionHeight = solutionGrid.length;
  setBoardSize(solutionWidth, solutionHeight);
  initializeEmptyLabels();
  setLabels(solutionGrid, solutionHeight, solutionWidth);
  maxVertex = 1 + Math.max(...solutionGrid.flat());
  refreshCanvas();
}

// There are three things we want to do here.
// 0) The board should always have at least some minimum size, maybe 8 x 8?
// 1) If the player just saved the game, we don't want their solution to shift or the size of their board to change.
// 2) If they're checking out the score, we want to make the the board is big enough and the solution is centered, with at least one row/column of padding on either size.
// 3) If this is a new game, the size of the board should match the size of the window appropriately.
function setBoardSize(solutionWidth, solutionHeight) {
  const upperGridWidth = Math.floor(canvas.getBoundingClientRect().width/75)
  const defaultWidth = Math.max(6, upperGridWidth);
  const defaultHeight = 6;
  //assume that a is too big, and b is never too big
  gridWidth = Math.max(defaultWidth, solutionWidth + 2);
  gridHeight = Math.max(defaultHeight, solutionHeight + 2);
  [canvas.width, canvas.height] = setCanvasSize();
  setCircleRadius();
}

function initializeEmptyLabels(){
  for (var i = 0; i < gridWidth*gridHeight; i++){ labels[i] = 0; }
}

function setLabels(solutionGrid, solutionHeight, solutionWidth){
  const xShift = Math.floor((gridWidth - solutionWidth)/2)
  const yShift = Math.floor((gridHeight - solutionHeight)/2)
  for (var rowIndex = 0; rowIndex < solutionHeight; rowIndex++){
    for (var colIndex = 0; colIndex < solutionWidth; colIndex++){
      const i = index(colIndex+xShift, rowIndex+yShift)
      labels[i] = solutionGrid[rowIndex][colIndex]
    }
  }
}

function parsedSolution(solutionString, width) {
  var solutionList = solutionString.split(",").map(Number);
  return Array.from(
    { length: solutionList.length/width },
    (_, i) => solutionList.slice(i * width, i * width + width)
  );
}

function colorAndLabelAllCircles(){
  for (var b = 0; b < gridHeight ; b++){
    for (var a = 0; a < gridWidth ; a++) {
      drawCircleBasedOnState(a, b);
    }
  }
}

function circleCenter(a, b) {
  return {
    x: 0.5*(canvas.width/gridWidth) + a*canvas.width/gridWidth,
    y: 0.5*canvas.height/gridHeight + b*canvas.height/gridHeight
  }
}

function colorForIndex(n) {
  const phi = 0.61803398875;          // golden ratio fractional part
  const h = ((n - 1) * phi % 1) * 270 + 45; // evenly spread hue
  const s = 40;                        // saturation %
  const l = 40;                        // lightness %
  return `hsl(${h}, ${s}%, ${l}%)`;     // browsers accept hsl() directly
}

function drawCircleBasedOnState(a, b){
  const c = circleCenter(a, b)
  const state = label(a,b);
  if (state == 0) {
    drawCircle(c.x, c.y, colors.background, colors.circleBorder);
  } else {
    drawGameCircleAtXY(state, c, `${colorForIndex(state)}`);
  }
}

function drawCircle(x, y, fillColor, strokeColor) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * 3.1415);
  context.fillStyle = fillColor;
  context.fill();
  context.lineWidth = borderWidth;
  context.strokeStyle = strokeColor;
  context.stroke();
}

function drawGameCircleAtXY(textString, pt, color) {
  drawCircle(pt.x, pt.y, color, color)
  printStringAtXY(textString, pt.x, pt.y);
}

function printStringAtXY(textString, x, y, flipstring){
  context.font = fontSize + "px Helvetica";
  context.fillStyle = colors.text;
  context.textAlign = 'center';
  if (flipstring == "flip"){
    context.rotate(Math.PI/2);
    context.fillText(textString, y, -x + fontSize/(2.62));
    context.rotate(-Math.PI/2);
  } else {
    context.fillText(textString, x, y + fontSize/(2.62));
  }
}

function colorValue(value){
  for (let b = 0; b < gridHeight ; b++) {
    for (let a = 0; a < gridWidth ; a++) {
      if (label(a, b) == value) {
        drawGameCircleAtXY(label(a, b), circleCenter(a,b), "#752c4d")
      }
    }
  }
}

function numberOfVertices(){ return labels.filter(x => x !== 0).length; }

function redundantConnection(a1, b1, a2, b2) {
  const row = labels[index(a1, b1)] - 1
  const column = labels[index(a2, b2)] - 1
  return gameMatrix[row][column] > 1
}

function drawLine(a1, b1, a2, b2){
  const c1 = circleCenter(a1, b1)
  const c2 = circleCenter(a2, b2)

  context.beginPath();
  context.moveTo(c1.x, c1.y);
  context.lineTo(c2.x, c2.y);
  context.lineWidth = borderWidth * 4;

  context.strokeStyle = redundantConnection(a1, b1, a2, b2)
    ? colors.badConnection
    : colors.goodConnection;
  context.stroke();
}

function index(a,b) { return gridWidth * b + a }
function label(a, b) { return labels[index(a,b)] }

function maxLabel() {
  return Math.max(...labels.map(Number), 1);
}

function indicesFromCoord(x,y){
  return [
    Math.round(gridWidth/canvas.width * (x - canvas.width/gridWidth/2)),
    Math.round(gridHeight/canvas.height * (y - canvas.height/gridHeight/2))
  ]
}

function incrementAdjacencyMatrix(i, j, matrix){
  if (i != 0 && j != 0) {
    matrix[i-1][j-1]++;
    matrix[j-1][i-1]++;
  }
}

function compareRightAndDownAndUpdate(a,b){
  let currentLabel = label(a,b);
  if (currentLabel == 0) { return }

  if (a != gridWidth - 1 && label(a + 1, b) > 0 ) {
    incrementAdjacencyMatrix(currentLabel, label(a + 1, b), gameMatrix);
  }
  if(b != gridHeight - 1 && label(a,b+1) > 0 ) {
    incrementAdjacencyMatrix(currentLabel, label(a,b+1), gameMatrix);
  }
}

function compareRightAndDownAndDraw(a,b) {
  if (label(a,b) > 0) {
    if (a != gridWidth - 1 && label(a+1,b) > 0) {
      drawLine(a, b, a+1, b);
    }
    if (b != gridHeight - 1 && label(a,b+1) > 0) {
      drawLine(a, b, a, b+1);
    }
  }
}

function updateAdjacencyMatrix() {
  for (var b = 0; b < gridHeight ; b++){
    for (var a = 0; a < gridWidth ; a++){
      compareRightAndDownAndUpdate(a,b);
    }
  }
}

function drawEdges(){
  for (var b = 0; b < gridHeight ; b++){
    for (var a = 0; a < gridWidth ; a++){
      compareRightAndDownAndDraw(a,b);
    }
  }
}

function expandGrid() {
  var rowCount = labels.length/gridWidth;
  for(var i = 0; i < rowCount; i++){
    if(labels[i * gridWidth] != 0) {
      moveRight();
      break
    }
  }

  rowCount = labels.length/gridWidth;
  for(var i = 0; i < rowCount; i++){
    if(labels[i * gridWidth + gridWidth - 1] != 0) {
      widenCanvas();
      break
    }
  }

  for(var i = 1; i <= gridWidth; i++) {
    if(labels[i] != 0) {
      moveDown();
      break
    }
  }

  for(var i = 1; i <= gridWidth; i++) {
    if(labels[labels.length - i] != 0) {
      heightenCanvas();
      break
    }
  }
}

function refreshCanvas(){
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = colors.background;
  context.fill();
  const scale = canvas.width / canvas.getBoundingClientRect().width;
  canvas.style.borderRadius = `${r/scale/0.8}px`;
  maxVertex = Math.max(3, maxLabel() + 1)
  expandGrid();
  resetGameMatrix();
  updateAdjacencyMatrix();
  drawEdges();
  colorAndLabelAllCircles();
  drawMenuBar();
}

function setCanvasSize(){
  return [gridWidth * 300, gridHeight * 300];
}

function resetGameMatrix(){
  var n = Math.max(maxLabel(), maxVertex);
  var matrix = [];
  for(var i = 0; i < n; i++) {
    matrix[i] = [];
    for (var j = 0; j < n; j++) {
      if (i == j && labels.includes(i + 1)) { matrix[i][j] = 1; }
      else { matrix[i][j] = 0; }
    }
  }
  gameMatrix = matrix;}

// Disable the menu when user right-clicks.
canvas.oncontextmenu = function(event) {
  return false;
}

const id = (new URLSearchParams(window.location.search)).get("id");
if (id === null) {
  initializeEmptyBoard();
} else {
  fetch(`${API_BASE_URL}/square_game/${id}`)
    .then(response => {
      if (response.ok) { return response.json() }
      else { throw new Error("ID not found") }
    })
    .then(data => initializeBoard(data.solution,data.width))
    .catch(_ => initializeEmptyBoard())
}
