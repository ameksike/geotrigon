<?php
	unset($config);
	$config["db"]["server"] = 'localhost';
	$config["db"]["name"]   = 'work';
	$config["db"]["port"]   = '5432';
	$config["db"]["user"]   = 'postgres';
	$config["db"]["passw"]  = 'postgres';

	$config["map"]["name"]  = 'qba.map';
	$config["map"]["path"]  = 'server/common/data/';

	$config["plugins"][]  = "Layer";
	$config["plugins"][]  = "Map";
	$config["plugins"][]  = "Navigation";
	$config["plugins"][]  = "Info";
	$config["plugins"][]  = "Perfil";
	$config["plugins"][]  = "Query";
	$config["plugins"][]  = "ThematicRaster";
	$config["plugins"][]  = "Contour";
	$config["plugins"][]  = "ClosestDegree";
	$config["plugins"][]  = "Measure";
	/*$config["plugins"][]  = "Rutas"; modulo de ejemplo*/
	return $config;
?>
