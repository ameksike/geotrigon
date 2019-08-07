//-------------------------------------------------------------------------
var Router = function(params)
{
	this.caminoMinimo = params.camMax ? params.camMax : 100;
	this.caminoMaximo = params.camMin;

	this.inven = function(params)
	{
		alert("esto es una prueba");
	}

	this.serverResponse = function(objResponse)
	{
		alert("esto es una prueba");
	}
}
//-------------------------------------------------------------------------
