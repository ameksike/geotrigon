//-------------------------------------------------------------------------
var MeasureGUI = function(map)
{
	var _this = this;
	var _that = MeasureGUI.prototype;
	this.buildGUI = function(params)
	{
		_this.Tab = {
			title: 'Mediciones',
			frame: true,
			id: "Medisiones",
			iconCls: 'tabs',
			closable: true,
			tbar:new Ext.Toolbar({
		                id:'m-tbar',
		                defaults: {toggleGroup:'measureBtns'},
		                items:[{
		                    tooltip: 'Distance',
		                    iconCls: 'mline',
		                    handler: function (btn){_this.distance();}
				},{
		                    tooltip: 'Area',
		                    iconCls: 'marea',
		                    handler: function (btn){_this.area();}
				},{
		                    tooltip: 'Asimut',
		                    iconCls: 'masimut',
		                    handler: function (btn){_this.asimut();}
				}]
			}),
			items: [{
					xtype: 'fieldset',
					title: "Select measure's type",
					style : 'margin:3 3 0 0;',
					autoHeight: true,
					layout: 'form',
					collapsed: true, 
					collapsible: true,
					items: [{
						    xtype: 'radiogroup',
						    itemCls: 'x-check-group-alt',
						    columns: 1,
						    listeners : {change:function(d,v){_this.setGeodesic(v.inputValue);}},
						    items: [
							{boxLabel: 'Geodesic Values', name: 'rb-auto', inputValue: true},
							{boxLabel: 'Planar Values', name: 'rb-auto', inputValue: false, checked: true}
						    ]
					}]
				},{
					xtype: 'fieldset',
					title: 'Historic measure',
					autoHeight: true,
					layout: 'form',
					items: []
			}]
		};
		return _this.Tab;
	}
	_that.map = map;
	_that.controls = [];
	_that.construct();
}
