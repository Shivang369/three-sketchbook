#!/usr/bin/env node
import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import prompts from "prompts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const targetDir = process.argv[2] || "my-sketchbook";
  const templateDir = path.join(__dirname, "template");

  console.log(`\n📦 Copying template into ${targetDir}...`);
  await fs.copy(templateDir, targetDir);

  process.chdir(targetDir);

  // Ask if user wants to initialize a git repo
  const { shouldInitGit } = await prompts({
    type: "confirm",
    name: "shouldInitGit",
    message: "Initialize a new git repository?",
    initial: true,
  });

  if (shouldInitGit) {
    try {
      execSync("git init", { stdio: "ignore" });
      execSync("git branch -M main", { stdio: "ignore" });
      execSync("git add .", { stdio: "ignore" });
      execSync('git commit -m "Initial commit from create-three-sketchbook"', {
        stdio: "ignore",
      });
      console.log("✅ Git repository initialized.");
    } catch (err) {
      console.warn("⚠️ Failed to initialize git repo:", err.message);
    }
  } else {
    console.log("Skipping git init.");
  }

  console.log("\n🎉 Done! Next steps:");
  console.log(`  cd ${targetDir}`);
  console.log("  pnpm install   # or npm install");
  console.log("  pnpm dev       # start the dev server");
}

main();
