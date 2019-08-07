/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Navigation
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
Kcl.Class( "Kcl.Navigation",
{
	extend: Kcl.Plugin,
	property:{
		olManager: null
	},
	behavior: {
		buildGUI:function(params){
			eval("var map = "+params.map);
			var _this = Kcl.Navigation.prototype;
			_this.olManager = new MapControls(map, params.gui.toolBar);

			params.gui.toolBar.addButton({
				id: 'ZoomIn',
				control: true,
				iconCls: 'tb2a',
				tooltip: 'ZoomIn (+)',
				handler: function (){
					_this.olManager.doZoomInbox();
				}
			});

			params.gui.toolBar.addButton({
				id: 'ZoomOut',
				control: true,
				iconCls: 'tb2b',
				tooltip: 'ZoomOut (-)',
				handler: function (){
					_this.olManager.doZoomOut();
				}
			});

			params.gui.toolBar.addButton({
				id: 'Recenter',
				control: true,
				iconCls: 'tb2c',
				tooltip: 'Recenter',
				handler: function (){
					_this.olManager.doRecenter();
				}
			});

			params.gui.toolBar.addButton({
				id: 'FullExtent',
				iconCls: 'tb2d',
				tooltip: 'FullExtent',
				handler: function (){
					_this.olManager.doFullExtent();
				}
			});

			params.gui.toolBar.addButton({
				id: 'Back',
				iconCls: 'tb2e',
				tooltip: 'Back',
		                disabled: true,
				handler: function (){
					_this.olManager.doBack();
				}
			});

			params.gui.toolBar.addButton({
				id: 'Next',
				iconCls: 'tb2f',
				tooltip: 'Next',
		                disabled: true,
				handler: function (){
					_this.olManager.doNext();
				}
			});

			params.gui.toolBar.addButton({
				id: 'Pan',
				control: true,
				iconCls: 'tb2h',
				tooltip: 'Pan',
				handler: function (){
					_this.olManager.doPan();
				}
			});

			params.gui.toolBar.addButton('-');
		}
	}
});

Kcl.Navigation.require = [
	"plugins/Navigation/client/js/common/MapControls.js",
	"plugins/Navigation/client/css/controls.css",
	"plugins/Navigation/client/js/common/controls/MapBox.js",
	"plugins/Navigation/client/js/common/controls/MapPan.js",
	"plugins/Navigation/client/js/common/controls/MapRecenter.js",
	"plugins/Navigation/client/js/common/controls/MapZoomOut.js"
];
