/**
 *
 * Description: MapControls es una clase para la administracion de 
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 15/05/2010
 * Update Date: 
 *
 * @package: plugins
 * @subpackage: Navigation
 * @version:
 *
 */
//-------------------------------------------------------------------------
/*std.include("plugins/Navigation/client/js/common/controls/MapBox.js");
std.include("plugins/Navigation/client/js/common/controls/MapPan.js");
std.include("plugins/Navigation/client/js/common/controls/MapRecenter.js");
std.include("plugins/Navigation/client/js/common/controls/MapZoomOut.js");*/
//-------------------------------------------------------------------------
var MapControls = function(map, tbar)
{
	var _this = this;
	this.map = map;
	this.actions = { update: new Array() };
	this.history = new Array();

        var activeHistory = function (){
            if(_this.history.length > 0){
               if(_this.pos == 0 && _this.history.length == 1){
                    tbar.setStatus(false, 'Next');
                    tbar.setStatus(true, 'Back');
                }
               else
                   if(_this.pos == 0){
                        tbar.setStatus(true, 'Next');
                        tbar.setStatus(false, 'Back');
                   }
               else
                if(_this.pos == _this.history.length - 1){
                        tbar.setStatus(false, 'Next');
                        tbar.setStatus(true, 'Back');
                    }
                else if(_this.pos > 0 && _this.pos < _this.history.length){
                    tbar.setStatus(true, 'Next');
                    tbar.setStatus(true, 'Back');
                }
            }

        };

	this.saveHistory = function()
	{
	    _this.history.push( { coor:_this.map.getCenter(), zoom:_this.map.getZoom()} );
	    _this.pos = _this.history.length -1;
            activeHistory();
	}

	this.update = function(evt)
	{
	    for(var i=0; i<_this.actions.update.length; i++)
		eval(_this.actions.update[i]+"();");            
	}

	this.doNext = function()
	{
		if((++_this.pos) < _this.history.length)
			_this.map.moveTo(_this.history[_this.pos].coor, _this.history[_this.pos].zoom);
		else _this.pos = _this.history.length -1;
                activeHistory();
	}

	this.doBack = function()
	{
		if(--_this.pos >= 0)
                    _this.map.moveTo(_this.history[_this.pos].coor, _this.history[_this.pos].zoom);
		else _this.pos = 0;
                activeHistory();
	}

	this.doZoomInbox = function(action)
	{
		_this.map.mode = "box";
		_this.map.div.style.cursor = "crosshair";
		if(action) this.actions.push(action);
		if(!_this.objZoomBox) _this.objZoomBox = new MapBox(_this.map, function(bounds){
			_this.map.zoomToExtent(new OpenLayers.Bounds(bounds.left, bounds.bottom, bounds.right, bounds.top));
			_this.saveHistory();
			_this.update();
		});
	}

	this.doZoomOut = function(action)
	{
		_this.map.mode = "zoomout";
		_this.map.div.style.cursor = "default";
		if(action) this.actions.push(action);
		if(!_this.objZoomOut) _this.objZoomOut = new MapZoomOut(_this.map, function(){
			_this.saveHistory();
			_this.update();
		});
	}

	this.doPan = function(action)
	{
		_this.map.mode = "pan";
		_this.map.div.style.cursor = "move";
		if(action) this.actions.push(action);
		if(!_this.objPan) _this.objPan = new MapPan(_this.map, function(){_this.saveHistory();});
	}

	this.doRecenter = function(action)
	{
		_this.map.mode = "recenter";
		_this.map.div.style.cursor = "default";
		if(action) this.actions.push(action);
		if(!_this.objRecenter) _this.objRecenter = new MapRecenter(_this.map, function(){_this.saveHistory();});
	}

	this.doFullExtent = function(action)
	{
		_this.map.div.style.cursor = "default";
		_this.map.zoomToMaxExtent(); 
		if(action) action();
		else this.update();
		_this.saveHistory();
	}
}
