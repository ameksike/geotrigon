<?php
	class Vector 
	{
		private $color;
		public function __construct() {
			$this->color = "red";

		}

		public function update($params)
		{
			return array(
				'action'=>'update'
			);
		}

		public function getColor()
		{
			return $this->color;
		}
	}
?>

