var path = require('path');
var webpack = require('webpack');

var paths = {
    admin: "src/main/resources/assets/form-builder-admin",
    formbuilder: "src/main/resources/site/assets"
};

module.exports = {
    entry: {
        'assets/form-builder-admin/js': path.join(__dirname, paths.admin, 'jsx', 'form-builder-admin.jsx'),
        'site/assets/js': path.join(__dirname, paths.formbuilder, 'jsx', 'main.jsx')
    },
    output: {
        path: path.join(__dirname, 'build/resources/main'),
        filename: '[name]/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    presets: [ 
                        'es2015', 
                        'react'
                    ],
                    plugins: [
                        require('babel-plugin-transform-object-rest-spread')
                    ]
                }
            },
            {
                test: /\.less?$/,
                loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            }
        ]
    },
    node: {
        fs: 'empty'
    },
    devtool: 'eval-cheap-module-source-map',
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            sourceMap: true
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
};