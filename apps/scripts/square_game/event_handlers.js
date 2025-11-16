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

function handleRightClick() {
  var [a,b] = indicesFromCoord(coords.x, coords.y);
  if (withinCircle(coords, a, b)) {
    labels[index(a,b)] = (labels[index(a,b)] + 1) % (maxVertex + 1);
  }
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
window.addEventListener('resize', () => refreshCanvas());
