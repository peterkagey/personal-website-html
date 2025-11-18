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

function drawMenuBar(){
  document.getElementById("display-solved").textContent = largestFullSubmatrix(gameMatrix);
  document.getElementById("display-vertices").textContent = numberOfVertices();
  setAlecString();
}

function padString(string, length){return ("     " + string).slice(-length);}

function setAlecString(){
  let alecString = "";
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

function moveLeft() {
  for(var i = 0; i < labels.length/gridWidth; i++){
    if(labels[i * gridWidth] != 0) { return false; }
  }
  labels.splice(labels.length, 0, 0);
  labels.shift();
  refreshCanvas();
}

function moveRight() {
  for(var i = 0; i < labels.length/gridWidth; i++){
    if(labels[i * gridWidth + gridWidth - 1] != 0) { return false; }
  }
  labels.splice(0, 0, 0);
  labels.pop();
  refreshCanvas();
}

function moveUp() {
  for(var i = 0; i < gridWidth; i++){
    if(labels[i] != 0) { return false; }
  }
  var topRow = labels.splice(0, gridWidth);
  labels = labels.concat(topRow);
  refreshCanvas();
}

function moveDown() {
  for(var i = 0; i < gridWidth; i++){
    if(labels[labels.length - 1 - i] != 0) { return false; }
  }
  var bottomRow = labels.splice(labels.length-gridWidth, gridWidth);
  labels = bottomRow.concat(labels);
  refreshCanvas();
}

function widenCanvas() {
  gridWidth++;
  [canvas.width, canvas.height] = setCanvasSize()
  setCircleRadius();
  for(var i = 0; i < gridHeight; i++){
    labels.splice(i*gridWidth+gridWidth - 1, 0, 0);
  }
  refreshCanvas();
}

function heightenCanvas() {
  gridHeight++;
  [canvas.width, canvas.height] = setCanvasSize()
  for (var i = gridWidth*(gridHeight-1); i < gridWidth*(gridHeight); i++){
    labels[i] = 0;
  }
  refreshCanvas();
}

function narrowCanvas() {
  const rowCount = labels.length/gridWidth;
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
  refreshCanvas();
}

function shortenCanvas() {
  for(var i = 1; i <= gridWidth; i++) {
    if(labels[labels.length - i] != 0) { return false; }
  }
  gridHeight--;
  [canvas.width, canvas.height] = setCanvasSize();
  labels.splice(labels.length-gridWidth, gridWidth);
  refreshCanvas();
}

const resizeCanvas = {
  "widen": widenCanvas,
  "heighten": heightenCanvas,
  "narrow": narrowCanvas,
  "shorten": shortenCanvas
}

const moveEverything = {
  "left": moveLeft,
  "right": moveRight,
  "up": moveUp,
  "down": moveDown
}

async function saveGame() {
  const grid = Array.from({ length: gridHeight }, (_, b) =>
    Array.from({ length: gridWidth }, (_, a) => labels[index(a, b)])
  );
  try {
    const response = await fetch(`${API_BASE_URL}/square_game/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grid),
    });

    if (response.status == 200) {
      const body = await response.json();
      window.location.href = `/apps/square_game/?id=${body.id}`;
    }
  } catch (error) {
    console.error('Error saving game:', error);
  }
}

const buttons = {
  "button-left":      moveEverything.left,
  "button-right":     moveEverything.right,
  "button-up":        moveEverything.up,
  "button-down":      moveEverything.down,
  "button-wider":     resizeCanvas.widen,
  "button-taller":    resizeCanvas.heighten,
  "button-shorter":   resizeCanvas.shorten,
  "button-narrower":  resizeCanvas.narrow,
  "button-save":      () => saveGame(),
  "button-new":       () => window.location.assign("/apps/square_game/"),
}

for (const [id, handler] of Object.entries(buttons)) {
  document.getElementById(id).addEventListener("click", handler);
}
