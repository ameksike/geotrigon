/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: ClosestDegree
 * @version: 0.1

 * @description: 
 * @authors: ing. Hermes Lazaro Herrera Martinez
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("plugins/ClosestDegree/client/css/closestDegree.css");
Kcl.Class( "Kcl.ClosestDegree",
{
	extend: Kcl.Plugin,
	behavior: {
		buildGUI:function(params){
			params.gui.toolBar.addButton({
			    id: 'ClosestDegree',
			    control: true,
			    iconCls: 'viss',
			    tooltip: '&Aacute;ngulo de cierre',
			    handler: function (){
				std.FrontController.send({
				    action: 'closest',
				    controller: "ClosestDegree"
				});
				
				/*
				 * mostrar un panel para pedir parametros
				 */
				

			    },
			    onDefuse : function(){}
			});
		},
		serverResponse: function(objResponse){
			/**
			 * mostrar una ventana con el numero de poligonos generados
			 * con checkboxes para ocultar o mostrarlos.
			 */
			switch(objResponse.action){
			    case "draw":
				var vectorLayer = new OpenLayers.Layer.Vector("Simple Geometry");
				var pointList =[];
				var green = {
				    strokeColor: "#009900",
				    fillColor:"#00FF00",
				    strokeWidth: 1,
				    fillOpacity:0.4,
				    pointRadius: 2,
				    pointerEvents: "visiblePainted"
				};
				for(var i=0;i<objResponse.polygon.length;i++){
				    
				    var obj = objResponse.polygon[i];
				    // var px = std.mod.Map.obj.getPixelFromLonLat(new OpenLayers.LonLat(obj[0],obj[1]));
				    var newPoint = new OpenLayers.Geometry.Point(obj[0],
				        obj[1]);
				    pointList.push(newPoint);
				}
				pointList.push(pointList[0]);
				var linearRing = new OpenLayers.Geometry.LinearRing(pointList);
				var feature = new OpenLayers.Feature.Vector(
				    new OpenLayers.Geometry.Polygon([linearRing]), null, green);

				//mod.Map.obj.removeLayer(vectorLayer);
				std.mod.Map.obj.addLayer(vectorLayer);
				vectorLayer.addFeatures([feature]);
				
				break;
			}
		   }
	}	
});
