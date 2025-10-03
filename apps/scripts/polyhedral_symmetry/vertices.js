import * as THREE from "three";

export const octahedralVertices = {
  A: [ // Cuboctahedron
    new THREE.Vector3(Math.sqrt(1 / 2), Math.sqrt(1 / 2), 0),
    new THREE.Vector3(Math.sqrt(1 / 2), -Math.sqrt(1 / 2), 0),
    new THREE.Vector3(Math.sqrt(1 / 2), 0, Math.sqrt(1 / 2)),
    new THREE.Vector3(Math.sqrt(1 / 2), 0, -Math.sqrt(1 / 2)),
    new THREE.Vector3(0, Math.sqrt(1 / 2), Math.sqrt(1 / 2)),
    new THREE.Vector3(0, Math.sqrt(1 / 2), -Math.sqrt(1 / 2)),
    new THREE.Vector3(-Math.sqrt(1 / 2), Math.sqrt(1 / 2), 0),
    new THREE.Vector3(-Math.sqrt(1 / 2), -Math.sqrt(1 / 2), 0),
    new THREE.Vector3(-Math.sqrt(1 / 2), 0, Math.sqrt(1 / 2)),
    new THREE.Vector3(-Math.sqrt(1 / 2), 0, -Math.sqrt(1 / 2)),
    new THREE.Vector3(0, -Math.sqrt(1 / 2), Math.sqrt(1 / 2)),
    new THREE.Vector3(0, -Math.sqrt(1 / 2), -Math.sqrt(1 / 2))
  ],
  B: [ // Cube
    new THREE.Vector3(-Math.sqrt(1 / 3), -Math.sqrt(1 / 3), -Math.sqrt(1 / 3)),
    new THREE.Vector3(Math.sqrt(1 / 3), -Math.sqrt(1 / 3), -Math.sqrt(1 / 3)),
    new THREE.Vector3(Math.sqrt(1 / 3), Math.sqrt(1 / 3), -Math.sqrt(1 / 3)),
    new THREE.Vector3(-Math.sqrt(1 / 3), Math.sqrt(1 / 3), -Math.sqrt(1 / 3)),
    new THREE.Vector3(-Math.sqrt(1 / 3), -Math.sqrt(1 / 3), Math.sqrt(1 / 3)),
    new THREE.Vector3(Math.sqrt(1 / 3), -Math.sqrt(1 / 3), Math.sqrt(1 / 3)),
    new THREE.Vector3(Math.sqrt(1 / 3), Math.sqrt(1 / 3), Math.sqrt(1 / 3)),
    new THREE.Vector3(-Math.sqrt(1 / 3), Math.sqrt(1 / 3), Math.sqrt(1 / 3))
  ],
  C: [ // Octahedron
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1)
  ]
};


const icosahedralVertices = {
  A: [ // Icosidodecahedron
    new THREE.Vector3(1,0,0),
    new THREE.Vector3(0.309017,-0.809017,-0.5),
    new THREE.Vector3(-0.809017,-0.5,-0.309017),
    new THREE.Vector3(0.809017,0.5,0.309017),
    new THREE.Vector3(0,0,1),
    new THREE.Vector3(-0.809017,-0.5,0.309017),
    new THREE.Vector3(-0.309017,0.809017,-0.5),
    new THREE.Vector3(-1,0,0),
    new THREE.Vector3(0.809017,0.5,-0.309017),
    new THREE.Vector3(0.5,0.309017,-0.809017),
    new THREE.Vector3(-0.5,-0.309017,-0.809017),
    new THREE.Vector3(0.5,0.309017,0.809017),
    new THREE.Vector3(0.309017,-0.809017,0.5),
    new THREE.Vector3(0.309017,0.809017,0.5),
    new THREE.Vector3(-0.309017,0.809017,0.5),
    new THREE.Vector3(-0.5,-0.309017,0.809017),
    new THREE.Vector3(0,-1,0),
    new THREE.Vector3(-0.5,0.309017,-0.809017),
    new THREE.Vector3(-0.309017,-0.809017,-0.5),
    new THREE.Vector3(0,1,0),
    new THREE.Vector3(0.309017,0.809017,-0.5),
    new THREE.Vector3(0.5,-0.309017,-0.809017),
    new THREE.Vector3(-0.5,0.309017,0.809017),
    new THREE.Vector3(0.5,-0.309017,0.809017),
    new THREE.Vector3(-0.809017,0.5,0.309017),
    new THREE.Vector3(-0.309017,-0.809017,0.5),
    new THREE.Vector3(0.809017,-0.5,0.309017),
    new THREE.Vector3(0,0,-1),
    new THREE.Vector3(0.809017,-0.5,-0.309017),
    new THREE.Vector3(-0.809017,0.5,-0.309017)
  ],
  B: [ // Dodecahedron
    new THREE.Vector3(0.57735,0.57735,0.57735),
    new THREE.Vector3(0.934172,-0.356822,0.),
    new THREE.Vector3(0,-0.934172,-0.356822),
    new THREE.Vector3(0.356822,0,0.934172),
    new THREE.Vector3(-0.57735,-0.57735,0.57735),
    new THREE.Vector3(-0.57735,-0.57735,-0.57735),
    new THREE.Vector3(0.57735,0.57735,-0.57735),
    new THREE.Vector3(-0.57735,0.57735,-0.57735),
    new THREE.Vector3(0.934172,0.356822,0.),
    new THREE.Vector3(0.356822,0,-0.934172),
    new THREE.Vector3(0.57735,-0.57735,0.57735),
    new THREE.Vector3(-0.356822,0,0.934172),
    new THREE.Vector3(0,-0.934172,0.356822),
    new THREE.Vector3(0.57735,-0.57735,-0.57735),
    new THREE.Vector3(0,0.934172,-0.356822),
    new THREE.Vector3(-0.356822,0,-0.934172),
    new THREE.Vector3(0,0.934172,0.356822),
    new THREE.Vector3(-0.57735,0.57735,0.57735),
    new THREE.Vector3(-0.934172,-0.356822,0.),
    new THREE.Vector3(-0.934172,0.356822,0),
  ],
  C: [ // Icosahedron
    new THREE.Vector3(0,0.525731,0.850651),
    new THREE.Vector3(0.850651,0,0.525731),
    new THREE.Vector3(0.525731,-0.850651,0),
    new THREE.Vector3(0,-0.525731,0.850651),
    new THREE.Vector3(-0.525731,-0.850651,0),
    new THREE.Vector3(0,-0.525731,-0.850651),
    new THREE.Vector3(0.850651,0,-0.525731),
    new THREE.Vector3(0,0.525731,-0.850651),
    new THREE.Vector3(0.525731,0.850651,0),
    new THREE.Vector3(-0.525731,0.850651,0),
    new THREE.Vector3(-0.850651,0,0.525731),
    new THREE.Vector3(-0.850651,0,-0.525731)
  ]
};

export const vertices = {
  Octahedral: octahedralVertices,
  Icosahedral: icosahedralVertices
}
