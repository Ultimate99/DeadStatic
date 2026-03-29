import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(buildDir, "..", "..");

function runNode(args) {
  execFileSync(process.execPath, args, {
    cwd: projectRoot,
    stdio: "inherit",
  });
}

function collectFiles(rootDir, extension) {
  const files = [];

  function walk(currentDir) {
    readdirSync(currentDir, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        return;
      }
      if (fullPath.endsWith(extension)) {
        files.push(fullPath);
      }
    });
  }

  walk(rootDir);
  return files.sort();
}

runNode([path.join(buildDir, "build-bundle.mjs")]);
runNode([path.join(buildDir, "build-standalone.mjs")]);
runNode(["--experimental-default-type=module", path.join(buildDir, "validate-content.mjs")]);

collectFiles(path.join(projectRoot, "src", "js"), ".js").forEach((file) => {
  runNode(["--experimental-default-type=module", "--check", file]);
});
runNode(["--check", path.join(projectRoot, "src", "runtime-config.js")]);

runNode(["--check", path.join(projectRoot, "dist", "js", "game.js")]);
collectFiles(path.join(projectRoot, "scripts"), ".mjs").forEach((file) => {
  runNode(["--experimental-default-type=module", "--check", file]);
});
collectFiles(path.join(projectRoot, "tests", "qa"), ".mjs").forEach((file) => {
  runNode(["--experimental-default-type=module", "--check", file]);
});
runNode(["--experimental-default-type=module", path.join(projectRoot, "tests", "qa", "qa.test.mjs")]);
