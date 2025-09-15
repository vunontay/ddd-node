#!/usr/bin/env node
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// src/cli.ts
var import_commander = require("commander");

// src/index.ts
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
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
function setupDDDStructure(baseDir) {
  const structure = [
    "domain/entities",
    "domain/value_objects",
    "domain/repositories",
    "domain/events",
    "application/dto",
    "application/services",
    "infrastructure/repositories",
    "infrastructure/db",
    "infrastructure/redis",
    "infrastructure/messaging",
    "infrastructure/config",
    "interfaces/http",
    "interfaces/graphql",
    "interfaces/cli",
    "shared/errors",
    "shared/utils",
    "shared/constants"
  ];
  structure.forEach((dir) => {
    const fullPath = import_path.default.join(baseDir, dir);
    if (!import_fs.default.existsSync(fullPath)) {
      import_fs.default.mkdirSync(fullPath, { recursive: true });
    }
  });
}
function generateModule(moduleName, options = {}) {
  const {
    actions = ["index", "show", "create", "update", "destroy"],
    skipController = false,
    skipService = false,
    skipRepository = false,
    outputDir
  } = options;
  const baseDir = outputDir ? import_path.default.resolve(outputDir) : process.cwd();
  const srcPath = outputDir ? baseDir : import_path.default.join(baseDir, "src");
  if (!import_fs.default.existsSync(srcPath)) {
    if (outputDir) {
      console.log(`\u{1F4C1} Creating DDD structure at ${srcPath}`);
      setupDDDStructure(srcPath);
    } else {
      console.log("\u274C Not in a DDD project directory. Run 'create-ddd-app new <project-name>' first or specify outputDir.");
      return;
    }
  }
  const createdFiles = [];
  const entityPath = import_path.default.join(srcPath, "domain/entities", `${moduleName}.entity.ts`);
  import_fs.default.writeFileSync(entityPath, generateEntityTemplate(moduleName));
  createdFiles.push(entityPath);
  const valueObjectPath = import_path.default.join(srcPath, "domain/value_objects", `${moduleName}.value-object.ts`);
  import_fs.default.writeFileSync(valueObjectPath, generateValueObjectTemplate(moduleName));
  createdFiles.push(valueObjectPath);
  if (!skipRepository) {
    const repoInterfacePath = import_path.default.join(srcPath, "domain/repositories", `${moduleName}.repository.ts`);
    import_fs.default.writeFileSync(repoInterfacePath, generateRepositoryInterfaceTemplate(moduleName, actions));
    createdFiles.push(repoInterfacePath);
    const repoImplPath = import_path.default.join(srcPath, "infrastructure/repositories", `${moduleName}.repository.impl.ts`);
    import_fs.default.writeFileSync(repoImplPath, generateRepositoryImplTemplate(moduleName, actions));
    createdFiles.push(repoImplPath);
  }
  const dtoPath = import_path.default.join(srcPath, "application/dto", `${moduleName}.dto.ts`);
  import_fs.default.writeFileSync(dtoPath, generateDtoTemplate(moduleName, actions));
  createdFiles.push(dtoPath);
  if (!skipService) {
    const servicePath = import_path.default.join(srcPath, "application/services", `${moduleName}.service.ts`);
    import_fs.default.writeFileSync(servicePath, generateServiceTemplate(moduleName, actions));
    createdFiles.push(servicePath);
  }
  if (!skipController) {
    const controllerPath = import_path.default.join(srcPath, "interfaces/http", `${moduleName}.controller.ts`);
    import_fs.default.writeFileSync(controllerPath, generateControllerTemplate(moduleName, actions));
    createdFiles.push(controllerPath);
    const routesPath = import_path.default.join(srcPath, "interfaces/http", `${moduleName}.routes.ts`);
    import_fs.default.writeFileSync(routesPath, generateRoutesTemplate(moduleName, actions));
    createdFiles.push(routesPath);
  }
  console.log(`\u2705 Generated ${moduleName} module:`);
  createdFiles.forEach((file) => {
    const relativePath = import_path.default.relative(baseDir, file);
    console.log(`   create  ${relativePath}`);
  });
}
function generateEntityTemplate(moduleName) {
  const className = toPascalCase(moduleName);
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

export class ${className}Entity {
  constructor(
    public readonly id: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Add your entity properties and methods here
}
`;
}
function generateValueObjectTemplate(moduleName) {
  const className = toPascalCase(moduleName);
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

export class ${className}ValueObject {
  constructor(public readonly value: string) {
    this.validate(value);
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('${className} value cannot be empty');
    }
  }

  equals(other: ${className}ValueObject): boolean {
    return this.value === other.value;
  }
}
`;
}
function generateRepositoryInterfaceTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  const entityName = `${className}Entity`;
  let methods = "";
  if (actions.includes("index")) {
    methods += `  findAll(): Promise<${entityName}[]>;
`;
  }
  if (actions.includes("show")) {
    methods += `  findById(id: string): Promise<${entityName} | null>;
`;
  }
  if (actions.includes("create")) {
    methods += `  create(entity: Omit<${entityName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${entityName}>;
`;
  }
  if (actions.includes("update")) {
    methods += `  update(id: string, data: Partial<${entityName}>): Promise<${entityName} | null>;
`;
  }
  if (actions.includes("destroy")) {
    methods += `  delete(id: string): Promise<boolean>;
`;
  }
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

import { ${entityName} } from '../entities/${moduleName}.entity';

export interface ${className}Repository {
${methods}}
`;
}
function generateRepositoryImplTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  const entityName = `${className}Entity`;
  let methods = "";
  if (actions.includes("index")) {
    methods += `
  async findAll(): Promise<${entityName}[]> {
    // TODO: Implement database query
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes("show")) {
    methods += `
  async findById(id: string): Promise<${entityName} | null> {
    // TODO: Implement database query
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes("create")) {
    methods += `
  async create(data: Omit<${entityName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${entityName}> {
    // TODO: Implement database insert
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes("update")) {
    methods += `
  async update(id: string, data: Partial<${entityName}>): Promise<${entityName} | null> {
    // TODO: Implement database update
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes("destroy")) {
    methods += `
  async delete(id: string): Promise<boolean> {
    // TODO: Implement database delete
    throw new Error('Method not implemented');
  }
`;
  }
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

import { ${className}Repository } from '../../domain/repositories/${moduleName}.repository';
import { ${entityName} } from '../../domain/entities/${moduleName}.entity';

export class ${className}RepositoryImpl implements ${className}Repository {${methods}}
`;
}
function generateDtoTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  let dtos = `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

`;
  if (actions.includes("create")) {
    dtos += `export interface Create${className}Dto {
  // Add your create DTO properties here
}

`;
  }
  if (actions.includes("update")) {
    dtos += `export interface Update${className}Dto {
  // Add your update DTO properties here
}

`;
  }
  dtos += `export interface ${className}ResponseDto {
  id: string;
  createdAt: string;
  updatedAt: string;
  // Add your response DTO properties here
}
`;
  return dtos;
}
function generateServiceTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  let methods = "";
  if (actions.includes("index")) {
    methods += `
  async findAll() {
    return await this.${moduleName}Repository.findAll();
  }
`;
  }
  if (actions.includes("show")) {
    methods += `
  async findById(id: string) {
    return await this.${moduleName}Repository.findById(id);
  }
`;
  }
  if (actions.includes("create")) {
    methods += `
  async create(data: Create${className}Dto) {
    // TODO: Add business logic validation
    return await this.${moduleName}Repository.create(data);
  }
`;
  }
  if (actions.includes("update")) {
    methods += `
  async update(id: string, data: Update${className}Dto) {
    // TODO: Add business logic validation
    return await this.${moduleName}Repository.update(id, data);
  }
`;
  }
  if (actions.includes("destroy")) {
    methods += `
  async delete(id: string) {
    return await this.${moduleName}Repository.delete(id);
  }
`;
  }
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

import { ${className}Repository } from '../../domain/repositories/${moduleName}.repository';
import { Create${className}Dto, Update${className}Dto } from '../dto/${moduleName}.dto';

export class ${className}Service {
  constructor(private readonly ${moduleName}Repository: ${className}Repository) {}
${methods}}
`;
}
function generateControllerTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  let methods = "";
  if (actions.includes("index")) {
    methods += `
  async index(req: Request, res: Response) {
    try {
      const result = await this.${moduleName}Service.findAll();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
`;
  }
  if (actions.includes("show")) {
    methods += `
  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.${moduleName}Service.findById(id);
      if (!result) {
        return res.status(404).json({ error: '${className} not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
`;
  }
  if (actions.includes("create")) {
    methods += `
  async create(req: Request, res: Response) {
    try {
      const result = await this.${moduleName}Service.create(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
`;
  }
  if (actions.includes("update")) {
    methods += `
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.${moduleName}Service.update(id, req.body);
      if (!result) {
        return res.status(404).json({ error: '${className} not found' });
      }
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
`;
  }
  if (actions.includes("destroy")) {
    methods += `
  async destroy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.${moduleName}Service.delete(id);
      if (!success) {
        return res.status(404).json({ error: '${className} not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
`;
  }
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

import { Request, Response } from 'express';
import { ${className}Service } from '../../application/services/${moduleName}.service';

export class ${className}Controller {
  constructor(private readonly ${moduleName}Service: ${className}Service) {}
${methods}}
`;
}
function generateRoutesTemplate(moduleName, actions) {
  const className = toPascalCase(moduleName);
  let routes = "";
  if (actions.includes("index")) {
    routes += `router.get('/', ${moduleName}Controller.index.bind(${moduleName}Controller));
`;
  }
  if (actions.includes("show")) {
    routes += `router.get('/:id', ${moduleName}Controller.show.bind(${moduleName}Controller));
`;
  }
  if (actions.includes("create")) {
    routes += `router.post('/', ${moduleName}Controller.create.bind(${moduleName}Controller));
`;
  }
  if (actions.includes("update")) {
    routes += `router.put('/:id', ${moduleName}Controller.update.bind(${moduleName}Controller));
`;
  }
  if (actions.includes("destroy")) {
    routes += `router.delete('/:id', ${moduleName}Controller.destroy.bind(${moduleName}Controller));
`;
  }
  return `// Created at: ${(/* @__PURE__ */ new Date()).toISOString()}
// Creator: create-ddd-app

import { Router } from 'express';
import { ${className}Controller } from './${moduleName}.controller';
import { ${className}Service } from '../../application/services/${moduleName}.service';
import { ${className}RepositoryImpl } from '../../infrastructure/repositories/${moduleName}.repository.impl';

const router = Router();

// Dependency injection setup
const ${moduleName}Repository = new ${className}RepositoryImpl();
const ${moduleName}Service = new ${className}Service(${moduleName}Repository);
const ${moduleName}Controller = new ${className}Controller(${moduleName}Service);

// Routes
${routes}
export default router;
`;
}
function toPascalCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// src/cli.ts
var program = new import_commander.Command();
program.name("create-ddd-app").description("DDD project generator for Node.js with HMVC-style usage").version("1.3.0");
program.command("new <projectName>").description("Generate a new DDD structured project").action((projectName) => {
  generateProject(projectName);
});
program.command("generate <moduleName>").alias("g").description("Generate a new DDD module (Entity, Repository, Service, Controller)").option("--actions <actions>", "Specify actions (comma-separated)", "index,show,create,update,destroy").option("--skip-controller", "Skip generating controller").option("--skip-service", "Skip generating service").option("--skip-repository", "Skip generating repository").action((moduleName, options) => {
  const actions = options.actions.split(",").map((action) => action.trim());
  generateModule(moduleName, {
    actions,
    skipController: options.skipController,
    skipService: options.skipService,
    skipRepository: options.skipRepository
  });
});
program.command("module <moduleName>").alias("m").description("Generate a new DDD module (alias for generate)").option("--actions <actions>", "Specify actions (comma-separated)", "index,show,create,update,destroy").option("--skip-controller", "Skip generating controller").option("--skip-service", "Skip generating service").option("--skip-repository", "Skip generating repository").action((moduleName, options) => {
  const actions = options.actions.split(",").map((action) => action.trim());
  generateModule(moduleName, {
    actions,
    skipController: options.skipController,
    skipService: options.skipService,
    skipRepository: options.skipRepository
  });
});
program.parse(process.argv);
//# sourceMappingURL=cli.cjs.map