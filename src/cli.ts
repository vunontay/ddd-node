#!/usr/bin/env node
import { Command } from "commander";
import { generateProject, generateModule } from "./index";

const program = new Command();

program
  .name("create-ddd-app")
  .description("DDD project generator for Node.js with HMVC-style usage")
  .version("1.1.0");

// New project command
program
  .command("new <projectName>")
  .description("Generate a new DDD structured project")
  .action((projectName) => {
    generateProject(projectName);
  });

// Generate module command (like hmvc-rails)
program
  .command("generate <moduleName>")
  .alias("g")
  .description("Generate a new DDD module (Entity, Repository, Service, Controller)")
  .option("--actions <actions>", "Specify actions (comma-separated)", "index,show,create,update,destroy")
  .option("--skip-controller", "Skip generating controller")
  .option("--skip-service", "Skip generating service")
  .option("--skip-repository", "Skip generating repository")
  .action((moduleName, options) => {
    const actions = options.actions.split(",").map((action: string) => action.trim());
    generateModule(moduleName, {
      actions,
      skipController: options.skipController,
      skipService: options.skipService,
      skipRepository: options.skipRepository
    });
  });

// Short alias command (like hmvc-rails)
program
  .command("module <moduleName>")
  .alias("m")
  .description("Generate a new DDD module (alias for generate)")
  .option("--actions <actions>", "Specify actions (comma-separated)", "index,show,create,update,destroy")
  .option("--skip-controller", "Skip generating controller")
  .option("--skip-service", "Skip generating service")  
  .option("--skip-repository", "Skip generating repository")
  .action((moduleName, options) => {
    const actions = options.actions.split(",").map((action: string) => action.trim());
    generateModule(moduleName, {
      actions,
      skipController: options.skipController,
      skipService: options.skipService,
      skipRepository: options.skipRepository
    });
  });

program.parse(process.argv);
