/**
 *
 * @framework: Ksike
 * @project: Geotrygon
 * @package: Plugin
 * @subpackage: Query
 * @version: 0.1

 * @description: 
 * @authors: ing. Hermes Lazaro Herrera Martinez
 * @making-Date: 08/12/2010
 * @update-Date: 08/12/2010
 * @license: GPL v2
 *
 */
std.include("plugins/Query/client/js/views/gui.js");
std.include("plugins/Query/client/css/query.css");
//-------------------------------------------------------------------------
var context;
//-------------------------------------------------------------------------
Kcl.Class( "Kcl.Query",
{
	extend: Kcl.Plugin,
	property:{
		showLayers: null,
		selectLayers:[]
	},
	behavior: {
		buildGUI:function(params){
			this.ui = params.gui;
			params.gui.toolBar.addButton({
				id: 'queryPlugin',
				control: true,
				iconCls: 'query',
				tooltip: 'Consultas',
				handler: function (){
					params.gui.update();
					context = new QueryContext();
					std.FrontController.send({
					    action: 'query',
					    controller: "Query",
					    params:{
						responseAction:'main'
					    }
					});
				},
				onDefuse : function()
				{
					if(context) context.controlOff();
				}
			});
		},
		serverResponse: function(objResponse) {
			switch(objResponse.action)
			{
			    case "result":
				
				break;
			    case "initTab":
				var tabPanel = Ext.getCmp('q-TabPanel');
				var activeTab = tabPanel.get('q-tab'+objResponse.layer);
				var gridTab = Ext.getCmp('q-grid-'+objResponse.layer);
				if(!gridTab){
				    gridTab = context.addGridLayer('q-grid-'+objResponse.layer,objResponse.features)
				    context.store = gridTab.getStore();
				    context.layer = objResponse.layer;
				    activeTab.add(gridTab);
				}
				activeTab.doLayout();
				break;
			    case "main":
				selectLayers = [];
				showLayers = null;
				
				this.ui.region.east.add({
				    title: 'Consultas',
				    resizeTabs: true,
				    id: "query",
				    iconCls: 'tabs',
				    autoScroll:true,
				    closable: true,
				    layout: 'fit',
				    tbar:new Ext.Toolbar({
				        id:'q-tbar',
				        defaults: {
				            toggleGroup:'queryBtns',
				            disabled:true
				        },
				        items:[{
				            tooltip: 'Selecci&oacute;n de Capas',
				            iconCls: 'scapas',
				            disabled : false,
				            handler: function (btn){
				               
				                if(!btn.pressed)return;
				                
				                var sm = new Ext.grid.CheckboxSelectionModel({
				                    listeners:{
				                        rowselect: function(selectionModel, rowIndex, record){
				                            selectLayers[record.data.name] = rowIndex;
				                        },
				                        rowdeselect: function(selectionModel, rowIndex, record){
				                            selectLayers[record.data.name] = null;
				                            delete selectLayers[record.data.name];
				                        }
				                    }
				                });
				                if(!showLayers){
				                    var grid = new Ext.grid.GridPanel({
				                        id:'q-grid-layers',
				                        store: new Ext.data.ArrayStore({
				                            fields: ['name'],
				                            data : objResponse.layers
				                        }),
				                        viewConfig: {
				                            forceFit:true
				                        },
				                        cm: new Ext.grid.ColumnModel({
				                            columns: [
				                            sm,
				                            {
				                                id:'name',
				                                header: "Capas",
				                                dataIndex: 'name',
				                                width: '85%'
				                            }]
				                        }),
				                        sm: sm,
				                        columnLines: false
				                    });
				                    showLayers = new Ext.Window({
				                        title: 'Selecci&oacute;n de Capas',
				                        width:'20%',
				                        height: 300,
				                        layout: 'fit',
				                        items: grid,
				                        resizable: false,
				                        closeAction:'hide',
				                        listeners:{
				                            'hide':function(){
				                                
				                                var length = 0;
				                                for(var i in selectLayers){
				                                    if(!(selectLayers[i] instanceof Function)){
				                                        length++;
				                                        break;
				                                    }
				                                }
				                                var items = Ext.getCmp('q-tbar').items.items;
				                                if(length > 0){
				                                    Ext.each(items,function(item){
				                                        item.enable();
				                                    });
				                                    var win = context.main(selectLayers);
				                                    if(win)
				                                        win.show();
				                                }else{
				                                    Ext.each(items,function(item){
				                                        item.disable();
				                                    });
				                                    items[0].enable();
				                                }
				                            }
				                        }
				                    });
				                }
				                showLayers.show();
				            }
				        },"-",{
				            tooltip :"Puntual",
				            iconCls:'point',
				            id: 'q-point',
				            handler:function(){
				                context.currentControl='point';
				                context.toggleControl({
				                    value:context.currentControl
				                });
				            }
				        },{
				            tooltip :"Rectangular",
				            iconCls:'box',
				            id: 'q-box',
				            handler:function(){
				                context.currentControl='polygon';
				                context.irregularPolygon(context.currentControl, this.ownerCt.get('chk-query-irregular').checked);
				                context.toggleControl({
				                    value:context.currentControl
				                });
				            }
				        },{
				            tooltip :"Circular",
				            iconCls:'circle',
				            id: 'q-circle',
				            handler:function(){
				                context.currentControl = 'circle';
				                context.irregularPolygon(context.currentControl, this.ownerCt.get('chk-query-irregular').checked);
				                context.toggleControl({
				                    value:context.currentControl
				                });
				            }
				        },{
				            tooltip :"Triangular",
				            iconCls:'triangle',
				            id: 'q-triangle',
				            handler:function(){
				                context.currentControl = 'triangle';
				                context.irregularPolygon(context.currentControl, this.ownerCt.get('chk-query-irregular').checked);
				                context.toggleControl({
				                    value: context.currentControl
				                });
				            }
				        },"-",{
				            tooltip: "Irregular",
				            id:'chk-query-irregular',
				            xtype:'checkbox',
				            handler:function(checkbox,checked){
				                context.irregularPolygon(context.currentControl, checked);
				            }

				        }]
				    }),
				    listeners:{
				        close:function(){
				            var gridLayers = Ext.getCmp('q-grid-layers');
				            gridLayers.ownerCt.purgeListeners();
				            gridLayers.ownerCt.close();
				        }
				    },
				    items: [{
				        layout:'fit',
				        autoScroll:true,
				        autoWidth:true,
				        items: new Ext.Panel({
				            title: 'Historial de consultas',
				            bodyStyle: 'padding:2px',
				            layout:'fit',
				            border:true,
				            items: [new Ext.tree.TreePanel({
				                id:'query-tree-history',
				                layout:'fit',
				                frame:false,
				                loader: new Ext.tree.TreeLoader(),
				                autoScroll: true,
				                lines:false,
				                rootVisible: false,
				                root: new Ext.tree.AsyncTreeNode({
				                    expanded: true,
				                    children: []
				                }),
				                listeners:{
				                    click : function(node, e ){
				                        var pbar = Ext.getCmp('q-paging-q-grid-'+context.layer);
				                        context.wktFeature = node.attributes.wktFeature;
				                        context.store.baseParams.wktFeature = context.wktFeature;
				                        context.store.load({
				                            params:{
				                                start:pbar.cursor,
				                                limit:20
				                            }
				                        })
				                    }
				                }
				            })]
				        })
				    }]
				});
				break;
			}
		}
	}
});
