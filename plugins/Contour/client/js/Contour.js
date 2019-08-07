/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Contour
 * @version: 0.1

 * @description: 
 * @authors: ing. Hermes Lazaro Herrera Martinez
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
Kcl.Class( "Kcl.Contour",
{
	extend: Kcl.Plugin,
	behavior: {
		buildGUI:function(params){
			this.ui = params.gui;
			params.gui.toolBar.addButton({
			    id: 'contourPlugin',
			    control: true,
			    iconCls: 'contour',
			    tooltip: 'Contornos o Curvas de Nivel',
			    handler: function (){
				var context = new ContourContext();
				params.gui.region.east.add({
					title: 'Generaci&oacute;n de Contornos',
					resizeTabs: true,
					frame: true,
					id: "montornosMod",
					iconCls: 'tabs',
					closable: true,
					layout: 'fit',
					items: context.component
				});
				std.mod.Map.obj.mode = "contour"
				std.mod.Map.obj.events.register('mouseup', this, context.buildGUI);
			    }
			});
		},
		serverResponse: function(objResponse)
		{
			switch(objResponse.action)
			{
			    case "update":
				break;
			}
		}
	}
});

Kcl.Contour.require = [
	"plugins/Contour/client/css/Spinner.css",
	"plugins/Contour/client/js/common/colorpicker/colorpicker.js",
	"plugins/Contour/client/js/common/color-field.js",
	"plugins/Contour/client/js/common/sliderTip.js",
	"plugins/Contour/client/js/common/Spinner.js",
	"plugins/Contour/client/js/common/SpinnerField.js",
	"plugins/Contour/client/js/controllers/OLContourContext.js",
	"plugins/Contour/client/js/views/gui.js",
	"plugins/Contour/client/css/contour.css"
];
