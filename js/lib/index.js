// This is for the classic notebook and Jupyterlab

// Export widget models and views, and the npm package version number.
module.exports = require('./cesiumwidget.js');
module.exports['version'] = require('../package.json').version;
