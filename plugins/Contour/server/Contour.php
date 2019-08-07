<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Contour
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
class Contour extends Plugin {
    private $mapPath;

    public function __construct() {
        ms_ResetErrorList();
        $conf = kcl::package("config")->Main;
        $mapPath = kcl::router("module", "Map");
        $this->mapPath = $mapPath.$conf["map"]["path"].$conf["map"]["name"];
    }

    public function drawingContour($params) {

        $absdir = str_replace("/Contour/server","",realpath(dirname(__FILE__)));
        $mapdir = str_replace("../../plugins","",$this->mapPath);
        $stColor = explode(",",$params->color);
        $stOutlineColor = explode(",",$params->outlinecolor);
        $stLabelColor = explode(",",$params->labelcolor);

        $data_location = $this->makeContour($params);

        $msMapObj = ms_newMapObj($this->mapPath);
        $msNewLayer = $msMapObj->getLayerByName("Contour_".$params->raster);
        if(!$msNewLayer) {
            $msNewLayer = ms_newLayerObj($msMapObj);
            $msNewLayer->set('name', "Contour_".$params->raster);
            $msNewLayer->set('group', 'Contour');
            $msNewLayer->set('template', 'user');
            $msNewLayer->set('opacity', 80);
            $msNewLayer->set('type', MS_LAYER_LINE);
            $msNewLayer->set('status', MS_ON);
            $msNewLayer->set('labelitem',"elev");
            $msclass = ms_newClassObj($msNewLayer);
            $msclass->label->set("type",MS_TRUETYPE);
            $msclass->label->set("antialias",MS_TRUE);
            $msclass->label->set("font","Vera");
            // $msclass->label->set("force",MS_TRUE);
            $msclass->label->set("size",$params->labelsize);
            $msclass->label->set("position",MS_UC);
            $msclass->label->color->setRGB($stLabelColor[0],$stLabelColor[1],$stLabelColor[2]);

            $style = ms_newStyleObj($msclass);
            $style->set("antialias",MS_TRUE);
            $style->color->setRGB($stColor[0],$stColor[1],$stColor[2]);
            $style->outlinecolor->setRGB($stOutlineColor[0],$stOutlineColor[1],$stOutlineColor[2]);
        }
        else {
	    $msNewLayer->getClass(0)->label->set("size",$params->labelsize);
            $msNewLayer->getClass(0)->label->color->setRGB($stLabelColor[0],$stLabelColor[1],$stLabelColor[2]);
            $msNewLayer->getClass(0)->getStyle(0)->color->setRGB($stColor[0],$stColor[1],$stColor[2]);
            $msNewLayer->getClass(0)->getStyle(0)->outlinecolor->setRGB($stOutlineColor[0],$stOutlineColor[1],$stOutlineColor[2]);
        }
        $msNewLayer->set('data',$data_location);
        $msMapObj->save($absdir.$mapdir);

        return array("location"=>$data_location);
    }

    public function makeContour($params) {
        $path = str_replace("Contour/server","",realpath(dirname(__FILE__)));
        $map_path = kcl::router("module", "Map");
        $location = "";
        $msMapObj = ms_newMapObj($this->mapPath);

        if(!$msMapObj) return;
        $msLayer = $msMapObj->getLayerByName($params->raster);
        if(!$msLayer)return;

        $msPoint = ms_newPointObj();
        $msPoint->setXY($params->point->x, $params->point->y);
        $msLayer->set('status', MS_ON);
        $msMapObj->preparequery();
        $qresult = @$msLayer->queryByPoint($msPoint, MS_SINGLE, -1);

        if ($qresult == MS_SUCCESS) {
            $msLayer->open();
            $result  = $msLayer->getResult(0);
            $shape   = $msLayer->getShape($result->tileindex, $result->shapeindex);
            $location = $shape->values['location'];
            $msLayer->close();
        }
        $parts = explode("/",$location);
        $name_file = $parts[count($parts)-1];
        $file_cache_path = "Map/server/common/data/data/gdal/ogr/shp/".$name_file.".c".$params->delta.".shp";

        if(!file_exists($path.$file_cache_path)) {
            $dir1 = $map_path."server/common/data/data/gdal/".$location;
            $dir2 = $map_path."server/common/data/data/gdal/ogr/shp/".$name_file.".c".$params->delta.".shp";

            $cmd = "gdal_contour -i ".$params->delta." -snodata 32767 -a elev ".$dir1." ".$dir2;
            exec($cmd);
        }
        return "ogr/shp/".$name_file.".c".$params->delta.".shp";
    }

}
?>
