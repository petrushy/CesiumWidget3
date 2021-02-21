var path = require('path');
var version = require('./package.json').version;
var glob = require("glob");

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

// Custom webpack rules are generally the same for all webpack bundles, hence
// stored in a separate local variable.
var rules = [{
    test: /\.css$/,
    use: ['style-loader', { loader: 'css-loader' }],
    sideEffects: true
    }, {
    test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
    loader: "url-loader",
    type:'asset/resource'},
    // { test: /\.json$/, loader: 'json-loader' },
    //{ test: /\.js$/, loader: 'babel-loader', query: {presets: ['es2015', 'stage-0']}, exclude: /node_modules/ }
    // {
    //     test: /\.m?js$/,
    //     exclude: /(node_modules|bower_components)/,
    //     use: {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: ['@babel/preset-env']
    //       }
    //     }
    //   }
    // {
    //     test: /\.js$/,
    //     exclude: "/node_modules/",
    //     use: "babel-loader",
    //   },

];

var plugins = [
    //new HtmlWebpackPlugin({
    //    template: path.resolve(__dirname, 'src', 'index.html') //'src/index.html'
    //}),
    new CopyWebpackPlugin({
        patterns: [
            { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
            { from: path.join(cesiumSource, "ThirdParty"), to: 'ThirdParty' },
            { from: path.join(cesiumSource, "Assets"), to: 'Assets' },
            { from: path.join(cesiumSource, "Widgets"), to: 'Widgets' }
        ],
    }),
    new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
    }), 
    //new HtmlWebpackTagsPlugin({ tags: ['cesium/Cesium.js', 'cesium/Widgets/widgets.css'], append: false }),

    // new CopyPlugin({
    //     patterns: [
    //       {
    //         from: `../node_modules/cesium/Build/Cesium${prod ? "" : "Unminified"}`,
    //         to: "cesium",
    //       },
    //     ],
    //   }),
      
];


module.exports = (env, argv) => {
    var devtool = argv.mode === 'development' ? 'source-map' : false;
    return [
        {
            mode: 'development',
            context: __dirname,
            entry: {
                app: './src/index.js'
            },
            output: {
                filename: '[name].js',
                path: path.resolve(__dirname, 'dist'), // '..', 'cesiumwidget3', 'nbextension'),

                // Needed to compile multiline strings in Cesium
                sourcePrefix: ''
            },
            devtool: 'source-map',
            node: {
                // Resolve node module use of fs
                global: false,
                __filename: false,
                __dirname: false
              },
            resolve: {
                mainFields: ['module', 'main'],
                fallback: {
                        // Resolve node module use of fs
                         fs: "empty",
                         Buffer: false,
                         http: "empty",
                         https: "empty",
                         zlib: "empty"
                     },
                     alias: {
                        //  CesiumJS module name
                        cesium: path.resolve(__dirname, cesiumSource)
                    }
            },
            module: {
                unknownContextCritical: false,
                rules: rules,
           
            },
            plugins: plugins,
            externals: ['cesium'],

        
            // development server options
            devServer: {
                contentBase: path.join(__dirname, "dist")
            }
        }, 

        {// Notebook extension
        //
        // This bundle only contains the part of the JavaScript that is run on
        // load of the notebook. This section generally only performs
        // some configuration for requirejs, and provides the legacy
        // "load_ipython_extension" function which is required for any notebook
        // extension.
        //
            entry: './lib/extension.js',
            output: {
                filename: 'extension.js',
                path: path.resolve(__dirname, '..', 'cesiumwidget3', 'nbextension'),
                libraryTarget: 'amd',
                publicPath: '', // publicPath is set in extension.js

                // Needed to compile multiline strings in Cesium
                sourcePrefix: ''

  
            },
            devtool: 'source-map',
            plugins: plugins,         
        },
        {// Bundle for the notebook containing the custom widget views and models
        //
        // This bundle contains the implementation for the custom widget views and
        // custom widget.
        // It must be an amd module
        //
            entry: './lib/index.js',
            output: {
                filename: 'index.js',
                path: path.resolve(__dirname, '..', 'cesiumwidget3', 'nbextension'),
                libraryTarget: 'amd',
                publicPath: '',

                // Needed to compile multiline strings in Cesium
                sourcePrefix: ''
            },
            amd: {
                // Enable webpack-friendly use of require in Cesium
                toUrlUndefined: true
            },
            devtool: 'source-map',
            module: {
                // unknownContextCritical: false,
                rules: rules
            },
            node: {
                // Resolve node module use of fs
        
                global: false,
                __filename: false,
                __dirname: false
            },
            resolve: {
                mainFields: ['module', 'main']
            },

            //resolve: {
            //    alias: {
            //      cesium$: 'cesium/Cesium',
            //      cesium: 'cesium/Source'
            //    }
            //  },

            plugins: plugins,

            externals: ['@jupyter-widgets/base', 'cesium']
        },
        {// Embeddable CesiumWidget3 bundle
        //
        // This bundle is generally almost identical to the notebook bundle
        // containing the custom widget views and models.
        //
        // The only difference is in the configuration of the webpack public path
        // for the static assets.
        //
        // It will be automatically distributed by unpkg to work with the static
        // widget embedder.
        //
        // The target bundle is always `dist/index.js`, which is the path required
        // by the custom widget embedder.
        //
            plugins: plugins,
            entry: ['./lib/embed.js' ],//.push(glob.sync("./node_modules/cesium/Source/Widget/**/*.js")),
            output: {
                filename: 'index.js',
                path: path.resolve(__dirname, 'dist'),
                libraryTarget: 'amd',
                publicPath: 'https://unpkg.com/CesiumWidget3@' + version + '/dist/',
                
                // Needed to compile multiline strings in Cesium
                sourcePrefix: ''
            },
            devtool: 'source-map',
            node: {
                // Resolve node module use of fs
        
                global: false,
                __filename: false,
                __dirname: false
            },
            resolve: {
                mainFields: ['module', 'main']
            },
            amd: {
                // Enable webpack-friendly use of require in Cesium
                toUrlUndefined: true
            },
            module: {
                unknownContextCritical: false,
                rules: rules,
            },
            resolve: {
                mainFields: ['module', 'main']
            },
            //resolve: {
            //    alias: {
            //      cesium$: 'cesium/Cesium',
            //      cesium: 'cesium/Source'
            //    }
            //  },

            plugins: [
                // Copy Cesium Assets, Widgets, and Workers to a static directory
                new CopyWebpackPlugin({
                    patterns: [
                        { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' },
                        { from: path.join(cesiumSource, 'ThirdParty'), to: 'ThirdParty' },
                        { from: path.join(cesiumSource, 'Assets'), to: 'Assets' },
                        { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
                    ],
                }),
                //new webpack.DefinePlugin({
                //    // Define relative base path in cesium for loading assets
                //    CESIUM_BASE_URL: JSON.stringify('')
                //})
            ],
            externals: ['@jupyter-widgets/base', 'cesium']
        },


         

        
    ];
}
