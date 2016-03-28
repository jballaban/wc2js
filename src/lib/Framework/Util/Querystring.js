/**
Querystring tools
@namespace
**/
Framework.Util.Querystring = {
	getQuerystring() {
		var href = window.location.href.split('?');
		if (href.length == 0)
			return '';
		return href[1];
	},

	/**
	Returns the querystring as a map
	@param {string} querystring - Querystring (after ?)
	@returns {object}
	**/
	getMap(querystring) {
		if (querystring == undefined)
			querystring = location.search.substring(1);
		var params = {}, regex = /([^&=]+)=([^&]*)/g, m;
	    while (m = regex.exec(querystring)) {
	      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	    }
	    return params;
	}
}

describe('Framework.Util.Querystring', function() {
	it('#getMap', function() {
		assert.equal(Framework.Util.Querystring.getMap("this=that&test=them&there=their")['this'], "that");
	});
});