/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Perfil
 * @version: 0.1

 * @description: 
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("plugins/Perfil/client/js/views/VPerfil.js");
std.include("plugins/Perfil/client/js/common/PolyLine.js");
std.include("plugins/Perfil/client/js/common/ejschart/dist/EJSChart.js");
std.include("plugins/Perfil/client/js/common/ejschart/JSChart.js");
std.include("plugins/Perfil/client/js/controllers/Perfil_Aux.js");
std.include("plugins/Perfil/client/css/perfil.css");
//-------------------------------------------------------------------------
Kcl.Class( "Kcl.Perfil",
{
	extend: Kcl.Plugin,
	behavior: {
		serverResponse:function(objResponse){
			Generar_Grafica(objResponse.SA, objResponse.SP);
		},
		buildGUI:function(params)
		{
			var _this = Kcl.Perfil.prototype;
			if(!_this.div) _this.div = document.createElement("div");
			_this.div.id  = "grafica";
			document.body.appendChild(_this.div);

			params.gui.toolBar.addButton({
				id: 'Perfil',
				control: true,
				iconCls: 'perfilcs',
				tooltip: 'Perfiles de Visibilidad y Haltura',
				handler: function (){
					eval("var map = "+params.map);
					_this.polyline = new PolyLine();
					map.div.style.cursor = "default";
					map.addControl(_this.polyline.obj);
					_this.polyline.obj.activate();
					_this.polyline.onClic2 = function(lst)
					{
						LstCoord = lst;
						std.FrontController.send({
							action: 'getHeightProfile',	
							controller: "Perfil",
							certificate: "",
							params: {
								"Factor": 900/1000,
								"Coordenadas": lst
							}
						});			
					}
					//closeWindow = function(){if(_this.polyline) _this.polyline.obj.deactivate();};
				},
				onDefuse : function()
				{
				    if(_this.polyline) _this.polyline.obj.deactivate();
				}
			});
		}
	}
});
