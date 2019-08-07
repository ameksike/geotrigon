
MeasureGUI.prototype.construct = function()
{
	var _that = MeasureGUI.prototype;
	if(!_that.controls.distance) _that.controls.distance = new PolyLineMeasure();
	if(!_that.controls.area) _that.controls.area = new PolygonMeasure();
	_that.setControls();
	// set even controls
	_that.controls.distance.onClic2 = function(lst){_that.showDistance(lst);};
	_that.controls.area.onClic2 = function(lst){_that.showArea(lst);};
	// initialice geodesic property 
	//_that.setGeodesic(false);
	_that.window = new WMeasureResult("Resultado de las mediciones");
}

MeasureGUI.prototype.distance = function()
{
	var _that = MeasureGUI.prototype;
	_that.controlOff();
	if(_that.controls.distance) _that.controls.distance.obj.activate();
}

MeasureGUI.prototype.area = function()
{
	var _that = MeasureGUI.prototype;
	_that.controlOff();
	if(_that.controls.area) _that.controls.area.obj.activate();
}

MeasureGUI.prototype.asimut = function(){}

MeasureGUI.prototype.controlOff = function()
{
	var _that = MeasureGUI.prototype;
	for(var i in _that.controls)if(i!="remove")
		_that.controls[i].obj.deactivate();		
}

MeasureGUI.prototype.setGeodesic = function(status)
{
	var _that = MeasureGUI.prototype;
	for(var i in _that.controls)if(i!="remove")
		_that.controls[i].obj.geodesic = status;		
}

MeasureGUI.prototype.setControls = function()
{
	var _that = MeasureGUI.prototype;
	for(var i in _that.controls)if(i!="remove")
		_that.map.addControl(_that.controls[i].obj);				
}


MeasureGUI.prototype.showDistance  = function(lst)
{
	var _that = MeasureGUI.prototype;
	_that.window.show(lst);
}

MeasureGUI.prototype.showArea  = function(lst)
{
	var _that = MeasureGUI.prototype;
	_that.window.show(lst);				
}
