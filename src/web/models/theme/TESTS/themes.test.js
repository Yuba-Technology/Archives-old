import Theme from "@/models/theme/theme.js";
import { AVAILABLE_THEMES } from "@/models/theme/config.js";

describe("Theme", () => {
    let originalLocalStorage;
    let originalMatchMedia;
    let broswerTheme = "light";
    let themeChangeCallback;
    let theme;

    beforeEach(() => {
        // Save original window objects
        originalLocalStorage = window.localStorage;
        originalMatchMedia = window.matchMedia;

        // Mock matchMedia
        window.matchMedia = jest.fn().mockImplementation((query) => {
            return {
                matches:
                    query === "(prefers-color-scheme: dark)" &&
                    broswerTheme === "dark",
                addEventListener: jest.fn((event, handler) => {
                    themeChangeCallback = event === "change" ? handler : null;
                })
            };
        });

        // Create new Theme instance
        // theme = new Theme();
    });

    afterEach(() => {
        // Restore original window objects
        window.localStorage = originalLocalStorage;
        window.matchMedia = originalMatchMedia;
        broswerTheme = "light";
        themeChangeCallback = null;
    });

    it("should have the correct default values", () => {
        theme = new Theme();
        expect(theme.currentOption).toBe("auto");
        expect(theme.current).toBe("light");
        expect(theme.userAgentPreferred).toBe("light");
        expect(window.localStorage.getItem("theme")).toBe("auto");
        expect(theme.available).toBe(AVAILABLE_THEMES);

        broswerTheme = "dark";
        theme = new Theme();

        expect(theme.currentOption).toBe("auto");
        expect(theme.current).toBe("dark");
        expect(theme.userAgentPreferred).toBe("dark");
        expect(window.localStorage.getItem("theme")).toBe("auto");
        expect(theme.available).toBe(AVAILABLE_THEMES);

        theme = null;
    });

    it("should add the right class to html", () => {
        theme = new Theme();
        expect(document.documentElement.dataset.theme).toBe("light");
        expect(document.documentElement.dataset.bsTheme).toBe("light");
        expect(document.documentElement.classList).not.toContain("dark");

        theme.set("dark");

        expect(document.documentElement.dataset.theme).toBe("dark");
        expect(document.documentElement.dataset.bsTheme).toBe("dark");
        expect(document.documentElement.classList).toContain("dark");

        theme = null;
    });

    it("should set the right theme", () => {
        theme = new Theme();
        theme.set("dark");
        expect(theme.currentOption).toBe("dark");
        expect(theme.current).toBe("dark");
        expect(window.localStorage.getItem("theme")).toBe("dark");

        theme.set("light");
        expect(theme.currentOption).toBe("light");
        expect(theme.current).toBe("light");
        expect(window.localStorage.getItem("theme")).toBe("light");

        theme.set("auto");
        expect(theme.currentOption).toBe("auto");
        expect(theme.current).toBe("light");
        expect(window.localStorage.getItem("theme")).toBe("auto");

        theme = null;
    });

    it("should throw an error when setting an invalid theme", () => {
        theme = new Theme();
        expect(() => theme.set("invalid")).toThrow(
            "Theme invalid is not available"
        );
        theme = null;
    });

    it("should toggle the theme properly", () => {
        theme = new Theme();
        theme.toggle();
        expect(theme.currentOption).toBe("light");

        theme.toggle();
        expect(theme.currentOption).toBe("dark");

        theme.toggle();
        expect(theme.currentOption).toBe("auto");

        theme = null;
    });

    it("should init properly and handle the theme change properly", () => {
        theme = new Theme();
        broswerTheme = "dark";
        themeChangeCallback(); // Call the registered event handler
        expect(theme.userAgentPreferred).toBe("dark");
        expect(theme.current).toBe("dark");

        broswerTheme = "light";
        themeChangeCallback();
        expect(theme.userAgentPreferred).toBe("light");
        expect(theme.current).toBe("light");

        theme = null;
    });
});
