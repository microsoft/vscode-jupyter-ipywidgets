// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

// Copied from https://github.com/jupyter-widgets/ipywidgets/blob/master/packages/html-manager/webpack.config.js

const postcss = require('postcss');
const common = require('./build/webpack/common');
const path = require('path');
const constants = require('./build/constants');
const outDir = path.join(__dirname, 'out');
// Any build on the CI is considered production mode.
const isProdBuild = constants.isCI || process.argv.includes('--mode');
module.exports = [
    {
        mode: isProdBuild ? 'production' : 'development',
        devtool: isProdBuild ? 'source-map' : 'inline-source-map',
        entry: path.join(outDir, 'index.js'),
        cache: true,
        externals: ['crypto'],
        output: {
            filename: 'ipywidgets.js',
            path: path.join(__dirname, 'dist'),
            publicPath: 'built/',
            pathinfo: false
        },
        resolve: {
            modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, './')]
        },
        plugins: [...common.getDefaultPlugins('ipywidgets')],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        postcss.plugin('delete-tilde', function () {
                                            return function (css) {
                                                css.walkAtRules('import', function (rule) {
                                                    rule.params = rule.params.replace('~', '');
                                                });
                                            };
                                        }),
                                        postcss.plugin('prepend', function () {
                                            return function (css) {
                                                css.prepend(
                                                    "@import './node_modules/@jupyter-widgets/controls/css/labvariables.css';"
                                                );
                                            };
                                        }),
                                        require('postcss-import')(),
                                        require('postcss-preset-env')()
                                    ]
                                }
                            }
                        }
                    ]
                },
                // jquery-ui loads some images
                { test: /\.(jpg|png|gif)$/, type: 'asset/resource' },
                // required to load font-awesome
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/inline'
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/inline'
                },
                { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, type: 'asset/resource' },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    type: 'asset/inline'
                }
            ]
        }
    }
];
