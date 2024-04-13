/**
 * Get the translation for a given key from a nested translation object (e.g. `key.subkey.subsubkey`).
 * If the key is not found, return the key itself.
 *
 * @param {Object} translation - The translation object.
 * @param {string} key - The key to look for, separated by dots for nested keys.
 * @return {string} The translation for the given key, or the key itself if not found.
 */
function getTranslation(translation, key) {
    const keys = key.split(".");
    let currentTranslation = translation; // Create a new variable to avoid modifying the original object

    for (const k of keys) {
        if (!currentTranslation[k]) {
            return key;
        }

        currentTranslation = currentTranslation[k];
    }

    return currentTranslation;
}

export { getTranslation };
