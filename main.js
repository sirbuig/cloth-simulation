import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x111111);
document.body.appendChild(renderer.domElement);

const light_left = new THREE.DirectionalLight(0xffffff, 3);
const light_right = new THREE.DirectionalLight(0xffffff, 5);
const light_below = new THREE.DirectionalLight(0xffffff, 2);
light_left.position.set(-10, 3, -8);
light_right.position.set(4, 2, 4);
light_below.position.set(-10, -10, -2);
scene.add(light_left);
scene.add(light_right);
scene.add(light_below);

const radius = 3.0;
const widthSegments = 64;
const heightSegments = 64;
const geometry = new THREE.SphereGeometry(
  radius,
  widthSegments,
  heightSegments
);
const material = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  flatShading: true,
  roughness: 0.2,
  metalness: 0.5,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(0, -5, 0);
scene.add(sphere);

camera.position.z = 15;

function animate() {
  // sphere.rotation.x += 0.003;
  sphere.rotation.y += 0.003;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
