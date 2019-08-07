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
var config = {
	"router": {
		"proj": 'project/geotrygon/',
		"uri":  '../../'
	},
	"loader": {
		"designerPatterns": [
			'Singleton'
		],
		"base" : [
			'Class',
			'Factory',
			'Router',
			'Loader',
			'Base'
		],
		"Format": [
			'Format',
			'FormatON'
		],
		"communicator": [
			'Communicator',
			'Communicator.HtmlRPC',
			'Communicator.Ajax'
		],
		"control": [
			'Primal', 
			'App', 
			'Plugin'
		],
		"front" : [
			'FrontController'
		]
	},
	"factory": [
		'OOP',
		'FrontController',
	],
	"NameSpace": "std"
}
/**/
