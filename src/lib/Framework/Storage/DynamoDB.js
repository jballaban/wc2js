"use strict";
/**
Data persistance management.  Currently all works off browser localStorage
@namespace
**/
Framework.Storage.DynamoDB = {
	init: function() {
		this._aws = apigClientFactory.newClient();
	},
	_tables: ['map'],
	/**
	Saves an object at field name
	@param {string} field - The storage key
	@param {object} object - The data to store (will be serialized)
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
	Loads data at a specified key
	@param {string} field - The key to query
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
	Removes a specific key and data from storage
	@param {string} field - The key to remove
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