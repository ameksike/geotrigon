/**
 *
 * Description: Splash es una clase para la administracion de Splash
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 03/06/2010
 * Update Date: 
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */
var Splash = function(params)
{
	var _this = this;
	this.div  = params.div ? params.div : false;
	this.wait = params.wait ? params.wait : false;
	this.time = params.time ? params.time : 500;

	this.show = function(src, callback)
	{
		var splash = document.createElement("img");
		splash.src = src;
		splash.id  = "splash";

		if(!_this.div) _this.div = document.createElement("div");
		_this.div.align = "center";
		_this.div.style.marginTop = "15%";
		_this.div.style.display = true;
		_this.div.id  = "splash";
		_this.div.appendChild(splash);

		_this.div.appendChild(splash);
		document.body.appendChild(_this.div);

		if(_this.wait) _this.waitAndHide(callback);
	}

	this.hide = function()
	{
		_this.div.innerHTML = "";
	}

	this.waitAndHide = function(callback)
	{
		setTimeout(function(){
			_this.div.innerHTML = "";
			if(callback) callback();
		},_this.time);
	}
}
