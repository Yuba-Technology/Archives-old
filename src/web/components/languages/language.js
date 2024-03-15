import { AVAILABLE_LANGUAGES } from "./config.js";

class Language {
    constructor() {
        this.defaultLanguage = "en-US";
        this.userAgentLanguage = navigator.language || navigator.userLanguage;
        this.availableLanguages = AVAILABLE_LANGUAGES;

        this.getBestMatchLanguage = this.getBestMatchLanguage.bind(this);
        const preferredLanguage =
            window.localStorage.getItem("language") ||
            this.userAgentLanguage ||
            this.defaultLanguage;
        this.language =
            this.getBestMatchLanguage(preferredLanguage) ||
            this.defaultLanguage;
        this.status = "loading";
        this.data = {};
        this.setLanguage = this.setLanguage.bind(this);
        this.setLanguage(this.language);
    }

    /**
     * Get the best match language from the available languages.
     * @param {string} language - The language to match.
     * @returns {string} - The best match language.
     */
    getBestMatchLanguage(language) {
        // example: input "en-US",
        // match "en-US", "en", "en-GB", null
        const languages = Object.keys(this.availableLanguages);
        if (languages.includes(language)) {
            return language;
        }

        const languageCode = language.split("-")[0];
        if (languages.includes(languageCode)) {
            return languageCode;
        }

        for (const lang of languages) {
            if (lang.startsWith(languageCode)) {
                return lang;
            }
        }

        return null;
    }

    setLanguage(language) {
        if (!this.availableLanguages[language]) {
            throw new Error(`Language "${language}" is not available`);
        }

        window.localStorage.setItem("language", language);
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
        if (!this.availableLanguages[language]) {
            throw new Error(`Language "${language}" is not available`);
        }

        this.data = {};

        // Load two language files at the same time, and merge them
        // One is the target language, and the other is the default language
        // We do this because the default language may have more complete data
        // than the target language

        const data = await Promise.all([
            import(`@assets/locales/${language}.yml`),
            import(`@assets/locales/${this.defaultLanguage}.yml`)
        ]);

        const targetData = data[0].default;
        const defaultData = data[1].default;
        this.data = { ...defaultData, ...targetData };
        this.status = "loaded";
    }
}

export { Language };
