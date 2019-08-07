var ThematicContext = {
    crenderer:function(color) {
        return '<div style="background-color:' + color + '; width:12px;' +
        ' height:12px; margin: -1px 1px -1px 0px !important;' +
        ' float:left; border: #CCCCCC 1px solid;">&nbsp;' +
        '</div><span>'+color+'</span>';
    },
    ngroup:0,
    delta :100,
    layer:null,
    data:{
        properties: [{
            'name': 'min',
            'text': 'Rango Minimo',
            'value': 0,
            'group': 'clase-1'
        },{
            'name': 'max',
            'text': 'Rango Maximo',
            'value': 100,
            'group': 'clase-1'
        },{
            'name': 'color',
            'text': 'Color',
            'value': '#0054b4',
            'group': 'clase-1',
            'editor': new Ext.grid.GridEditor(new Ext.ux.ColorField({
                selectOnFocus: true
            })),
            'renderer': ThematicContext.crenderer
        }]
    },
    gridProperties:function(){
        // data store
        var store = new Ext.data.GroupingStore({
            id: 'storePG',
            recordType: Ext.ux.wam.PropertyRecord,
            groupField: 'group',
            sortInfo: {
                field:'name',
                direction:'ASC'
            },
            reader: new Ext.data.JsonReader({
                id: 'name',
                root: 'properties'
            }, Ext.ux.wam.PropertyRecord)
        });
        store.loadData(ThematicContext.data);

        var gridProperties = new Ext.ux.wam.PropertyGrid({
            store: store,
            frame: false,
            layout:'fit',
            autoHeight:true,
            trackMouseOver:true,
            sm: new Ext.grid.RowSelectionModel({
                singleSelect:true
            }),
            tbar:[{
                // iconCls: 'icon-user-add',
                text: 'Adicionar',
                handler: function(){
                    var propel = [];
                    var length = ThematicContext.data.properties.length;
                    ThematicContext.ngroup++;
                    var recordMin = {
                        'name': 'min'+(ThematicContext.ngroup),
                        'text': 'Rango Minimo'
                    }
                    if(length >= 3){
                        recordMin.value = ThematicContext.data.properties[length-2].value ;
                        recordMin.group = 'clase-'+ (ThematicContext.ngroup);
                    }else{
                        recordMin.value = 0;
                        recordMin.group = 'clase-1';
                    }

                    var recordMax = {
                        'name': 'max'+(ThematicContext.ngroup),
                        'text': 'Rango Maximo'
                    }
                    if(length >= 3){
                        recordMax.value = ThematicContext.data.properties[length-2].value + ThematicContext.delta;
                        recordMax.group = 'clase-'+ (ThematicContext.ngroup);
                    }else{
                        recordMax.value = ThematicContext.delta;
                        recordMax.group = 'clase-1';
                    }

                    var recordColor = {
                        'name': 'color'+(ThematicContext.ngroup),
                        'text': 'Color',
                        'editor': new Ext.grid.GridEditor(new Ext.ux.ColorField({
                            selectOnFocus: true
                        })),
                        'value':'#0054b4',
                        'renderer': ThematicContext.crenderer
                    }
                    if(length >= 3){
                        recordColor.group = 'clase-'+ (ThematicContext.ngroup);
                    }else{
                        recordColor.group = 'clase-1';
                    }

                    propel.push(recordMin);
                    propel.push(recordMax);
                    propel.push(recordColor);
                    ThematicContext.data.properties = ThematicContext.data.properties.concat(propel);
                    store.loadData(ThematicContext.data);
                    gridProperties.getView().refresh();
                }
            },{
                // iconCls: 'icon-user-delete',
                text: 'Eliminar',
                disabled: false,
                handler: function(){
                   
                    var s = gridProperties.getSelectionModel().getSelections();
                    var propDelete = [];
                    for(var i = 0, r; r = s[i]; i++){
                        for(var j=0; j< ThematicContext.data.properties.length; j++) {
                            if(ThematicContext.data.properties[j].group != r.data.group){
                                propDelete.push(ThematicContext.data.properties[j]);
                            }
                        }
                    }
                    ThematicContext.data.properties = propDelete;
                    store.loadData(ThematicContext.data);
                    gridProperties.getView().refresh();
                }
            },{
                // iconCls: 'icon-user-delete',
                text: 'Actualizar',
                disabled: false,
                handler: function(){
                    var properties = [];
                    var colorTool = new Ext.ux.ColorPicker();
                    for(var i=0; i< ThematicContext.data.properties.length; i += 3) {
                        var node = {};
                        for(var j=0; j< ThematicContext.data.properties.length; j++) {
                            if(ThematicContext.data.properties[j].group == ThematicContext.data.properties[i].group){
                                if(ThematicContext.data.properties[j].name.substr(0,3) == "min")
                                    node['min'] = ThematicContext.data.properties[j].value;
                                if(ThematicContext.data.properties[j].name.substr(0,3) == "max")
                                    node['max'] = ThematicContext.data.properties[j].value;
                                if(ThematicContext.data.properties[j].name.substr(0,3) == "col"){
                                    var aux = ThematicContext.data.properties[j].value.split("#");
                                    node['color'] = colorTool.hexToRgb(aux[1]);
                                }
                            }
                        }
                        properties.push(node);
                    }
                    std.FrontController.send({
                        action: 'update',
                        controller: "ThematicRaster",
                        params: {
                            nodes: properties,
                            raster:ThematicContext.raster
                        }
                    });
                }
            }],
            //anchor: '100% -90',
            border: false,
            view: new Ext.grid.GroupingView({
                forceFit:true,
                groupTextTpl: '{group}',
                emptyGroupText: 'No Group',
                enableGroupingMenu: true,
                showGroupName: true
            }),
            listeners:{
                afteredit:function(g, ic){
                    for(var i = 0;i<ThematicContext.data.properties.length;i++){
                        if(g.record.data.name == ThematicContext.data.properties[i].name &&
                            g.record.data.group == ThematicContext.data.properties[i].group){
                            ThematicContext.data.properties[i].value = g.value;
                        }
                    }
                    store.loadData(ThematicContext.data);
                    gridProperties.getView().refresh();
                }
            }
        })
        return gridProperties;
    },
    chooserRaster:function(){
        var combo = new Ext.form.ComboBox({
	    layout:'fit',//width:  500,
            store: ThematicContext.rasterLayers,
            listeners:{
                change:function(){
                    ThematicContext.raster = combo.getValue();
                    std.FrontController.send({
                        action: 'load',
                        controller: "ThematicRaster",
                        params: {
                            raster:ThematicContext.raster
                        }
                    });
                }
            }
        });
        return combo;
    }
}

