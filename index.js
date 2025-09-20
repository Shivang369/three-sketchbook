#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import fs from "fs-extra";

const __dirname = dirname(fileURLToPath(import.meta.url));
const targetDir = process.argv[2] || "my-three-demo";
const templateDir = resolve(__dirname, "template");

console.log(`Scaffolding project in ${targetDir}...`);

await fs.copy(templateDir, targetDir, {
  overwrite: false,
  errorOnExist: true,
});

console.log("Done! Next steps:");
console.log(`  cd ${targetDir}`);
console.log("  pnpm install");
console.log("  pnpm dev");
