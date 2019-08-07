<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: ThematicRaster
 * @version: 0.1

 * @description: 
 * @authors: ing. Hermes Lazaro Herrera Martinez
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
use Ksike\filter\control\Plugin; 
use Ksike\base\helpers\Assist as kcl;
class ThematicRaster extends Plugin {
    private $mapPath;

    public function __construct() {
        ms_ResetErrorList();
        $conf = kcl::package("config")->Main;
        $mapPath = kcl::router("module", "Map");
        $this->mapPath = $mapPath.$conf["map"]["path"].$conf["map"]["name"];
    }

    public function load($params) {
        $msMap = ms_newMapObj($this->mapPath);
        $numclasses = 0;
        $styles = array();
        if($msMap && isset($params) && isset($params->raster)){
            $layer = $msMap->getLayerByName($params->raster);
            $numclasses = $layer != null?$layer->numclasses:0;
        }   
        for($i=0;$i<$numclasses;$i++) {
            $style = $layer->getClass($i)->getStyle(0);
            $color = array($style->color->red,$style->color->green,$style->color->blue);
            $styles[] = array('min'=>$style->minvalue,'max'=>$style->maxvalue,'color'=>$color);
        }
        $raster = array();
        for($i=0; $i < $msMap->numlayers ;$i++) {
            $layer = $msMap->getLayer($i);
            if($layer->type == MS_LAYER_RASTER) {
                $raster[] = $layer->name;
            }
        }

        return array(
        "action"=> "update",
        "styles"=> $styles,
        "raster"=> $raster,
        "rasterized"=>isset($params->raster)&&($params->raster != null)?"1":null
        );
    }

    public function update($params) {
        $arrObjects = $params->nodes;
        $absdir = str_replace("/ThematicRaster/server","",realpath(dirname(__FILE__)));
        $mapdir = str_replace("../../plugins","",$this->mapPath);

        $msMap = ms_newMapObj($this->mapPath);
        if($msMap) $layer = $msMap->getLayerByName($params->raster);
        $numclasses = $layer->numclasses;

        for($i = $numclasses-1 ; $i >= 0; $i--) {
            $layer->removeClass($i);
        }
        $msMap->save($absdir.$mapdir);
        $length = count($arrObjects);
        for($i=0 ; $i < $length; $i++) {
            $obj = $arrObjects[$i];
            $class = ms_newClassObj($layer);
            $style = ms_newStyleObj($class);
            $style->set('minvalue',$obj->min);
            $style->set('maxvalue',$obj->max);
            $style->set('rangeitem',"[pixel]");
            $style->color->setRGB($obj->color[0],$obj->color[1],$obj->color[2]);
            $class->setexpression("([pixel] > ".$obj->min." AND [pixel] <= ".$obj->max.")");
        }
        $msMap->save($absdir.$mapdir);
    }

}
?>
