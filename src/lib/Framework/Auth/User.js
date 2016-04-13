"use strict";
/**
Stores current user information
@namespace
**/
Framework.Auth.User = {
	/**
	Provider token & lifespan.  Stored really only for reference.
	**/
	Token: null,

	/**
	The provider unique user Id.
	**/
	Id: null,

	/**
	The provider user photo URL
	**/
	Photo: null,

	/**
	The provider full user name
	**/
	Name: null,

	/**
	The provider raw data, only set once
	**/
	_data: null,

	/**
	Configures the user data store to use.  Defaults to local.
	**/
	init: function(storage) {
		this._storage = storage == null ? Framework.Storage.Local : storage;
	},

	/**
	Attempts to load the current user from the defined data store
	**/
	load: function() {
		var result = this._storage.load('auth', 'me');
		if (result != null)
			this._fromJSON(result);
	},

	/**
	Saves the current user to the defined data store
	**/
	save: function() {
		this._storage.save('auth', 'me', this._toJSON());
	},

	/**
	Clears current user and data store
	**/
	signOut: function() {
		this.Token = null;
		this.Id = null;
		this.Photo = null;
		this.Name = null;
		this.save();
	},

	_fromJSON: function(json) {
		Framework.Auth.User.Token = json.token;
		Framework.Auth.User.Id = json.id;
		Framework.Auth.User.Photo = json.photo;
		Framework.Auth.User.Name = json.name;
	},
	
	_toJSON: function() {
		return {
			token: this.Token,
			id: this.Id,
			photo: this.Photo,
			name: this.Name
		}
	}
}

describe('Framework.Auth.User', function() {
	it('*', function() {
		Framework.Auth.User.init();
		Framework.Auth.User._fromJSON({
			id: 'test',
			name: 'test-name',
			photo: 'test-photo'
		});
		Framework.Auth.User.save();
		Framework.Auth.User.load();
		assert.equal(Framework.Auth.User.Id, 'test');
		var json = Framework.Auth.User._toJSON();
		assert.equal(json.id, 'test');
	});
});