var PolygonMeasure = function()
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
		"Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
	};

	var style = new OpenLayers.Style();
	style.addRules([new OpenLayers.Rule({symbolizer: sketchSymbolizers})]);
	var styleMap = new OpenLayers.StyleMap({"default": style});

	this.obj = new OpenLayers.Control.Measure(
	    OpenLayers.Handler.Polygon, {
		persist: true,
		handlerOptions: {
		    layerOptions: {styleMap: styleMap}
		}
	    }
	);

	this.getUnit = function (event) {
		var geometry = event.geometry.components[event.geometry.components.length-1];
		if(event.order==1) var unit = event.units;
		else var unit = event.units+"<sup>2</sup>";
		return new Array(
			geometry.x,
			geometry.y,
			event.measure,
			unit
		);
	}

	this.obj.events.on({
	    	"measure": function(event)
		{
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
