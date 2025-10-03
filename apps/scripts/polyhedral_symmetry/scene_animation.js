import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { scene, renderer, camera } from '../polyhedral_symmetry/scene_setup.js';
import { slider } from './triangle_control.js';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';
import { vertices } from '../polyhedral_symmetry/vertices.js';
import * as THREE from "three";

const controls = new OrbitControls(camera, renderer.domElement);
let lastMesh = new THREE.Mesh(new THREE.BufferGeometry());

export function makeAnimator(symmetry) {
  return function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const scaledVs = {
        A: vertices[symmetry].A.map(v => v.clone().multiplyScalar(slider.A)),
        B: vertices[symmetry].B.map(v => v.clone().multiplyScalar(slider.B)),
        C: vertices[symmetry].C.map(v => v.clone().multiplyScalar(slider.C))
      }

    const points = [...scaledVs["A"], ...scaledVs["B"], ...scaledVs["C"]];
    const geometry = new ConvexGeometry(points);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

    scene.remove(lastMesh);
    lastMesh.geometry.dispose();
    lastMesh.material.dispose();

    lastMesh = new THREE.Mesh(geometry, material);
    scene.add(lastMesh);

    renderer.render(scene, camera);
  }
}
