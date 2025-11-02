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
    alecNotes.value = alec_string;
  });

  // Handle #best_sol click event
  // document.getElementById("best_sol").addEventListener("click", function() {
  //   var listItems = document.querySelectorAll("li");
  //   listItems.forEach(function(li) {
  //     li.style.display = (li.style.display === "none" || li.style.display === "") ? "block" : "none";
  //   });
  // });
});

var dragging = false; var mouseDown = false;
var click_original_a; var click_original_b;
var clickXdel; var clickYdel;
var value_of_moving_circle;

var coords;
async function saveGame() {
  const grid = Array.from({ length: b_height - 1 }, (_, b) =>
    Array.from({ length: a_width }, (_, a) => labels[index(a, b + 1)])
  );
  try {
    const response = await fetch(`${API_BASE_URL}/save_square_game`, {
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

function withinCircle(pt, a, b) { return distance2(pt, circleCenter(a, b)) < r }

const isButton = {
  decrement:      pt => withinCircle(pt, a_width-3, 0) && max_vertex > 1,
  increment:      pt => withinCircle(pt, a_width-1, 0) && max_vertex < 99,
  saveGame:       pt => withinCircle(pt, 2, 0),
  newGame:        pt => withinCircle(pt, 3, 0),
  moveLeft:       pt => withinCircle(pt, 4, 0) && a_width > 7,
  moveRight:      pt => withinCircle(pt, 5, 0) && a_width > 8,
  moveUp:         pt => withinCircle(pt, 6, 0) && a_width > 9,
  moveDown:       pt => withinCircle(pt, 7, 0) && a_width > 10,
  widenCanvas:    pt => withinCircle(pt, 8, 0) && a_width > 11,
  heightenCanvas: pt => withinCircle(pt, 9, 0) && a_width > 12,
  narrowCanvas:   pt => withinCircle(pt, 10, 0) && a_width > 13,
  shortenCanvas:  pt => withinCircle(pt, 11, 0) && a_width > 14
}

async function newGame() {
  window.location.assign("/apps/square_game/");
}

function setDragStartState(coords) {
  var [a,b] = ab_from_xy(coords.x, coords.y);
  if (withinCircle(coords, a, b) < r) {
    click_original_a = a; click_original_b = b;
    clickXdel = atox[a] - coords.x; clickYdel = btoy[b] - coords.y;
    value_of_moving_circle = labels[index(a,b)];
    labels[index(a,b)] = 0;
    refresh_canvas();
    saveCanvas();
    labels[index(a,b)] = value_of_moving_circle;
  } else {
    value_of_moving_circle = 0;
  }
}

function handleRightClick(event) {
  var [a,b] = ab_from_xy(coords.x, coords.y);
  if (withinCircle(coords, a, b)) {
    labels[index(a,b)] = (labels[index(a,b)] + 1) % (max_vertex + 1);
  }
}

function handleLeftClick(event) {
  if (isButton.decrement(coords))           { max_vertex--;              }
  else if (isButton.increment(coords))      { max_vertex++;              }
  else if (isButton.saveGame(coords))       { saveGame();                }
  else if (isButton.newGame(coords))        { newGame()                  }
  else if (isButton.moveLeft(coords))       { move_everything("left");   }
  else if (isButton.moveRight(coords))      { move_everything("right");  }
  else if (isButton.moveUp(coords))         { move_everything("up");     }
  else if (isButton.moveDown(coords))       { move_everything("down");   }
  else if (isButton.widenCanvas(coords))    { resize_canvas("widen");    }
  else if (isButton.heightenCanvas(coords)) { resize_canvas("heighten"); }
  else if (isButton.narrowCanvas(coords))   { resize_canvas("narrow");   }
  else if (isButton.shortenCanvas(coords))  { resize_canvas("shorten");  }
  else                                      { setDragStartState(coords)  }
}

var handleMouseDown = function(event) {
  coords = getCanvasCoords(event); // Just in case the user clicks before moving the mouse.
  mouseDown = true; dragging = false;
  var [a,b] = ab_from_xy(coords.x, coords.y);
  var label = labels[index(a,b)]
  // if (event.shiftKey && label != 0) { colorValue(label) }
  if (event.which == 1)        { handleLeftClick(event) }
  else if (event.which == 3)        { handleRightClick(event) }
  refresh_canvas();
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

function handleMouseMove(event){
  coords = getCanvasCoords(event);
  if (mouseDown && event.which == 1 && value_of_moving_circle > 0){
    dragging = true;
    restoreCanvas();
    drawGameCircleAtXY(value_of_moving_circle, coords.x + clickXdel, coords.y + clickYdel, gameCircleFill)
  }
}

function handleMouseUp(event){
  coords = getCanvasCoords(event); // For when the user saves, and mouseUp happens on the new screen.
  refresh_canvas();
  saveCanvas();
  mouseDown = false;
  if (dragging){
    var [a,b] = ab_from_xy(coords.x+clickXdel, coords.y+clickYdel);
    if (withinCircle({x: coords.x+clickXdel, y: coords.y+clickYdel}, a, b)){
      labels[index(click_original_a, click_original_b)] = 0;
      labels[index(a,b)] = value_of_moving_circle;
      refresh_canvas();
    }
  } else {
    var [a,b] = ab_from_xy(coords.x, coords.y);
    if (withinCircle(coords, a, b)){
      if (event.which == 1){ update_state(a,b); }
      refresh_canvas();
    }
  }
  dragging = false;
}

function handleKeyDown(event){
  if (event.key == "Backspace") {
    if (coords === undefined) { console.warn("The mouse hasn't moved yet!") }
    else {
      var [a,b] = ab_from_xy(coords.x, coords.y);
      if (withinCircle(coords, a, b)){
        labels[index(a,b)] = 0;
        refresh_canvas();
      }
    }
  }
}

window.addEventListener('keydown', handleKeyDown);
canvas.addEventListener('mousemove', handleMouseMove, false);
canvas.addEventListener('mousedown', handleMouseDown, false);
canvas.addEventListener('mouseup', handleMouseUp, false);
