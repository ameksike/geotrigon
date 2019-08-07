var layerList = new Array();
var layers = new Array();
//---------------------------------------- in rolo 
var checkear = false;
var chequeada = "";
var contador = 0;
/**
 * Dice si es ancestro del nodo
 * @param {Ext.tree.TreeNode} node
 * @param {String} ancestro
 */
var isAncestro = function(node, ancestro){
	if(!node.parentNode)
		return false;
	return (node.parentNode.attributes.text == ancestro || isAncestro(node.parentNode,ancestro));
}
/**
 * Funcion que chequea los nodos
 * @param {Ext.tree.TreeNode} node
 * @param {Boolean} checked
 * @param {Boolean} checkear
 */
var CascadeChecked = function(node, checked) {		
		checkParent(node,checked);
		if(node.childNodes)
			checkChild(node,checked);
		if(checkedChild(node) == node.childNodes.length && node.attributes.text == chequeada)
			chequeada = "";
};
/**
 * Chekea los padres del nodo
 * @param {Ext.tree.TreeNode} node
 * @param {Boolean} checked
 */
var checkParent = function(node, checked){
	if(node.parentNode && !node.parentNode.attributes.checked){
		node.parentNode.getUI().removeClass('complete');				
		node.parentNode.getUI().toggleCheck(checked);
	}
}
/**
 * Chekea los hijos del nodo
 * @param {Ext.tree.TreeNode} node
 * @param {Boolean} checked
 */
var checkChild = function(node, checked){
	node.cascade(function(n) {
		if (n.attributes.id != node.attributes.id && isAncestro(n,chequeada)) {
			n.getUI().toggleCheck(checked);
			n.attributes.checked = checked;			
		}
	});	
}
/**
 * Funcion que deschequea los nodos
 * @param {Ext.tree.TreeNode} node
 * @param {Boolean} checked
 */
var CascadeUnCheked = function (node,checked){	
	node.cascade(function(n) {
				if (n.attributes.id != node.attributes.id) {
					n.getUI().toggleCheck(checked);
					n.attributes.checked = checked;
				}
			});
	if(node.parentNode && node.parentNode.attributes.checked && checkedChild(node.parentNode) == 0){			
			
		node.parentNode.getUI().addClass('complete');
		node.parentNode.getUI().toggleCheck(checked);
	}	
	contador = 0;
	chequeada = "";
}
/**
 * Funcion para saber la cantidad de hijos de un nodo
 * @param {Ext.tree.TreeNode} parentNode
 * @return {Number}
 */
var checkedChild = function (parentNode){
	var cantidad = 0;
	if(parentNode.childNodes){
		var nodeList = parentNode.childNodes;
		for (i in nodeList){
			if(nodeList[i].attributes && nodeList[i].attributes.id != parentNode.attributes.id)
				if(nodeList[i].attributes.checked)
					cantidad++;
		}
	}
	return cantidad;
}
/**
 * Funcion que cambia el estado del padre segun el estado de los hijos
 * @param {Ext.tree.TreeNode} node
 * @param {boolean} checked
 * @param {boolean} checkear
 */
var UncheckOrCheckParent = function (node,checked,checkear)
{	
	if (checked) {	
			CascadeChecked(node, checked, checkear);
			node.getUI().removeClass('complete');	

	} else{
		node.getUI().addClass('complete');
		CascadeUnCheked(node, checked);
	}
}

var reloadTree = function(node){ 

	tree.getLoader().load(node);
	if(!node.childNodes)
		return;
	node.cascade(function(n){
		reloadTree(n);
	});
}
//---------------------------------------- out rolo 
var formatStatusProperty = function(obj)
{
	if(obj.status == undefined) return true;
	else if(obj.status >= 1) return true; 
	else return false;
}
//---------------------------------------------------------------------------------------------------
