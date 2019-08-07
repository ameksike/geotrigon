<?php
	class Routin 
	{
		private $pathMin;
		private $vector;
		private $raster;

		public function __construct($vector, $raster) {
			$this->pathMin = "Tas";
			$this->vector = $vector;
			$this->raster = $raster;
		}

		public function update($params)
		{
			return array(
				'action'=>'update'
			);
		}

		public function load()
		{
			return phpinfo();
		}

		public function getRaster()
		{
			return $this->raster;
		}

		public function getVector()
		{
			return$this->vector;
		}
	}
?>

