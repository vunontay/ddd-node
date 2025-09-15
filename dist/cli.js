#!/usr/bin/env node

// src/cli.ts
import { Command } from "commander";

// src/index.ts
import fs from "fs";
import path from "path";
function generateProject(name) {
  const baseDir = path.join(process.cwd(), name);
  const structure = [
    "src/domain/entities",
    "src/domain/value_objects",
    "src/domain/repositories",
    "src/domain/events",
    "src/application/dto",
    "src/application/services",
    "src/infrastructure/repositories",
    "src/infrastructure/db",
    "src/infrastructure/redis",
    "src/infrastructure/messaging",
    "src/infrastructure/config",
    "src/interfaces/http",
    "src/interfaces/graphql",
    "src/interfaces/cli",
    "src/shared/errors",
    "src/shared/utils",
    "src/shared/constants"
  ];
  structure.forEach((dir) => {
    fs.mkdirSync(path.join(baseDir, dir), { recursive: true });
  });
  const entryCandidates = [
    "src/main.ts",
    "src/app.ts",
    "src/index.ts",
    "server.js",
    "app.js",
    "index.js"
  ];
  let entryFile = null;
  for (const candidate of entryCandidates) {
    const candidatePath = path.join(baseDir, candidate);
    if (fs.existsSync(candidatePath)) {
      entryFile = candidatePath;
      break;
    }
  }
  if (!entryFile) {
    entryFile = path.join(baseDir, "src/main.ts");
    fs.writeFileSync(entryFile, "// entry point\n");
    console.log(`\u2139\uFE0F No entry file found. Created default at ${entryFile}`);
  } else {
    console.log(`\u2139\uFE0F Found existing entry file at ${entryFile}`);
  }
  console.log(`\u2705 Project ${name} generated successfully!`);
}

// src/cli.ts
var program = new Command();
program.name("ddd").description("DDD project generator for Node.js").version("1.0.0");
program.command("new <projectName>").description("Generate a new DDD structured project").action((projectName) => {
  generateProject(projectName);
});
program.parse(process.argv);
//# sourceMappingURL=cli.js.map