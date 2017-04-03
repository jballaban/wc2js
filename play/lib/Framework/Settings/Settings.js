"use strict";
/**
Generic animation effects
@namespace
**/
Framework.Settings = {
	/**
	Manages user settings & persistence
	@param {Function} callback - The callback to fire once settings have been loaded from the server
	**/
	init () {
		this._store = new Framework.Storage.DynamoDB();
		this._data = {  // defaults
			fullscreen: false
		}
		this._load();
	},

	/** 
	Returns the current setting state (note NOT the actual stat as user could have switched out of fullscreen manually)
	**/
	getFullscreen: function() {
		return this._data.fullscreen;
	},

	/**
	Saves the users fullscreen setting to true and if runtime is passed attemps to takeover.  Automatically persists data.
	@param {bool} value - Bool indicating if user wants fullscreen or not
	**/
	setFullscreen: function(value) {
		if (this._data.fullscreen != value) {
			this._data.fullscreen = value;
			this._save();
		}
		//if (runtime != null)
		//	runtime.setFullscreen();
	},
/*
	get playMusic() {
		return this.data.playMusic;
	}

	set playMusic(value) {
		this.data.playMusic = value;
		this._save();
		if (value)
			Runtime.playMusic();
		else
			Runtime.stopMusic();
	}

	get lockMouse() {
		return this.data.lockMouse;
	}

	set lockMouse(value) {
		this.data.lockMouse = value;
		Framework.MouseHandler.setLock(value);
		// does not save as we cannot persist state
	}
*/

	_save: function() {
		if (this._loaded) // only save settings if we've synced
			this._store.save('settings', this._data);
	},

	_load: function() {
		let result = this._store.load('settings');
		if (result != null)
			this._data = result;
	}

}