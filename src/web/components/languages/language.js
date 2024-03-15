import { AVAILABLE_LANGUAGES } from "./config.js";

class Language {
    constructor() {
        this.default = "en-US";
        this.userAgentPreferred = navigator.language || navigator.userLanguage;
        this.available = AVAILABLE_LANGUAGES;

        this.getBestMatch = this.getBestMatch.bind(this);
        const preferredLanguage =
            window.localStorage.getItem("language") ||
            this.userAgentPreferred ||
            this.default;
        this.current = this.getBestMatch(preferredLanguage) || this.default;
        this.status = "loading";
        this.data = {};
        this.set = this.set.bind(this);
        this.set(this.current);
    }

    /**
     * Get the best match language from the available languages.
     * @param {string} language - The language to match.
     * @returns {string} - The best match language.
     */
    getBestMatch(language) {
        // example: input "en-US", this.available = { "en-GB": "English" }
        // match "en-US", "en-GB", null
        const languages = Object.keys(this.available);
        if (languages.includes(language)) {
            return language;
        }

        const languageCode = language.split("-")[0];
        for (const lang of languages) {
            if (lang.startsWith(languageCode)) {
                return lang;
            }
        }

        return null;
    }

    set(language) {
        if (!this.available[language]) {
            throw new Error(`Language "${language}" is not available`);
        }

        window.localStorage.setItem("language", language);
        this.current = language;
        this.data = {};
        this.status = "loading";
        this.loadLangusgeData(language);
    }

    /**
     * Load language data.
     * @param {string} language The language to be loaded.
     * @returns {void}
     */
    async loadLangusgeData(language) {
        if (!this.available[language]) {
            throw new Error(`Language "${language}" is not available`);
        }

        this.data = {};

        // Load two language files at the same time, and merge them
        // One is the target language, and the other is the default language
        // We do this because the default language may have more complete data
        // than the target language

        const data = await Promise.all([
            import(`@assets/locales/${language}.yml`),
            import(`@assets/locales/${this.default}.yml`)
        ]);

        const targetData = data[0].default;
        const defaultData = data[1].default;
        this.data = { ...defaultData, ...targetData };
        this.status = "loaded";
    }
}

export { Language };
