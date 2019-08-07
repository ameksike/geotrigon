/**
 *
 * Description: MapRecenter es una clase para la administracion de 
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 14/05/2010
 * Update Date: 
 *
 * @package: plugins
 * @subpackage: Navigation
 * @version:
 *
 */
var MapRecenter = function(map, actions)
{
	var _this = this;
	this.map = map;
	this.map.div.style.cursor = "";
	this.actions = actions;
	this.mouseDragStart;
	this.performedDrag = false;
	this.update = function(params)
	{
		var type = typeof(this.actions );
		if(type == "string") eval(_this.actions+"(params);");
		else _this.actions(params);
	}
	var mouseup = function(evt)
	{
		if(this.map.mode == "recenter")
		{
			var newXY = new OpenLayers.Pixel(evt.xy.x, evt.xy.y);
			var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
			_this.map.setCenter(newCenter, null, true);
			_this.update();
		}
	}
	this.map.events.register( 'mouseup',   this, mouseup);
}
