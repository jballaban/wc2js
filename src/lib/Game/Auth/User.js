"use strict";
/**
Holding screen while we auth the user
@extends Framework.UI.Screen
**/
Game.Auth.user = {
	
	authenticate: function(onlogin) {
		Framework.Auth.User.init();
		Framework.Auth.User.load();

		if (Framework.Auth.User.Id != null) {
			Game.Auth.user.login(Framework.Auth.User, onlogin);
		} else {
			setTimeout(function() {
				Framework.Auth.Google.auth(function() {
			  		 Game.Auth.user.login(Framework.Auth.User, onlogin);
			  	});
			}, 1000);
		}
	},

	login: function(user, callback) {
		// ensure user exists and store login
		document.getElementById('user_photo').src = user.Photo;
		document.getElementById('user_name').innerHTML = user.Name;
		this.get(user.Id, function(result) {
			if (result.status != 'OK') // TODO: redirect to an error page with try again button
				throw 'Couldn\'t access APIs, please refresh and try again as certain gameplay may be affected'
			if (result.data == null) { // new record
				result.data = {
					logins: [],
					profile: user._data
				}
			}
			result.data.logins.push(Date.now());
			Game.Auth.user.save(user.Id, result.data);
		});
		callback();
	},

	get: function(userid, callback) {
		Framework.Storage.DynamoDB.load('user', userid, callback);
	},

	save: function(userid, data) {
		Framework.Storage.DynamoDB.save('user', userid, data);
	}
}