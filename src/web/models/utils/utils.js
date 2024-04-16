/**
 * Converts a string from snake_case to camelCase.
 *
 * @param {string} str - The string to convert.
 * @returns {string} The converted string.
 */
function camelCase(str) {
    return str.replace(/_([a-z])/g, (g) => {
        return g[1].toUpperCase();
    });
}

/**
 * Converts an object's keys from snake_case to camelCase.
 * This function is recursive and will convert keys in nested objects as well.
 *
 * @param {Object} obj - The object to convert.
 * @returns {Object} The converted object.
 */
function convertKeysToCamelCase(obj) {
    const newObj = {};

    // Iterate over each key-value pair in the object
    for (const key in obj) {
        // If the value is an object, recursively convert its keys
        if (typeof obj[key] === "object" && obj[key] !== null) {
            newObj[camelCase(key)] = convertKeysToCamelCase(obj[key]);
        } else {
            newObj[camelCase(key)] = obj[key];
        }
    }

    return newObj;
}

export { convertKeysToCamelCase };
