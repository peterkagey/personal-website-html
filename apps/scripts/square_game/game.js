var canvas = document.getElementById("square_game_canvas");
canvas.tabIndex = 0;
var context = canvas.getContext("2d");
var defaultWidth; var defaultHeight;
var rubyA;
var gridWidth; var gridHeight;
var aShift; var bShift; var r;
var circleBorderColor = '#333'
var backgroundColor = '#222'
var menuCircleFill = '#2c4d75'
var textColor = 'white'
var badConnectionColor = '#d43'
var goodConnectionColor = '#ccc'
var labels = [];
var gameMatrix;
var maxVertex = 4;
var level; var score;
var alecString
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
  defaultWidth = Math.max(6, upperGridWidth);
  defaultHeight = 6;
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

// solutionString is saved in the database as a string like "0,0,1,2,0,..."
// together with a width that specifies when to break the line.
function parseSolution(solutionString, solutionWidth){
  if (solutionWidth + aShift > gridWidth){
    aShift = gridWidth - solutionWidth
  };
  var solutionList = solutionString.split(",");
  var bRow = bShift;
  for (var i = 0; i < solutionList.length; i++){
    var aPos = (i % solutionWidth) + aShift;
    if (aPos == aShift){
      bRow++;
    }
    labels[index(aPos, bRow)] = parseInt(solutionList[i]);
  }
}

