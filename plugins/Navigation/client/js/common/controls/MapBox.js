/**
 *
 * Description: MapBox es una clase para la administracion de 
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 16/05/2010
 * Update Date: 
 *
 * @package: plugins
 * @subpackage: Navigation
 * @version:
 *
 */
var MapBox = function(map, actions)
{
	var _this = this;
	this.map = map;
	this.map.div.style.cursor = "crosshair";
	this.actions = actions;
	this.mouseDragStart;
	this.performedDrag = false;

	this.update = function(params)
	{
		var type = typeof(this.actions);
		if(type == "string") eval(_this.actions+"(params);");
		else _this.actions(params);
	}

	var mouseup = function(evt)
	{
		if(this.map.mode == "box")
		{
			if (this.mouseDragStart != null) {
			    if (Math.abs(this.mouseDragStart.x - evt.xy.x) > 5 ||    
				Math.abs(this.mouseDragStart.y - evt.xy.y) > 5) {   
				var start = this.map.getLonLatFromViewPortPx( this.mouseDragStart ); 
				var end = this.map.getLonLatFromViewPortPx( evt.xy );

				var top = Math.max(start.lat, end.lat);
				var bottom = Math.min(start.lat, end.lat);
				var left = Math.min(start.lon, end.lon);
				var right = Math.max(start.lon, end.lon);

				this.update({
					top: Math.max(start.lat, end.lat),
					bottom : Math.min(start.lat, end.lat),
					left : Math.min(start.lon, end.lon),
					right : Math.max(start.lon, end.lon)
				});

			    } else {
				var end = this.map.getLonLatFromViewPortPx( evt.xy );
				this.map.setCenter(new OpenLayers.LonLat((end.lon), (end.lat)), this.map.getZoom() + 1);
			    }    
			    this.map.viewPortDiv.removeChild(this.zoomBox);
			    this.zoomBox = null;
			}
			this.mouseDragStart = false;
		}
	}

	var mousedown = function(evt)
	{
		if(this.map.mode == "box")
		{
			this.mouseDragStart = evt.xy.clone();
			//...................................
			this.map.div.style.cursor = "crosshair";
			this.zoomBox = OpenLayers.Util.createDiv('zoomBox',  this.mouseDragStart, null, null, "absolute", "2px solid red");
			this.zoomBox.style.backgroundColor = "white";
			this.zoomBox.style.filter = "alpha(opacity=30)"; // IE
			this.zoomBox.style.opacity = "0.30";
			this.zoomBox.style.fontSize = "1px";
			this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
			this.map.viewPortDiv.appendChild(this.zoomBox);
			//...................................
			document.onselectstart = function() { return false; };
			OpenLayers.Event.stop(evt);
		}
	}

	var mousemove = function(evt)
	{
		if(this.map.mode == "box")
		{
			if(this.mouseDragStart) {
			    var deltaX = Math.abs(this.mouseDragStart.x - evt.xy.x);
			    var deltaY = Math.abs(this.mouseDragStart.y - evt.xy.y);
			    this.zoomBox.style.width = Math.max(1, deltaX) + "px";
			    this.zoomBox.style.height = Math.max(1, deltaY) + "px";
			    if (evt.xy.x < this.mouseDragStart.x)
			        this.zoomBox.style.left = evt.xy.x+"px";
			    if (evt.xy.y < this.mouseDragStart.y)
			        this.zoomBox.style.top = evt.xy.y+"px";
			}
		}
	}

	this.map.events.register( 'mouseup',   this, mouseup);
	this.map.events.register( 'mousedown', this, mousedown);
	this.map.events.register( 'mousemove', this, mousemove);
}
