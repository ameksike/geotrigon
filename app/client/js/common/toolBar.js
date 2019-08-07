/**
 *
 * Description: ToolBars es una clase para la administracion de ToolBars
 * Authors: ing Rolando Toledo, ing Antonio Membrides Espinosa
 * Making Date: 03/05/2010
 * Update Date: 15/08/2010
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */
var ToolBars = function()
{	
	var _this = this;
	var toosId = [];
	var updateActiveTool = function(tool)
	{	
		for(var i=0; i<toosId.length; i++)if(toosId[i] && toosId[i]!=tool){
			var itool = document.getElementById(toosId[i]);
			itool.className = "x-btn-wrap x-btn x-btn-icon";
			_this.obj.items.items[i].onDefuse();
		}
		document.getElementById(tool).className = "x-btn-wrap x-btn x-btn-icon x-btn-pressed";
	}

	if(!_this.obj) _this.obj = new Ext.Toolbar({});
	_this.addButton = function (button){
		if(_this.obj){
			var type = typeof(button);
			if(type == "object") _this.obj.add({
					id: button.id,
					text: button.text ? button.text : '' ,
					iconCls: button.iconCls,
					tooltip: button.tooltip ? button.tooltip : '' ,
					width: button.width ? button.width : '15%',
					heigth: button.heigth ? button.heigth : 50,
                                        listeners: button.listeners ? button.listeners : {},
                                        disabled: button.disabled ? button.disabled : false,
					handler: function (){
						button.handler();
						if(button.control) updateActiveTool(button.id);
					},
					onDefuse: function()
					{
						if(button.onDefuse) button.onDefuse();
					}
			});
			else  _this.obj.add('-');
			_this.obj.doLayout();
			toosId.push(button.id);
		}
        }
        _this.delButton = function (id){}

        _this.getButton = function (id){
            return Ext.getCmp(id);
        }

        _this.setStatus = function (status, id){
            if(status)
                _this.getButton(id).enable();
            else if(!status)
                _this.getButton(id).disable();
        }
}
