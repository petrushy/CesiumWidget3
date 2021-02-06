var widgets = require('@jupyter-widgets/base');

// All kind of trial'n errors
//const CESIUM_BASE_URL = 'https://localhost:5000/';

//var Cesium = require('cesium/Source/Widgets/Viewer/Viewer');
//import Cesium from 'cesium/Source/Cesium.js';

//import {  Viewer } from 'cesium';
//import "node_modules/cesium/Build/Cesium/Widgets/widgets.css";
//import "./css/main.css";
//require('cesium/Build/Buils/Cesium.js');
//require('./lib/Cesium/Widgets/widgets.css');
//var Cesium = require('cesium/Cesium');

const CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.77/Build/Cesium/';

//import "cesium/Widgets/widgets.css";
//import "cesium/Build/Cesium/Widgets/widgets.css";
//import "cesium/Build/Cesium/Widgets/widgets.css";
//import "./css/main.css";

import * as Cesium from 'cesium';
import { Color } from 'cesium';
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'cesium';

var _ = require('lodash');

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
        const CESIUM_BASE_URL = 'https://cesium.com/downloads/cesiumjs/releases/1.77/Build/Cesium/';

        this.value_changed();
      
        
        var c = Color.fromRandom();

        this.cesiumContainer = document.createElement("div");
        this.cesiumContainer.setAttribute("class", "cesiumContainer");
        this.cesiumContainer.setAttribute('width', '100%');
        this.cesiumContainer.setAttribute('height', '200');
        this.el.appendChild(this.cesiumContainer);
        var viewer = new Viewer(this.cesiumContainer, {
            shouldAnimate: true,
          });
        this.cesiumViewer = viewer;
        console.log(viewer);

        

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


