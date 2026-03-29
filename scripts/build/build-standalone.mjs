import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(buildDir, "..", "..");
const srcDir = path.join(projectRoot, "src");
const distDir = path.join(projectRoot, "dist");

async function readCssWithImports(filePath, seen = new Set()) {
  const normalized = path.normalize(filePath);
  if (seen.has(normalized)) {
    return "";
  }

  seen.add(normalized);
  const source = await readFile(normalized, "utf8");
  const lines = await Promise.all(
    source.split(/\r?\n/).map(async (line) => {
      const match = line.match(/^\s*@import\s+["'](.+?)["'];\s*$/);
      if (!match) {
        return line;
      }

      const importPath = path.resolve(path.dirname(normalized), match[1]);
      return readCssWithImports(importPath, seen);
    }),
  );

  return lines.join("\n");
}

async function buildStandalone() {
  await mkdir(distDir, { recursive: true });
  await cp(path.join(srcDir, "public"), distDir, { recursive: true, force: true });

  const [template, css, runtimeConfig, js] = await Promise.all([
    readFile(path.join(srcDir, "index.source.html"), "utf8"),
    readCssWithImports(path.join(srcDir, "css", "ui.css")),
    readFile(path.join(srcDir, "runtime-config.js"), "utf8"),
    readFile(path.join(distDir, "js", "game.js"), "utf8"),
  ]);

  const html = template
    .replace('<link rel="stylesheet" href="./css/ui.css">', `<style>\n${css}\n</style>`)
    .replace('<script src="./runtime-config.js"></script>', `<script>\n${runtimeConfig}\n</script>`)
    .replace('<script defer src="./js/game.js"></script>', `<script>\n${js}\n</script>`);

  await writeFile(path.join(distDir, "index.html"), html, "utf8");
  await writeFile(path.join(distDir, ".nojekyll"), "", "utf8");
}

await buildStandalone();
