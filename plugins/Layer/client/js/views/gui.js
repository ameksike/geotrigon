var LayerControls = function()
{
	var _this = this;
	var _that = LayerControls.prototype;
	_that.nEspanded = []; 
	_that.mslayer = []; 
	_that.msclass = []; 
	this.buildGUI = function()
	{
		if(!_this.larerRoot) _that.larerRoot = new Ext.tree.TreeNode({
			text:'Capas',
			id:'larerRoot',	
			expanded: true
		});

		var toolbar = new Ext.Toolbar({
			border: false,
			autoHeight: true,
			items: [
				{xtype:'tbseparator'},
				{id:'ba1', iconCls: 'savel', handler:function(){_this.send();}, tooltip: 'Guardar los cambios de estado sobre el Mapa'},
				{xtype:'tbseparator'},
				{id:'ba3', iconCls: 'ba3', handler:function(){_this.mainTree.getRootNode().expand();}, tooltip: 'Expandir el arbol de capas'},
				{id:'ba4', iconCls: 'ba4', handler:function(){_this.mainTree.getRootNode().collapse();}, tooltip: 'Contraer el arbol de capas'},					
				{xtype:'tbseparator'},
				{id:'ba5', iconCls: 'reload', handler:function(){_this.load();}, tooltip: 'Actualizar el controlador de capas',}
			]
		});

		if(!_this.mainTree) _that.mainTree = new Ext.tree.TreePanel({
			tbar: toolbar,
			useArrows: true,
			autoScroll: true,
			animate: true,
			enableDD: true,
			containerScroll: true,
			border: false,
			rootVisible: false,
			root: _this.larerRoot
		});

		return new Ext.Panel({
			id:'leftCapas',
			autoWidth: true,
			layout:'fit',
			border:false,
			items: _this.mainTree
		});
	}
}
