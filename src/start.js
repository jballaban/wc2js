var runtime = new Framework.Runtime(document.getElementById('canvas').getContext('2d', { alpha: false }));
Framework.init(runtime, 'debug');
runtime.setScreen(new Game.Screen.Auth());
runtime.start();

Framework.Auth.User.init();
Framework.Auth.User.load();

if (Framework.Auth.User.Id != null) {
	user(Framework.Auth.User.Name);
} else {
	setTimeout(function() {
		Framework.Auth.Google.auth(function() {
	  		 user(Framework.Auth.User.Name);
	  	});
	}, 1000);
}

function user(name) {
	document.getElementById('user').innerHTML = name;
	runtime.setScreen(new Game.Screen.MainMenu());
}