var runtime = new Framework.Runtime({
	resize: function(width, height) {
		this.background.canvas.width = this.background.width = width;
		this.background.canvas.height = this.background.height = height;
		this.foreground.canvas.width = this.foreground.width = width;
		this.foreground.canvas.height = this.foreground.height = height;
	},
	background: document.getElementById('background').getContext('2d', { alpha: false }),
	foreground: document.getElementById('foreground').getContext('2d', { alpha: true })
});
var parameters = Framework.Util.Querystring.getMap(Framework.Util.Querystring.getQuerystring())
var mode = parameters.mode == 'prod' ? 'prod' : (location.href.indexOf('localhost') == -1 ? 'prod' : 'debug');
Framework.init(runtime, runtime.canvas.foreground, mode);
runtime.setScreen(new Game.Auth.Screen());
runtime.start();

Framework.Storage.DynamoDB.init()
Game.Auth.user.authenticate(runtime.screen.loaded);