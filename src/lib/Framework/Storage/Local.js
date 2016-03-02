"use strict";
/**
Data persistance management.  Currently all works off browser localStorage
@namespace
**/
Framework.Storage.Local = {
	/**
	Saves an object at field name
	@param {string} field - The storage key
	@param {object} object - JSON data to store (will be serialized)
	**/
	save: function(table, id, object) {
		window.localStorage.setItem(table+'-'+id, JSON.stringify(object));
	},

	/**
	Loads data at a specified key
	@param {string} field - The key to query
	**/
	load: function(table, id) {
		return JSON.parse(window.localStorage.getItem(table+'-'+id));
	},

	/**
	Removes a specific key and data from storage
	@param {string} field - The key to remove
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