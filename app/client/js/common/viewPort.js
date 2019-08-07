/**
 *
 * Description: Viewport es una clase para la administracion de las interfaces
 * Authors: ing Rolando Toledo, ing Antonio Membrides Espinosa
 * Making Date: 08/05/2010
 * Update Date: 17/08/2010
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */
var Viewport = function(params)
{
    var _this = this;
    this.toolBar = new ToolBars()
    this.update = function(){_this.ui.doLayout(); }

    this.region = {
	center: {
		obj: new Ext.Panel({
			region:'center',
			id: 'center',
			layout:'fit',
			split:true,
			html: '<div id="msmap"></div>'
    		})
	},
	north: {
		obj: new Ext.Panel({
			region:'north',
			border:false,
			height: 76,
			xtype: 'panel',
			id: 'north',
			title: params.title ? params.title : "Merma's Demo",
			items :  _this.toolBar.obj	
    		})
	},
	south: {
		obj: new Ext.Panel({
			region:'south',
			frame: true,
			border:false,
			id: 'south',
			height: 35,
			layout:'column'
    		}),
		add:function(obj){
			_this.region.south.obj.add(obj);	
			_this.region.south.obj.doLayout();
		}
	},
	east: new function(){
		var _this = this;
		this.tab = new Ext.TabPanel({
			activeTab: 0,
			border:false,
			resizeTabs:true, 
			minTabWidth: 115,
			tabWidth: 135,
			enableTabScroll:true,
			split:true,
			defaults: {autoScroll:true}
		});
		this.obj = new Ext.Panel({
			region:'east',
			layout: 'fit',
			title:'Analysis',
                        id: 'east',//border:false,
			width: 300,
			minSize: 175,
			maxSize: 400,
			lines:false,
			split:true,
			collapsible: true,
			collapseMode:'mini',
			collapsed: true,
			items: _this.tab
    		});
		this.add = function(obj){
			_this.tab.add(obj).show();
			_this.obj.expand(obj.expand ? obj.expand : true);
		}
                this.rem = function(obj){_this.tab.remove(obj);}
	},	
	west: {
		obj: new Ext.Panel({
			region:'west',
			layout: 'fit',
                        id: 'west',
			title:'Layers Control',
			width: 195,
			border:false,
			minSize: 175,
			maxSize: 400,
			lines:false,
			collapseMode:'mini',
			collapsible: true
    		}),
		add:function(obj){
			_this.region.west.obj.add(obj);	
			_this.region.west.obj.doLayout();
		}
	}
    }; 
    this.buildGUI = function()
    {
	Ext.QuickTips.init();
        _this.ui = new Ext.Viewport({
            layout: 'border',
            frame: true,
            items: [_this.region.center.obj,_this.region.north.obj, _this.region.south.obj,_this.region.west.obj,_this.region.east.obj]
        });
        return _this.ui;
    }
};
