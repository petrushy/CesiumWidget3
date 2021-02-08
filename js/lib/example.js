var widgets = require('@jupyter-widgets/base');

import * as Cesium from 'c137.js';
import { Color } from 'c137.js';
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'c137.js';
//import "c137.js/Build/Cesium/Widgets/widgets.css";

var _ = require('lodash');

var uniquePointer = 0;

// See example.py for the kernel counterpart to this file.


// Custom Model. Custom widgets models must at least provide default values
// for model attributes, including
//
//  - `_view_name`
//  - `_view_module`
//  - `_view_module_version`
//
//  - `_model_name`
//  - `_model_module`
//  - `_model_module_version`
//
//  when different from the base class.

// When serialiazing the entire widget state for embedding, only values that
// differ from the defaults will be specified.
export var HelloModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'HelloModel',
        _view_name : 'HelloView',
        _model_module : 'CesiumWidget3',
        _view_module : 'CesiumWidget3',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!'
    })
});


// Custom View. Renders the widget model.
export var HelloView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        console.log('start my render');
        HelloView.__super__.render.apply(this, arguments);

        //const CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.78/Build/Cesium/'; 

        // this.value_changed();

        this.cesiumContainer = document.createElement("div");
        //this.cesiumContainer = this.cesiumContainer.uniqueId();
        //this.cesiumId = this.cesiumContainer.id;

        var id = "cesiumContainer" + uniquePointer;
        uniquePointer++;

        this.cesiumContainer.setAttribute("class", id);
        this.cesiumContainer.style.width = '100%';
        this.cesiumContainer.style.height = '600px';
        this.cesiumContainer.style.padding = '0';

        this.el.appendChild(this.cesiumContainer);
        var viewer = new Viewer(this.cesiumContainer, {
            shouldAnimate: true,
          });
        this.cesiumViewer = viewer;
        this.cesiumViewer.fullscreenButton.viewModel.fullscreenElement = this.cesiumViewer.container.childNodes[0];
     

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:value', this.value_changed, this);
    },

    value_changed: function() {
        // this.el.textContent = this.model.get('value');
    }
});

//module.exports =  {
//    HelloModel: HelloModel,
//    HelloView: HelloView
//};


