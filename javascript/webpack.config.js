const path = require('path');
const fs = require('fs');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// fetch all html files in source folder
const templateFiles = fs
    .readdirSync(path.resolve(__dirname, 'src/'))
    .filter((file) => path.extname(file).toLowerCase() === '.html');

// process html files in order to inject compiled files
const htmlPluginEntries = templateFiles.map(
    (template) =>
        new HTMLWebpackPlugin({
            inject: 'body',
            hash: true,
            filename: template,
            template: path.resolve(__dirname, 'src/', template),
        })
);

module.exports = (env) => ({
    entry: {
        index: [
            path.resolve(__dirname, 'src/js', 'index.js'),
            path.resolve(__dirname, 'src/sass', 'main.scss'),
        ],
    },

    mode: env.production ? 'production' : 'development',

    // default output folder. Possibly overwritten in subconfig
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },

    module: {
        rules: [
            // loader for JavaScript
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            // loader for SASS
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader, // extracts css into separate file
                        options: {
                            publicPath: '../',
                        },
                    },
                    'css-loader', // css loader
                    {
                        loader: 'postcss-loader', // postprocessing css
                        options: {
                            postcssOptions: {
                                plugins: [['postcss-preset-env']],
                            },
                        },
                    },
                    'sass-loader', // sass files loader
                ],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]',
                },
            },
            {
                test: /.svg$/,
                type: 'asset', // inline if < 10kb, else resource
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                },
                use: 'svgo-loader',
            },
            {
                resourceQuery: /rawSVG/,
                type: 'asset/source',
                use: 'svgo-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext][query]',
                },
            },
            {
                test: /\.(csv)$/i,
                use: ['csv-loader'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },

    target: 'web',
    devtool: env.production ? 'eval-source-map' : 'source-map',

    /* Development Server Configuration */
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        watchFiles: ['src/**/*'],
        open: false,
        hot: true,
        host: '127.0.0.1',
        port: 5000,
    },

    /* Optimization configuration */
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin()],
    },

    /* Performance treshold configuration values */
    performance: {
        maxEntrypointSize: 500 * 1024,
        maxAssetSize: 800 * 1024,
    },

    plugins: [
        new WebpackBundleAnalyzer(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
        }),
        new Dotenv(),
    ].concat(htmlPluginEntries),
});
