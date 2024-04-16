import { convertKeysToCamelCase } from "@/models/utils/utils.js";

/**
 * Represents the configuration for an item.
 * @typedef {Object} ItemConfig
 * @property {string} name - Item's name
 * @property {string} [slug=encodeURIComponent(name)] - Item's slug, defaults to the encoded name(`encodeURIComponent(name)`)
 * @property {string} [description=""] - Item's description
 * @property {string} url - Item's URL, it will be stored without ending with a slash(`/`)
 * @property {string} lastUpdated - Item's last updated date, in ISO format
 * @property {string} [filetype="unknown"] - Item's filetype
 * @property {boolean} [error=false] - Item's error status, only occurs when the item has an error in configuration. If this is true, then other properties may be incorrect or unavailable.
 */

/**
 * Static class for an item stored in an archive.
 *
 * **This class supports both camelCase and snake_case for its configuration properties.**
 * If snake_case is used, it will be automatically converted to camelCase.
 *
 * @class Item
 * @property {Archive} archive - The archive that this item belongs to
 * @property {string} name - Item's name
 * @property {string} slug - Item's slug
 * @property {string} description - Item's description
 * @property {string} url - Item's URL, it will be stored without ending with a slash(`/`)
 * @property {string} [lastUpdated=last_updated] - Item's last updated date, in ISO format. This can also be set using the `last_updated` property.
 * @property {string} filetype - Item's filetype
 * @property {boolean} error - Item's error status, only occurs when the item has an error in configuration. If this is true, then other properties may be incorrect or unavailable.
 * @exports Item
 */
class Item {
    /**
     * @constructor
     * @param {Archive} archive - The archive that this item belongs to
     * @param {ItemConfig} item - The item configuration object.
     */
    constructor(archive, item) {
        this.archive = archive;

        // compatible with snake_case keys, because we sometimes
        // directly pass the loaded yaml file to this class
        item = convertKeysToCamelCase(item);
        this.name = item.name;
        this.slug = item.slug || encodeURIComponent(item.name);
        this.description = item.description || "";
        this.url = item.url.endsWith("/") ? item.url.slice(0, -1) : item.url;
        this.lastUpdated = item.lastUpdated || item.last_updated;
        this.filetype = item.filetype || "unknown";
        this.error = item.error || false;
    }
}

export default Item;
