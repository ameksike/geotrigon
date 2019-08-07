/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Map
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("lib/OpenLayers/theme/default/style.css");
std.include("lib/OpenLayers/examples/style.css");
//-------------------------------------------------------------------------
Kcl.Class( "Kcl.Map",
{
	extend: Kcl.Plugin,
	property:{
		lay: null
	},
	behavior: {
		onLoadStart : function(){},
		onLoadEnd : function(){},
		onResize : function(){
			var _this = Kcl.Map.prototype;
			_this.obj.updateSize();
		},
		refresh : function(){
			var _this = Kcl.Map.prototype;
			_this.lay.redraw(true);
		},
		serverResponse:function(objResponse){
			var _this = Kcl.Map.prototype;
			switch(objResponse.action)
			{
			    case "update":
				_this.refresh();
				break;

			    case "load":
				_this.obj.setOptions({
				    projection: objResponse.projection,
				    maxExtent: new OpenLayers.Bounds(objResponse.box["x1"], objResponse.box["y1"],objResponse.box["x2"], objResponse.box["y2"]),
				});

				_this.lay = new OpenLayers.Layer.MapServer(
					"lay",
					std.FrontController.getRequest("getMap", "Map"),
					{
						layers: []
					},{
						isBaseLayer:1,
						gutter:0,
						buffer:0,
						//singleTile:true,
						transitionEffect:'resize'
					}
				);

				_this.lay.events.on({
				    "loadstart": function(){ _this.onLoadStart(); },
				    "loadend": function(){ _this.onLoadEnd(); }
				});
				_this.obj.addLayer(_this.lay);
				_this.obj.zoomToMaxExtent();
				break;
			}
		},
		buildGUI:function(params){
			var _this = Kcl.Map.prototype;
			params.gui.region.center.obj.addListener("resize",_this.onResize);
			_this.obj = new OpenLayers.Map("msmap",{
			    allOverlays: true,
			    maxResolution: 'auto',
			    numZoomLevels: 9,
			    controls: [
					//new OpenLayers.Control.Navigation(),
					new OpenLayers.Control.KeyboardDefaults()
			    ]
			});
			std.FrontController.send({action:'load', controller:"Map"});
		}
	}
});
Kcl.Map.require = "lib/OpenLayers/OpenLayers.js";
