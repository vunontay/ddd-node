interface GeneratorOptions {
    actions?: string[];
    skipController?: boolean;
    skipService?: boolean;
    skipRepository?: boolean;
    outputDir?: string;
}
declare function generateProject(name: string): void;
declare function setupDDD(targetDir?: string): void;
declare function generateModule(moduleName: string, options?: GeneratorOptions): void;
declare function toPascalCase(str: string): string;

declare const DDD: {
    generateProject: typeof generateProject;
    generateModule: typeof generateModule;
    setupDDD: typeof setupDDD;
    utils: {
        toPascalCase: typeof toPascalCase;
    };
};

export { DDD, type GeneratorOptions, DDD as default, generateModule, generateProject, setupDDD };
