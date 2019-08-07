<?php
/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: ClosestDegree
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
class ClosestDegree extends Plugin {

    private $util;
    private $layerId;
    private $mapPath;

    public function __construct() {
        parent::__construct();
        $this->layerId = "relieve";
        $this->util = new ClosestUtil();
        $conf = kcl::package("config")->Main;
        $mapPath = kcl::router("module", "Map");
        $this->mapPath = $mapPath . $conf["map"]["path"] . $conf["map"]["name"];
    }

    public function closest($params) {
        /*
         * Estos parametros de entrada para el algoritmo
         * es preciso definir limites de entrada pq sino
         * hay ejecuciones sin importancia de acuerdo al modelo de datos
         */
        $x1 = -81.68624; //$params->point->x;
        $y1 = 22.78888; //$params->point->y;
        $radius1 = 0.20; //$params->radius; el radio de busqueda maximo es 0.5
        $radius2 = 0.10; //$params->radius; el radio de busqueda maximo es 0.5
        $height = 150; //$params->height; la altura
        $sides = 100; //$params->tolerance; el angulo maximo es 360
        $count = 10; //$params->count;  el desplazamiento minimo es 0.0075
        $rotation = 45; //$params->rotation;
        set_time_limit(300);
        $points = $this->topographicProfile($x1, $y1, $radius1, $radius2, $height, $sides, $count, $rotation);

        return array("action" => "draw", "polygon" => $points);
    }

    public function criticPoints($x1, $y1, $x2, $y2, $delta, $angle, $rotation=0) {
        $points = array();
        $totalpoints = round($this->util->distance($x1, $y1, $x2, $y2) / $delta);

        for ($i = 0; $i <= $totalpoints; $i++) {
            $point = $this->util->pointProfile($x1, $y1, $angle, $rotation, ($i * $delta));
            $points[] = $point;
        }
        return $points;
    }

    public function topographicProfile($x1, $y1, $radius_x, $radius_y, $height, $sides, $counts, $rotation=null) {

        $visPoints = array();
        if ($rotation) {
           $rotation = $rotation*(pi()/180.0);
        } else {
            $rotation = 0;
        }
        $z1 = $this->heightByPoint($x1, $y1);
        for ($i = 0; $i < $sides; $i++) {
            $topPoints = array();
            // $a = (pi()/180); 0 x/2 x x 3x/2 2x
            $angle = ($i * 2.0 * pi() / $sides);
            $fpoint = $this->util->pointProfile($x1, $y1, $angle, $rotation, $radius_x, $radius_y);
            $tdistance = $this->util->distance($x1, $y1, $fpoint[0], $fpoint[1]);
            $los = $this->util->slope($z1, $height, $tdistance);

            //$total = round($radius / $delta);
            $j = 1;
            $k = 1;
            $deltax = (float) $radius_x / $counts;
            $deltay = (float) $radius_y / $counts;
            while (($j * $deltax) <= $radius_x && ($k * $deltay) <= $radius_y) {
                $point = $this->util->pointProfile($x1, $y1, $angle, $rotation, $j * $deltax, $k * $deltay);
                if ($radius_x == $radius_y)
                    $d = $j * $deltax;
                else
                    $d = $this->util->distance($x1, $y1, $point[0], $point[1]);

                $z2 = $this->heightByPoint($point[0], $point[1]);
                $currentSlope = $this->util->slope($z1, $z2, $d);

                $visible = $point;
                if ($currentSlope > $los) { //refino solucion heu. BB hasta el limite del modelo
                    $fx = $point[0];
                    $fy = $point[1];
                    $point = $this->util->pointProfile($x1, $y1, $angle, $rotation, ($j - 1) * $deltax, ($k - 1) * $deltay);
                    $ix = $point[0];
                    $iy = $point[1];
                    while (abs($fx - $ix) > 0.00085) {
                        $mx = (float) ($ix + $fx) / 2.0;
                        $my = (float) ($iy + $fy) / 2.0;

                        $z2 = $this->heightByPoint($mx, $my);
                        $d = $this->util->distance($x1, $y1, $mx, $my);
                        $slope = $this->util->slope($z1, $z2, $d);

                        if ($slope > $los) {
                            $fx = $mx;
                            $fy = $my;
                        }
                        if ($slope <= $los) {
                            $ix = $mx;
                            $iy = $my;
                        }
                    }; //menor o igual a 200m -> 0.0019
                    //menor o igual a  90m -> 0.00085
                    $visible = array($mx, $my);
                    break;
                };
                $j++;
                $k++;
            }
            $visPoints[] = $visible;
            //break;
        } //die;
        return $visPoints;
    }

    //-------------------------------------------------------------------------
    private function heightByPoint($X, $Y) {

        $Haltura = 0;
        $msPoint = ms_newPointObj();
        $msPoint->setXY($X, $Y);

        $msMapObj = ms_newMapObj($this->mapPath);
        if($msMapObj){ //... parche membridesco
		$msLayer = $msMapObj->getLayerByName($this->layerId);
		$status = $msLayer->status;
		$msLayer->set('status', MS_ON);

		$msMapObj->preparequery();
		$QResult = @$msLayer->queryByPoint($msPoint, MS_SINGLE, -1);

		if ($QResult == MS_SUCCESS) {
		    $msLayer->open();
		    $NResult = $msLayer->getNumResults();
		    if ($NResult) {
		        $Result = $msLayer->getResult(0);
		        $Shape = $msLayer->getShape($Result->tileindex, $Result->shapeindex);
		        $Haltura = $Shape->values["value_0"];
		        $Shape->free();
		    }
		    $msLayer->close();
		}
		//ms_ResetErrorList();
		$msLayer->set('status', $status);
	}
        return $Haltura;
    }

}

//-----------------------------------------------------------------------------
?>
