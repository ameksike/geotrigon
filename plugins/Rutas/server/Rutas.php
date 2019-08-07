<?php
	class Rutas extends Plugin implements Security
	{
		public function __construct() {}

		public function reedRegistro($params)
		{
			// utilizar el recurso para administrar los ficheros de configuracion
			/// $confobj = $this->getConfigDriver();
			$confobj = DriverManager::factory("ConfigManager");
			$mainconf = $confobj->loadConfig("Main");
			$rutaconf = $confobj->loadConfig();

			// utilizar el recurso para administrar ficheros
			$pathf = Router::module("Rutas");
			$file = DriverManager::factory("File", $pathf."server/common/Raster.bit");
			$dataf = $file->reed();/**/
			// utilizar el recurso Doctrine para administrar db
			
			$dbf = DriverManager::factory("Doctrine", "ontuts_doctrine");

			$user = new Users();
			$user->id = 222;
			$user->names = $params->first;
			$user->email = $params->last;
			$user->save();/**/

			$commentsTable = $dbf->getTable('UsersComments');
			$tpl = $commentsTable->findAll();

			//print_r($tpl);die("AA");
			// utilizar el recurso para administrar db
			$dbf = DriverManager::factory("PgSQL", $mainconf["db"]["name"]);
			$result = $dbf->executeSQL("SELECT nombre, edad, ci FROM person",1);

			return array(
				'first'=>$rutaconf["tree"],
				'last'=>$rutaconf["node"],
				'file'=>$dataf,
				'dbout'=>$result
			);
		}

		public function showRegistro($params)
		{
			// utilizar el recurso de inclusion automatica en el directorio include
			$vector = new Vector();
			$raster = new Raster();
			$routin = new Routin($vector, $raster);
			$tastic = new Persona(); // global para la app

			return array(
				'first' =>$params->first,
				'last'  =>$params->last,
				'rgb'   =>$routin->getRaster()->getRGB(),
				'color' =>$routin->getVector()->getColor(),
				'name'  =>$tastic->getName()
			);
		}

		public function admninRout()
		{
			return "info en texto plano";
		}

		public function allow($certy, $acction) 
		{ // utilizar el recurso de seguridad a nivel de funciones
			switch($acction)
			{
				case "admninRout" : return true; break;
				case "showRegistro" :
					if($certy == "65645645")
						return true;
					else return false;
				break;
				case "reedRegistro" :
					if($certy == "232324877")
						return true;
					else return false;
				break;
				default: return false; break;
			}
			
		}

		public function allowFailed($certy, $acction) {
			return "No esta autorizado";
		}
	}
?>
