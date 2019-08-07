<?php 
    function createMap($tplmap, $map){

	if (!file_exists($tplmap)) {
	    return "Template Map file is not a PHP file or not exists";
	}
	if (!file_exists($map)) {
	    return "Map file that not exists";
	}
	//die('classes: '.$GLOBALS['classes']);
	$phpMap = file_get_contents($tplmap);
	ob_start();
	eval('?> ' . $phpMap . ' <?php ');
	file_put_contents($map, ob_get_contents());
	ob_end_clean();
	return "Saved Map file actions is success";
    }
    
    class msClassTemplate{

	private $dir;
	private $dataRange;
	private $rangeItem;
	private $expr;
	private $color;
	private $rangeColor;

	public function __construct($rangeItem = "pixel"){
	    $this->rangeItem = $rangeItem;
	    $this->color = "255 255 255";
	    $this->rangeColor = "";
	    $this->expr = "[pixel] > 0";
	}
	private function strRange(){
	    return "DATARANGE ".$this->dataRange;
	}
	private function strName(){
	    return 'NAME "range-'.$this->dataRange.'"';
	}
	private function strColor(){
	    return 'COLOR '.$this->color;
	}
	private function strRangeItem(){
	    return 'RANGEITEM "['.$this->rangeItem.']"';
	}
	private function strRangeColor(){
	    return 'COLORRANGE '.$this->rangeColor;
	}
	private function strExpression(){
	    return 'EXPRESSION ('.$this->expr.')';
	}

	public function strTemplate(){
	    $class = "CLASS\n";
	    $class.= $this->strName()."\n";
	    $class.= $this->strExpression()."\n\t";
	    $class.= "STYLE\n\t\t";
	   // $class.= $this->strRange()."\n\t\t";
	    $class.= $this->strRangeItem()."\n\t\t";
	    $class.= $this->strColor()."\n\t";
	    if($this->rangeColor != ""){
	      $class.= $this->strRangeColor()."\n\t";
	    }
	    $class.= "END\nEND\n\n";
	    return $class;
	}

	public function setColor($r,$g,$b){
	    $this->color = $r." ".$g." ".$b;
	}
	public function setExpr($expr){
	    $this->expr = $expr;
	}
	public function setRangeColor($color1, $color2){
	     $this->rangeColor = $color1." ".$color2;
	}
	public function setRange($min,$max){
	    $this->dataRange = $min." ".$max;
	
	   /* $class  = 'CLASS
               NAME "rango 0-20"
               EXPRESSION ([pixel] > 0 AND [pixel] <= 50)
               STYLE
                    DATARANGE 0 50
                    RANGEITEM "[pixel]"
                    COLOR '.rand(0,255).' '.rand(0,255).' '.rand(0,255).'
               END
          END';*/
	}
    }
    class classProperties{
	public $range;
	public $expr;
	public $color;
	public $rangeColor;

	public function __construct(){
	  $this->range = array();
	  $this->color = array();
	  $this->rangeColor = array();
	}
    }
    class msMapTemplate{

	public function createClass($range,$expr,$color,$rangeColor=null){
	    $class = new msClassTemplate();
	    $class->setRange($range['min'],$range['max']);
	    $class->setExpr($expr);
	    $class->setColor($color['r'],$color['g'],$color['b']);
	    if($rangeColor){
		$color = $rangeColor[0];
		$strcolor1 = $color['r']." ".$color['g']." ".$color['b'];
		$color = $rangeColor[1];
		$strcolor2 = $color['r']." ".$color['g']." ".$color['b'];
		$class->setRangeColor($strcolor1,$strcolor2);
	    }
	    return $class->strTemplate();
	}

	public function generateClasses($arrayClassProperties){
	    if($arrayClassProperties){
		$length = count($arrayClassProperties);
		$tmpClasses = "";
		for($i=0; $i<$length; $i++){
		    $class = $arrayClassProperties[$i];
		    if($class->rangeColor)
		      $tmpClasses .= $this->createClass($class->range,$class->expr,$class->color,$class->rangeColor);
		    else
		      $tmpClasses .= $this->createClass($class->range,$class->expr,$class->color);
		}		
	    }
	    return $tmpClasses;
	}
	
	static function createMap($dir,$mapId){    
	    if (!file_exists($dir . $mapId . '.map.php')) {
		// Map file is not a PHP file
		return;
	    }
	    $phpMap = file_get_contents($dir . $mapId . '.map.php');

	    ob_start();
	    eval('?> ' . $phpMap . ' <?php ');
	    file_put_contents($dir . $mapId . '.all.map',ob_get_contents());
	    ob_end_clean();
	}
    }
?>
