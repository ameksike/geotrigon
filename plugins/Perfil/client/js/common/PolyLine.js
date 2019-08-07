var PolyLine = function()
{
	var _this = this;
	this.list = new Array();

	var sketchSymbolizers = {
		"Point": {
		    pointRadius: 4,
		    graphicName: "square",
		    fillColor: "white",
		    fillOpacity: 1,
		    strokeWidth: 1,
		    strokeOpacity: 1,
		    strokeColor: "#FF5599"
		},
		"Line": {
		    strokeWidth: 2.5,
		    strokeOpacity: 1,
                    strokeColor: "#FF0099",
		    fillOpacity: 1,
		    strokeDashstyle: "dash",
		}
	};

	var style = new OpenLayers.Style();
	style.addRules([new OpenLayers.Rule({symbolizer: sketchSymbolizers})]);
	var styleMap = new OpenLayers.StyleMap({"default": style});

	this.obj = new OpenLayers.Control.Measure(
	    OpenLayers.Handler.Path, {
		persist: true,
		handlerOptions: {
		    layerOptions: {styleMap: styleMap}
		}
	    }
	);

	this.getUnit = function (event) {
		var geometry = event.geometry.components[event.geometry.components.length-1];
		return {
			"X" : geometry.x,
			"Y" : geometry.y,
			"D" : event.measure
		}
	}

	this.obj.events.on({
	    	"measure": function(event)
		{
			_this.units = event.units;
			_this.list.push(_this.getUnit(event));
			if(_this.onClic2) _this.onClic2(_this.list);
			_this.list = new Array();//_this.list.clear();
		},"measurepartial": function(event)
		{
			var unit = _this.getUnit(event);
			_this.list.push(unit);
			if(_this.onClic) _this.onClic(unit);
		}
	});
}
