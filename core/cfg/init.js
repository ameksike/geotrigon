/**
 *
 * $framework: Ksike
 * $package: Core
 * $subpackage: config
 * $version: 0.1

 * $description: Este es el cargador inicial para todos los modulos del framework Ksike
 * $authors: ing. Antonio Membrides Espinosa
 * $making-Date: 01/06/2010
 * $update-Date: 01/09/2010
 * $license: GPL v3
 *
 */
var uri = '../../';
var std  = new Kcl.Core();
std.require([
		uri+'core/js/DesignerPatterns/Singleton.js',
		uri+'core/js/Class.js',
		uri+'core/js/Factory.js',
		uri+'core/js/Router.js',
		uri+'core/js/Loader.js',
		uri+'core/js/Base.js',
		uri+'core/js/Format.js',
		uri+'core/js/Format.JSON.js',
		uri+'core/js/Communicator.js',
		uri+'core/js/Communicator.HtmlRPC.js',
		uri+'core/js/Communicator.Ajax.js',
		uri+'core/js/Primal.js', 
		uri+'core/js/Plugin.js'
	],function(){
		std = new Kcl.Base({'uri':uri, 'proj':'project/geotrygon/'});
		std.load([
			'OOP',
			'FrontController',
			//{'name':'FrontController','params': {'driver':'HtmlRPC'} },
			{'name':'App',  'build':false},
			{'name':'Main', 'type':'plugin'}
		]);
});

