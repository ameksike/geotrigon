Ext.ns('gridQueryContext');
gridQueryContext.Grid = Ext.extend(Ext.grid.GridPanel, {
    initComponent:function() {
        var config = {
            store:new Ext.data.JsonStore({
                id:'queryStore',
                totalProperty:'totalCount',
                root:'layers',
                url:'core/php/Front.php ',
                fields:[{
                    name:'layer'
                },{
                    name:'idLayer'
                },{
                    name:'type'
                }]
            })
            ,
            columns:[{
                id:'layerid',
                header:"Capas editables",
                width:40,
                sortable:true,
                dataIndex:'layer'
            },{
                header:"Identificador",
                width:20,
                sortable:true,
                dataIndex:'idLayer'
            },{
                header:"Tipo de capa",
                width:20,
                sortable:true,
                dataIndex:'type'
            }],
            viewConfig:{
                forceFit:true
            }
        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        this.bbar = new Ext.PagingToolbar({
            store:this.store,
            displayInfo:true,
            pageSize:10,
            displayMsg: 'Mostrando {0} - {1} de {2}'
        });
        // call parent
        gridQueryContext.Grid.superclass.initComponent.apply(this, arguments);
    } // eo function initComponent
    ,
    onRender:function() {
        // call parent
        gridQueryContext.Grid.superclass.onRender.apply(this, arguments);
        // load the store
        this.store.load({
            params:{
                start:0,
                limit:10,
                action: 'query',
                controller: "Query"
            }
        });
    } // eo function onRender

});
Ext.reg('querygrid', gridQueryContext.Grid);
