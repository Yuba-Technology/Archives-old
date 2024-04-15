import { AVAILABLE_LANGUAGES } from "./config.js";

/**
 * Class for managing the language of the website.
 * @class Language
 * @property {string} default - The default language. Defaults to "en-US".
 * @property {string} userAgentPreferred - The language preferred by the user agent.
 * @property {Object} available - The available languages.
 * @property {string} current - The current language.
 * @property {string} status - The status of the language. It can be "loading" or "loaded".
 * @property {Object} data - The language data.
 * @exports Language
 * @requires AVAILABLE_LANGUAGES
 */
class Language {
    /**
     * @constructor
     */
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
    }

    /**
     * Get the best match language from the available languages.
     * This method is mainly used for window.navigator.language,
     * which may return a language code that is not in the
     * available languages like "en" and "en-GB".
     * @method
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

    /**
     * Deep merge two objects.
     * @method
     * @param {Object} target - The target object.
     * @param {Object} source - The source object.
     * @returns {Object} - The merged object.
     * @private
     * @static
     * @example
     * const target = {
     *     a: 1,
     *     b: {
     *         c: 2,
     *     }
     * };
     * const source = {
     *     b: {
     *         c: 3,
     *         d: 4
     *      }
     * };
     * const output = deepMerge(target, source);
     * console.log(output); // { a: 1, b: { c: 2, d: 4 } }
     */
    _deepMerge(target, source) {
        if (typeof target !== "object" || target === null) {
            target = {};
        }

        if (typeof source !== "object" || source === null) {
            source = {};
        }

        for (const key in source) {
            if (
                !Object.hasOwn(source, key) ||
                key === "__proto__" || // Prevent prototype pollution
                key === "prototype" // Same as above
            ) {
                continue;
            }

            target[key] =
                source[key] instanceof Object
                    ? this._deepMerge(target[key], source[key])
                    : source[key];
        }

        return target;
    }

    /**
     * Set the current language and load the language data. This method will set the `current` property to the given language, and load the language data. If the language is not available, an error will be thrown. It also sets the `status` property to "loading" and the `data` property to an empty object before loading the language data.
     * @method
     * @async
     * @param {string} language - The language to be set.
     * @returns {Promise<void>}
     */
    async set(language) {
        if (!this.available[language]) {
            throw new Error(`Language "${language}" is not available`);
        }

        window.localStorage.setItem("language", language);
        document.documentElement.lang = language;
        this.current = language;
        this.data = {};
        this.status = "loading";
        await this.loadLanguageData(language);
    }

    /**
     * Load language data. This method will change the `status` property to "loaded" after the language data is loaded to `data` property. It also sets the `data` property to an empty object before loading the language data.
     * @method
     * @async
     * @param {string} language The language to be loaded.
     * @returns {Promise<void>}
     */
    async loadLanguageData(language) {
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
        this.data = this._deepMerge(defaultData, targetData);
        this.status = "loaded";
    }
}

export default Language;
