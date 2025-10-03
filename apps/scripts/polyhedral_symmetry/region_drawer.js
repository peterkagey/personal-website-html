function drawPolygon(ctx, points, color) {
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; ++i) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawIcosahedralRegions(ctx, vertices) {
  function ptFromBarycentric(b, c) {
    const A = vertices.A;
    const Bv = vertices.B;
    const Cv = vertices.C;
    return {
      x: (1-b-c) * A.x + b * Bv.x + c * Cv.x,
      y: (1-b-c) * A.y + b * Bv.y + c * Cv.y
    };
  }
  drawPolygon(ctx, [
    ptFromBarycentric(0, 0),
    ptFromBarycentric(0, 1),
    ptFromBarycentric(1, 0)
  ], '#FFBBDD');
  drawPolygon(ctx, [
    ptFromBarycentric(0.44279,0.55721),
    ptFromBarycentric(0.300402,0.378028),
    ptFromBarycentric(0,0.54035),
    ptFromBarycentric(0,1),
  ], '#BBFFDD');
  drawPolygon(ctx, [
    ptFromBarycentric(0.55721,0.44279),
    ptFromBarycentric(0.366458,0.291207),
    ptFromBarycentric(0.517017,0),
    ptFromBarycentric(1.,0),
  ], '#BBDDFF');
  drawPolygon(ctx, [
    ptFromBarycentric(0.482983,0),
    ptFromBarycentric(0,0),
    ptFromBarycentric(0,0.45965),
    ptFromBarycentric(0.335451,0.30546),
  ], '#222200');
  drawPolygon(ctx, [
    ptFromBarycentric(0,0.54035),
    ptFromBarycentric(0,0.45965),
    ptFromBarycentric(0.335451,0.30546),
    ptFromBarycentric(0.300402,0.378028),
  ], '#002222');
  drawPolygon(ctx, [
    ptFromBarycentric(0.44279,0.55721),
    ptFromBarycentric(0.476602,0.523398),
    ptFromBarycentric(0.329776,0.362156),
    ptFromBarycentric(0.300402,0.378028),
  ], '#DDFFBB');
  drawPolygon(ctx, [
    ptFromBarycentric(0.329776,0.362156),
    ptFromBarycentric(0.366458,0.291207),
    ptFromBarycentric(0.55721,0.44279),
    ptFromBarycentric(0.476602,0.523398),
  ], '#DDBBFF');
  drawPolygon(ctx, [
    ptFromBarycentric(0.366458,0.291207),
    ptFromBarycentric(0.335451,0.30546),
    ptFromBarycentric(0.482983,0),
    ptFromBarycentric(0.517017,0),
  ], '#220022');
  drawPolygon(ctx, [
    ptFromBarycentric(0.335451,0.30546),
    ptFromBarycentric(0.366458,0.291207),
    ptFromBarycentric(0.360105,0.298587),
    ptFromBarycentric(0.353716,0.306211),
    ptFromBarycentric(0.347284,0.314094),
    ptFromBarycentric(0.340801,0.322251),
    ptFromBarycentric(0.334262,0.330701),
    ptFromBarycentric(0.327656,0.339461),
    ptFromBarycentric(0.320977,0.348552),
    ptFromBarycentric(0.314215,0.357994),
    ptFromBarycentric(0.30736,0.367811),
    ptFromBarycentric(0.300402,0.378028)
  ], '#FFDDBB');
}

export function drawOctahedralRegions(ctx, vertices) {
  function ptFromBarycentric(b, c) {
    const A = vertices.A;
    const Bv = vertices.B;
    const Cv = vertices.C;
    return {
      x: (1-b-c) * A.x + b * Bv.x + c * Cv.x,
      y: (1-b-c) * A.y + b * Bv.y + c * Cv.y
    };
  }
  drawPolygon(ctx, [
    ptFromBarycentric(0, 0),
    ptFromBarycentric(0, 1),
    ptFromBarycentric(1, 0)
  ], '#FFBBDD');
  drawPolygon(ctx, [
    ptFromBarycentric(0, 0.585786),
    ptFromBarycentric(0.25273, 0.437741),
    ptFromBarycentric(0.366025, 0.633975),
    ptFromBarycentric(0, 1)
  ], '#BBFFDD');
  drawPolygon(ctx, [
    ptFromBarycentric(0, 0.585786),
    ptFromBarycentric(0.25273, 0.437741),
    ptFromBarycentric(0.323544, 0.280197),
    ptFromBarycentric(0, 0.41421)
  ], '#002222');
  drawPolygon(ctx, [
    ptFromBarycentric(0, 0.414214),
    ptFromBarycentric(0.323544, 0.280197),
    ptFromBarycentric(0.44949, 0),
    ptFromBarycentric(0, 0)
  ], '#222200');
  drawPolygon(ctx, [
    ptFromBarycentric(0.417738, 0.241181),
    ptFromBarycentric(0.323544, 0.280197),
    ptFromBarycentric(0.44949, 0),
    ptFromBarycentric(0.55051, 0)
  ], '#220022');
  drawPolygon(ctx, [
    ptFromBarycentric(0.633975, 0.366025),
    ptFromBarycentric(0.417738, 0.241181),
    ptFromBarycentric(0.55051, 0),
    ptFromBarycentric(1., 0)
  ], '#BBDDFF');
  drawPolygon(ctx, [
    ptFromBarycentric(0.336565, 0.388631),
    ptFromBarycentric(0.417738, 0.241181),
    ptFromBarycentric(0.633975, 0.366025),
    ptFromBarycentric(0.464102, 0.535898)
  ], '#DDBBFF');
  drawPolygon(ctx, [
    ptFromBarycentric(0.336565, 0.388631),
    ptFromBarycentric(0.25273, 0.437741),
    ptFromBarycentric(0.366025, 0.633975),
    ptFromBarycentric(0.464102, 0.535898)
  ], '#DDFFBB');
  drawPolygon(ctx, [
    ptFromBarycentric(0.25273, 0.437741),
    ptFromBarycentric(0.26529, 0.417723),
    ptFromBarycentric(0.277024, 0.399849),
    ptFromBarycentric(0.288048, 0.38378),
    ptFromBarycentric(0.298455, 0.369243),
    ptFromBarycentric(0.308322, 0.35602),
    ptFromBarycentric(0.31771, 0.343931),
    ptFromBarycentric(0.32667, 0.332829),
    ptFromBarycentric(0.335247, 0.322592),
    ptFromBarycentric(0.343478, 0.313116),
    ptFromBarycentric(0.351392, 0.304315),
    ptFromBarycentric(0.359019, 0.296114),
    ptFromBarycentric(0.36638, 0.288449),
    ptFromBarycentric(0.373496, 0.281267),
    ptFromBarycentric(0.380386, 0.27452),
    ptFromBarycentric(0.387065, 0.268167),
    ptFromBarycentric(0.393547, 0.262171),
    ptFromBarycentric(0.399845, 0.256501),
    ptFromBarycentric(0.405969, 0.251128),
    ptFromBarycentric(0.41193, 0.246029),
    ptFromBarycentric(0.417738, 0.241181),
    ptFromBarycentric(0.323544, 0.280197)
  ], '#FFDDBB');
}
