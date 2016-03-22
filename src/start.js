var runtime = new Framework.Runtime(document.getElementById('canvas').getContext('2d', { alpha: false }));
Framework.init(runtime, 'debug');
runtime.setScreen(new Game.Auth.Screen());
runtime.start();

Framework.Auth.User.init();
Framework.Auth.User.load();

if (Framework.Auth.User.Id != null) {
	login(Framework.Auth.User);
} else {
	setTimeout(function() {
		Framework.Auth.Google.auth(function() {
	  		 login(Framework.Auth.User);
	  	});
	}, 1000);
}

function login(user) {
	document.getElementById('user_photo').src = user.Photo;
	document.getElementById('user_name').innerHTML = user.Name;
	runtime.screen.loaded();
}