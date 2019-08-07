/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Layer
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("plugins/Layer/client/js/views/gui.js");
std.include("plugins/Layer/client/js/controllers/gui.js");
std.include("plugins/Layer/client/js/common/treeControls.js");
std.include("plugins/Layer/client/css/lay.css");
//-------------------------------------------------------------------------
Kcl.Class( "Kcl.Layer",
{
	extend: Kcl.Plugin,
	property:{
		objLayer: null
	},
	behavior: {
		serverResponse:function(objResponse){
			
			if(objResponse.action == "update")
				this.objLayer.updateTree(objResponse.nodesList);
		},
		buildGUI:function(params){
			this.objLayer = new LayerControls();
			params.gui.region.west.add(this.objLayer.buildGUI());
			this.objLayer.load();
		}
	}
});

