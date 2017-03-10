"use strict";
/**
Data persistance management using browser local storage
@namespace
**/
Framework.Storage.Local = {

	/**
	Saves an object
	@param {string} table - The table name (concatenated with id)
	@param {string} id - The row id (concatenated with table)
	@param {object} object - JSON data to store (will be serialized)
	**/
	save: function(table, id, object) {
		window.localStorage.setItem(table+'-'+id, JSON.stringify(object));
	},

	/**
	Loads data from store
	@param {string} table - The tablename (concatenated with id)
	@param {string} id - The row id (concatenated with table)
	**/
	load: function(table, id) {
		return JSON.parse(window.localStorage.getItem(table+'-'+id));
	},

	/**
	Removes a specific row from store
	@param {string} table - The tablename (concatenated with id)
	@param {string} id - The row id (concatenated with table)
	**/
	remove: function(table, id) {
		window.localStorage.removeItem(table+'-'+id);
	}

}

describe('Framework.Storage.Local', function() {
	it('#save,load,remove', function() {
		Framework.Storage.Local.save('person', 1, { name: 'bob', age: 5 });
		assert.equal(Framework.Storage.Local.load('person', 1).name, 'bob');
		Framework.Storage.Local.remove('person', 1);
		assert.equal(Framework.Storage.Local.load('person', 1), null);
	});
});