// This is for the jupyterlab frontend

var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'CesiumWidget3:plugin',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'CesiumWidget3',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

