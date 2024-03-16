import { waitFor } from "@testing-library/dom";

import { Language } from "@/components/languages/language.js";
import { AVAILABLE_LANGUAGES } from "@/components/languages/config.js";

describe("Language", () => {
    let originalLocalStorage;
    let originalNavigator;
    let language;

    beforeEach(async () => {
        // Save original window objects
        originalLocalStorage = window.localStorage;
        originalNavigator = window.navigator;

        // Mock navigator
        window.navigator = {
            language: "en-US",
            userLanguage: "en-US"
        };

        // Mock document attributes
        document.documentElement.lang = "en-US";

        // Create new Language instance
        language = new Language();
    });

    afterEach(() => {
        // Restore original window objects
        window.localStorage = originalLocalStorage;
        window.navigator = originalNavigator;
    });

    test("constructor", async () => {
        expect(language.default).toBe("en-US");
        expect(language.userAgentPreferred).toBe("en-US");
        expect(language.available).toBe(AVAILABLE_LANGUAGES);
        expect(language.current).toBe("en-US");
        expect(document.documentElement.lang).toBe("en-US");
    });

    test("getBestMatch", () => {
        expect(language.getBestMatch("en-US")).toBe("en-US");
        expect(language.getBestMatch("en-GB")).toBe("en-US");
        expect(language.getBestMatch("de-DE")).toBe(null);
    });

    test("_deepMerge", () => {
        const target = {
            a: 1,
            b: {
                c: 2,
                e: {
                    f: 4,
                    g: 6
                }
            }
        };
        const source = {
            b: {
                d: 3,
                e: {
                    f: 5,
                    h: 7
                }
            }
        };
        const output = language._deepMerge(target, source);
        expect(output).toEqual({
            a: 1,
            b: {
                c: 2,
                d: 3,
                e: {
                    f: 5,
                    g: 6,
                    h: 7
                }
            }
        });
    });

    test("set", async () => {
        await language.set("zh-CN");
        expect(language.current).toBe("zh-CN");
        expect(window.localStorage.getItem("language")).toBe("zh-CN");
        expect(document.documentElement.lang).toBe("zh-CN");
        // Wait until language becomes "loaded"
        // if not become "loaded" in 5 seconds, fail the test
        await waitFor(() => expect(language.status).toBe("loaded"), {
            timeout: 5000
        });
        expect(language.data).toEqual(expect.any(Object));
    });

    test("set-error", async () => {
        await expect(language.set("de-DE")).rejects.toThrow(
            "Language \"de-DE\" is not available"
        );
    });

    test("loadLanguageData", async () => {
        await language.loadLanguageData("en-US");
        expect(language.data).toEqual(expect.any(Object));

        await waitFor(() => expect(language.status).toBe("loaded"), {
            timeout: 5000
        });
    });
});
