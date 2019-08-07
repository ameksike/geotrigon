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
				{id:'ba1', iconCls: 'reload', text: 'Actualizar', handler:function(){_this.send();}},
				{xtype:'tbseparator'},
				{id:'ba3', iconCls: 'ba3', handler:function(){_this.mainTree.getRootNode().expand();}},
				{xtype:'tbseparator'},
				{id:'ba4', iconCls: 'ba4', handler:function(){_this.mainTree.getRootNode().collapse();}},					
				{xtype:'tbseparator'}
			]
		});

		_this.load();

		if(!_this.mainTree) _that.mainTree = new Ext.tree.TreePanel({
			tbar: toolbar,
			useArrows: true,
			autoScroll: true,
			animate: true,
			enableDD: true,
			containerScroll: true,
			border: false,
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
