"use strict";
/**
@static
**/
Framework.Auth.User = {
	Token: null,
	Id: null,
	Photo: null,
	init: function(storage) {
		this._storage = storage == null ? Framework.Storage.Local : storage;
	},
	load: function() {
		var result = this._storage.load('auth', 'me');
		if (result != null)
			this._fromJSON(result);
	},
	save: function() {
		this._storage.save('auth', 'me', this._toJSON());
	},
	signOut: function() {
		this.Token = null;
		this.Id = null;
		this.Photo = null;
		this.save();
	},
	_fromJSON: function(json) {
		Framework.Auth.User.Token = json.token;
		Framework.Auth.User.Id = json.id;
		Framework.Auth.User.Photo = json.photo;
	},
	_toJSON: function() {
		return {
			token: this.Token,
			id: this.Id,
			photo: this.Photo
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