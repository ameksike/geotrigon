var MapInfo = function(map)
{
	var _this = this;
	this.map = map;
	var formatOutput = function(lonLat) 
	{
		var digits = parseInt(_this.conf.numDigits);
		var newHtml =  _this.conf.prefix +
		    lonLat.lon.toFixed(digits) +
		    _this.conf.separator + 
		    lonLat.lat.toFixed(digits) +
		    _this.conf.suffix;
		return newHtml;
	}
	var redraw = function(evt) 
	{
		var lonLat;
		if (evt == null) {
		    lonLat = new OpenLayers.LonLat(0, 0);
		} else {
		    if (this.lastXy == null ||
			Math.abs(evt.xy.x - this.lastXy.x) > this.granularity ||
			Math.abs(evt.xy.y - this.lastXy.y) > this.granularity)
		    {
			this.lastXy = evt.xy;
			return;
		    }
		    lonLat = this.map.getLonLatFromPixel(evt.xy);
		    if (!lonLat) {return; }    
		    if (this.displayProjection) {
			lonLat.transform(this.map.getProjectionObject(), this.displayProjection );
		    }      
		    this.lastXy = evt.xy;
		}
		var newHtml = formatOutput(lonLat);
		if (newHtml != _this.div.innerHTML) {
		    _this.div.innerHTML = newHtml;
		}
	}
	this.setMousePosition = function(div, conf)
	{
		_this.div = document.getElementById(div);
		if(!conf) _this.conf = {prefix:'', separator:' / ',	suffix:'', numDigits:5};
		else _this.conf = conf;
		_this.map.events.register( 'mousemove', this, redraw);
	}
	this.zoomid = "zoomi";
	this.zoomUpdate = function()
	{
		document.getElementById(_this.zoomid).innerHTML = "<b>Zoom: </b>";
		document.getElementById(_this.zoomid).innerHTML += _this.map.getResolution();
		document.getElementById(_this.zoomid).innerHTML += " m";
	}
}
