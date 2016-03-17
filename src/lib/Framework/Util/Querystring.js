/**
@namespace
**/
Framework.Util.Querystring = {
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
		assert.equal(Framework.Util.Querystring.getMap("?this=that&test=them&there=their")['test'], "them");
	});
});