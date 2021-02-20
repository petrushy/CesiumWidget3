var widgets = require('@jupyter-widgets/base');

import * as Cesium from 'c137.js';
import { Color } from 'c137.js';
import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'c137.js';
//import "c137.js/Build/Cesium/Widgets/widgets.css";

var _ = require('lodash');

var uniquePointer = 0;

// See cesiumwidget.py for the kernel counterpart to this file.


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
export var CesiumModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'CesiumModel',
        _view_name : 'CesiumView',
        _model_module : 'CesiumWidget3',
        _view_module : 'CesiumWidget3',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
        value : 'Hello World!',
        width : '100%',
        height : '600px',
        czml: []
    })
});


// Custom View. Renders the widget model.
export var CesiumView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
        console.log('start my render');
        CesiumView.__super__.render.apply(this, arguments);

        // this.value_changed();

        this.cesiumContainer = document.createElement("div");

        var id = "cesiumContainer" + uniquePointer;
        uniquePointer++;

        this.cesiumContainer.setAttribute("class", id);
        this.cesiumContainer.style.width = this.model.get('width');
        this.cesiumContainer.style.height = this.model.get('height');
        this.cesiumContainer.style.padding = '0';

        this.el.appendChild(this.cesiumContainer);

        var timeline = this.model.get('timeline');
        var animation = this.model.get('animation');
        var baseLayerPicker = this.model.get('base_layer_picker');
        var geocoder = this.model.get('geocoder');
        var homeButton = this.model.get('home_button');
        var infoBox = this.model.get('infobox');
        var sceneModePicker = this.model.get('scene_mode_picker');
        var selectionIndicator = this.model.get('selection_indicator');
        var navigationHelpButton = this.model.get('navigation_help_button');
        var navigationInstructionsInitiallyVisible = this.model.get('navigation_instructions_initially_visible');
        var scene3DOnly = this.model.get('scene_3D_only');
        var sceneMode_name = this.model.get('scene_mode');

        var sceneModes = {
            'COLUMBUS_VIEW': Cesium.SceneMode.COLUMBUS_VIEW,
            'SCENE2D': Cesium.SceneMode.SCENE2D,
            'SCENE3D': Cesium.SceneMode.SCENE3D
        };

        var sceneMode;

        if (sceneModes[sceneMode_name])
            sceneMode = sceneModes[sceneMode_name];
        else {
            sceneMode = Cesium.SceneMode.SCENE3D;
            console.log('Illegal scene_mode received')
            }

        this.viewer = new Cesium.Viewer(this.cesiumContainer,{
            timeline: timeline,
            animation: animation,
            baseLayerPicker: baseLayerPicker,
            geocoder: geocoder,
            homeButton: homeButton,
            infoBox: infoBox,
            sceneModePicker: sceneModePicker,
            selectionIndicator: selectionIndicator,
            navigationHelpButton: navigationHelpButton,
            navigationInstructionsInitiallyVisible: navigationInstructionsInitiallyVisible,
            scene3DOnly: scene3DOnly,
            sceneMode: sceneMode
        });

        this.viewer.fullscreenButton.viewModel.fullscreenElement = this.viewer.container.childNodes[0];
     

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        //this.model.on('change:czml', this.czml_changed, this);

        this.update_lightning();
        this.model.on( 'change:enable_lightning', this.update_lightning, this);

        this.update_czml();
        this.model.on( 'change:czml', this.update_czml, this);

        this.update_kml();
        this.model.on('change:kml_url', this.update_kml, this);

        //this.update_geojson();
        //this.model.on( 'change:geojson', this.update_geojson, this);

        this.fly_to();
        this.model.on( 'change:_flyto', this.fly_to, this);

        this.zoom_to();
        this.model.on( 'change:_zoomto', this.zoom_to, this);

        this.zoom_to_region();
        this.model.on( 'change:_zoomtoregion', this.zoom_to_region, this);
    },

    update_lightning: function() {
        var enableLighting = this.model.get('enable_lighting');
        console.log('update lighting')
        this.viewer.scene.globe.enableLighting = enableLighting;
    },

    update_czml: function () {
        console.log('Update CZML!');
        // Add or update the CZML
        var data = this.model.get('czml');
        if (data && data.length) {
            var cz = new Cesium.CzmlDataSource();
            cz.load(data, 'Python CZML');
            if (!this.czml) {
                this.viewer.dataSources.remove(this.czml, true);
            }
            console.log(cz);

            this.viewer.dataSources.add(cz);
            this.czml = cz;
        }
    },

    update_geojson: function () {
        console.log('Update geojson!');
        // Add or update the CZML
        var geojson_string = this.model.get('geojson');
        if (!_.isEmpty(geojson_string)) {
            var data = JSON.parse(geojson_string);
            var gjson = new Cesium.GeoJsonDataSource();

            gjson.load(data, 'Python geojson');
            if (!_.isEmpty(this.geojson)) {
                this.viewer.dataSources.remove(this.geojson,true);
            }
            console.log(gjson);
            this.viewer.dataSources.add(gjson);
            this.geojson = gjson;
        }
    },

    update_kml: function () {
        console.log('Update KML!');
        // Add or update the KML
        var kml_string = this.model.get('kml_url');
        if (!_.isEmpty(kml_string)) {
            //var data = $.parseJSON(kml_string);
            var kml = new Cesium.KmlDataSource();

            kml.load(kml_string, 'Python KML');
            if (!_.isEmpty(this.kml)) {
                this.viewer.dataSources.remove(this.kml, true);
            }
            console.log(kml);

            this.viewer.dataSources.add(kml);
            this.kml = kml;
        }
    },

    fly_to: function () {
        console.log('fly to location!');
        // move the camera to a location
        var flyto = this.model.get('_flyto');
        if (!_.isEmpty(flyto)) {
            var pos = flyto; //flyto.split(",");
            this.viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2])),
                    orientation : {
                        heading : Cesium.Math.toRadians(Number(pos[3])),
                        pitch : Cesium.Math.toRadians(Number(pos[4])),
                        roll : Cesium.Math.toRadians(Number(pos[5]))
                    }
                });
            //this.model.set('_flyto', null);
            this.touch()
        }
        console.log(pos);
    },

    zoom_to: function () {
        console.log('zoom to a location!');
        // move the camera to a location
        var zoomto = this.model.get('_zoomto');
        if (!_.isEmpty(zoomto)) {
            var pos = zoomto; //.split(",");
            this.viewer.camera.setView({
                    destination : Cesium.Cartesian3.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2])),
                    orientation : {
                        heading : Cesium.Math.toRadians(Number(pos[3])),
                        pitch : Cesium.Math.toRadians(Number(pos[4])),
                        roll : Cesium.Math.toRadians(Number(pos[5]))
                    }
                });
                //this.model.set('_zoomto', null);
                this.touch()
        }
        console.log(pos);
    },

    zoom_to_region: function () {
        console.log('view region!');
        // move the camera to a location
        var region = this.model.get('_zoomtoregion');
        if (!_.isEmpty(region)) {
            var pos = region; // .split(",");
            var rectangle = Cesium.Rectangle.fromDegrees(Number(pos[0]), Number(pos[1]), Number(pos[2]), Number(pos[3]));
            this.viewer.camera.viewRectangle(rectangle);
            this.model.set('_zoomtoregion', null);
            this.touch();
        }
        console.log(region);
    }
});


