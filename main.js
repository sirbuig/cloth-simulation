import * as THREE from "three";
import * as CANNON from "cannon-es";

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

const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);
const time_step = 1 / 60;

const sphere_body = new CANNON.Body({
  mass: 0,
  position: new CANNON.Vec3(0, -5, 0),
  shape: new CANNON.Sphere(radius),
});
world.addBody(sphere_body);

function create_cloth(widthSegments, heightSegments) {
  const geometry = new THREE.PlaneGeometry(
    7.5,
    7.5,
    widthSegments,
    heightSegments
  );
  const material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  const cloth = new THREE.Mesh(geometry, material);
  cloth.position.set(0, 5, 0);
  cloth.rotation.x = -Math.PI / 2;
  scene.add(cloth);

  const cloth_body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 5, 0),
    shape: new CANNON.Box(new CANNON.Vec3(3.5, 3.5, 0.1)),
  });

  const q = new CANNON.Quaternion();
  q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  cloth_body.quaternion.copy(q);

  world.addBody(cloth_body);

  return { cloth, cloth_body };
}

const { cloth, cloth_body } = create_cloth(2, 2);

camera.position.z = 15;

function animate() {
  sphere.rotation.y += 0.003;

  world.step(time_step);

  sphere.position.copy(sphere_body.position);
  sphere.quaternion.copy(sphere_body.quaternion);

  cloth.position.copy(cloth_body.position);
  cloth.quaternion.copy(cloth_body.quaternion);

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
