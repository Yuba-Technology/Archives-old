import { getTranslation } from "@/models/language/utils.js";

describe("getTranslation function", () => {
    it("should return the correct translation when the key exists", () => {
        const translation = {
            hello: {
                world: "你好，世界"
            }
        };
        const key = "hello.world";
        const result = getTranslation(translation, key);
        expect(result).toBe("你好，世界");
    });

    it("should return the key when the key does not exist", () => {
        const translation = {
            hello: {
                world: "你好，世界"
            }
        };
        const key = "hello.universe";
        const result = getTranslation(translation, key);
        expect(result).toBe("hello.universe");
    });

    it("should return the key when the translation is not an object", () => {
        const translation = "你好，世界";
        const key = "hello.world";
        const result = getTranslation(translation, key);
        expect(result).toBe("hello.world");
    });
});
