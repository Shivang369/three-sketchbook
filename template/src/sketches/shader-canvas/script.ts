import { ShaderCanvas } from "../../core/ShaderCanvas";
import fragShader from "./shaderCanvasExample.fs";

const shaderDemo = new ShaderCanvas({
  fragmentShader: fragShader,
});

shaderDemo.start();
