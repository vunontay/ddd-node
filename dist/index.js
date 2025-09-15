"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  generateProject: () => generateProject
});
module.exports = __toCommonJS(index_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
function generateProject(name) {
  const baseDir = import_path.default.join(process.cwd(), name);
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
    import_fs.default.mkdirSync(import_path.default.join(baseDir, dir), { recursive: true });
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
    const candidatePath = import_path.default.join(baseDir, candidate);
    if (import_fs.default.existsSync(candidatePath)) {
      entryFile = candidatePath;
      break;
    }
  }
  if (!entryFile) {
    entryFile = import_path.default.join(baseDir, "src/main.ts");
    import_fs.default.writeFileSync(entryFile, "// entry point\n");
    console.log(`\u2139\uFE0F No entry file found. Created default at ${entryFile}`);
  } else {
    console.log(`\u2139\uFE0F Found existing entry file at ${entryFile}`);
  }
  console.log(`\u2705 Project ${name} generated successfully!`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  generateProject
});
//# sourceMappingURL=index.js.map