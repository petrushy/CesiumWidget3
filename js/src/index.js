import { Cesium3DTileset, createWorldTerrain, IonResource, Viewer } from 'cesium';
import "../node_modules/cesium/Build/Cesium/Widgets/widgets.css";
//import "cesium/Source/Widgets/widgets.css";
//node_modules/cesium/Source??
import "./css/main.css";

// This is simplified version of Cesium's Getting Started tutorial.
// See https://cesium.com/docs/tutorials/getting-started/ for more details.

var viewer = new Viewer('cesiumContainer', {
    terrainProvider: createWorldTerrain()
});

var tileset = new Cesium3DTileset({
    url: IonResource.fromAssetId(40866)
});

viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
