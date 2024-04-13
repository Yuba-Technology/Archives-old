import { AVAILABLE_THEMES } from "./config.js";

/**
 * Class for managing the theme of the website.
 * @class Theme
 * @property {string} current - The current theme.
 * @property {string} userAgentPreferred - The theme preferred by the user agent.
 * @property {string[]} available - The available themes.
 * @property {string} currentOption - The current theme option.
 * @exports Theme
 * @requires AVAILABLE_THEMES
 */
class Theme {
    /**
     * @constructor
     */
    constructor() {
        this.current = "auto";
        this.userAgentPreferred = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
        this.available = AVAILABLE_THEMES;
        this.currentOption = window.localStorage.getItem("theme") || "auto";

        this._init = this._init.bind(this);
        this._handleThemeChange = this._handleThemeChange.bind(this);
        this.set = this.set.bind(this);
        this.toggle = this.toggle.bind(this);

        this._init();
    }

    /**
     * initialize the class. Will set the theme to the current theme option.
     * @method
     * @private
     * @returns {void}
     */
    _init() {
        this.set(this.currentOption);
        this.userAgentPreferred = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", this._handleThemeChange);
    }

    /**
     * Handle the theme change event. Update the theme if the current theme option is "auto".
     * @method
     * @private
     * @returns {void}
     */
    _handleThemeChange() {
        this.userAgentPreferred = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches
            ? "dark"
            : "light";
        if (this.currentOption === "auto") {
            this.set("auto"); // Actually updates the theme
        }
    }

    /**
     * Set the theme to the given theme. Available themes were defined in the config file.
     * @method
     * @param {string} theme - The theme to set. Must be one of the available themes.
     * @returns {void}
     */
    set(theme) {
        if (!this.available.includes(theme)) {
            throw new Error(`Theme ${theme} is not available`);
        }

        this.currentOption = theme;
        this.current = theme === "auto" ? this.userAgentPreferred : theme;
        window.localStorage.setItem("theme", theme);
        document.documentElement.dataset.theme = this.current;
        document.documentElement.dataset.bsTheme = this.current;
        document.documentElement.classList.toggle(
            "dark",
            this.current === "dark"
        );
    }

    /**
     * Toggle the theme to the next available theme.
     * Available themes are defined in the config file.
     * @method
     * @returns {void}
     */
    toggle() {
        const currentIndex = this.available.indexOf(this.currentOption);
        const nextIndex = (currentIndex + 1) % this.available.length;
        this.set(this.available[nextIndex]);
        return this.available[nextIndex];
    }
}

export default Theme;
