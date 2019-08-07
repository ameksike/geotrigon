/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: ThematicRaster
 * @version: 0.1

 * @description: 
 * @authors: ing. Hermes Lazaro Herrera Martinez
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
var ThematicContext = {};
Kcl.Class( "Kcl.ThematicRaster",
{
	extend: Kcl.Plugin,
	property:{
		objLayer: null
	},
	behavior: {
		buildGUI:function(params)
		{
			this.ui = params.gui;
			params.gui.toolBar.addButton({
			    id: 'thematicRaster',
			    control: true,
			    iconCls: 'thematicRaster',
			    tooltip: 'Raster Tematico',
			    handler: function (){
				std.FrontController.send({
				    action: 'load',
				    controller: "ThematicRaster"
				});
			    }
			});
		},
		serverResponse: function(objResponse)
		{
			switch(objResponse.action)
			{
			    case "update":
				var colorTool = new Ext.ux.ColorPicker();
				var styles = objResponse.styles;
				ThematicContext.data.properties = [];
				ThematicContext.ngroup = styles.length;
				for(var i=0;i < styles.length;i++){
				    var color = "#"+colorTool.rgbToHex(styles[i].color[0],styles[i].color[1],styles[i].color[2]);
				    var property = [{
					'name': 'min'+(i+1),
					'text': 'Rango Minimo',
					'value': styles[i].min,
					'group': 'clase-'+(i+1)
				    },{
					'name': 'max'+(i+1),
					'text': 'Rango Maximo',
					'value': styles[i].max,
					'group': 'clase-'+(i+1)
				    },{
					'name': 'color'+(i+1),
					'text': 'Color',
					'value': color,
					'group': 'clase-'+(i+1),
					'editor': new Ext.grid.GridEditor(new Ext.ux.ColorField({
					    selectOnFocus: true
					})),
					'renderer': ThematicContext.crenderer
				    }]
				    ThematicContext.data.properties = ThematicContext.data.properties.concat(property);
				}
				ThematicContext.rasterLayers = objResponse.raster
	
				var elem = Ext.getCmp('thematicRasterPlugin');
				if(elem){
				    this.ui.region.east.rem(elem);
				}
				var chooserRaster = ThematicContext.chooserRaster(); 
				var gridProperties = ThematicContext.gridProperties();
				this.ui.region.east.add({
				    title: 'Tematizar raster',
				    frame: true,
				    closable:true,
				    id:'thematicRasterPlugin',
				    iconCls: 'tabs',
				    items: [chooserRaster,gridProperties]
				});
				chooserRaster.selectByValue(ThematicContext.raster,true);
				break;
			}
		}
	}
});


Kcl.ThematicRaster.require = [
	"plugins/ThematicRaster/client/js/common/grid/property-grid.js",
	"plugins/ThematicRaster/client/js/common/spinner/Spinner.js",
	"plugins/ThematicRaster/client/js/common/spinner/SpinnerField.js",
	"plugins/ThematicRaster/client/js/common/colorpicker/color-field.js",
	"plugins/ThematicRaster/client/js/common/colorpicker/colorpicker.js",
	"plugins/ThematicRaster/client/js/common/colorpicker/colorpickerfield.js",
	"plugins/ThematicRaster/client/js/common/loco.js",
	"plugins/ThematicRaster/client/css/ThematicRaster.css"
];

