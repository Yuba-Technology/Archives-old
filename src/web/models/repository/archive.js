import { convertKeysToCamelCase } from "@/models/utils/utils.js";

/**
 * Represents the configuration for an archive.
 * @typedef {Object} ArchiveConfig
 * @property {string} name - Archive's name
 * @property {string} [slug=encodeURIComponent(name)] - Archive's slug, defaults to the encoded name(`encodeURIComponent(name)`)
 * @property {string} [description=""] - Archive's description
 * @property {string[]} [keywords=[]] - Archive's keywords
 * @property {string} [avatar="@assets/images/default-avatar.png"] - Archive's avatar URL
 * @property {string} url - Archive's URL, it will be stored without ending with a slash(`/`)
 * @property {string} lastUpdated - Archive's last updated date, in ISO format
 * @property {string[]} [tags=[]] - Archive's tags
 * @property {string[]} [categories=[]] - Archive's categories, if more than one, means the later one belongs to the former one
 * @property {Object[]} [items=[]] - Archive's items
 * @property {boolean} [error=false] - Archive's error status. Only occurs when the archive has an error in configuration. If this is true, then other properties may be incorrect or unavailable.
 */

/**
 * Archive model for an archive. This class is used to
 * represent an archive with properties such as name, description, tags, etc.
 *
 * **This class supports both camelCase and snake_case for its configuration properties.**
 * If snake_case is used, it will be automatically converted to camelCase.
 *
 * @class Archive
 * @property {Repository} repo - The repository that this archive belongs to
 * @property {string} name - Archive's name
 * @property {string} slug - Archive's slug
 * @property {string} description - Archive's description
 * @property {string[]} keywords - Archive's keywords
 * @property {string} avatar - Archive's avatar URL
 * @property {string} url - Archive's URL, it will be stored without ending with a slash(`/`)
 * @property {string} lastUpdated - Archive's last updated date, in ISO format
 * @property {string[]} tags - Archive's tags
 * @property {string[]} categories - Archive's categories, if more than one, means the later one belongs to the former one
 * @property {boolean} error - Archive's error status. Only occurs when the archive has an error in configuration. If this is true, then other properties may be incorrect or unavailable. Defaults to false if not provided.
 */
class Archive {
    /**
     * @constructor
     * @param {Repository} repo - The repository that this archive belongs to
     * @param {ArchiveConfig} archive - The archive configuration object.
     */
    constructor(repo, archive) {
        this.repo = repo;

        // compatible with snake_case keys, because we sometimes
        // directly pass the loaded yaml file to this class
        archive = convertKeysToCamelCase(archive);
        this.name = archive.name;
        this.slug = archive.slug || encodeURIComponent(archive.name);
        this.description = archive.description || "";
        this.keywords = archive.keywords || [];
        this.avatar = archive.avatar || "@assets/images/default-avatar.png";
        this.url = archive.url;
        this.lastUpdated = archive.lastUpdated;
        this.tags = archive.tags || [];
        this.categories = archive.categories || [];
        this.items = archive.items || [];
        this.error = archive.error || false;
    }
}

export default Archive;
