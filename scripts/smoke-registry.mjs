import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { spawn } from "node:child_process";
import { createServer } from "node:net";

const rootDir = new URL("..", import.meta.url);
const webDir = new URL("../apps/web/", import.meta.url);

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: false,
      ...options
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with code ${code ?? -1}`));
    });
  });
}

async function waitForServer(url) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch {}

    await delay(500);
  }

  throw new Error(`Timed out waiting for ${url}.`);
}

async function getAvailablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        server.close(() => reject(new Error("Failed to determine an available port.")));
        return;
      }

      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(address.port);
      });
    });
  });
}

const tempDir = await mkdtemp(join(tmpdir(), "ghibli-registry-smoke-"));
const previewPort = await getAvailablePort();

try {
  await mkdir(join(tempDir, "src"), { recursive: true });

  await writeFile(
    join(tempDir, "package.json"),
    JSON.stringify(
      {
        name: "ghibli-registry-smoke",
        private: true,
        type: "module",
        scripts: {
          build: "vite build"
        },
        dependencies: {
          react: "latest",
          "react-dom": "latest"
        },
        devDependencies: {
          "@types/react": "latest",
          "@types/react-dom": "latest",
          "@vitejs/plugin-react": "^5.0.0",
          tailwindcss: "latest",
          typescript: "latest",
          vite: "^7.0.0"
        }
      },
      null,
      2
    )
  );

  await writeFile(
    join(tempDir, "components.json"),
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema.json",
        style: "default",
        rsc: false,
        tsx: true,
        tailwind: {
          config: "",
          css: "src/index.css",
          baseColor: "neutral",
          cssVariables: true,
          prefix: ""
        },
        aliases: {
          components: "@/components",
          utils: "@/lib/utils",
          ui: "@/components/ui",
          lib: "@/lib",
          hooks: "@/hooks"
        },
        registries: {
          "@ghibli": `http://127.0.0.1:${previewPort}/r/{name}.json`
        }
      },
      null,
      2
    )
  );

  await writeFile(
    join(tempDir, "tsconfig.json"),
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          useDefineForClassFields: true,
          lib: ["ES2023", "DOM", "DOM.Iterable"],
          allowJs: false,
          skipLibCheck: true,
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          strict: true,
          forceConsistentCasingInFileNames: true,
          module: "ESNext",
          moduleResolution: "Bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx"
        },
        include: ["src", "vite.config.ts"]
      },
      null,
      2
    )
  );

  await writeFile(
    join(tempDir, "vite.config.ts"),
    `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()]
});
`
  );

  await writeFile(
    join(tempDir, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ghibli Registry Smoke</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`
  );

  await writeFile(join(tempDir, "src/index.css"), `@import "tailwindcss";\n`);
  await writeFile(
    join(tempDir, "src/main.tsx"),
    `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./index.css";

const root = document.getElementById("root");

if (!root) throw new Error("Missing root.");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`
  );
  await writeFile(
    join(tempDir, "src/app.tsx"),
    `export function App() {
  return <main>Smoke fixture</main>;
}
`
  );

  await run("pnpm", ["install", "--ignore-scripts"], { cwd: tempDir });
  await run("pnpm", ["build:web"], { cwd: rootDir });

  const server = spawn(
    "pnpm",
    ["exec", "vite", "preview", "--host", "127.0.0.1", "--port", String(previewPort)],
    {
      cwd: webDir,
      stdio: "inherit",
      shell: false
    }
  );

  try {
    await waitForServer(`http://127.0.0.1:${previewPort}`);
    await run(
      "pnpm",
      [
        "exec",
        "shadcn",
        "add",
        "@ghibli/all",
        "--cwd",
        tempDir
      ],
      { cwd: rootDir }
    );
    await run("pnpm", ["build"], { cwd: tempDir });
  } finally {
    server.kill("SIGTERM");
  }
} finally {
  await rm(tempDir, { recursive: true, force: true });
}
