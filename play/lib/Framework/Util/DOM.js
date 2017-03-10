"use strict";
/**
DOM manipulation tools
@namespace
**/
Framework.Util.DOM = {
	/**
	Creates a video DOM element
	@param {string} src - Video source
	@param {number} x - absolute X position
	@param {number} y - absolute y position
	@param {number} width - Width
	@param {number} height - Height
	@param {bool} autoplay - Autoplay
	@param {bool} loop - Loop
	@param {function} oncomplete - Callback on video complete
	@returns {object} - Video DOM reference
	**/
	addVideo: function(src, x, y, width, height, autoplay, loop, oncomplete) {
	    var video = document.createElement('video');
	    var source = document.createElement('source');
	    video.appendChild(source);
	    source.setAttribute('src', src);
	    source.setAttribute('type', 'video/mp4');
		video.setAttribute('style', 'left:'+x+';top:'+y+';');
		this.setAttribute(video, 'width', width);
		this.setAttribute(video, 'height', height);
		this.setAttribute(video, 'autoplay', autoplay ? 'true' : null);
		this.setAttribute(video, 'loop', loop ? 'true' : null);
		if (oncomplete != null)
			video.onended = function() { oncomplete(); }.bind(this);
		document.body.appendChild(video);
		return video;
	},

	/**
	Creates an audio DOM element
	@param {string} src - Audio source
	@param {bool} autoplay - Autoplay
	@param {bool} loop - Loop
	@returns {object} - Audio DOM reference
	**/
	addAudio: function(src, autoplay, loop) {
 		var audio = document.createElement('audio');
	    audio.setAttribute('hidden', 'true');
	    var source = document.createElement('source');
	    source.setAttribute('src', src);
	    source.setAttribute('type', 'audio/mpeg');
	    audio.appendChild(source);
    	this.setAttribute(audio, 'autoplay', autoplay ? 'true' : null);
    	this.setAttribute(audio, 'loop', loop ? 'true' : null);
    	document.body.appendChild(audio);
    	return audio;
	},

	/**
	Creates a DIV DOM element
	@param {string} classname - Class to apply
	@returns {object} - DIV DOM reference
	**/
	addDiv: function(classname) {
		var div = document.createElement('div')
		this.setAttribute(div, 'class', classname);
		document.body.appendChild(div);
		return div;
	},

	/**
	Removes an element from DOM
	@param {object} el - The element to remove
	**/
	removeElement: function(el) {
		el.parentNode.removeChild(el);
	},

	/**
	Applies an attribute value to a DOM element.
	@param {object} el - The DOM element to adjust
	@param {string} attribute - Attribute name
	@param {string} value - The value to apply.  If null then the attribute will be removed.
	**/
	setAttribute: function(el, attribute, value) {
		if (value == null)
			el.removeAttribute(attribute);
		else
			el.setAttribute(attribute, value);
	}
}

describe('Framework.Util.DOM', function() {
	it('#*', function() {
		
	});
});