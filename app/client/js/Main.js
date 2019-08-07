//-------------------------------------------------------------------------
Kcl.Class( "Kcl.Main",
{
	extend: Kcl.App,
	behavior: {
		construct : function(eve, loadType){
			var _this = Kcl.Main.prototype;
			_this.splash = new Splash({});
			//std.FrontController.driver="HtmlRPC";
			_this.splash.show("app/client/img/splash.jpg");
			_this.parent.construct.apply(_this, [_this]);

		},
		serverResponse:function(objResponse){
			var _this = Kcl.Main.prototype;
			_this.parent.serverResponse(objResponse);
		},
		onLoadPlugins : function(params){
			var _this = Kcl.Main.prototype;
			_this.gui = new Viewport({title:'<center><table><tr><td><img src="app/client/img/icon.png"></td>&nbsp;<td><img src="app/client/img/logo.png"></td></tr></table></center>'});
			_this.splash.hide();
			_this.gui.buildGUI();
			_this.buildGUI({"gui": _this.gui, "map": "std.mod.Map.obj"});
			//... linker ......................................
			if(_this.mod.Navigation){
				_this.mod.Navigation.olManager.actions.update.push("std.mod.Info.scale.update");
				_this.mod.Navigation.olManager.actions.update.push("std.mod.Info.mapinfo.zoomUpdate");
			}
			if(_this.mod.Map)_this.mod.Map.onLoadEnd = function(){
				if(_this.mod.Info)_this.mod.Info.scale.update();
				if(_this.mod.Info)_this.mod.Info.mapinfo.zoomUpdate();
			}
		}
	}
});

Kcl.Main.require = [
	std.Router.getModulePath()+"css/app.css",
	std.Router.getLibPath()+"ext/css/ext-all.css",
	std.Router.getLibPath()+"ext/js/ext-base.js",
	std.Router.getLibPath()+"ext/js/ext-all.js",
	std.Router.getModulePath()+"js/common/splash.js",
	std.Router.getModulePath()+"js/common/toolBar.js",
	std.Router.getModulePath()+"js/common/viewPort.js"
];
