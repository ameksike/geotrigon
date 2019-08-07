//-------------------------------------------------------------------------
var Scale = function(map)
{
	var _this = this;
	this.map = map;
	this.store = new Ext.data.ArrayStore({
		fields: ['state'],
		data : [["2278173"], ["278173"], ["78173"], ["8173"], ["5173"], ["500"], ["100"]]
	});
	this.ui = new Ext.form.ComboBox({
		columnWidth : 0.3,
		store: _this.store,
		displayField: 'state',
		typeAhead: true,
		triggerAction: 'all',	
		mode: 'local',
		width: 135,
		value: "250'000",
		forceSelection:true,
		listeners:{
			'change': function(){_this.set();},
			'select': function(){_this.set();}
		}
	});

	this.update = function(){
		_this.ui.setValue(_this.map.getScale());
	}

	this.set = function(){
		_this.map.zoomToScale(_this.ui.getValue());
		_this.doAction()
	}

	this.doAction = function(params)
	{

	}
}
//-------------------------------------------------------------------------
