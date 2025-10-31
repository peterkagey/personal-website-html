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

var handlemousedown = function(event) { // Where the clickiness happens.
  mouseDown = true; dragging = false;
  var coords = getCanvasCoords(canvas, event);
  var [a,b] = ab_from_xy(coords.x, coords.y);
  if (event.which == 1){
    if      (distance(coords.x, coords.y, atox[a_width-3], btoy[0]) < r && max_vertex > 1) { max_vertex--; }
    else if (distance(coords.x, coords.y, atox[a_width-1], btoy[0]) < r && max_vertex < 99){ max_vertex++; }
    else if (distance(coords.x, coords.y, atox[2], btoy[0]) < r){
      document.getElementById("new_square_game").submit(); return
    }
    else if (a_width > 6 && distance(coords.x, coords.y, atox[3], btoy[0]) < r){
      document.getElementById("new_square_game").submit(); // seems broken.
      window.location.assign("https://peterkagey.com/apps/square_game/"); //I'd prefer a "home_path" solution.
      return
    }
    else if (a_width > 7 && distance(coords.x, coords.y, atox[4], btoy[0])  < r){ move_everything("left");   }
    else if (a_width > 8  && distance(coords.x, coords.y, atox[5], btoy[0])  < r){ move_everything("right");  }
    else if (a_width > 9  && distance(coords.x, coords.y, atox[6], btoy[0])  < r){ move_everything("up");     }
    else if (a_width > 10 && distance(coords.x, coords.y, atox[7], btoy[0])  < r){ move_everything("down");   }
    else if (a_width > 11 && distance(coords.x, coords.y, atox[8], btoy[0])  < r){ resize_canvas("widen");    }
    else if (a_width > 12 && distance(coords.x, coords.y, atox[9], btoy[0])  < r){ resize_canvas("heighten"); }
    else if (a_width > 13 && distance(coords.x, coords.y, atox[10], btoy[0]) < r){ resize_canvas("narrow");   }
    else if (a_width > 14 && distance(coords.x, coords.y, atox[11], btoy[0]) < r){ resize_canvas("shorten");  }
    if (distance(atox[a], btoy[b], coords.x, coords.y) < r){
      click_original_a = a; click_original_b = b;
      clickXdel = atox[a] - coords.x; clickYdel = btoy[b] - coords.y;
      value_of_moving_circle = labels[index(a,b)];
      labels[index(a,b)] = 0;
      refresh_canvas();
      saveCanvas();
      labels[index(a,b)] = value_of_moving_circle;
    }
    else { value_of_moving_circle = 0; }
  }
  if (event.which == 3){
    if (distance(atox[a], btoy[b], coords.x, coords.y) < r){
      labels[index(a,b)] = (parseInt(labels[index(a,b)]) + 1) % (max_vertex + 1);
    }
  }
  refresh_canvas();
  return false;
}
var handlefocus = function(e){
  if(e.type=='mouseover'){
    canvas.focus();
    return false;
  }else if(e.type=='mouseout'){
    canvas.blur();
    return false;
  }
  return true;
};

function getCanvasCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

function handlemousemove(event){
  var coords = getCanvasCoords(canvas, event);
  // refresh_canvas();
  if (mouseDown && event.which == 1 && value_of_moving_circle > 0){
    dragging = true;
    restoreCanvas();
    drawGameCircleAtXY(value_of_moving_circle, coords.x + clickXdel, coords.y + clickYdel, gameCircleFill)
  }
}

function handlemouseup(event){
  refresh_canvas();
  saveCanvas();
  mouseDown = false;
  coords = getCanvasCoords(canvas, event);
  if (dragging){
    var [a,b] = ab_from_xy(coords.x+clickXdel, coords.y+clickYdel);
    if (distance(atox[a], btoy[b], coords.x+clickXdel, coords.y+clickYdel) < r){
      labels[index(click_original_a, click_original_b)] = 0;
      labels[index(a,b)] = value_of_moving_circle;
      refresh_canvas();
    }
  } else {
    var [a,b] = ab_from_xy(coords.x, coords.y);
    if (distance(atox[a], btoy[b], coords.x, coords.y) < r){
      if (event.which == 1){ update_state(a,b); }
      refresh_canvas();
    }
  }
  dragging = false; // does the magic on mouseup
}

function handlekeydown(event){
  var [a,b] = ab_from_xy(coords.x, coords.y);
  var label = labels[index(a,b)]
  if (event.keyCode == 67 && label != 0) { return colorValue(label) };

  if (distance(atox[a], btoy[b], coords.x, coords.y) < r){
    labels[index(a,b)] = 0;
    refresh_canvas();
    return false;
  }
}

canvas.addEventListener('mouseover', handlefocus, false);
canvas.addEventListener('mouseout', handlefocus, false);
canvas.addEventListener('keydown', handlekeydown);
canvas.addEventListener('mousedown', handlemousedown, false);
canvas.addEventListener('mousemove', handlemousemove, false);
canvas.addEventListener('mouseup', handlemouseup, false);
