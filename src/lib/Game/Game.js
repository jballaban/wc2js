"use strict";
var Game = {
	trigger: {
		button: {
			hoverBackground: function(el) {
				var fromAlpha = el.sprite.alpha;
				var fromMenuColour = el.sprite.colour;
				return function (el, val) {
					var toAlpha = val ? 1 : fromAlpha;
					var toMenuColour = val ? '#000000' : fromMenuColour;
					Framework.Effect.fade(el, el.sprite, 'alpha', toAlpha, 500);
					Framework.Effect.fade(el, el.sprite, 'colour', toMenuColour, 500);
				}
			},
			hover: function(el, menucolour, textcolour) {
				var fromMenuColour = el.sprite.colour;
				var fromTextColour = el.text.colour;
				return function (el, val) {
					var toMenuColour = val ? menucolour : fromMenuColour;
					var toTextColour = val ? textcolour : fromTextColour;
					Framework.Effect.fade(el, el.sprite, 'colour', toMenuColour, 500);
					Framework.Effect.fade(el, el.text, 'colour', toTextColour, 500);
				}
			}
		}
	},
	style: {
		button: {
			bigFont: 'bold 14pt Calibri'
		}
	}
};