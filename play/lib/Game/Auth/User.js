"use strict";
Game.Auth.user = {

	authenticate: function(onlogin) {
		Framework.Auth.User.init();
		Framework.Auth.User.load();
		if (Framework.Auth.User.Id != null) {
			this._login(onlogin);
		} else {
			setTimeout(function() {
				Framework.Auth.Google.auth(function() {
			  		 this._login(onlogin);
			  	});
			}, 1000);
		}
	},

	_login: function(callback) {
		// ensure user exists and store login
		document.getElementById('user_photo').src = user.Photo;
		document.getElementById('user_name').innerHTML = user.Name;
		this.get(user.Id, function(result) {
			if (result.status != 'OK') // TODO: redirect to an error page with try again button
				throw 'Couldn\'t access APIs, please refresh and try again as certain gameplay may be affected'
			if (result.data == null) { // new record
				result.data = {
					logins: [],
					profile: user._data,
					settings: {}
				}
			}
			result.data.logins.push(Date.now());
			this.save(user.Id, result.data);
		}).bind(this);
		callback();
	},

	_get: function(userid, callback) {
		Framework.Storage.DynamoDB.load('user', userid, callback);
	},

	_save: function(userid, userrecord) {
		Framework.Storage.DynamoDB.save('user', userid, userrecord);
	}
}