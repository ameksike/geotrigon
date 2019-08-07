/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Info
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
Kcl.Class( "Kcl.Info",
{
	extend: Kcl.Plugin,
	behavior: {
		buildGUI:function(params){
			//... Mouse Position ...............
			params.gui.region.south.add({
				columnWidth : 0.3,
				style : 'margin:5 0 0 0;',
				html: '<div id="cood"><b>Coordenadas(m):</b></div>'
			});

			eval("var map = "+params.map);
			this.mapinfo = new MapInfo(map);

			this.mapinfo.setMousePosition("cood",{
				prefix: '<b>Coordenates(degree): </b>',
				separator: ' / ',
				suffix: '',
				numDigits: 5
			});

			//... Scale ......................
			this.scale = new Scale(map);
			params.gui.region.south.add({
				columnWidth : 0.3,
				layout:'column',
				items: [{
						html:"<b>Scale 1:</b> ", 
						style : 'margin:5 0 0 0;',
						columnWidth : 0.2
					
					},this.scale.ui,{
						html:'<div id="skle"></div>',
						style : 'margin:5 0 0 0;',
						columnWidth : 0.3
					
					}]
			});
		
			std.mod.Map.obj.addControl(new OpenLayers.Control.ScaleLine());
			//... Zoom ......................
			params.gui.region.south.add({
				columnWidth : 0.3,
				style : 'margin:5 0 0 0;',
				html:'<div id="zoomi"><b>Zoom:</b></div>'
			});
		}
	}
});

Kcl.Info.require = [
	"plugins/Info/client/js/common/MapInfo.js",
	"plugins/Info/client/js/common/Scale.js"
];
