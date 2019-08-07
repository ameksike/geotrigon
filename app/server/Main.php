<?php
use Ksike\filter\control\App; 
use Ksike\base\bundles\Package; 
class Main extends App 
{
    public function __construct($mate) 
    {
        parent::__construct($mate);
	//$this->linker->load();
	$this->linker->connect("writeMap","Layer","update","Map",'pos', null);
        $this->linker->connect("update","ThematicRaster","update","Map",'pos', null);
	$this->linker->connect("showRegistro","Rutas","admninRout","Rutas",'pos', null);
    }
    public function index($params) { return "<br>AAAAAAAAA"; }	

    public function allow($certy, $acction) { return true;}
    public function allowFailed() {}
}
?>
