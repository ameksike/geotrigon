<?php
/*
F	900
L	3

X0	-9202669.387230758
Y0	2605749.5965445517
D0	0

X1	-9180917.895529963
Y1	2613843.888765
D1	23208.72589694965

X2	-9154474.905619191
Y2	2610719.7759781606
D2	49835.62575641669
*/
//-----------------------------------------------------------------------------
class Perfil extends Plugin 
{
    private $SerieP;
    private $SerieA;
    private $CoordInter;

    public function __construct() 
    {
        parent::__construct();
	$this->SerieP      = array();
	$this->SerieA      = array();
	$this->CoordInter  = array();
	$this->layerId     = "relieve";
    }

    public function getHeightProfile($params)  
    {
	if($params)
	{	
		$LD = 0;
		$FD = $requ->Factor;
		$this->CoordInter[0] = $requ->Coordenadas[0];
		//--- Recepcion de datos del Cliente PHP ------------------------------
		$L = count($requ->Coordenadas);
		for($i=0; $i<$L-1; $i++)
		{
			$DS = $requ->Coordenadas[$i+1]['D']-$requ->Coordenadas[$i]['D'];
			if($DS < $FD) $MD = 0;
			else
			{
				$MD = round($DS/$FD);
				$X  = $requ->Coordenadas[$i]['X'];
				$Y  = $requ->Coordenadas[$i]['Y'];
				$DX = ($requ->Coordenadas[$i+1]['X'] - $X)/$MD;
				$DY = ($requ->Coordenadas[$i+1]['Y'] - $Y)/$MD;
			}

			$this->setSerie($i, $requ);

			for($j=0; $j<$MD; $j++)
			{	
				$this->CoordInter[$LD+1]['X'] = $DX + $this->CoordInter[$LD]['X'];
				$this->CoordInter[$LD+1]['Y'] = $DY + $this->CoordInter[$LD]['Y'];
				$NX = $this->CoordInter[$LD]['X'];
				$NY = $this->CoordInter[$LD]['Y'];

				if($NX!=$X && $NY!=$Y)
				{
					$C  = count($this->SerieA);
					$this->SerieA[$C][0] = $LD * $FD;
					$this->SerieA[$C][1] = $this->QueryByPoint($NX,$NY);
					$this->SerieA[$C][2] = $NX;
					$this->SerieA[$C][3] = $NY;
				}$LD++;
			}
		}	
		$this->setSerie($L-1, $requ);

		$PerfilResult = new PerfilResult();
		$PerfilResult->SerialPunto = $this->SerieP;
		$PerfilResult->SerialArea  = $this->SerieA;
        	return $PerfilResult;
         }
    }
    //-------------------------------------------------------------------------
    public function setSerie($i, $requ)
    {
		$X  = $requ->Coordenadas[$i]['X'];
		$Y  = $requ->Coordenadas[$i]['Y'];
		$H  = $this->QueryByPoint($X,$Y);
		$D  = $requ->Coordenadas[$i]['D'];
		$C  = count($this->SerieA);

		$this->SerieP[$i][0] = $D;
		$this->SerieP[$i][1] = $H;

		$this->SerieA[$C][0] = $D;
		$this->SerieA[$C][1] = $H;
		$this->SerieA[$C][2] = $X;
		$this->SerieA[$C][3] = $Y;
    }
    //-------------------------------------------------------------------------
    private function QueryByPoint($X, $Y)
    {
    		//ms_ResetErrorList();
		$Haltura = 0;
		$msPoint = ms_newPointObj();
		$msPoint->setXY($X, $Y);
		
		$msMapObj   = $this->serverContext->getMapObj();
		$layersInit = $this->serverContext->getMapInfo()->layersInit;
		$msLayer    = $layersInit->getMsLayerById($msMapObj, $this->layerId);
		$status     = $msLayer->status;
		$msLayer->set('status', MS_ON);

		$msMapObj->preparequery();
		$QResult = @$msLayer->queryByPoint($msPoint, MS_SINGLE, -1);
		
		if ($QResult == MS_SUCCESS)
		{
			$msLayer->open();
			$NResult = $msLayer->getNumResults();
			if ($NResult) 
			{
				$Result  = $msLayer->getResult(0);
				$Shape   = $msLayer->getShape($Result->tileindex, $Result->shapeindex);
		    		$Haltura = $Shape->values["value_0"];
				$Shape->free();
			}  
			$msLayer->close();
		} 
		//ms_ResetErrorList();
		$msLayer->set('status', $status);
		return $Haltura; 
    }
}
//-----------------------------------------------------------------------------
?>
