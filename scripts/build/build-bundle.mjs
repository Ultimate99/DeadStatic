import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const buildDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(buildDir, "..", "..");
const srcJsDir = path.join(projectRoot, "src", "js");
const distJsDir = path.join(projectRoot, "dist", "js");
const entryPath = path.join(srcJsDir, "app.js");
const dependencyPattern = /^\s*(?:import|export)\s+[\s\S]*?from\s+["'](.+?)["'];\s*$/gm;

function normalizeJsPath(filePath) {
  return path.normalize(filePath.endsWith(".js") ? filePath : `${filePath}.js`);
}

function stripModuleSyntax(source) {
  return source
    .replace(/^\s*import[\s\S]*?;\s*$/gm, "")
    .replace(/^\s*export\s+\*\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/^\s*export\s+\{[\s\S]*?\}\s+from\s+["'][^"']+["'];\s*$/gm, "")
    .replace(/^\s*export\s+\{[\s\S]*?\};\s*$/gm, "")
    .replace(/^export\s+async\s+function\s+/gm, "async function ")
    .replace(/^export\s+(const|function|class)\s+/gm, "$1 ");
}

function collectDependencyPaths(source, parentFile) {
  return [...source.matchAll(dependencyPattern)]
    .map((match) => match[1])
    .filter((specifier) => specifier.startsWith("."))
    .map((specifier) => normalizeJsPath(path.resolve(path.dirname(parentFile), specifier)));
}

async function walkModule(filePath, seen, ordered) {
  const normalized = normalizeJsPath(filePath);
  if (seen.has(normalized)) {
    return;
  }
  seen.add(normalized);

  const source = await readFile(normalized, "utf8");
  const dependencies = collectDependencyPaths(source, normalized);
  for (const dependency of dependencies) {
    await walkModule(dependency, seen, ordered);
  }

  ordered.push({
    filePath: normalized,
    source,
  });
}

async function buildBundle() {
  await mkdir(distJsDir, { recursive: true });

  const ordered = [];
  await walkModule(entryPath, new Set(), ordered);

  const bundle = [
    "/* Dead Static bundled runtime for direct file-open compatibility. */",
    ...ordered.map(({ filePath, source }) => `// ${path.relative(srcJsDir, filePath).replace(/\\/g, "/")}\n${stripModuleSyntax(source).trim()}\n`),
    "",
  ].join("\n\n");

  await writeFile(path.join(distJsDir, "game.js"), bundle, "utf8");
}

await buildBundle();
