LayerControls.prototype.updateTree = function(nodesList)
{
	while(LayerControls.prototype.larerRoot.hasChildNodes())
		LayerControls.prototype.larerRoot.removeChild(LayerControls.prototype.larerRoot.firstChild);
	LayerControls.prototype.loadTree(LayerControls.prototype.larerRoot, nodesList);
	LayerControls.prototype.larerRoot.expand();	
}

LayerControls.prototype.loadTree = function(root, nodesList)
{
	if(nodesList) for(var i in nodesList) if(i != "remove")
	{
		var newNode = new Ext.tree.TreeNode({
			animate: false,
			listeners : {	
				'checkchange' : function(node, checked) {
						if(chequeada == ""){
							chequeada = node.attributes.text;
							contador = node.childNodes.length;
						}
						if(node.childNodes && node.childNodes.length > 0)
							UncheckOrCheckParent(node, checked, false);
					 	else UncheckOrCheckParent(node, checked, true);
				},
				"expand": function(node){
					if(LayerControls.prototype.nEspanded.indexOf(node.attributes.text) == -1) LayerControls.prototype.nEspanded.push(node.attributes.text);
				},
				"collapse": function(node){
					LayerControls.prototype.nEspanded.splice(LayerControls.prototype.nEspanded.indexOf(node.attributes.text), 1);
				}
			}
		});

		for(var j in nodesList[i]) if(j != "remove")
		{
			if(j == "icon"){
				if(nodesList[i].icon != "" && nodesList[i].type != "msgroup") newNode.attributes.icon = "plugins/Layer/client/img/tmp/" + nodesList[i].icon;
				else if(nodesList[i].type == "mslayer") newNode.attributes.iconCls = "x-tree-noIcon";
			}else{
				newNode.attributes[j] = nodesList[i][j];
				newNode[j] = nodesList[i][j];
			}
		}
		if(nodesList[i].list) LayerControls.prototype.loadTree(newNode, nodesList[i].list);
		root.appendChild(newNode);
	}
}

LayerControls.prototype.getNodes = function(arrayNode)
{
	if(arrayNode)
	{
		var lst = new Array()
		for(var i in arrayNode) if(i != "remove"){
			var node = arrayNode[i];
			var obj = new Object();
			if(node.attributes.type == "msgroup") obj.text = node.attributes.text;
			else obj.index  = node.attributes.index;
			if(node.attributes.type == "mslayer") obj.text  = node.attributes.text;
			obj.status = node.attributes.checked;
			//obj.expanded = node.attributes.expanded;
			if(node.childNodes.length>0) obj.lst = LayerControls.prototype.getNodes(node.childNodes);
			lst.push(obj);
		}
		return lst;
	}
}

LayerControls.prototype.getNodesInOrder = function(arrayNode, list)
{
	for(var i in arrayNode) if(i != "remove"){
		var node = arrayNode[i];
		list.push({
			id: node.attributes.id,
			text: node.attributes.text,
			expanded: node.attributes.expanded
		});
		if(node.childNodes) LayerControls.prototype.getNodesInOrder(node.childNodes, list);
	}
}

LayerControls.prototype.load = function()
{
	std.FrontController.send({
		action: 'load',	
		controller: "Layer",
		certificate: "232324877",
		params: { nEspanded : LayerControls.prototype.nEspanded }
	});	
}

LayerControls.prototype.send = function(l)
{
	var _this = LayerControls.prototype;
	std.FrontController.send({
		action: 'writeMap',
		controller: "Layer",
		certificate: "232324877",
		params: {
			reorder: false,
			nEspanded : LayerControls.prototype.nEspanded,
			lst : _this.getNodes(_this.larerRoot.childNodes)
		}
	});	
}
