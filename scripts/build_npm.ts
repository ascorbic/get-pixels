import { build, emptyDir } from "https://deno.land/x/dnt@0.36.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./npm",
  shims: {
    deno: {
      test: "dev",
    },
    undici: true,
    custom: [
      {
        module: "node:buffer",
        globalNames: ["Buffer"],
      },
    ],
  },
  rootTestDir: "./test-node",
  package: {
    // package.json properties
    name: "@unpic/pixels",
    version: Deno.args[0]?.replace(/^v/, ""),
    description: "Get raw pixels from an image",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/ascorbic/get-pixels.git",
    },
    bugs: {
      url: "https://github.com/ascorbic/get-pixels/issues",
    },
    devDependencies: {
      "@types/node": "latest",
      "@types/pngjs": "latest",
    },
    publishConfig: {
      access: "public",
    },
  },
});

// post build steps
// Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README-npm.md", "npm/README.md");
