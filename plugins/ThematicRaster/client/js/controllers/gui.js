LayerControls.prototype.updateTree = function(nodesList, nodesEspanded)
{
	while(LayerControls.prototype.larerRoot.hasChildNodes())
		LayerControls.prototype.larerRoot.removeChild(LayerControls.prototype.larerRoot.firstChild);
	LayerControls.prototype.loadTree(LayerControls.prototype.larerRoot, nodesList, nodesEspanded);
}

LayerControls.prototype.loadTree = function(root, nodesList, nodesEspanded)
{
	if(nodesList) for(var i=0; i<nodesList.length; i++)
	{
		var expand = false;
		if(nodesEspanded && nodesEspanded.indexOf(nodesList[i].name) != -1 ) expand = true;
		var newNode = new Ext.tree.TreeNode({
			id: root.id+i,
			text: nodesList[i].name,
			type: nodesList[i].type,
			checked: nodesList[i].check,
			expanded: expand,
			template: nodesList[i].template,
			listeners : {	
				'checkchange' : function(node, checked) {
						var ntype = node.attributes.type;
						if(ntype != "msgroup"){
							var npos  = eval("LayerControls.prototype."+ntype+".indexOf(node.attributes.text)");
							if(!checked){
								if(npos == -1) eval("LayerControls.prototype."+ntype+".push(node.attributes.text);");
							}else eval("LayerControls.prototype."+ntype+".splice("+npos+", 1);");
						}
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
				},
				"contextmenu": function(node, event) {}
			}
		});
		if(nodesList[i].icon != "" && nodesList[i].type != "msgroup") newNode.attributes.icon = "plugins/Layer/client/img/tmp/" + nodesList[i].icon;
		else if(nodesList[i].type == "mslayer") newNode.attributes.iconCls = "x-tree-noIcon";
		if(nodesList[i].list) LayerControls.prototype.loadTree(newNode, nodesList[i].list, nodesEspanded);
		root.appendChild(newNode);
	}
}

LayerControls.prototype.load = function(l)
{
	std.frontController.send({
		action: 'load',	
		controller: "Layer",
		certificate: "232324877",
		params: {
			nEspanded : LayerControls.prototype.nEspanded,
			mslayer : LayerControls.prototype.mslayer,
			msclass : LayerControls.prototype.msclass
		}
	});	
}

LayerControls.prototype.send = function(l)
{
	std.frontController.send({
		action: 'update',	
		controller: "Layer",
		certificate: "232324877",
		params: {
			nEspanded : LayerControls.prototype.nEspanded,
			mslayer : LayerControls.prototype.mslayer,
			msclass : LayerControls.prototype.msclass
		}
	});	
}
