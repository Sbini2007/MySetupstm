import net from "node:net";
import path from "node:path";
import { spawn } from "node:child_process";

const port = 3000;
const host = "127.0.0.1";

try {
  const response = await fetch(`http://${host}:${port}/`, {
    signal: AbortSignal.timeout(5000),
  });
  console.log(`MySetups is already running at http://localhost:${port} (HTTP ${response.status})`);
  process.exit(0);
} catch {}

function isPortAvailable() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }
      reject(error);
    });
    server.listen(port, "0.0.0.0", () => {
      server.close((error) => {
        if (error) reject(error);
        else resolve(true);
      });
    });
  });
}

if (!(await isPortAvailable())) {
  throw new Error(
    `Port ${port} is occupied, but the existing server did not respond. Stop the stale server before restarting MySetups.`
  );
}

const nextBin = path.resolve("node_modules", "next", "dist", "bin", "next");
const server = spawn(
  process.execPath,
  [nextBin, "dev", "-p", String(port), "-H", "0.0.0.0"],
  { stdio: "inherit" }
);

server.once("error", (error) => {
  console.error("Failed to start the MySetups development server.", error);
  process.exitCode = 1;
});
server.once("exit", (code, signal) => {
  if (signal) {
    console.error(`MySetups development server stopped by ${signal}.`);
    process.exitCode = 1;
  } else {
    process.exitCode = code ?? 1;
  }
});
