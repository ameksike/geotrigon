var PerfilWindow;
//------------------------------------------------------------------------
var ShowPerfilWindow = function(Titulo)
{
	//------------------------------------------------------------ Eventos
	Accion1 = function()
	{
		Factor = ComboBox1.getValue();
		Has_Data();
	}

	Accion2 = function()
	{
		_factor = ComboBox2.getValue();
		Set_Extremes(_factor);
	}
	//------------------------------------------------------------ Variables
	store1 = new Ext.data.SimpleStore({
		fields: [{name: 'state'}],
		data: [["90"],["180"],["270"],["360"], ["450"], ["540"],["630"],["720"],["810"],["900"]],
		autoLoad: true
	});

	store2 = new Ext.data.SimpleStore({
		fields: [{name: 'state'}],
		data: [["0.1"],["0.2"],["0.3"],["0.4"],["0.5"],["0.6"],["0.7"],["0.8"],["0.9"]],
		autoLoad: false
	});
	//------------------------------------------------------------ Componentes
	if(!this.PerfilWindow)
	{
		//--------------------------------------------------------	
		ComboBox1 = new Ext.form.ComboBox({
			store: store1,
			mode: 'local',
			width:  140,
			value:'900',
			typeAhead: true,
			triggerAction: 'all',
			displayField:'state',
			selectOnFocus:true,
			listeners: { select: Accion1},
			forceSelection: true
		});
		//--------------------------------------------------------	
		ComboBox2 = new Ext.form.ComboBox({
			store: store2,
			id: 'membris',
			mode: 'local',
			width:  140,	
			value:'50',
			typeAhead: true,
			triggerAction: 'all',
			displayField:'state',
			selectOnFocus:true,
			listeners: { 
				'select' : Accion2, 
				'specialkey' : function (f, e) 
				{
					if(e.getKey() == e.ENTER) {
						Accion2();
					}
				}
			},
			forceSelection: true
		});
		//--------------------------------------------------------
	    	PanelT = new Ext.Panel({
			height: 29,
			region:'south',
			layout:'column',
			frame:true,	
			items:[
				{	
					columnWidth:0.2,
					html   : '<div id="h">Perfil de Altura (m):</div>'
				},{
					columnWidth:0.3,
					html   : '<div id="d">Distancia Acumulada (m):</div>'
			},{
					columnWidth:0.4,
					html   : '<div id="c">Coordenadas (degree):</div>'
			}]
	    	});
		//--------------------------------------------------------
	    	PanelH = new Ext.Panel({
			title : "Panel de Configuraci&oacute;n",
			collapsible:true,
			region:'west',
			frame:true,
			items:[{
					columnWidth:0.4,
					layout:'column',
					style:'margin:3 0 2 0;',
					items: [{	
							columnWidth:1,
							layout: 'form',
							style:'margin:3 0 2 0;',
							html: '<div id="t">Factor (m): </div>'
						},{	
							columnWidth:1,
							items: ComboBox1	
						}
					]	
				},{
					columnWidth:0.4,
					layout:'column',
					style:'margin:8 0 0 0;',
					items: [{	
							columnWidth:1,
							layout: 'form',
							style:'margin:3 0 2 0;',
							html: '<div id="t">Especulaci&oacute;n de altura (%): </div>'
						},{	
							columnWidth:1,
							items: ComboBox2	
						}
					]	
				}]
	    	});
		//--------------------------------------------------------
	    	PanelG = new Ext.Panel({
			height: 350,
			width:  205,
			region:'center',
			layout:'fit',
			frame:true,
			containerScroll: true,
			contentEl: 'grafica'
	    	});
    		//--------------------------------------------------------
		this.PerfilWindow = new Ext.Window({
			title	     : Titulo,
			layout       : 'border',
			closeAction  : 'hide',
			resizeHandles: 'all',
			width        : 800,
			height       : 420,
			shadow       : true,
			animCollapse : true,
			collapsible  : true,
			resizable    : true,
			plain        : true,
			renderTo     : document.body,
			listeners    : {'hide':function(p){ if(closeWindow)closeWindow(); }},
			items	     : [PanelG, PanelH, PanelT]

		});
		//--------------------------------------------------------
        }
	//...................................................................
        this.PerfilWindow.show();
};
//------------------------------------------------------------------------
