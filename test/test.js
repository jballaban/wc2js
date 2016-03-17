assert = require('assert');
var https = require('https');

var api = { host: 'oy1ftr1rbk.execute-api.us-east-1.amazonaws.com', path: '/dev' };

// options define only relative path and method
function _api(options, item, callback) {
	options.host = api.host;
	options.path = api.path+options.path;

	var payload = JSON.stringify(item);
	var req = https.request(options, function(res) {
		var bodyparts = [];
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			bodyparts.push(chunk);
		});
		res.on('end', function() {
			callback(JSON.parse(bodyparts.join('')));
		});
	});

	req.write(payload)
	req.end();
}

Framework = {
	mode: 'debug'
}

runtime = {
	canvas: {
		font: '',
		measureText: function(text) { return { width: 1 }; },
		quadraticCurveTo: function(a, b, c, d) {},
		lineTo: function (a, b) {},
		globalAlpha: 1,
		beginPath: function() {},
		moveTo: function(a, b) {},
		closePath: function() {},
		fill: function() {},
		fillStyle: '#000',
		strokeStyle: '#000',
		stroke: function() {},
		drawImage: function (a, b, c, d, e, f, g) {},
		fillText: function (a, b, c, d) {},
		clearRect: function (a, b, c, d) {}
	}
}

// AWS overrides
apigClientFactory = {
	_result: {
		then: function(a) {
			return {
				catch: function(a) {

				}
			}
		}
	},
	newClient: function() {
		return {
			mapPost: function(a, b) { return apigClientFactory._result; },
			mapGet: function (a, b) { return apigClientFactory._result; }
		}
	}
}

Image = function() {
	src = '';
}

window = {
	localStorage: {
		setItem: function(a, b) {
			this[a] = b;
		},
		getItem: function(a) {
			return this[a];
		},
		removeItem: function(a) {
			this[a] = null;
		}
	}
}

performance = {
	now: function() {
		return new Date().getTime();
	}
}

document = {
	body: {
		requestPointerLock: function () {},
		appendChild: function (a) {}
	},
	exitPointerLock: function () {},
	addEventListener: function (a, b) {},
	createElement: function (a) {
		return {
			setAttribute: function (a, b) {},
			removeAttribute: function (a) {},
			appendChild: function (a) {},
			play: function() {},
			pause: function() {},
			parentNode: {
				removeChild: function(a) {}
			}
		}
	}
}

require('../src/lib/Framework/Util/Util.js');
require('../src/lib/Framework/Util/Val.js');
require('../src/lib/Framework/Util/Math.js');
require('../src/lib/Framework/Util/Querystring.js');
require('../src/lib/Framework/Util/Timer.js');
require('../src/lib/Framework/Util/Colour.js');
require('../src/lib/Framework/Util/Animate.js');
require('../src/lib/Framework/Util/DOM.js');
require('../src/lib/Framework/UI/UI.js');
require('../src/lib/Framework/UI/iDrawable.js');
require('../src/lib/Framework/UI/Text.js');
require('../src/lib/Framework/UI/Rectangle.js');
require('../src/lib/Framework/UI/Image.js');
require('../src/lib/Framework/UI/Element.js');
require('../src/lib/Framework/UI/Cursor.js');
require('../src/lib/Framework/UI/Video.js');
require('../src/lib/Framework/IO/IO.js');
require('../src/lib/Framework/IO/Mouse.js');
require('../src/lib/Framework/IO/MouseHandler.js');
Framework.UI.Cursor.init(runtime.canvas); // seed cursors based on our context
Framework.IO.MouseHandler.init(100, 100); // seed cursors based on our context
require('../src/lib/Framework/IO/Audio.js');
require('../src/lib/Framework/UI/Button.js');
require('../src/lib/Framework/UI/Checkbox.js');
require('../src/lib/Framework/UI/Modal.js');
require('../src/lib/Framework/UI/Menu.js');
require('../src/lib/Framework/UI/Screen.js');
require('../src/lib/Framework/Storage/Storage.js');
require('../src/lib/Framework/Storage/Local.js');
require('../src/lib/Framework/Storage/DynamoDB.js');
require('../src/lib/Framework/Auth/Auth.js');
require('../src/lib/Framework/Auth/User.js');
require('../src/lib/Framework/Auth/Google.js');
require('../src/lib/Framework/Runtime.js');

describe('API:map', function() {
	this.timeout(5000); // takes a while to post
	it('#CREATE', function (done) {
		var stack = 2;
		_api({ path: '/map', method: 'POST' }, {
			id: 'test-1',
			name: 'test-1'
		}, function(result) {
			assert.equal(JSON.stringify(result),JSON.stringify({}), 'Result should be an empty object');
			if (--stack == 0)
				done();
		});
		_api({ path: '/map', method: 'POST' }, {
			id: 'test-2',
			name: 'test-2'
		}, function(result) {
			assert.equal(JSON.stringify(result),JSON.stringify({}), 'Result should be an empty object');
			if (--stack == 0)
				done();
		});
	});

	it('#GET', function (done) {
		_api({ path: '/map?id=test-1', method: 'GET' }, null, function(result) {
			assert.notEqual(result.Item, undefined, 'Could not find Item record in response: '+ JSON.stringify(result));
			assert.notEqual(result.Item.Id, undefined, 'Could not find Id attribute in response: '+JSON.stringify(result));
			done();
		});
	});

	it('#LIST', function (done) {
		_api({ path: '/map?limit=3', method: 'GET' }, null, function(result) {
			assert.notEqual(result.Items, 'Could not find Items collection in response: '+JSON.stringify(result));
			assert.ok(result.Items.length >=2, 'There should be at least 2 records in the response: '+JSON.stringify(result));
			done();
		});
	});

	it('#DELETE', function (done) {
		var stack = 2;

		_api({ path: '/map?id=test-1', method: 'DELETE' }, null, function(result) {
			assert.equal(JSON.stringify(result),JSON.stringify({}), 'Result should be an empty object');
			if (--stack == 0)
				done();
		});
		_api({ path: '/map?id=test-2', method: 'DELETE' }, null, function(result) {
			assert.equal(JSON.stringify(result),JSON.stringify({}), 'Result should be an empty object');
			if (--stack == 0)
				done();
		});
	});

});