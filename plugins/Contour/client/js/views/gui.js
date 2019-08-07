var ContourContext = function()
{
    var that = this;
    var components = new Array();
    var splitNumber = new Ext.ux.form.SpinnerField({
        columnWidth : .3,
        fieldLabel : 'Altura',
        name : 'delta',
        anchor : '95%',
        minValue : 10,
        maxValue : 10000,
        allowDecimals : true,
        decimalPrecision : 1,
        incrementValue : 1,
        alternateIncrementValue : 1,
        value : 10,
        accelerate : true
    });
    components.push(splitNumber);
    components.push(new Ext.ux.ColorField({
        name : 'color',
        fieldLabel : 'Color',
        anchor : '95%',
        width : 200
    }));
    components.push(new Ext.ux.ColorField({
        name : 'labelcolor',
        fieldLabel : 'Color de la Etiqueta',
        anchor : '95%',
        width : 200
    }));

    var labelsize = new Ext.ux.form.SpinnerField({
        columnWidth : .3,
        fieldLabel : 'Label Size',
        name : 'labelsize',
        anchor : '95%',
        minValue : 0,
        maxValue : 10000,
        allowDecimals : true,
        decimalPrecision : 1,
        incrementValue : 1,
        alternateIncrementValue : 1,
        value : 0,
        accelerate : true
    });
    components.push(labelsize);
    
    components.push(new Ext.form.Label({
            html : 'Coordenadas',
            id : 'contourcoordenadas'
    }));
    
    this.component = new Ext.FormPanel({
        frame : true,
        labelAlign : 'top',
        id: 'frmContornos',
        buttonsAlign : 'center',
	items:components,
	buttons:[{
                text : 'Generar',
                handler : function() {
		    var frmContornos = Ext.getCmp('frmContornos');
                    var form = frmContornos ? frmContornos.getForm() : {} ;
                    var colorTool = new Ext.ux.ColorPicker();
                    var values = form.getValues ? form.getValues() : {};
                    if(colorTool.hexToRgb) values.color = values.color != "" ? colorTool.hexToRgb(values.color.split("#")[1]).join(",") : "51,153,102";
                    if(colorTool.hexToRgb) values.labelcolor = values.labelcolor != "" ? colorTool.hexToRgb(values.labelcolor.split("#")[1]).join(","): "51,153,102";
                    values.point  = that.point;
                    values.raster = that.layer;
                    if(values.point) std.FrontController.send({
                        action: 'drawingContour',
                        controller: "Contour",
                        params:values
                    });
                }
       }]
    });

    this.layer = 'contour';
    this.buildGUI = function(evt){
        
        if(std.mod.Map.obj.mode != "contour")
            return;

        var pixel = new OpenLayers.Pixel(evt.xy.x, evt.xy.y);
        var lonlat = std.mod.Map.obj.getLonLatFromPixel(pixel);
        that.point = {
	        x:lonlat.lon,
	        y:lonlat.lat
        }

	var div = document.getElementById("contourcoordenadas");
	div.innerHTML  = "<b>Coordenadas: </b>";
	div.innerHTML += that.point.x + " / ";
	div.innerHTML += that.point.y;	
    }
}
