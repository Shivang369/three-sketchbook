import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import Stats from "stats.js";

import vertShaderSource from "./shaders/vertex.glsl";
import fragShaderSource from "./shaders/fragment.glsl";

const debugObject = {
  depthColor: "#186691",
  surfaceColor: "#9bd8ff",
  size: 1,
  subdivisions: 32,
  wireframe: false,
};

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

const windowDims = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const scene = new THREE.Scene();

const axesHelper = new THREE.AxesHelper(1);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(2, 4);
gridHelper.position.y = 0.01;
scene.add(gridHelper);

let geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const regenerateGeometry = (size: number, subdivisions: number) => {
  geometry.dispose(); // Dispose of the old geometry to free up memory
  geometry = new THREE.PlaneGeometry(size, size, subdivisions, subdivisions);
  return geometry;
};

const material = new THREE.ShaderMaterial({
  vertexShader: vertShaderSource,
  fragmentShader: fragShaderSource,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uAmplitude: { value: new THREE.Vector2(0.1, 0.1) },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uTime: { value: 0 },
  },
  wireframe: false,
  side: THREE.DoubleSide,
});

const mesh = new THREE.Mesh(geometry, material);
mesh.scale.set(2, 2, 1);
mesh.rotation.x = -Math.PI / 2;

scene.add(mesh);

const gui = new GUI();

gui
  .add(material.uniforms.uFrequency.value, "x")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyX");
gui
  .add(material.uniforms.uFrequency.value, "y")
  .min(0)
  .max(20)
  .step(0.01)
  .name("frequencyZ");
gui
  .add(material.uniforms.uAmplitude.value, "x")
  .min(0)
  .max(1)
  .step(0.01)
  .name("amplitudeX");
gui
  .add(material.uniforms.uAmplitude.value, "y")
  .min(0)
  .max(1)
  .step(0.01)
  .name("amplitudeZ");
gui.addColor(debugObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});
gui.add(debugObject, "size", 0.1, 2, 0.01).onChange((size) => {
  mesh.geometry = regenerateGeometry(size, debugObject.subdivisions);
});
gui.add(debugObject, "subdivisions", 1, 128, 1).onChange((subdivisions) => {
  mesh.geometry = regenerateGeometry(debugObject.size, subdivisions);
});
gui.add(material, "wireframe").onChange((value) => {
  material.wireframe = value;
});

const camera = new THREE.PerspectiveCamera(
  75,
  windowDims.width / windowDims.height,
  0.1,
  100
);
camera.position.set(1, 1, 1);
scene.add(camera);

const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(windowDims.width, windowDims.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

window.addEventListener("resize", () => {
  windowDims.width = window.innerWidth;
  windowDims.height = window.innerHeight;

  camera.aspect = windowDims.width / windowDims.height;
  camera.updateProjectionMatrix();

  renderer.setSize(windowDims.width, windowDims.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const clock = new THREE.Clock();

const update = () => {
  stats.begin();

  const elapsedTime = clock.getElapsedTime();
  material.uniforms.uTime.value = elapsedTime;

  orbitControls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(update);

  stats.end();
};

update();
