/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Measure
 * @version: 0.1

 * @description: en construccion yet ...
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("plugins/Measure/client/js/common/PolygonMeasure.js");
std.include("plugins/Measure/client/js/common/PolyLineMeasure.js");
std.include("plugins/Measure/client/js/views/WMeasureResult.js");
std.include("plugins/Measure/client/js/views/MeasureGUI.js");
std.include("plugins/Measure/client/js/controllers/MeasureGUI.js");
std.include("plugins/Measure/client/css/measure.css");
Kcl.Class( "Kcl.Measure",
{
	extend: Kcl.Plugin,
	behavior: {
		buildGUI:function(params){
			params.gui.toolBar.addButton({
				id: 'Measure',
				control: true,
				iconCls: 'measure',
				tooltip: 'Mediciones',
				handler: function (){
					eval("var map = "+params.map);
					this.guim = new MeasureGUI(map);	
					params.gui.region.east.add(this.guim.buildGUI());
				},
				onDefuse : function()
				{
					if(this.guim) this.guim.controlOff();
				}
			});
		}
	}
});
