# 📓️ three-sketchbook

An **opinionated unofficial** [Vite](https://vitejs.dev/) + [Three.js](https://threejs.org/)
**sketchbook** template for quickly quickly building and organizing multiple Three.js demos in one place.

<img src="./media/three-sketchbook-demo.gif" alt="Three Sketchbook Demo" width="50%" />

The project is a fork of [three-demo-template](https://github.com/sbobyn/three-demo-template)
that adds support for multiple demos (sketches) each with their own routes
that can be easily navigated between using a provided gui; cleanup of GPU resources when
navigating between sketches is handled automatically.

This template provides a clean, modern dev environment with:

- Hash-based Router – each demo in the `sketches/` folder gets a route generated of the form: `#/sketches/<demoFileName>`
- Persistent Navigation UI – select sketches via a built-in `lil-gui` dropdown with current selection saved in localStorage
- **[Vite](https://vitejs.dev/)** – fast dev server with HMR, optimized builds
- **[vite-plugin-glsl](https://www.npmjs.com/package/vite-plugin-glsl)** – import `.glsl, .vs, .fs, .vert, .frag` shader files directly with live reload
- **[vite-plugin-restart](https://www.npmjs.com/package/vite-plugin-restart)** – automatically restart the dev server when config files change
- **Camera helpers** – full-screen perspective/orthographic cameras that resize to fit browser
- **Scene setup helper** – quickly get a scene, renderer, resize handling, and optional OrbitControls
- **ShaderCanvas** – full-screen quad with built-in uniforms that accepts a fragment shader and supplies it with built-in uniforms (`uTime`, `uResolution`, `uMouse`) as well as optional user defined uniforms
- **[Stats.js](https://github.com/mrdoob/stats.js) helper** – optional FPS panel for performance debugging
- **[lil-gui](https://github.com/georgealways/lil-gui)** – lightweight debug GUI for scene switching and optinally for tweaking uniforms, material parameters, and scene settings in real time
- **TypeScript**

## 🎮 How It Works

Each sketch is a file in `src/sketches/` that exports a function returning a `THREE.WebGLRenderer`.
`main.ts` automatically loads them and handles:

- Creating & removing the canvas for each sketch
- Stopping render loops (renderer.setAnimationLoop(null))
- Disposing GPU resources (renderer.dispose())
- Clearing sketch-specific GUIs

Navigation is handled by a tiny hash router (based on [fragments-boilerplate-vanilla](https://github.com/phobon/fragments-boilerplate-vanilla)), so you can deep-link directly to a sketch:

```
#/sketches/rotating-box
#/sketches/shaderCanvasExample
```

## 🖼 Starting Example

Inside `src/sketches/`, you’ll find multiple example sketches

- `sceneBasicDemo.ts` – Simple lit cube casting shadows on a plane

- `shaderSceneDemo.ts` – Plane with custom vertex + fragment shader

- `shaderCanvasDemo.ts` – ShaderCanvas using a simple fragment shader that uses the `uTime` and `uMouse` uniforms

---

## 🚀 Getting Started

```bash
npm create three-sketchbook@latest my-project
cd my-project
pnpm install # or npm install
pnpm dev
```

## ✨ Adding a New Sketch

Take a look at the example sketches in `src/sketches/`.

Create a new file in `src/sketches/`, e.g. `src/sketches/my-sketch.ts`

Export a function that contains your Three.js demo and return the renderer:

```javascript
import * as THREE from "three";
import { setupScene } from "../core/setupScene";

export default function (): THREE.WebGLRenderer {
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 2;

  const { scene, renderer, canvas } = setupScene({ camera });
  document.querySelector("#app")?.appendChild(canvas);

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
  );
  scene.add(mesh);

  renderer.setAnimationLoop(() => {
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  });

  return renderer;
}
```

That's it!

## 🌐 Deployment

Deploy to Vercel

Push your project to GitHub.

Go to [vercel.com/new](https://vercel.com/new).

Import your repo and click Deploy.

> Note: This template is unofficial and not maintained by the Three.js or Vite teams. It’s meant as a quick-start kit for personal projects, shader experiments, and prototyping.
