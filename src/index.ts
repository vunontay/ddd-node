import fs from "fs";
import path from "path";

export function generateProject(name: string) {
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

  let entryFile: string | null = null;

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
    console.log(`ℹ️ No entry file found. Created default at ${entryFile}`);
  } else {
    console.log(`ℹ️ Found existing entry file at ${entryFile}`);
  }

  console.log(`✅ Project ${name} generated successfully!`);
}
