const fs = require("node:fs");
const yaml = require("js-yaml");

class InjectConfigPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.thisCompilation.tap(
            "InjectConfigPlugin",
            (compilation) => {
                compilation.hooks.processAssets.tapAsync(
                    {
                        name: "InjectConfigPlugin",
                        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
                    },
                    (assets, callback) => {
                        // Get all the html files
                        const htmlFiles = Object.keys(assets).filter((file) =>
                            file.endsWith(".html")
                        );

                        // Load the config file from config input
                        const CONFIG = yaml.load(
                            fs.readFileSync(this.options.configPath, "utf8")
                        );

                        const CONFIG_REPLACEMENTS = {
                            "<title>.*</title>": `<title>${CONFIG.title}</title>`,
                            "<meta name=\"description\" content=\".*\"": `<meta name="description" content="${CONFIG.description}"`,
                            "<meta name=\"keywords\" content=\".*\"": `<meta name="keywords" content="${CONFIG.keywords}"`,
                            "<meta name=\"author\" content=\".*\"": `<meta name="author" content="${CONFIG.author}"`,
                            "<html( lang=\".*\")?>": `<html lang="${CONFIG.language}">`
                        };

                        for (const file of htmlFiles) {
                            let html = assets[file].source();
                            // Inject the config file into the html
                            for (const [regex, replacement] of Object.entries(
                                CONFIG_REPLACEMENTS
                            )) {
                                html = html
                                    .toString()
                                    .replace(
                                        new RegExp(regex, "g"),
                                        replacement
                                    );
                            }

                            assets[file] = {
                                source: () => html,
                                size: () => html.length
                            };
                        }

                        callback();
                    }
                );
            }
        );
    }
}

module.exports = { InjectConfigPlugin };
