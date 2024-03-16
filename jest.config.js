module.exports = {
    testEnvironment: "jsdom",
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/web/$1",
        "^@assets/(.*)$": "<rootDir>/src/assets/$1"
    },
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.yml$": "jest-transform-yaml"
    }
};
