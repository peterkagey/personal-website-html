import * as THREE from "three";

export const scene = new THREE.Scene();
const mainCanvasContainerRect = document.getElementById('main-canvas-container').getBoundingClientRect();

const width = mainCanvasContainerRect.width;
const height = mainCanvasContainerRect.height;
const mainCanvas = document.getElementById('main-canvas');
export const renderer = new THREE.WebGLRenderer({canvas: mainCanvas});

export const camera = new THREE.PerspectiveCamera(40, width / height);
camera.position.set(1.5, 1.5, 1.5);
camera.lookAt(0, 0, 0);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
// document.body.appendChild(renderer.domElement);

const redLight = new THREE.DirectionalLight(0xffff00, 0.7, 100);
redLight.position.set(5, 0, 0);
camera.add(redLight);

const greenLight = new THREE.DirectionalLight(0x00ffff, 0.7, 100);
greenLight.position.set(0, 5, 0);
camera.add(greenLight);

const blueLight = new THREE.DirectionalLight(0xff00ff, 0.7, 100);
blueLight.position.set(0, 0, 5);
camera.add(blueLight);
scene.add(camera)
