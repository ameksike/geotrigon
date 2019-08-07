//-----------------------------------------------------------------------------------------------
var LstCoord;
var Factor = 900;
var store1;
var store2;
var Accion1;
var Accion2;
var closeWindow;
var ComboBox1;
var ComboBox2;
//-----------------------------------------------------------------------------------------------
var dataSerie = {
	SA : new Array(),
	SP : new Array()
}
//---------------------------------------------------------------------------
var storeExpload = function(listD, value)
{
	if(ComboBox2) store2 = ComboBox2.getStore();
	if(store2)
	{
		store2.removeAll();
		ComboBox2.setValue(value);
		store2.loadData(listD);
	}
}
//---------------------------------------------------------------------------
var Actualizar =  function(point)
{
	p = Buscar(point.x);
	if(p)
	{
		serial = dataSerie.SA[Factor];
		x = serial[p][2];
		y = serial[p][3];
		document.getElementById("d").innerHTML='<span><b>Distancia Acumulada (m): </b>'+point.x+'</span>';
		document.getElementById("h").innerHTML='<span><b>Perfil de Altura (m): </b>'+point.y+'</span>';
		document.getElementById("c").innerHTML= "<b>Coordenates(degree):</b>"+x+" / "+y;
	}
}
//---------------------------------------------------------------------------
var Buscar = function(Y)
{
	var pos=0;
	var array = dataSerie.SA[Factor];
	if(array) for(var i=0; i<array.length; i++)
	{
		z = array[i][0];
		if( parseInt(z) != parseInt(Y)) pos++;
		else return pos;
	}else return -1;
}
//---------------------------------------------------------------------------
var Get_Distancia = function()
{
	/*ultimo = Coord.length-1;	
	if(ultimo>=0)
	{
		punto1 = new Point();
		punto2 = new Point();
		punto1.x = Coord[ultimo][0];
		punto1.y = Coord[ultimo][1]; 
		punto2.x = Actual_x;
		punto2.y = Actual_y; 
		return Coord[ultimo][2] + mapconfig.CalculoDist(punto1,punto2);
	}
	else return 0;   */
}
//---------------------------------------------------------------------------
var Dibujar_Grafica = function()
{
	Set_DataHandler(dataSerie.SA[Factor]);
	Graficar_Area("Perfil de Altura");
	Set_DataHandler(dataSerie.SP[Factor]);
	Graficar_Punto("Perfil de Altura");
	//-------------------------------------------------------- Update : Especulacion de altura
	var fact = [
		["0.1"],["0.2"],["0.3"],["0.4"],["0.5"],["0.6"],["0.7"],["0.8"],["0.9"],
		["1"],["1.5"],["2"],["2.5"],["3"],["3.5"],["4"],["4.5"],["5"],["5.5"],
		["6"],["6.5"],["7"],["7.5"],["8"],["8.5"],["9"],["9.5"],
		["10"],["20"],["30"],["40"],["50"],["60"],["70"],["80"],["90"]
	];
	var total   = JSMax_Ex - JSMax_Ey;
	var x100Min = JSMax_Ey * 100 / total;
	var data    = '[["'+x100Min+'"]';
	for(var i=1; i<fact.length; i++)
	{
		var factI = parseFloat(fact[i]);
		if(factI > x100Min) data += ',['+factI+']';
	}
	data += ',["100"]]';
	storeExpload(eval(data), x100Min);
	//-------------------------------------------------------
	ShowPerfilWindow('Informaci&oacute;n de Perfiles');
}
//---------------------------------------------------------------------------
var Generar_Grafica = function(SA, SP)
{
	Preparar_Grafica('grafica');
	dataSerie.SA[Factor] = SA;
	dataSerie.SP[Factor] = SP;
	Dibujar_Grafica();
}
//---------------------------------------------------------------------------
var Has_Data = function()
{
	var array = dataSerie.SA[Factor];
	if(array) Dibujar_Grafica();
	else std.FrontController.send({
		action: 'getHeightProfile',	
		controller: "Perfil",
		certificate: "",
		params: {
			"Factor": Factor/1000,
			"Coordenadas": LstCoord
		}
	});
}
var Limpiar_Series = function()
{
	for(var i=1; i<=10; i++)
	{
		var f9 = 90*i;
		SPCoord = eval ("SPCoord"+f9.toString());
		if(SPCoord) SPCoord.clear();
		SACoord = eval ("SACoord"+f9.toString());
		if(SACoord) SACoord.clear();
	}
	Coord.clear();
}
//---------------------------------------------------------------------------
