import { drawOctahedralRegions, drawIcosahedralRegions } from './region_drawer.js'
export let slider = {A: 1 / 3, B: 1 / 3, C: 1 / 3};
export function setupTriangleControl(symmetry) {
  const triCanvas = document.getElementById("c");


  const dpr = window.devicePixelRatio || 1;

  const parentRect = triCanvas.parentElement.getBoundingClientRect();

  const w = parentRect.width;
  const h = parentRect.height;

  triCanvas.width = w * dpr;
  triCanvas.height = h * dpr;

  const ctx = triCanvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  function getVertices() {
    const s = 0.9* Math.min(w, h / 0.866);
    return {
      A: {x: w/2, y: h/2 - s * 0.866/2},
      B: {x: w/2 - s/2, y: h/2 + s * 0.866/2},
      C: {x: w/2 + s/2, y: h/2 + s * 0.866/2}
    }
  }

  function drawTriangle() {
    ctx.clearRect(0, 0, w, h);

    triCanvas.style.width = w + "px";
    triCanvas.style.height = h + "px";

    const vertices = getVertices();

    ctx.beginPath();
    ctx.moveTo(vertices.A.x, vertices.A.y);
    ctx.lineTo(vertices.B.x, vertices.B.y);
    ctx.lineTo(vertices.C.x, vertices.C.y);
    ctx.closePath();

    ctx.fillStyle = "skyblue";
    ctx.fill();

    if (symmetry == "Octahedral") drawOctahedralRegions(ctx, vertices);
    if (symmetry == "Icosahedral") drawIcosahedralRegions(ctx, vertices);

    ctx.beginPath();

    ctx.arc(
      slider.A * vertices.A.x + slider.B * vertices.B.x + slider.C * vertices.C.x,
      slider.A * vertices.A.y + slider.B * vertices.B.y + slider.C * vertices.C.y,
      4, 0, 2 * Math.PI
    );
    ctx.strokeStyle = '#FFF';
    ctx.stroke();
  }

  const sliderHTML = {
    A: document.getElementById('slider-a'),
    B: document.getElementById('slider-b'),
    C: document.getElementById('slider-c')
  };

  triCanvas.addEventListener('mousedown', handleStart);
  window.addEventListener('mousemove', handleMove);
  window.addEventListener('mouseup', handleEnd);

  // triCanvas.addEventListener('touchstart', handleStart, { passive: true });
  // window.addEventListener('touchmove', handleMove, { passive: true });
  // window.addEventListener('touchend', handleEnd);

  let dragging = false;

  function handleStart(e) {
    dragging = true;
    handlePointer(e);
  }

  function handleMove(e) {
    if (dragging) handlePointer(e);
  }

  function handleEnd() {
    dragging = false;
  }

  function barycentric(P) {
    const vertices = getVertices();;
    const x1 = vertices.A.x, y1 = vertices.A.y;
    const x2 = vertices.B.x, y2 = vertices.B.y;
    const x3 = vertices.C.x, y3 = vertices.C.y;
    const x = P['x'], y = P['y'];

    const detT = (y2 - y3)*(x1 - x3) + (x3 - x2)*(y1 - y3);

    const u = ((y2 - y3)*(x - x3) + (x3 - x2)*(y - y3)) / detT;
    const v = ((y3 - y1)*(x - x3) + (x1 - x3)*(y - y3)) / detT;
    const w = 1 - u - v;

    return [u, v, w];
  }

  function handlePointer(e) {
    const rect = triCanvas.getBoundingClientRect();

    [slider.A, slider.B, slider.C] = barycentric({x: e.clientX - rect.left, y: e.clientY - rect.top});

    slider.A = Math.max(0, Math.min(1, slider.A))
    slider.B = Math.max(0, Math.min(1, slider.B))
    slider.C = Math.max(0, Math.min(1, slider.C))

    const total = slider.A + slider.B + slider.C
    if(total > 1){
      slider.A /= total
      slider.B /= total
      slider.C /= total
    }

    sliderHTML.A.textContent = slider.A.toFixed(2);
    sliderHTML.B.textContent = slider.B.toFixed(2);
    sliderHTML.C.textContent = slider.C.toFixed(2);

    drawTriangle()
  };
  drawTriangle();
}