function parsedSolution(solutionString, width){
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
    drawCircle(c.x, c.y, backgroundColor, circleBorderColor);
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
  context.fillStyle = textColor;
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
    ? badConnectionColor
    : goodConnectionColor;
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

function largestFullSubmatrix(matrix){
  for (var n = 0; n < matrix.length+1; n++){
    for (var i = 0; i < n; i++){
      for (var j = 0; j < n; j++){
        if( matrix[i][j] == 0) { return n-1 }
      }
    }
  }
  return matrix.length
}

function padString(string, length){return ("     " + string).slice(-length);}

function setAlecString(){
  alecString = "";
  var matrix = gameMatrix;
  var len = matrix.length.toString().length
  for (var i = 0; i < matrix.length; i++){
    alecString = alecString + padString((i+1),len) + ":";
    for (var j = 0; j <= matrix.length; j++){
      if (matrix[i][j] == 0) {
        alecString = alecString + " " + padString((j+1),len)
      } else {
        alecString = alecString + " " + padString("", len)
      }
    }
    alecString = alecString + "\n";
  }
  var alecNotes = document.getElementById("adjacency-matrix");
  alecNotes.innerHTML = alecString
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

function refreshCanvas(){
  canvas.width = canvas.width;
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = backgroundColor;
  context.fill();
  const scale = canvas.width / canvas.getBoundingClientRect().width;
  canvas.style.borderRadius = `${r/scale/0.8}px`;
  maxVertex = Math.max(3, maxLabel() + 1)
  resetGameMatrix();
  updateAdjacencyMatrix();
  drawEdges();
  colorAndLabelAllCircles();
  drawMenuBar();
  setAlecString();
}

function setCanvasSize(){
  return [gridWidth * 300, gridHeight * 300];
}

function resizeCanvas(dimension){
  if (dimension == "widen"){
    gridWidth++;
    [canvas.width, canvas.height] = setCanvasSize()
    setCircleRadius();
    for(var i = 0; i < gridHeight; i++){
      labels.splice(i*gridWidth+gridWidth - 1, 0, 0);
    }
  }

  if (dimension == "heighten"){
    gridHeight++;
    [canvas.width, canvas.height] = setCanvasSize()
    for (var i = gridWidth*(gridHeight-1); i < gridWidth*(gridHeight); i++){
      labels[i] = 0;
    }
  }

  if (dimension == "narrow"){
    const rowCount = labels.length/gridWidth;
    console.log(rowCount);
    for(var i = 0; i < rowCount; i++){
      if(labels[i * gridWidth + gridWidth - 1] != 0){
        return false;
      }
    }
    gridWidth--;
    [canvas.width, canvas.height] = setCanvasSize()
    setCircleRadius();
    for(var i = 1; i <= gridHeight; i++){
      labels.splice(i * gridWidth, 1)
    }
  }

  if (dimension == "shorten"){
    for(var i = 1; i <= gridWidth; i++){
      if(labels[labels.length - i] != 0){
        return false;
      }
    }
    gridHeight--;
    [canvas.width, canvas.height] = setCanvasSize();
    labels.splice(labels.length-gridWidth, gridWidth);
  }
  refreshCanvas();
}

function moveEverything(direction) {
  if (direction == "left"){
    for(var i = 0; i < labels.length/gridWidth; i++){
      if(labels[i * gridWidth] != 0){ return false; }
    }
    labels.splice(labels.length, 0, 0);
    labels.shift();

  } else if(direction == "right"){
    for(var i = 0; i < labels.length/gridWidth; i++){
      if(labels[i * gridWidth + gridWidth - 1] != 0){ return false; }
    }
    labels.splice(0, 0, 0);
    labels.pop();

  } else if (direction == "up"){
    for(var i = 0; i < gridWidth; i++){
      if(labels[i] != 0){ return false; }
    }
    var topRow = labels.splice(0, gridWidth);
    labels = labels.concat(topRow);

  } else if (direction == "down"){
    for(var i = 0; i < gridWidth; i++){
      if(labels[labels.length - 1 - i] != 0){ return false; }
    }
    var bottomRow = labels.splice(labels.length-gridWidth, gridWidth);
    labels = bottomRow.concat(labels);
  }
  refreshCanvas();
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

function drawMenuBar(){
  document.getElementById("display-solved").textContent = largestFullSubmatrix(gameMatrix);
  document.getElementById("display-vertices").textContent = numberOfVertices();
}

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

function bound(n) {
  const boundSequence = [NaN,0,2,4,6,8,11,15,19,23,28,34,40,46,53,61,69,77,86,96,106,116,127,139,151,163,176,190,204,218,233,249,265,281,298,316,334,352,371,391,411,431,452,474,496,518,541,565,589,613,638,664,690,716,743,771,799,827,856,886,916,946,977];
  return Math.max(boundSequence[n], n * Math.ceil((n-1)/4));
}

fetch(`${API_BASE_URL}/square_game/records`)
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("records");
    var grid = document.createElement("div");
    grid.className = "grid wide-five narrow-three";

    data.forEach(record => {
      const li = document.createElement("div");
      if (
        (record.level == 3 && record.vertices == 4) ||
        (record.level == 4 && record.vertices == 6) ||
        (record.level == 5 && record.vertices == 9) ||
        (record.level == 6 && record.vertices == 12) ||
        (record.level == 7 && record.vertices == 15) ||
        (record.level == 8 && record.vertices == 19) ||
        (record.level == 9 && record.vertices == 24) ||
        (record.level == 10 && record.vertices == 30) ||
        (record.level == 11 && record.vertices == 34) ||
        (record.level == 14 && record.vertices == 56)
      ) {
        li.innerHTML = `<a href="/apps/square_game/high_scores/?level=${record.level}">f(${record.level}) = ${record.vertices}</a>`;
        grid.appendChild(li);
      } else if (record.level > 2) {
        li.innerHTML = `<a href="/apps/square_game/high_scores/?level=${record.level}">${bound(record.level)} ≤ f(${record.level}) ≤ ${record.vertices}</a>`;
        grid.appendChild(li);
      }
    });

    container.appendChild(grid);
  })
  .catch(err => console.error("Error loading records:", err));

const buttons = {
  "button-left":      () => moveEverything("left"),
  "button-right":     () => moveEverything("right"),
  "button-up":        () => moveEverything("up"),
  "button-down":      () => moveEverything("down"),
  "button-wider":     () => resizeCanvas("widen"),
  "button-taller":    () => resizeCanvas("heighten"),
  "button-shorter":   () => resizeCanvas("shorten"),
  "button-narrower":  () => resizeCanvas("narrow"),
  "button-save":      () => saveGame(),
  "button-new":       () => window.location.assign("/apps/square_game/"),
}

for (const [id, handler] of Object.entries(buttons)) {
  document.getElementById(id).addEventListener("click", handler);
}
