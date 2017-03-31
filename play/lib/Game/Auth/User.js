"use strict";
Game.Auth.user = {

	authenticate: function(onlogin) {
		Framework.Auth.User.init();
		Framework.Auth.User.load();
		if (Framework.Auth.User.Id != null) {
			Game.Auth.user._login(onlogin);
		} else {
			setTimeout(function() {
				Framework.Auth.Google.auth(function() {
			  		 Game.Auth.user._login(onlogin);
			  	});
			}, 1000);
		}
	},

	_login: function(callback) {
		// ensure user exists and store login
		document.getElementById('user_photo').src = Framework.Auth.User.Photo;
		document.getElementById('user_name').innerHTML = Framework.Auth.User.Name;
		Game.Auth.user._get(Framework.Auth.User.Id, function(result) {
			if (result.status != 'OK') // TODO: redirect to an error page with try again button
				throw 'Couldn\'t access APIs, please refresh and try again as certain gameplay may be affected'
			if (result.data == null) { // new record
				result.data = {
					logins: [],
					profile: Framework.Auth.User._data,
					settings: {}
				}
			}
			result.data.logins.push(Date.now());
			Game.Auth.user._save(Framework.Auth.User.Id, result.data);
		});
		callback();
	},

	_get: function(userid, callback) {
		Framework.Storage.DynamoDB.load('user', userid, callback);
	},

	_save: function(userid, userrecord) {
		Framework.Storage.DynamoDB.save('user', userid, userrecord);
	}
}