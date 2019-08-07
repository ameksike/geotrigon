/**
 *
 * Description: MapPan es una clase para la administracion de 
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 18/05/2010
 * Update Date: 
 *
 * @package: plugins
 * @subpackage: Navigation
 * @version:
 *
 */
var MapPan = function(map, actions)
{
	var _this = this;
	this.map = map;
	this.actions = actions;
	this.mouseDragStart;
	this.performedDrag = false;
	this.map.div.style.cursor = "move";

	this.update = function(params)
	{
		var type = typeof(this.actions );
		if(type == "string") eval(_this.actions+"(params)");
		else _this.actions(params);
	}

	var mouseup = function(evt)
	{
		if(this.map.mode == "pan")
		{
			if (this.performedDrag) this.map.setCenter(this.map.center);
			_this.mouseDragStart = false;
			_this.performedDrag = false;
		}
	}

	var mousedown = function(evt)
	{
		if(this.map.mode == "pan")
		{
			_this.mouseDragStart = evt.xy.clone();
			//...................................
			_this.map.div.style.cursor = "move";
			//...................................
			_this.performedDrag = true;
			document.onselectstart = function() { return false; };
			OpenLayers.Event.stop(evt);
			_this.update();
		}
	}

	var mousemove = function(evt)
	{
		if(this.map.mode == "pan")
		{
			if(this.mouseDragStart) {
			    var deltaX = this.mouseDragStart.x - evt.xy.x;
			    var deltaY = this.mouseDragStart.y - evt.xy.y;
			    var size = this.map.getSize();
			    var newXY = new OpenLayers.Pixel(size.w / 2 + deltaX, size.h / 2 + deltaY);
			    var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
			    this.map.setCenter(newCenter, null, true);
			    this.mouseDragStart = evt.xy.clone();
			}
		}
	}

	this.map.events.register( 'mouseup',   _this, mouseup);
	this.map.events.register( 'mousedown', _this, mousedown);
	this.map.events.register( 'mousemove', _this, mousemove);
}
