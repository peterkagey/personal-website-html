function filePath(nameStr) = str(nameStr, ".svg");

TH = 1;

module xWall(wallNumber, xDel, yDel, height) {
translate([xDel-TH/2,yDel,height])
rotate([-90,0,0])
translate([0, 0, -TH/2])
linear_extrude(TH)
import(filePath(str("x_", wallNumber)), dpi=254);
}

module yWall(wallNumber, xDel, yDel, height) {
translate([xDel,yDel-TH/2,height])
rotate([-90,0,90])
translate([0, 0, -TH/2])
linear_extrude(TH)
import(filePath(str("y_", wallNumber)), dpi=254);
}

rotate([0,0,180]) translate([-55,-55,0]) {
  color("red") {
    xWall(wallNumber=0, xDel=0, yDel=0, height=28);
    xWall(wallNumber=1, xDel=39, yDel=17, height=17);
    xWall(wallNumber=2, xDel=0, yDel=18, height=18);
    xWall(wallNumber=3, xDel=15, yDel=21, height=21);
    xWall(wallNumber=4, xDel=84, yDel=26, height=26);
    xWall(wallNumber=5, xDel=56, yDel=28, height=28);
    xWall(wallNumber=6, xDel=43, yDel=30, height=13);
    xWall(wallNumber=7, xDel=0, yDel=33, height=27);
    xWall(wallNumber=8, xDel=50, yDel=36, height=14);
    xWall(wallNumber=9, xDel=27, yDel=37, height=23);
    xWall(wallNumber=10, xDel=50, yDel=50, height=60);
    xWall(wallNumber=11, xDel=0, yDel=60, height=50);
    xWall(wallNumber=12, xDel=0, yDel=110, height=60);
  }
  color("blue"){
    yWall(wallNumber=0, xDel=0, yDel=0, height=50);
    yWall(wallNumber=1, xDel=15, yDel=18, height=15);
    yWall(wallNumber=2, xDel=18, yDel=0, height=21);
    yWall(wallNumber=3, xDel=27, yDel=21, height=27);
    yWall(wallNumber=4, xDel=39, yDel=0, height=21);
    yWall(wallNumber=5, xDel=43, yDel=17, height=16);
    yWall(wallNumber=6, xDel=50, yDel=30, height=60);
    yWall(wallNumber=7, xDel=56, yDel=0, height=28);
    yWall(wallNumber=8, xDel=64, yDel=28, height=22);
    yWall(wallNumber=9, xDel=84, yDel=0, height=28);
    yWall(wallNumber=10, xDel=86, yDel=26, height=24);
    yWall(wallNumber=11, xDel=110, yDel=0, height=60);
  }
}
