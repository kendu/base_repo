var webpack = require('webpack');
var path = require('path');
var env = process.env.BUILD_ENV;
var CleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var production = (env === 'production');
var startFolder = path.resolve(__dirname, './src');


// Assets, that should copy to build folder for access (example: favicons)
var assetsCopy = [
    { from: 'src/assets/images/favicons', to: 'favicons' }
]

// DEVELOPMENT ENV VARS
var devtool = 'eval',
    plugins = [
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin(assetsCopy)
    ],
    entry = {
        app: [
            './src/app.js'
        ]
    };

// STAGING OR PRODUCTION VARS
if (production) {
    devtool = 'cheap-module-source-map';
    entry = {
        app: [
            './src/app.js'
        ]
    };
    plugins = plugins.concat([
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle:   true,
            compress: {
                warnings: false, // Suppress uglification warnings
            },
        }),
        new CopyWebpackPlugin(assetsCopy)
    ]);
}


module.exports = {
    entry: entry,
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "bundle.js",
        publicPath: "/build/"
    },
    devtool: devtool,
    plugins: plugins,
    loader: {
        configEnvironment: env
    },
    module: {
        preLoaders: [
            /*{
                test: /\.js/,
                loader: 'eslint',
            },*/
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'source-map'
            }
        ],
        loaders: [
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'url?limit=10000!img?progressive=true'
                ]
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    'react-hot',
                    'babel?presets[]=stage-0,presets[]=react,presets[]=es2015'
                ],
            },
            {
                test: /\.json$/,
                loader: "json"
            },
        ]
    },
    resolve: {
        alias: {
            config: path.resolve(startFolder, './config')
        },
        extensions: ['', '.js', '.json']
    },
    node: {
      fs: "empty"
    }
};
