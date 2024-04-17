const yaml = require("js-yaml");

class AutoInjectVariable {
    constructor(data) {
        this.data = data;

        this.process = this.process.bind(this);
        this.updateURL = this.updateURL.bind(this);

        this.process();
    }

    process() {
        this.updateURL();
        return this.data;
    }

    updateURL() {
        if (!this.data.url || !this.data.url === "auto") {
            return;
        }

        const username = process.env.GITHUB_USERNAME;
        const repository = process.env.GITHUB_REPOSITORY;
        if (!username || !repository) {
            this.data.url = "/"; // for local debugging
            return;
        }

        this.data.url = `https://${username}.github.io/${repository}`;
    }
}

module.exports = function (source) {
    const data = yaml.load(source);
    const newData = new AutoInjectVariable(data).process();
    return JSON.stringify(newData);
};
