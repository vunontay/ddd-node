import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["cjs"],      
  dts: true,      
  splitting: false,
  sourcemap: true,
  clean: true,
  target: "node18"
});
