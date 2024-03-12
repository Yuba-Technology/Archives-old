const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Auto import Element Plus components
const AutoImport = require("unplugin-auto-import/webpack").default;
const Components = require("unplugin-vue-components/webpack").default;
const { ElementPlusResolver } = require("unplugin-vue-components/resolvers");

module.exports = {
    entry: {
        index: path.resolve(__dirname, "index.js"),
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../../dist/web"),
        clean: true,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, ""),
        },
        extensions: [".js", ".mjs", ".mts", ".json", ".vue"],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    transformToRequire: {
                        iframe: "src",
                    },
                },
            },
            {
                test: /\.html$/,
                use: ["html-loader"],
            },
            {
                test: /\.s?css$|\.sass$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(bmp|ico|png|jpe?g|gif|svg)$/i,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        // Auto import Element Plus components
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        // For public resources
        // new CopyWebpackPlugin({
        //     patterns: [{ from: "public", to: "public" }],
        // }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "index.html"),
            filename: "index.html",
            chunks: ["index"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
};
