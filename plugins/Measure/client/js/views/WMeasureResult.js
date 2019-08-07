//------------------------------------------------------------------------
var WMeasureResult = function(title)
{
	var _this = this;
	this.title = title;

		_this.store = new Ext.data.ArrayStore({
			fields: [
			   {name: 'longitud', type: 'float'},
			   {name: 'latitud', type: 'float'},
			   {name: 'value', type: 'float'},
			   {name: 'unit'}
			]
		});

		var grid = new Ext.grid.GridPanel({
			store: _this.store,
			columns: [
				{id:'exp', header: 'Valor Acumulado', width: 50, sortable: true, dataIndex: 'value'},
				{header: 'Unidad de Medida', width: 100, sortable: true, dataIndex: 'unit'},
				{header: 'Longitud', width: 75, sortable: true, dataIndex: 'longitud'},
				{header: 'Latitud', width: 75, sortable: true, dataIndex: 'latitud'}   
			 ],
			stripeRows: true,
			layout : 'fit',
			autoExpandColumn: 'exp',
			height: 350,
			width: 490,
			stateful: true,
			stateId: 'grid'        
		});

		if(!_this.window)_this.window = new Ext.Window({
			title	     : _this.title,
			layout       : 'fit',
			closeAction  : 'hide',
			resizeHandles: 'all',
			width        : 490,
			height       : 320,
			shadow       : true,
			animCollapse : true,
			collapsible  : true,
			resizable    : true,
			plain        : true,
			listeners    : {'hide':function(p){ if(_this.close)_this.close();}},
			items	     : grid,
			buttons	     :[{
		            	iconCls:"mdoc",
				tooltip: "Exportar a Word",
				handler:function(){
					alert("generar doc");
				}			
		        },{
		           	iconCls:"mexel",
				tooltip: "Exportar a Exel",
				handler:function(){
					alert("generar exel");
				}
		        },{
		         	iconCls:"mpdf",
				tooltip: "Exportar a PDF",
				handler:function(){
					alert("generar pdf");
				}
		        }]
		});

	this.show = function(lst)
	{
		_this.store.loadData(lst);
		_this.window.show();
	}
	//...................................................................
};
//------------------------------------------------------------------------
