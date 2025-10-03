import { setupTriangleControl } from './polyhedral_symmetry/triangle_control.js';
import { makeAnimator } from './polyhedral_symmetry/scene_animation.js';

setupTriangleControl("Icosahedral");
makeAnimator("Icosahedral")();
