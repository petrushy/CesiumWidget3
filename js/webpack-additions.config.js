var path = require('path');


const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
//const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

// The path to the CesiumJS source code
const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';



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

module.exports = {
    plugins: plugins, 
  };