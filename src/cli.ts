#!/usr/bin/env node
import { Command } from "commander";
import { generateProject } from "./index";

const program = new Command();

program
  .name("ddd")
  .description("DDD project generator for Node.js")
  .version("1.0.0");

program
  .command("new <projectName>")
  .description("Generate a new DDD structured project")
  .action((projectName) => {
    generateProject(projectName);
  });

program.parse(process.argv);
