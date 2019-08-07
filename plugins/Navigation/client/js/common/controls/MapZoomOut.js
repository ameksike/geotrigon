/**
 *
 * Description: MapZoomOut es una clase para la administracion de 
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 16/05/2010
 * Update Date: 
 *
 * @package: plugins
 * @subpackage: Navigation
 * @version:
 *
 */
var MapZoomOut = function(map, actions)
{
	this.map = map;
	this.actions = actions;
	this.mouseDragStart;
	this.performedDrag = false;
	var _this = this;

	this.update = function(params)
	{
		var type = typeof(this.actions );
		if(type == "string") eval(_this.actions+"(params);");
		else _this.actions(params);
	}

	this.map.div.style.cursor = "";
	var mouseup = function(evt)
	{
		if(this.map.mode == "zoomout")
		{
			var newXY = new OpenLayers.Pixel(evt.xy.x, evt.xy.y);
			var newCenter = this.map.getLonLatFromViewPortPx( newXY ); 
			this.map.setCenter(newCenter, null, true);
			this.map.zoomOut(); 
			this.update();
		}
	}
	this.map.events.register( 'mouseup',   this, mouseup);
}
