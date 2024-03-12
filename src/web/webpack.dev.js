const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

module.exports = merge(common, {
    mode: "development",
    resolve: {
        alias: {
            "@public": path.resolve(__dirname, "../../public"),
        },
    },
    devServer: {
        static: {
            directory: "public",
        },
        compress: true,
        port: 8001,
    },
});
