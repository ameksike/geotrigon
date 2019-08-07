var QueryContext = function(){
    this.layer = '';
    this.wktFeature = null;
    this.currentControl = '';
    this.win = null;
    this.store = null;
    var that = this;
    this.vectorLayer = new OpenLayers.Layer.Vector("Query Layer");
    
    this.vectorLayer.onFeatureInsert = function(feature){
        var formatWKT = new OpenLayers.Format.WKT();
        that.wktFeature = formatWKT.write(feature);
        if(that.store){ 
		that.store.baseParams.wktFeature = that.wktFeature;
		that.store.baseParams.layer = that.layer;
		that.store.load({
		    params:{
		        start:0,
		        limit:20
		    }
		});
	}
        that.vectorLayer.removeFeatures([feature],{silent:true});
        var root = Ext.getCmp('query-tree-history').getRootNode();
        var child = new Ext.tree.TreeNode({ text:"Regi&oacute;n seleccionada: " + that.wktFeature });
        child.attributes = { wktFeature:that.wktFeature };
        root.appendChild(child);
    }
  
    std.mod.Map.obj.addLayer(this.vectorLayer);
   
    var drawControls = {
        point: new OpenLayers.Control.DrawFeature(this.vectorLayer,
            OpenLayers.Handler.Point),
        polygon: new OpenLayers.Control.DrawFeature(this.vectorLayer,
            OpenLayers.Handler.RegularPolygon,{
                handlerOptions:{
                    sides:4
                }
            }),
        circle: new OpenLayers.Control.DrawFeature(this.vectorLayer,
            OpenLayers.Handler.RegularPolygon,{
                handlerOptions:{
                    sides:100
                }
            }),
        triangle: new OpenLayers.Control.DrawFeature(this.vectorLayer,
            OpenLayers.Handler.RegularPolygon,{
                handlerOptions:{
                    sides:3
                }
            })
    };
    
    for(var key in drawControls) {
        std.mod.Map.obj.addControl(drawControls[key]);
    }

    this.irregularPolygon = function(key,checked){
        if(drawControls[key])
            drawControls[key].handler.setOptions({
                irregular: checked
            });
    }
    
    this.toggleControl = function(element) {
	std.mod.Map.obj.mode = "query";
        for(key in drawControls) {
            var control = drawControls[key];
            if(element.value == key ) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    }

    this.controlOff = function()
	{
		for(key in drawControls)
			drawControls[key].deactivate();
	}

    this.addGridLayer = function(id ,metaFeatures){
        var fields = [],columns = [];
        for(var i in metaFeatures[0]){
            fields.push({
                name:i
            })
            columns.push({
                header:i,
                sortable:true,
                dataIndex:i
            })
        }
        var store = new Ext.data.JsonStore({
            baseParams:{
                action: 'query',
                controller: 'Query'
            },
            totalProperty:'totalCount',
            root:'features',
            url:'core/php/Front.php ',
            fields:fields,
            listeners:{
                load :function(){
                    if(that.win){
                        that.win.expand(true);
			that.win.show();
			}
                }
            }
        });
        var config = {
            store:store,
            cm: new Ext.grid.ColumnModel({
                defaults: {
                    width: 100,
                    sortable: true
                },
                columns: columns
            }) ,
            frame:true,
            id:id,
            region:'center',
            layout:'fit',
            columnLines: true,
            autoScroll:true,
            bbar: new Ext.PagingToolbar({
                id:'q-paging-'+id,
                store:store,
                displayInfo:true,
                pageSize:20,
                emptyMsg:'No hay datos',
                displayMsg: 'Mostrando {0} - {1} de {2}'
            })
        };
        var grid = new Ext.grid.GridPanel(config);
        grid.setAutoScroll(true);

        return grid;
    }

    this.main = function(selectLayers){
        var tabs = [];
        for(var i in selectLayers){
            if(!(selectLayers[i] instanceof Function)){
                tabs.push({
                    title:i,
                    xtype:'panel',
                    id:'q-tab'+i,
                    layout:'fit',
                    listeners:{
                        activate:function(tab){
                            var grid = tab.get(0);
                            that.layer = tab.title;
                            if(grid && that.wktFeature){
                                var pbar = grid.getBottomToolbar();
                                that.store = grid.getStore();
                                that.store.baseParams.wktFeature = that.wktFeature;
                                that.store.baseParams.layer = that.layer;
                                that.store.load({
                                    params:{
                                        start:pbar.cursor,
                                        limit:20
                                    }
                                })
                            }
                        },
                        close:function(tab){
                            var grid = Ext.getCmp('q-grid-layers');
                            if(grid && selectLayers[tab.title]){
                                var sm = grid.getSelectionModel();
                                sm.deselectRow(selectLayers[tab.title]);
                                delete selectLayers[tab.title];
                            }
                        }
                    }
                })
            }
        }
        if(!that.win){
            that.win = new Ext.Window({
                title:'Consulta espacial',
                maximizable:true,
                closable: true,
		closeAction : 'hide',
                collapsible:true,
                width:600,
                height:400,
                layout:'fit',
                items:{
                    xtype           : 'tabpanel',
                    minTabWidth     : 75,
                    id:'q-TabPanel',
                    enableTabScroll : true,
                    resizeTabs      : true,
                    defaults: {
                        autoScroll:true,
                        closable:true
                    },
                    items:tabs
                },
		listeners : {'hide':function(p){}},
                buttons:[{
                    	iconCls:"doc",
			tooltip: "Exportar a Word",
			handler:function(){
				alert("generar doc");
			}			
                },{
                   	iconCls:"exel",
			tooltip: "Exportar a Exel",
			handler:function(){
				alert("generar exel");
			}
                },{
                 	iconCls:"pdf",
			tooltip: "Exportar a PDF",
			handler:function(){
				alert("generar pdf");
			}
                }]
            })
        }else{
            var tabPanel = Ext.getCmp('q-TabPanel');
            if(tabPanel){
                for(var i=0; i<tabs.length; i++){
                    if(!tabPanel.findById('q-tab'+tabs[i].title)){
                        tabPanel.add(tabs[i]);
                    }
                }
                tabPanel.doLayout();
            }else
                return null;
        }

        for(var i in selectLayers){
            if(!(selectLayers[i] instanceof Function)){
                std.FrontController.send({
                    action: 'query',
                    controller: "Query",
                    params:{
                        layer:i,
                        responseAction:'initTab'
                    }
                });
            }
        }
        return that.win;
    }
}
