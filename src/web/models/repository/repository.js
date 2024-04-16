import { convertKeysToCamelCase } from "@/models/utils/utils.js";

/**
 * Represents the configuration for a repository.
 * @typedef {Object} RepoConfig
 * @property {string} name - Repository's name
 * @property {string} [slug=encodeURIComponent(name)] - Repository's slug, defaults to the encoded name(`encodeURIComponent(name)`)
 * @property {string} description - Repository's description
 * @property {string} url - Repository's URL, it will be stored without ending with a slash(`/`)
 * @property {string} lastUpdated - Repository's last updated date, in ISO format. This can also be set using the `last_updated` property.
 * @property {boolean} [error=false] - Repository's error status, only occurring when the repository has an error in configuration. If this is true, then other properties may be incorrect or unavailable.
 */

/**
 * Static class that represents a repository' metadata.
 *
 * **This class supports both camelCase and snake_case for its configuration properties.**
 * If snake_case is used, it will be automatically converted to camelCase.
 *
 * @class Repository
 * @property {string} name - Repository's name
 * @property {string} slug - Repository's slug
 * @property {string} description - Repository's description
 * @property {string} url - Repository's URL, it will be stored without ending with a slash(`/`)
 * @property {string} lastUpdated - Repository's last updated date, in ISO format
 * @property {Archive[]} archives - Repository's archives
 * @property {boolean} error - Repository's error status, only occurring when the repository has an error in configuration. If this is true, then other properties may be incorrect or unavailable.
 * @exports Repository
 */
class Repository {
    /**
     * @constructor
     * @param {RepoConfig} repo - The repository configuration object.
     */
    constructor(repo) {
        // compatible with snake_case keys, because we sometimes
        // directly pass the loaded yaml file to this class
        repo = convertKeysToCamelCase(repo);
        this.name = repo.name;
        this.slug = repo.slug || encodeURIComponent(repo.name);
        this.description = repo.description;
        this.url = repo.url.endsWith("/") ? repo.url.slice(0, -1) : repo.url;
        this.lastUpdated = repo.lastUpdated || repo.last_updated;
        this.error = repo.error || false;
    }
}

export default Repository;
