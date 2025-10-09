# 📓️ three-sketchbook

An (unofficial) [Vite](https://vitejs.dev/) + [Three.js](https://threejs.org/)
**sketchbook** template for quickly quickly building and organizing multiple Three.js demos in one place.

<img src="./media/three-sketchbook-demo.gif" alt="Three Sketchbook Demo" width="50%" />

The project is a fork of [three-demo-template](https://github.com/sbobyn/three-demo-template)
that adds support for multiple demos (sketches) each with their own routes
that can be easily navigated between using a provided gui

It includes:

- a Navigation UI to navigate between demos
- Dynamic route generation so all you need to do is add a new `.ts` sketch file and a route is generated and added to the navigation UI
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

Each sketch is a file named `script.js` in `src/sketches/` is just a regular Three.js demo. `main.js` finds all files named `script.js` and creates a route for them in the UI. When you navigate to them with the UI, `main.js` swaps the `iframe.src` in the `iframe` in `index.html` to use `scripts.js`; the template used for each `iframe` is in `/static/demo-template/`

## 🖼 Starting Examples

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

To add a new sketch, just add a subfolder with the name of your sketch and put your sketch in a file named `script.ts`.

That's it!

The helpers `/core/ShaderCanvas.ts` and `/core/setupScene.ts` both provide initial starting points (uses shown in the default sketches), but they are not required.

If you do not wish to use them, you just need to add a canvas to the `app` element:

```javascript
const canvas = document.createElement("canvas");
document.querySelector("#app")?.appendChild(canvas);
```

## 🌐 Deployment

Deploy to Vercel

Push your project to GitHub.

Go to [vercel.com/new](https://vercel.com/new).

Import your repo and click Deploy.
