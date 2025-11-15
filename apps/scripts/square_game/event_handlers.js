document.addEventListener("DOMContentLoaded", function() {
  // Handle #instr click event
  document.getElementById("instr").addEventListener("click", function() {
    var instructionsParagraph = document.getElementById("instructions_paragraph");
    instructionsParagraph.style.display = (instructionsParagraph.style.display === "none") ? "block" : "none";
  });

  // Handle #connect click event
  document.getElementById("connect").addEventListener("click", function() {
    var alecNotes = document.getElementById("alec_notes");
    alecNotes.style.display = (alecNotes.style.display === "none" || alecNotes.style.display === "") ? "block" : "none";
    alecNotes.style.width = (canvas.width - 30) + "px";
    alecNotes.innerHTML = alecString;
  });

  // Handle #best_sol click event
  // document.getElementById("best_sol").addEventListener("click", function() {
  //   var listItems = document.querySelectorAll("li");
  //   listItems.forEach(function(li) {
  //     li.style.display = (li.style.display === "none" || li.style.display === "") ? "block" : "none";
  //   });
  // });
});

async function saveGame() {
  const grid = Array.from({ length: gridHeight - 1 }, (_, b) =>
    Array.from({ length: gridWidth }, (_, a) => labels[index(a, b + 1)])
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

function withinCircle(p1, a, b) {
  const p2 = circleCenter(a, b)
  const distance = Math.sqrt(Math.pow((p1.x-p2.x),2)+Math.pow((p1.y-p2.y),2))
  return distance < r
}

const isButton = {
  decrement:      pt => withinCircle(pt, gridWidth-3, 0) && maxVertex > 1,
  increment:      pt => withinCircle(pt, gridWidth-1, 0) && maxVertex < 99,
  saveGame:       pt => withinCircle(pt, 2, 0),
  newGame:        pt => withinCircle(pt, 3, 0),
  moveLeft:       pt => withinCircle(pt, 4, 0) && gridWidth > 7,
  moveRight:      pt => withinCircle(pt, 5, 0) && gridWidth > 8,
  moveUp:         pt => withinCircle(pt, 6, 0) && gridWidth > 9,
  moveDown:       pt => withinCircle(pt, 7, 0) && gridWidth > 10,
  widenCanvas:    pt => withinCircle(pt, 8, 0) && gridWidth > 11,
  heightenCanvas: pt => withinCircle(pt, 9, 0) && gridWidth > 12,
  narrowCanvas:   pt => withinCircle(pt, 10, 0) && gridWidth > 13,
  shortenCanvas:  pt => withinCircle(pt, 11, 0) && gridWidth > 14
}

async function newGame() {
  window.location.assign("/apps/square_game/");
}

function handleRightClick(event) {
  var [a,b] = indicesFromCoord(coords.x, coords.y);
  if (withinCircle(coords, a, b)) {
    labels[index(a,b)] = (labels[index(a,b)] + 1) % (maxVertex + 1);
  }
}

function handleLeftClick(event) {
  if (isButton.decrement(coords))           { maxVertex--;              }
  else if (isButton.increment(coords))      { maxVertex++;              }
  else if (isButton.saveGame(coords))       { saveGame();                }
  else if (isButton.newGame(coords))        { newGame()                  }
  else if (isButton.moveLeft(coords))       { moveEverything("left");   }
  else if (isButton.moveRight(coords))      { moveEverything("right");  }
  else if (isButton.moveUp(coords))         { moveEverything("up");     }
  else if (isButton.moveDown(coords))       { moveEverything("down");   }
  else if (isButton.widenCanvas(coords))    { resizeCanvas("widen");    }
  else if (isButton.heightenCanvas(coords)) { resizeCanvas("heighten"); }
  else if (isButton.narrowCanvas(coords))   { resizeCanvas("narrow");   }
  else if (isButton.shortenCanvas(coords))  { resizeCanvas("shorten");  }
  setDragStartState(coords)
}

var handleFocus = function(e){
  if(e.type=='mouseover'){
    canvas.focus();
    return false;
  }else if(e.type=='mouseout'){
    canvas.blur();
    return false;
  }
  return true;
};

function getCanvasCoords(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function handleKeyDown(event){
  if (event.key == "Backspace") {
    if (coords === undefined) { console.warn("The mouse hasn't moved yet!") }
    else {
      var [a,b] = indicesFromCoord(coords.x, coords.y);
      if (withinCircle(coords, a, b)){
        labels[index(a,b)] = 0;
        refreshCanvas();
      }
    }
  }
}

window.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('mouseup', handleMouseUp, false);
