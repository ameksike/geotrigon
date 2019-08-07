/*
 * Modification of extJs PropertyGrid
 * @author wam
 */
Ext.namespace('Ext.ux.wam');
Ext.onReady(function() {
	Ext.getBody().createChild({
		tag: 'style',
		type: 'text/css',
		html: '.x-props-grid .x-item-disabled .x-grid3-cell-inner {color: gray !important; font-style: italic !important}'
	});
})
/**
 * @class Ext.ux.wam.PropertyRecord
 * A specific {@link Ext.data.Record} type that represents a name/value pair and is made to work with the
 * {@link Ext.grid.PropertyGrid}. PropertyRecords are the standard type supposed to be created in the Ext.data.Store attached
 * to the grid. The grid will only display name (or text if exists) and value. Other attributes will be hidden.
 * <pre><code>
var rec = new Ext.grid.PropertyRecord({
	name: 'birthday',
	text: 'Date of Birth', //Optional value to display, as name should be a valid id.
    value: new Date(Date.parse('05/26/1972')),
    disabled: true, //True to disable user-edition, false is default.
    editor: //Optionnal value to add a specific editor
    group: //Optionnal value to add a group field, and allow the use of a GroupingView 
});
// Add record to an already populated grid
grid.store.addSorted(rec);
</code></pre>
 * @constructor
 * @param {Object} config A data object in the format: {name: [name], value: [value]}.  The specified value's type
 * will be read automatically by the grid to determine the type of editor to use when displaying it.
 */
Ext.ux.wam.PropertyRecord = Ext.data.Record.create([
    {name:'name',type:'string'},
	{name:'text',type:'string'},
	'value',
	{
		name:'disabled',
		type:'boolean'
	},
	'editor',
	'group',
	'renderer',
     'type'
]);


/**
 * @class Ext.ux.wam.PropertyColumnModel
 * @extends Ext.grid.ColumnModel
 * A custom column model for the {@link Ext.grid.PropertyGrid}.  Generally it should not need to be used directly.
 * @constructor
 * @param {Ext.grid.Grid} grid The grid this store will be bound to
 * @param {Object} source The source data config object
 */
Ext.ux.wam.PropertyColumnModel = function(store){
	this.store = store;
    Ext.ux.wam.PropertyColumnModel.superclass.constructor.call(this, [
        {header: Ext.grid.PropertyColumnModel.prototype.nameText, width:50, sortable: true, dataIndex:'name', id: 'name'},
        {header: Ext.grid.PropertyColumnModel.prototype.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value'},
		{header: 'group', hidden: true, dataIndex:'group',id:'group'}
    ]);

    this.bselect = Ext.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor x-hide-display', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    var bfield = new Ext.form.Field({
        el:this.bselect,
        bselect : this.bselect,
        autoShow: true,
        getValue : function(){
            return this.bselect.value == 'true';
        }
    });

    this.editors = {
        'date' : new Ext.grid.GridEditor(new Ext.form.DateField({selectOnFocus:true})),
        'string' : new Ext.grid.GridEditor(new Ext.form.TextField({selectOnFocus:true})),
        'number' : new Ext.grid.GridEditor(new Ext.form.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new Ext.grid.GridEditor(bfield)
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
};

Ext.extend(Ext.ux.wam.PropertyColumnModel, Ext.grid.ColumnModel, {
    // private
    renderDate : function(dateVal){
        return dateVal.dateFormat(Ext.grid.PropertyColumnModel.prototype.dateFormat);
    },

    // private
    renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

    // private
    isCellEditable : function(colIndex, rowIndex){
        return (colIndex == 1) && (this.store.getAt(rowIndex).data['disabled']!==true);
    },
	
    // private
    getRenderer : function(col){
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },

    // private
    renderProp : function(value,metadata,record){
        return record.data['text'] || record.data['name'];
    },

    // private
    renderCell : function(value,metadata,record){
        var rv = value;
		if (record.data['renderer'] == "") {
			if (value instanceof Date) {
				rv = this.renderDate(value);
			}
			else 
				if (typeof value == 'boolean') {
					rv = this.renderBool(value);
				}
			rv = Ext.util.Format.htmlEncode(rv);
		}
		else {
			rv = record.data['renderer'].call(this, value);
		} 
		return rv;
    },

    // private
    getCellEditor : function(colIndex, rowIndex){
        var p = this.store.getAt(rowIndex);
		var val = p.data['value'];
        if(p.data['editor']!==""){
            return p.data['editor'];
        }
        if(val instanceof Date){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    }
});

/**
 * @class Ext.ux.wam.PropertyGrid
 * @extends Ext.grid.EditorGridPanel
 * A specialized grid implementation intended to mimic the traditional property grid as typically seen in
 * development IDEs.  Each row in the grid represents a property of some object, and the data is stored
 * as a set of name/value pairs in {@link Ext.grid.PropertyRecord}s.  Example usage:
 * <pre><code>
var grid = new Ext.grid.PropertyGrid({
    title: 'Properties Grid',
    autoHeight: true,
    width: 300,
    renderTo: 'grid-ct',
    source: {
        "(name)": "My Object",
        "Created": new Date(Date.parse('10/15/2006')),
        "Available": false,
        "Version": .01,
        "Description": "A test object"
    }
});
</pre></code>
 * @constructor
 * @param {Object} config The grid config object
 */
Ext.ux.wam.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {
    /**
    * @cfg {Object} source A data object to use as the data source of the grid (see {@link #setSource} for details).
    */
    /**
    * @cfg {Object} customEditors An object containing name/value pairs of custom editor type definitions that allow
    * the grid to support additional types of editable fields.  By default, the grid supports strongly-typed editing
    * of strings, dates, numbers and booleans using built-in form editors, but any custom type can be supported and
    * associated with a custom input control by specifying a custom editor.  The name of the editor
    * type should correspond with the name of the property that will use the editor.  Example usage:
    * <pre><code>
var grid = new Ext.grid.PropertyGrid({
    ...
    customEditors: {
        'Start Time': new Ext.grid.GridEditor(new Ext.form.TimeField({selectOnFocus:true}))
    },
    source: {
        'Start Time': '10:00 AM'
    }
});
</code></pre>
    */

    // private config overrides
    enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    /*viewConfig : {
        forceFit:true,
		getRowClass: function(record) {
			return (record.data['disabled']==true) ? "x-item-disabled" : "";
		}
    },*/

    // private
    initComponent : function(){
        this.lastEditRow = null;
        var cm = new Ext.ux.wam.PropertyColumnModel(this.store);
        this.store.sort('text', 'ASC');
        this.store.setDefaultSort('text', 'ASC');
        this.addEvents(
            /**
             * @event beforepropertychange
             * Fires before a property value changes.  Handlers can return false to cancel the property change
             * (this will internally call {@link Ext.data.Record#reject} on the property's record).
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing
             */
            'beforepropertychange',
            /**
             * @event propertychange
             * Fires after a property value has changed.
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing
             */
            'propertychange'
        );
        this.cm = cm;
        Ext.ux.wam.PropertyGrid.superclass.initComponent.call(this);

        this.selModel.on('beforecellselect', function(sm, rowIndex, colIndex){
            if (this.store.getAt(rowIndex).data['disabled']==true) {return false;}
			if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
    },

    // private
    onRender : function(){
        Ext.ux.wam.PropertyGrid.superclass.onRender.apply(this, arguments);

        this.getGridEl().addClass('x-props-grid');
    }
});
