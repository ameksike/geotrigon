<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Layer
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
class Layer extends Plugin
{
	private $msMapObj;
	private $layerPath;
	private $order;	
	private $nEspanded;	

	public function __construct() 
	{
		$this->order = array();
		$this->layerPath = kcl::router("this");
		$conf = kcl::package("config")->Main;
		$mapPath = kcl::router("module", "Map");
		$this->msMapObj = ms_newMapObj($mapPath.$conf["map"]["path"].$conf["map"]["name"]);
	}

	public function writeMap($params)
	{
		foreach($params->lst as $i) $this->updateLayers($i->lst, $i->text);
		if(!$params->reorder) $this->msMapObj->setlayersdrawingorder($this->order);
		$conf = kcl::package("config")->Main;
		$this->msMapObj->save($conf["map"]["name"]);
	}

	public function updateLayers($lays, $group)
	{
		foreach($lays as $i)
		{
			$objLayer = $this->msMapObj->getLayerByName($i->text);
			$this->order[] = $objLayer->index;
			if($objLayer){$objLayer->set("status", $i->status);
			$objLayer->set("group", $group);}
			if(isset($i->lst)) if(count ($i->lst)>0) $this->updateClass($i->lst, $objLayer);
		}
	}

	public function updateClass($cls, $lay)
	{
		foreach($cls as $i)
		{
			$cl = $lay->getclass($i->index);
			if($cl)$cl->set("status", $i->status);
		}
	}

	public function load($params)
	{
		if($params) $this->nEspanded = $params->nEspanded;
		return array(
			"action"=> "update",
			"nodesList"=> $this->readMap(),
			"nodesEspanded"=> $params ? $params->nEspanded : null
		);
	}

	public function readMap()
	{
		for( $i=0; $i < $this->msMapObj->numlayers; $i++)
		{
			$obj = $this->msMapObj->getLayer($i);
			$list[$obj->group]['type']   = 'msgroup';
			$list[$obj->group]['text']   = $obj->group;
			$list[$obj->group]['expanded'] = in_array($obj->group, $this->nEspanded) ? true : false; 
			$list[$obj->group]['list'][] = $this->getLayer($obj, $list[$obj->group]['checked']);
		}
		return $list;
	}

	private function getLayer($obj, &$check)
	{
		
		$layer['type'] = "mslayer";
		$layer['text'] = $obj->name;
		$layer['index'] = $obj->index;
		$layer['checked']= $obj->status ? true : false;
		$layer['edit'] = $obj->template;
		if($obj->numclasses > 1)  $layer['expanded'] = in_array($obj->name, $this->nEspanded) ? true : false; 
		if($obj->numclasses > 1)  $layer['list'] = $this->getClassList($obj);
		if($obj->numclasses == 1) $layer['icon'] = $this->iconPath($obj->getClass(0), $obj->index); else $layer['icon'] = "";
		$check = $check || $layer['checked'];

		return $layer;
	}

	private function getClassList($objLayer) 
	{	
		$class = array();
		if($objLayer->numclasses > 1) for($i=0; $i<$objLayer->numclasses; $i++)
		{
			$objClass = $objLayer->getClass($i);
			$class[] = array(
			    'text'=> $objClass->name,
			    'index' => $i,
			    'draggable' => false,
			    'type'=> "msclass",
			    'checked'=> $objClass->status ? true : false,
			    'icon'=> $this->iconPath($objClass, $objLayer->index."-".$i)
			);
		}
		return $class;
	}

	private function iconPath($objClass, $id) 
	{
		$conf = kcl::package("config")->this;
		$iconPath = $this->layerPath.$conf['class']['path'].$id.'.png';
		//if(is_writable($iconPath)) print_r("si-w "); else print_r("no-w ");
		if(is_writable($iconPath)) $objClass->createLegendIcon($this->msMapObj->keysizex, $this->msMapObj->keysizey)->saveImage($iconPath);
		$iconPath = $id.'.png';
		return $iconPath;
	}
}
