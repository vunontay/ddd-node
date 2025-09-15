import fs from "fs";
import path from "path";

interface GeneratorOptions {
  actions?: string[];
  skipController?: boolean;
  skipService?: boolean;
  skipRepository?: boolean;
}

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

export function generateModule(moduleName: string, options: GeneratorOptions = {}) {
  const baseDir = process.cwd();
  const {
    actions = ["index", "show", "create", "update", "destroy"],
    skipController = false,
    skipService = false,
    skipRepository = false
  } = options;

  // Check if we're in a DDD project
  const srcPath = path.join(baseDir, "src");
  if (!fs.existsSync(srcPath)) {
    console.log("❌ Not in a DDD project directory. Run 'create-ddd-app new <project-name>' first.");
    return;
  }

  const createdFiles: string[] = [];

  // 1. Generate Entity
  const entityPath = path.join(srcPath, "domain/entities", `${moduleName}.entity.ts`);
  fs.writeFileSync(entityPath, generateEntityTemplate(moduleName));
  createdFiles.push(entityPath);

  // 2. Generate Value Objects (if needed)
  const valueObjectPath = path.join(srcPath, "domain/value_objects", `${moduleName}.value-object.ts`);
  fs.writeFileSync(valueObjectPath, generateValueObjectTemplate(moduleName));
  createdFiles.push(valueObjectPath);

  // 3. Generate Repository Interface
  if (!skipRepository) {
    const repoInterfacePath = path.join(srcPath, "domain/repositories", `${moduleName}.repository.ts`);
    fs.writeFileSync(repoInterfacePath, generateRepositoryInterfaceTemplate(moduleName, actions));
    createdFiles.push(repoInterfacePath);

    // Generate Repository Implementation
    const repoImplPath = path.join(srcPath, "infrastructure/repositories", `${moduleName}.repository.impl.ts`);
    fs.writeFileSync(repoImplPath, generateRepositoryImplTemplate(moduleName, actions));
    createdFiles.push(repoImplPath);
  }

  // 4. Generate DTOs
  const dtoPath = path.join(srcPath, "application/dto", `${moduleName}.dto.ts`);
  fs.writeFileSync(dtoPath, generateDtoTemplate(moduleName, actions));
  createdFiles.push(dtoPath);

  // 5. Generate Service (Application Layer)
  if (!skipService) {
    const servicePath = path.join(srcPath, "application/services", `${moduleName}.service.ts`);
    fs.writeFileSync(servicePath, generateServiceTemplate(moduleName, actions));
    createdFiles.push(servicePath);
  }

  // 6. Generate Controller
  if (!skipController) {
    const controllerPath = path.join(srcPath, "interfaces/http", `${moduleName}.controller.ts`);
    fs.writeFileSync(controllerPath, generateControllerTemplate(moduleName, actions));
    createdFiles.push(controllerPath);

    // Generate Routes
    const routesPath = path.join(srcPath, "interfaces/http", `${moduleName}.routes.ts`);
    fs.writeFileSync(routesPath, generateRoutesTemplate(moduleName, actions));
    createdFiles.push(routesPath);
  }

  // Print created files
  console.log(`✅ Generated ${moduleName} module:`);
  createdFiles.forEach(file => {
    const relativePath = path.relative(baseDir, file);
    console.log(`   create  ${relativePath}`);
  });
}

// Template Functions
function generateEntityTemplate(moduleName: string): string {
  const className = toPascalCase(moduleName);
  return `// Created at: ${new Date().toISOString()}
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

function generateValueObjectTemplate(moduleName: string): string {
  const className = toPascalCase(moduleName);
  return `// Created at: ${new Date().toISOString()}
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

function generateRepositoryInterfaceTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  const entityName = `${className}Entity`;
  
  let methods = '';
  if (actions.includes('index')) {
    methods += `  findAll(): Promise<${entityName}[]>;\n`;
  }
  if (actions.includes('show')) {
    methods += `  findById(id: string): Promise<${entityName} | null>;\n`;
  }
  if (actions.includes('create')) {
    methods += `  create(entity: Omit<${entityName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${entityName}>;\n`;
  }
  if (actions.includes('update')) {
    methods += `  update(id: string, data: Partial<${entityName}>): Promise<${entityName} | null>;\n`;
  }
  if (actions.includes('destroy')) {
    methods += `  delete(id: string): Promise<boolean>;\n`;
  }

  return `// Created at: ${new Date().toISOString()}
// Creator: create-ddd-app

import { ${entityName} } from '../entities/${moduleName}.entity';

export interface ${className}Repository {
${methods}}
`;
}

function generateRepositoryImplTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  const entityName = `${className}Entity`;
  
  let methods = '';
  if (actions.includes('index')) {
    methods += `
  async findAll(): Promise<${entityName}[]> {
    // TODO: Implement database query
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes('show')) {
    methods += `
  async findById(id: string): Promise<${entityName} | null> {
    // TODO: Implement database query
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes('create')) {
    methods += `
  async create(data: Omit<${entityName}, 'id' | 'createdAt' | 'updatedAt'>): Promise<${entityName}> {
    // TODO: Implement database insert
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes('update')) {
    methods += `
  async update(id: string, data: Partial<${entityName}>): Promise<${entityName} | null> {
    // TODO: Implement database update
    throw new Error('Method not implemented');
  }
`;
  }
  if (actions.includes('destroy')) {
    methods += `
  async delete(id: string): Promise<boolean> {
    // TODO: Implement database delete
    throw new Error('Method not implemented');
  }
`;
  }

  return `// Created at: ${new Date().toISOString()}
// Creator: create-ddd-app

import { ${className}Repository } from '../../domain/repositories/${moduleName}.repository';
import { ${entityName} } from '../../domain/entities/${moduleName}.entity';

export class ${className}RepositoryImpl implements ${className}Repository {${methods}}
`;
}

function generateDtoTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  
  let dtos = `// Created at: ${new Date().toISOString()}
// Creator: create-ddd-app

`;

  if (actions.includes('create')) {
    dtos += `export interface Create${className}Dto {
  // Add your create DTO properties here
}

`;
  }

  if (actions.includes('update')) {
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

function generateServiceTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  
  let methods = '';
  if (actions.includes('index')) {
    methods += `
  async findAll() {
    return await this.${moduleName}Repository.findAll();
  }
`;
  }
  if (actions.includes('show')) {
    methods += `
  async findById(id: string) {
    return await this.${moduleName}Repository.findById(id);
  }
`;
  }
  if (actions.includes('create')) {
    methods += `
  async create(data: Create${className}Dto) {
    // TODO: Add business logic validation
    return await this.${moduleName}Repository.create(data);
  }
`;
  }
  if (actions.includes('update')) {
    methods += `
  async update(id: string, data: Update${className}Dto) {
    // TODO: Add business logic validation
    return await this.${moduleName}Repository.update(id, data);
  }
`;
  }
  if (actions.includes('destroy')) {
    methods += `
  async delete(id: string) {
    return await this.${moduleName}Repository.delete(id);
  }
`;
  }

  return `// Created at: ${new Date().toISOString()}
// Creator: create-ddd-app

import { ${className}Repository } from '../../domain/repositories/${moduleName}.repository';
import { Create${className}Dto, Update${className}Dto } from '../dto/${moduleName}.dto';

export class ${className}Service {
  constructor(private readonly ${moduleName}Repository: ${className}Repository) {}
${methods}}
`;
}

function generateControllerTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  
  let methods = '';
  if (actions.includes('index')) {
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
  if (actions.includes('show')) {
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
  if (actions.includes('create')) {
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
  if (actions.includes('update')) {
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
  if (actions.includes('destroy')) {
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

  return `// Created at: ${new Date().toISOString()}
// Creator: create-ddd-app

import { Request, Response } from 'express';
import { ${className}Service } from '../../application/services/${moduleName}.service';

export class ${className}Controller {
  constructor(private readonly ${moduleName}Service: ${className}Service) {}
${methods}}
`;
}

function generateRoutesTemplate(moduleName: string, actions: string[]): string {
  const className = toPascalCase(moduleName);
  
  let routes = '';
  if (actions.includes('index')) {
    routes += `router.get('/', ${moduleName}Controller.index.bind(${moduleName}Controller));\n`;
  }
  if (actions.includes('show')) {
    routes += `router.get('/:id', ${moduleName}Controller.show.bind(${moduleName}Controller));\n`;
  }
  if (actions.includes('create')) {
    routes += `router.post('/', ${moduleName}Controller.create.bind(${moduleName}Controller));\n`;
  }
  if (actions.includes('update')) {
    routes += `router.put('/:id', ${moduleName}Controller.update.bind(${moduleName}Controller));\n`;
  }
  if (actions.includes('destroy')) {
    routes += `router.delete('/:id', ${moduleName}Controller.destroy.bind(${moduleName}Controller));\n`;
  }

  return `// Created at: ${new Date().toISOString()}
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

// Helper function
function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
