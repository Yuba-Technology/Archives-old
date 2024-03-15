const path = require("node:path");
// const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Auto import Element Plus components
const AutoImport = require("unplugin-auto-import/webpack").default;
const Components = require("unplugin-vue-components/webpack").default;
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "src/web/index.js")
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist/web"),
        clean: true
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/web"),
            "@assets": path.resolve(__dirname, "src/assets")
        },
        extensions: [".js", ".mjs", ".mts", ".json", ".vue"]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    transformToRequire: {
                        iframe: "src"
                    }
                }
            },
            {
                test: /\.ya?ml$/,
                use: "yaml-loader"
            },
            {
                test: /\.s?css$|\.sass$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
            },
            {
                test: /\.(bmp|ico|png|jpe?g|gif|svg)$/i,
                type: "asset/resource"
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource"
            }
        ]
    },
    plugins: [
        // Auto import Element Plus components
        // We have to disable the eslint rule for the following line, because we can't change
        // the AutoImport function itself so we have to adapt to it ┑(~Д ~)┍
        // eslint-disable-next-line new-cap
        AutoImport({
            // eslint-disable-next-line new-cap
            resolvers: [ElementPlusResolver()]
        }),
        // eslint-disable-next-line new-cap
        Components({
            // eslint-disable-next-line new-cap
            resolvers: [ElementPlusResolver()]
        }),
        // For public resources
        new CopyWebpackPlugin({
            patterns: [{ from: "public", to: "" }]
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].bundle.css",
            chunkFilename: "[id].bundle.css"
        })
    ]
};
