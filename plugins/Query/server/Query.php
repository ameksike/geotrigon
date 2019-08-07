<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Query
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
class Query extends Plugin {

    private $mapPath;

    public function __construct() {
        ms_ResetErrorList();
        $conf = kcl::package("config")->Main;
        $mapPath = kcl::router("module", "Map");
        $this->mapPath = $mapPath . $conf["map"]["path"] . $conf["map"]["name"];
    }

    private function isDatabaseLayer($msLayer) {
        switch ($msLayer->connectiontype) {
            case MS_POSTGIS:
            case MS_ORACLESPATIAL:
                return true;
        }
        return false;
    }

    public function query($params) {
        if (!$params) {
            foreach ($_POST as $key => $val) {
                $params->{$key} = $val;
            }
        }

        $msMapObj = ms_newMapObj($this->mapPath);
        $msLayer = $msMapObj->getLayerByName($params->layer);

        if ($params->responseAction == "main") {
            $arr = array();
            for ($i = 0; $i < $msMapObj->numlayers; $i++) {
                $layer = $msMapObj->getLayer($i);
                if ($this->isDatabaseLayer($layer))
                    $arr[] = array($layer->name);
            }
            return array('action' => $params->responseAction, 'features' => array(), 'layers' => $arr);
        }

        if ($msLayer && $this->isDatabaseLayer($msLayer)) {
            return $this->queryPostGIS($params);
        }
    }

    public function queryPostGIS($params) {
        // print_r($params);die;
        $msMapObj = ms_newMapObj($this->mapPath);
        $offset = $params->start;
        $limit = $params->limit;
        $layer = $msMapObj->getLayerByName($params->layer);

        $parts = explode("FROM", $layer->data);
        $geom = trim($parts[0]);
        $table = $parts[1];
        $actionResponse = $params->responseAction;
        if ($params->wktFeature) {
            $wkt = $params->wktFeature;
            $geometry = "geometryFromText('" . $wkt . "', ST_SRID(" . $geom . "))";
            $sql = "SELECT * FROM " . $table . " WHERE ST_INTERSECTS(" . $geom . "," . $geometry . ") OFFSET " . $offset . " LIMIT " . $limit;
        } else {
            $sql = "SELECT * FROM " . $table . " limit 1";
        }

        $db = $this->getDB($layer);
        $features = $db->executeSQL($sql, true);
        $length = count($features);

        $array_features = array();
        for ($i = 0; $i < $length; $i++) {
            unset($features[$i][$geom]);
            $str = array();
            foreach ($features[$i] as $key => $value) {
                $str[] = $key . ":'" . $value . "'";
            }
            $array_features[] = "{" . implode(",", $str) . "}";
        }
        if ($params->wktFeature) {
            $sql = "SELECT count(*) as total FROM " . $table . " WHERE ST_INTERSECTS(" . $geom . "," . $geometry . ")";
            $result = $db->executeSQL($sql, true);
            echo "{totalCount:'" . $result[0]['total'] . "', features:[" . implode(",", $array_features) . "]}";
            die;
        }else
            return array('action' => $actionResponse, 'features' => $features, 'layer' => $params->layer);
    }

    private function getDB($layer) {        
        $arr = explode(" ", $layer->connection);
        $db  = DriverManager::factory("PgSQL");
        $length = count($arr);
        for ($i = 0; $i < $length; $i++) {
            $attr = explode("=", $arr[$i]);
            $db->{$attr[0]} = $attr[1];
        }
        return $db;
    }

    private function makeMSShape($params) {
        $pt = ms_newPointObj();
        $ln = ms_newLineObj();
        $strshp = str_replace($params->type, "", $params->wktFeature);
        $strshp = str_replace("(", "", $strshp);
        $strshp = str_replace(")", "", $strshp);

        switch ($params->type) {
            case 'POINT':
                $shp = ms_newShapeObj(MS_SHAPE_POINT);
                break;
            default:
                $shp = ms_newShapeObj(MS_SHAPE_POLYGON);
        }
        $vertices = explode(",", $strshp);
        $length = count($vertices);
        for ($i = 0; $i < $length; $i++) {
            $vertex = explode(" ", $vertices[$i]);
            $pt->setXY($vertex[0], $vertex[1]);
            $ln->add($pt);
        }
        $shp->add($ln);
        return $shp;
    }

    public function queryByMsShape($params, ms_shape_obj $shape) {
        $msMapObj = ms_newMapObj($this->mapPath);
        $offset = $params->start;
        $limit = $params->limit;

        $msLayer = $msMapObj->getLayerByName($params->layer);
        $msLayer->set('status', MS_ON);
        $msLayer->set('tolerance', 0);

        $ret = @$msLayer->queryByShape($shape);

        if ($ret != MS_SUCCESS ||
                $msLayer->getNumResults() == 0)
            return array();

        $results = array();
        $msLayer->open();
        $numResults = $msLayer->getNumResults();
        if (($offset + $limit) <= $numResults) {
            $numResults = $offset + $limit;
        }
        for ($i = $offset; $i < $numResults; $i++) {
            $result = $msLayer->getResult($i);
            $shape = $msLayer->getShape($result->tileindex, $result->shapeindex);
            $results[] = $shape;
        }
        $msLayer->close();

        return $results;
    }
}
?>
