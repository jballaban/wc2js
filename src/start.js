var runtime = new Framework.Runtime(document.getElementById('canvas').getContext('2d', { alpha: false }));
Framework.init(runtime, 'debug');
//runtime.setScreen(new Game.Screen.Load(runtime, new Game.Screen.Intro()));
runtime.setScreen(new Game.Screen.MainMenu());
runtime.start();