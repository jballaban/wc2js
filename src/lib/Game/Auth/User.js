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
		this.save(user);
		callback();
	},

	save: function(user) {
		// WARNING VERY NOT THREAD SAFE... just can't be bothered yet.
		Framework.Storage.DynamoDB.load('user', user.Id, function(result) {
			if (result.status == 'OK') {
				if (result.data == null)
					result.data = {
						logins: [],
						profile: user._data
					}
				result.data.logins.push(Date.now());
				Framework.Storage.DynamoDB.save('user', user.Id, result.data);
			}
		});
	}
}