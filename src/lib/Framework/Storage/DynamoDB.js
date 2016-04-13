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

	_tables: ['user'],

	/**
	Saves an object at field name
	@param {string} table - The table name
	@param {string} id - The unique row ID
	@param {object} object - The data to store (will be serialized)
	@param {object} [options] - Optional parameters
	@param {function} [options.callback] - Callback method once save has completed.  Returns true if suceeded
	**/
	save: function(table, id, object, options) {
		new Framework.Util.Val(table).is(String).in(this._tables).req();
		new Framework.Util.Val(id).req();
		new Framework.Util.Val(object).is(Object).req();
		var _options = new Framework.Util.Val(options).is(Object);
		var callback = _options.item('callback').is(Function).val();
		var fn = this._aws[table+'Put'];
		object.id = id;
		fn({}, object)
		.then(function(result){
			Framework.Storage.DynamoDB._response('save', result, callback);
		}).catch( function(result){
			Framework.Storage.DynamoDB._response('save', result, callback);
		});
	},

	_response: function(action, result, callback) {
		var returns = {};
		if (result.data == null) {
			console.log('Unexpected API result: ', result);
			returns = { 'status': 'Network error', data: result }
		}
		else if (result.status != 200 || result.data.errorType != null) {
			console.log('API error: ', result);
			returns = { 'status': 'API error', data: result.data }
		} else {
			returns = { 'status': 'OK' }
			if (action == 'save')
				returns.data = null;
			else if (action == 'load') {
				if (result.data.Item)
					returns.data = result.data.Item;
				else
					returns.data = null;
			}
			else
				returns.data = result.data;
		}
		if (callback != null)
			callback(returns);
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
		var fn = this._aws[table+'Get'];
		fn({id: id}, {})
		.then(function(result){
			Framework.Storage.DynamoDB._response('load', result, callback);
		}).catch( function(result){
			Framework.Storage.DynamoDB._response('load', result, callback);
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
		var fn = this._aws[table+'Delete'];
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
		//Framework.Storage.DynamoDB.save('user', 'mocha-1', { name: 'mocha-1' });
		//Framework.Storage.DynamoDB.load('map', 'mocha-1', function(item) {});
	});
});