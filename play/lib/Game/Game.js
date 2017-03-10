"use strict";
/**
@namespace
**/
var Game = {
	/**
	@namespace
	**/
	transition: {
		/**
		Changes screen
		**/
		screen: function(dest) {
			Framework.Effect.fade(runtime.screen, runtime.screen, 'alpha', 0, 1000, function() {
				runtime.setScreen(dest);
			});
		},

		/**
		Screen first appears
		**/
		appear: function() {
			Framework.Effect.fade(runtime.screen, runtime.screen, 'alpha', 1, 1000);
		}
	},
	/**
	@namespace
	**/
	trigger: {
		/**
		Button hover states
		@namespace
		**/
		button: {
			/**
			Hover for menu border
			**/
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

			/**
			Hover for button itself
			**/
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
	/**
	@namespace
	**/
	style: {
		/**
		Button styling
		@namespace
		**/
		button: {
			/**
			Large font style
			**/
			bigFont: 'bold 14pt Calibri'
		}
	}
};