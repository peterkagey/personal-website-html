t=1;
SCALE=100;
HOLE_DEPTH=0.05;
EPSILON=HOLE_DEPTH/10;
HOLE_RADIUS=0.1;
CHOP=0.5;

function scale_vector(t,v) = [(1-t)*v[0],(1-t)*v[1],(1-t)*v[2]];

vs = [
    [-1.72488,-1.24722,-0.368676],
    [-2.294,0.,0.],
    [-1.72488,0.368676,-1.24722],
    [-1.24722,-0.368676,-1.72488],
    [-1.24722,-1.24722,-1.24722],
    [0.,0.,0.]
];

function weighted_average(v0,v1,v2,a) = [
    (a[0]*v0[0] + a[1]*v1[0] + a[2]*v2[0])/(a[0] + a[1] + a[2]),
    (a[0]*v0[1] + a[1]*v1[1] + a[2]*v2[1])/(a[0] + a[1] + a[2]),
    (a[0]*v0[2] + a[1]*v1[2] + a[2]*v2[2])/(a[0] + a[1] + a[2]),
];

module hole_direction_0() {
    multmatrix([
        [1,0,0,0],
        [0,0.95898,-0.283472, 0],
        [0,0.283472,0.95898,0],
        [0,0,0,1]
    ]) 
    translate([0,0,-HOLE_DEPTH])
    cylinder(HOLE_DEPTH+EPSILON,HOLE_RADIUS,HOLE_RADIUS,$fn=20);  
}

module hole_direction_1() {
    multmatrix([
        [1,0,0,0],
        [0,0.283472,0.95898,0],
        [0,-0.95898,0.283472, 0],
        [0,0,0,1]
    ]) 
    translate([0,0,-HOLE_DEPTH])
    cylinder(HOLE_DEPTH+EPSILON,HOLE_RADIUS,HOLE_RADIUS,$fn=20);  
}

module hole_direction_2() {
    multmatrix([
        [0.432016, -0.735879, 0.521387,0],
        [-0.735879, 0.046597, 0.675508,0],
        [-0.521387, -0.675508, -0.521387, 0],
        [0,0,0,1]
    ]) 
    translate([0,0,-HOLE_DEPTH])
    cylinder(HOLE_DEPTH+EPSILON,HOLE_RADIUS,HOLE_RADIUS,$fn=20);  
}

module hole_direction_3() {
    multmatrix([
        [0.788196, 0.326959, 0.521387,0],
        [0.326959, 0.495276, -0.80486,0],
        [-0.521387, 0.80486, 0.283472, 0],
        [0,0,0,1]
    ]) 
    translate([0,0,-HOLE_DEPTH])
    cylinder(HOLE_DEPTH+EPSILON,HOLE_RADIUS,HOLE_RADIUS,$fn=20);  
}

module hole_direction_4() {
    multmatrix([
        [-0.353492, 0.476702, 0.80486,0],
        [0.476702, 0.832105, -0.283472,0],
        [-0.80486, 0.283472, -0.521387, 0],
        [0,0,0,1]
    ]) 
    translate([0,0,-HOLE_DEPTH])
    cylinder(HOLE_DEPTH+EPSILON,HOLE_RADIUS,HOLE_RADIUS,$fn=20);  
}

module hole_direction(i) {
    if (i == 0) hole_direction_0();
    if (i == 1) hole_direction_1();
    if (i == 2) hole_direction_2();
    if (i == 3) hole_direction_3();
    if (i == 4) hole_direction_4();
}

module drill_hole(i1, i2, i3, weights, hole_index) {
    translate(weighted_average(vs[i1],vs[i2],vs[i3],weights))
    hole_direction(hole_index);
}

module drill_holes(hole_index) {
    if (hole_index == 0) {
        drill_hole(0, 5, 1, [1,0.3,0.3], hole_index);
        drill_hole(0, 5, 1, [0.3,0.3,0.3], hole_index);
        drill_hole(0, 5, 1, [0.3,0.3,1], hole_index);
    }
    if (hole_index == 1) {
        drill_hole(2, 1, 5, [1,0.3,0.3], hole_index);
        drill_hole(2, 1, 5, [0.3,0.3,0.3], hole_index);
        drill_hole(5, 2, 1, [0.3,0.3,1], hole_index);
    }
    if (hole_index == 2) {
        drill_hole(3, 2, 5, [1,0.382,0.192528], hole_index);
        drill_hole(3, 2, 5, [0.382,1,0.192528], hole_index);
        drill_hole(3, 2, 5, [1,0.352044,0.762], hole_index);
        drill_hole(3, 2, 5, [0.352044,1,0.762], hole_index);
    }
    if (hole_index == 2) {
        drill_hole(3, 2, 5, [1,0.382,0.192528], hole_index);
        drill_hole(3, 2, 5, [0.382,1,0.192528], hole_index);
        drill_hole(3, 2, 5, [1,0.352044,0.762], hole_index);
        drill_hole(3, 2, 5, [0.352044,1,0.762], hole_index);
    }
    if (hole_index == 3) {
        drill_hole(0, 4, 5, [1,0.382,0.192528], hole_index);
        drill_hole(0, 4, 5, [0.382,1,0.192528], hole_index);
        drill_hole(0, 4, 5, [1,0.352044,0.762], hole_index);
        drill_hole(0, 4, 5, [0.352044,1,0.762], hole_index);
    }
    if (hole_index == 4) {
        drill_hole(4, 3, 5, [1,0.382,0.192528], hole_index);
        drill_hole(4, 3, 5, [0.382,1,0.192528], hole_index);
        drill_hole(4, 3, 5, [1,0.352044,0.762], hole_index);
        drill_hole(4, 3, 5, [0.352044,1,0.762], hole_index);
    }
}

module cone(t) {
    polyhedron([
        scale_vector(0,[-1.72488,-1.24722,-0.368676]),
        scale_vector(0,[-2.294,0.,0.]),
        scale_vector(0,[-1.72488,0.368676,-1.24722]),
        scale_vector(0,[-1.24722,-0.368676,-1.72488]),
        scale_vector(0,[-1.24722,-1.24722,-1.24722]),
        scale_vector(CHOP,[-1.72488,-1.24722,-0.368676]),
        scale_vector(CHOP,[-2.294,0.,0.]),
        scale_vector(CHOP,[-1.72488,0.368676,-1.24722]),
        scale_vector(CHOP,[-1.24722,-0.368676,-1.72488]),
        scale_vector(CHOP,[-1.24722,-1.24722,-1.24722]),
    ],[[0, 4, 3, 2, 1], [6, 5, 0, 1], [8, 7, 2, 3], [7, 6, 1, 2], [7, 8, 9, 5, 6], [9, 8, 3, 4], [5, 9, 4, 0]]);
}
scale([SCALE, SCALE, SCALE])
difference(){
    cone(1);
    union(){
        color("#FF0000") drill_holes(0);
        color("#FFAA00") drill_holes(1);
        color("#FFFF00") drill_holes(2);
        color("#00FF00") drill_holes(3);
        color("#00FFAA") drill_holes(4);
    }
}
