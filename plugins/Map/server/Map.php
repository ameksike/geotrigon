<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Map
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
use Ksike\filter\control\Plugin; 
use Ksike\base\helpers\Assist as kcl;
class Map extends Plugin
{
	private $conf;

	public function __construct() {
		if (!extension_loaded("MapScript"))
			dl('php_mapscript.'.PHP_SHLIB_SUFFIX);
		$this->conf = kcl::package("config")->this;
	}

	public function update()
	{
		return array(
			'action'=>'update'
		);
	}

	public function load()
	{
		return array(
			'action'=>'load',
			'box'=>$this->conf["bounds"],
			'projection'=>$this->conf["projection"]
		);
	}

	public function getMap($params)
	{
		ms_ResetErrorList();
		$conf = kcl::package("config")->Main;
		$mapPath = kcl::router("this");
		$size = explode(' ', $_GET['map_size']);
		$extent = explode(' ', $_GET['mapext']);
		if($objMap = ms_newMapObj($mapPath.$conf["map"]["path"].$conf["map"]["name"]))
		{
			$objMap->setSize($size[0], $size[1]);
			$objMap->setExtent($extent[0], $extent[1], $extent[2], $extent[3]);
			$Imagen = @$objMap->draw();
			header("Content-type: image/png");
			if($Imagen) $URL = $Imagen->saveImage('');
		}
		$this->saveLogError();
	}

	private function saveLogError()
	{
		$path = $mapPath = kcl::router("module", "Main")."log/mapscript/";
		$Error = ms_GetErrorObj();
		while($Error && $Error->code!=MS_NOERR)
		{
			$name = "code".$Error->code;
			Log::save(array("Routine"=>$Error->routine, "Description"=>$Error->message), $name, $path);
			$Error = $Error->next();
		}
		ms_ResetErrorList();
	}
}
