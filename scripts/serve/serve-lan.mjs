import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..", "..");
const distDir = path.join(projectRoot, "dist");
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function getLanUrls(listenPort) {
  return Object.values(os.networkInterfaces())
    .flat()
    .filter((entry) => entry && entry.family === "IPv4" && !entry.internal)
    .map((entry) => `http://${entry.address}:${listenPort}`);
}

function safeResolve(urlPath) {
  const requestUrl = new URL(urlPath, "http://dead-static.local");
  let pathname = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
  if (!pathname) {
    pathname = "index.html";
  }

  const resolved = path.normalize(path.join(distDir, pathname));
  if (!resolved.startsWith(distDir)) {
    return null;
  }
  return resolved;
}

async function sendFile(filePath, response) {
  const fileStats = await stat(filePath);
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] || "application/octet-stream",
    "Content-Length": fileStats.size,
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=300",
  });
  createReadStream(filePath).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    const targetPath = safeResolve(request.url || "/");
    if (!targetPath) {
      response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Forbidden");
      return;
    }

    let filePath = targetPath;
    if (!existsSync(filePath) && path.extname(filePath) === "") {
      filePath = path.join(filePath, "index.html");
    }

    if (!existsSync(filePath)) {
      filePath = path.join(distDir, "index.html");
    }

    await sendFile(filePath, response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(`Server error: ${error.message}`);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Dead Static LAN server running from ${distDir}`);
  console.log(`Local: http://localhost:${port}`);
  const lanUrls = getLanUrls(port);
  if (lanUrls.length) {
    console.log("Phone URLs:");
    lanUrls.forEach((url) => console.log(`  ${url}`));
  } else {
    console.log("No LAN IPv4 address detected. Connect the PC to Wi-Fi or Ethernet first.");
  }
  console.log("Keep this terminal open while playing on your phone.");
});
