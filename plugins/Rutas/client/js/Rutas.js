std.include("plugins/Rutas/client/css/controls.css");
Kcl.Class( "Kcl.Rutas",
{
	extend: Kcl.Plugin,
	behavior: {
		buildGUI:function(params){
			var TabRuta = {
				title: 'Analisis de Rutas',frame: true,
				id: "route",
				iconCls: 'tabs',
				closable: true,
				items: [
					{
						html:"Infox"
					},{
						xtype: "form",
						labelWidth: 75, 
						url:'save-form.php',
						frame:true,
						title: 'Simple Form',
						bodyStyle:'padding:5px 5px 0',
						width: 350,
						defaults: {width: 230},
						defaultType: 'textfield',

						items: [{
							fieldLabel: 'First Name',
							name: 'first',
							id: 'first',
							allowBlank:false
						    },{
							fieldLabel: 'Last Name',
							name: 'last',
							id: 'last'
						    },{
							fieldLabel: 'Company',
							name: 'company'
						    }, {
							fieldLabel: 'Email',
							name: 'email',
							vtype:'email'
						    }, new Ext.form.TimeField({
							fieldLabel: 'Time',
							name: 'time',
							minValue: '8:00am',
							maxValue: '6:00pm'
						    })
						],

						buttons: [{
						    text: 'Save',
						    handler : function(){
								std.FrontController.send({
									action: 'reedRegistro',	
									controller: "Rutas",
									certificate: "232324877",
									params: {
										first: Ext.get("first").getValue(),
										last: Ext.get("last").getValue()
									}
								});
							}
						},{
						    text: 'Cancel',
				    		    handler : function(){
								std.FrontController.send({
									action: 'showRegistro',	
									controller: "Rutas",
									certificate: "232324877",
									params: {
										first: Ext.get("first").getValue(),
										last: Ext.get("last").getValue()
									}
								});
							}
						}]
					},{
						html:"<div id='out'></div>"
				}]
			};

			params.gui.toolBar.addButton({
				id: 'Rutas',
				control: true,
				iconCls: 'tb3m',
				tooltip: 'Analisis de Rutas',
				handler: function (){
					params.gui.region.east.add(TabRuta);
				}
			});
		},
		serverResponse: function(objResponse){
			document.getElementById("out").innerHTML = "<b>First: </b>"+objResponse.first;
			document.getElementById("out").innerHTML += "</br><b>Last: </b>"+objResponse.last;
		}		
	}
});
