import { ShaderCanvas } from "./core/ShaderCanvas";
import fragShader from "./shaders/shaderCanvasExample.fs";

const shaderDemo = new ShaderCanvas({
  fragmentShader: fragShader,
});

shaderDemo.start();
