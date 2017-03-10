"use strict";
/**
Google Authentication
@namespace
**/
Framework.Auth.Google = {
	/**
	Authenticates the user against google and then calls complete function
	@param {function} ready - Called once authentication is complete
	**/
	auth: function(ready) {
		Framework.Auth.User.load();
		if (Framework.Auth.User.Token != null) {
			this._getProfile(
				ready, 
				function(message) { console.log('Auth error: '+message); }
			);
		} else {
			var params = Framework.Util.Querystring.getMap(location.hash.substring(1));
			if (params['access_token'] != undefined) {
				Framework.Auth.User.Token = params;
				Framework.Auth.User.save();
				location.replace([location.protocol, '//', location.host, location.pathname].join(''));
			} else {
				location.replace('https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=271838936260-qo5k99hb7ef6fiolmgu8dp0o00g331ug.apps.googleusercontent.com&redirect_uri='+encodeURIComponent([location.protocol, '//', location.host, location.pathname].join(''))+'&scope=profile');
			}
		}
	},

	_getProfile: function (success, failure) {
		gapi.auth.setToken(Framework.Auth.User.Token);
		gapi.client.load('plus', 'v1').then(function() {
			var request = gapi.client.plus.people.get({ 'userId': 'me' });
			request.then(function(resp) {
				Framework.Auth.User.Photo = resp.result.image.url;
				Framework.Auth.User.Id = resp.result.id;
				Framework.Auth.User.Name = resp.result.displayName;
				Framework.Auth.User._data = resp.result;
				Framework.Auth.User.save();
				success();
			}, function(reason) {
				failure(reason.result.error.message);
			});
		});
	}
}

describe('Framework.Auth.User', function() {
	it('*', function() {
		// cannot really test this?
	});
});