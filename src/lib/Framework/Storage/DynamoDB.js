"use strict";
/**
Data persistance management to AWS DynamoDB
@namespace
**/
Framework.Storage.DynamoDB = {
	/**
	Connects the storage to AWS client
	**/
	init: function() {
		this._aws = apigClientFactory.newClient();
	},

	_tables: ['map'],

	/**
	Saves an object at field name
	@param {string} table - The table name
	@param {string} id - The unique row ID
	@param {object} object - The data to store (will be serialized)
	@param {object} [options] - Optional parameters
	@param {function} [options.callback] - Callback method once save has completed
	**/
	save: function(table, id, object, options) {
		new Framework.Util.Val(table).is(String).in(this._tables).req();
		new Framework.Util.Val(id).req();
		new Framework.Util.Val(object).is(Object).req();
		var _options = new Framework.Util.Val(options).is(Object);
		var callback = _options.item('callback').is(Function).val();
		var fn = null;
		switch (table) {
			case 'map' :
				fn = this._aws.mapPost;
				object.id = id;
				break;
			default:
				throw new Error('Unknown table '+table);
		}
		fn({}, object)
		.then(function(result){
			if (callback != null)
				callback();
		}).catch( function(result){
			if (callback != null)
				callback();
		});
	},

	/**
	Loads data from the database
	@param {string} table - The table to query
	@param {string} id - The row ID
	@param {function} callback - The function to return data with (will take the Item as parameter)
	**/
	load: function(table, id, callback) {
		new Framework.Util.Val(table).is(String).in(this._tables).req();
		new Framework.Util.Val(id).req();
		new Framework.Util.Val(callback).is(Function).req();
		var fn = null;
		switch (table) {
			case 'map' :
				fn = this._aws.mapGet;
				break;
			default:
				throw new Error('Unknown table '+table);
		}
		fn({id: id, limit: 1}, {})
		.then(function(result){
			if (callback != null)
				callback(result.data.Item);
		}).catch( function(result){
			if (callback != null)
				callback();
		});
	},

	/**
	Deletes a row
	@param {string} table - The table top query
	@param {string} id - The unique row id
	@param {options} [options] - Optional parameters
	@param {function} [options.callback] - Callback function on completion (regardless of failure)
	**/
	remove: function(table, id, options) {
		new Framework.Util.Val(table).is(String).in(this._tables).req();
		new Framework.Util.Val(id).req();
		var _options = new Framework.Util.Val(options).is(Object);
		var callback = _options.item('callback').is(Function).val();
		var fn = null;
		switch (table) {
			case 'map' :
				fn = this._aws.mapDelete;
				break;
			default:
				throw new Error('Unknown table '+table);
		}
		fn({id: id}, {id: id})
		.then(function(result){
			if (callback != null)
				callback();
		}).catch( function(result){
			if (callback != null)
				callback();
		});
	}
}

describe('Framework.Storage.DynamoDB', function() {
	it('#save,load,remove', function() {
		// BOOOO CAN'T UNIT TEST THIS SINCE IT REQUIRES BROWSER SO THIS JUST FAKES
		Framework.Storage.DynamoDB.init();
		Framework.Storage.DynamoDB.save('map', 'mocha-1', { name: 'mocha-1' });
		Framework.Storage.DynamoDB.load('map', 'mocha-1', function(item) {
			
		});
	});
});