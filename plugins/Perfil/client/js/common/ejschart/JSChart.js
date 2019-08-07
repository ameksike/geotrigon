//.......... Objetos .......................................................................
var ObjChart;
var AreaSeries;
var PuntoSeries;
var LineaSeries;
//.......... Variables .....................................................................
var JSMax_Ey;
var JSMax_Ex;
var JSTitle  = "";
var JSATitle = "";
var JSLTitle = "";
var JSPTitle = "";
var JSLegend = false;
var JSArrayDataHandler;
//.......... Funxiones .....................................................................
var Set_DataHandler  = function(JSListData)
{
	if(JSListData)
	{
		this.JSMax_Ex = 0;
		this.JSMax_Ey = parseInt(JSListData[0][1]);
		for(var i=0; i<JSListData.length; i++)
		{
			if(this.JSMax_Ey < parseInt(JSListData[i][1]))
				this.JSMax_Ey = parseInt(JSListData[i][1]);

			if(JSMax_Ex < parseInt(JSListData[i][0]))
				this.JSMax_Ex = parseInt(JSListData[i][0]);
		}
		this.JSArrayDataHandler = new EJSC.ArrayDataHandler(JSListData);
		this.JSMax_Ey += this.JSMax_Ey/10;
	}
}
//------------------------------------------------------------------------------------------
var Set_Extremes = function (factor)
{
	ExY = this.JSMax_Ex * factor/ 100;
	this.ObjChart.axis_left.setExtremes(0, ExY);
	this.ObjChart.redraw(true);
}
//------------------------------------------------------------------------------------------
var Ajustar_Extremes = function ()
{
	this.ObjChart.axis_left.setExtremes( 0, this.JSMax_Ey );
	this.ObjChart.axis_bottom.setExtremes( 0, this.JSMax_Ex );
}
//------------------------------------------------------------------------------------------
var Ajustar_Dimenciones = function (Ancho, Alto)
{
	document.getElementById(Obj_Div).style.width  = Ancho;
	document.getElementById(Obj_Div).style.height = Alto;
}
//------------------------------------------------------------------------------------------
var Preparar_Grafica = function(Obj_Div, vJSTitle, vJSLegend, vsImgURL)
{
	if(vJSTitle)  this.JSTitle  = vJSTitle;
	if(vJSLegend) this.JSLegend = vJSLegend;
	//----------------------------------------- Construcion del Objeto Grafico ---------
	if(Obj_Div && !this.ObjChart)
		this.ObjChart = new EJSC.Chart( 
			Obj_Div, 
			{
				title: this.JSTitle,
				x_axis: "bottom",
				y_axis: "left",
				axis_top: { caption:"", visible:true, size:0, border:{thickness:2, color:"#000"} },
				axis_right: { caption:"", visible:true, size:1, border:{thickness:2, color:"#000"} },
				axis_bottom: { caption:"", crosshair:{show:true}, visible:true, max_extreme:this.JSMax_Ex, border:{thickness:2, color:"#000"}},
				axis_left: { caption:"", crosshair:{show:true},	size:10, min_extreme:0, max_extreme:this.JSMax_Ey, border:{thickness:2, color:"#000"}},
				building_message: "Construyemdo la Grafica...",
				max_zoom_message: "Escroleando la Grafica...",
				drawing_message:  "Dibujando la Grafica...",
				allow_interactivity: true,
				allow_move: true, 
				allow_zoom: true,
				auto_resize: true,
				auto_find_point_by_x: true,
				show_hints: true,
				show_legend: this.JSLegend,
				background: { color: "#FFF", opacity:100, includeTitle: false },
	  			grid:{thickness:1, color:"rgb(0,0,230)", opacity:100, show:false }
			}
		);
	//-----------------------------------------------------------
	this.ObjChart.hideTitlebar();
	if(vsImgURL!="") 
	{
		url = 'url('+vsImgURL+')';
		document.getElementById(Obj_Div).style.background = url; //backgroundImage
	}
	//---------------- Eventos -------------------------------------------
	this.ObjChart.onBeforeBuild = function()
	{
		//-----------------
	}
	//-----------------------------------------------------------
	onAfterMove = function(chart)
	{
		//-----------------
	}
	//-----------------------------------------------------------
	this.ObjChart.onDblClickPoint = function(point)
	{
		//-----------------
	}
	//-----------------------------------------------------------
	this.ObjChart.onAfterSelectPoint = function(point)
	{
		Actualizar(point);
		var cadena = "Perfil de Altura: "+point.y+" (m)"
		AreaSeries.title  = cadena;
		PuntoSeries.title = cadena;
	}
	//-----------------------------------------------------------
}
//..........................................................................................
var Graficar_Area = function(vJSTitle)
{		
    	if(this.JSArrayDataHandler)
	{
		if(vJSTitle)  this.JSATitle  = vJSTitle;
		//-----------------------------------------------------------
		if(!AreaSeries && this.JSArrayDataHandler)
		{
			AreaSeries = new EJSC.AreaSeries(
				this.JSArrayDataHandler,
				{
					title: this.JSATitle,
					color: 'rgb(20,200,200)',
					fillColor: 'rgb(200,0,0)',
					lock: {color: 'rgb(0,0,0)', offset:5, opacity:100, size:6, visible:false},
					lineWidth: 2,
					drawPoints: false,
					pointSize: 0,
					range: {borderColor:'rgb(255,0,255)' ,borderOpacity:100, borderWidth:1, offset:0, opacity:100, style:'doughnut', thickness:15 }, 
					borderColor: 'rgb(255,0,0)',
					pointBorderColor: 'rgb(255,0,0)'
				});
			//--------------------------------------------------
			this.ObjChart.addSeries(AreaSeries);
		}
		else   
		{
			Ajustar_Extremes();
			AreaSeries.setDataHandler(this.JSArrayDataHandler, true);
		}
	}
}
//..........................................................................................
var Graficar_Punto = function(vJSTitle)
{
    	if(this.JSArrayDataHandler)
	{
		if(vJSTitle)  this.JSPTitle  = vJSTitle;
		if(!PuntoSeries)
		{
			PuntoSeries = new EJSC.ScatterSeries(
				this.JSArrayDataHandler,
				{
					title: this.JSPTitle,
					drawPoints: true,
					lineWidth: 0,
					pointStyle: "diamond",
					pointSize: 2.5,
					color: 'rgb(255,0,0)'
				}
			);
			//--------------------------------------------------
			this.ObjChart.addSeries(PuntoSeries);
		}
		else
		{
			Ajustar_Extremes();
			PuntoSeries.setDataHandler(this.JSArrayDataHandler, true);
		}
	}
}
//..........................................................................................
var Graficar_Linea = function(vJSTitle)
{
    	if(this.JSArrayDataHandler)
	{
		if(vJSTitle)  this.JSLTitle  = vJSTitle;
		if(!LineaSeries && this.JSArrayDataHandler)
		{
			LineaSeries = new EJSC.LineSeries(
				this.JSArrayDataHandler,
				{
					title: this.JSLTitle,
					drawPoints: true,
					lineWidth: 0,
					pointSize: 0,
					color: 'rgb(100,0,255)'
				}
			);
			//--------------------------------------------------
			this.ObjChart.addSeries(LineaSeries);
		}
		else
		{
			Ajustar_Extremes();
			LineaSeries.setDataHandler(this.JSArrayDataHandler, true);
		}
	}
}
//..........................................................................................
