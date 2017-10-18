module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-ts');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bump');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					port: 8080,
					base: './build'
				}
			}
		},
		clean: {
			dev: ['./build']
		},
		copy: {
			dev: {
				files: [
					{
						src: './src/index.html.ejs',
						dest: './build/index.html',
					},
					{
						expand: true,
						src: [
							'./src/game.js',
							'./node_modules/fpsmeter/dist/fpsmeter.js',
							'./node_modules/requirejs/require.js'
						],
						dest: './build',
						flatten: true
					}
				],
				options: {
					process: function (content, srcpath) {
						return grunt.template.process(content);
					}
				}
			}
		},
		ts: {
			options: {
				target: 'es6',                 // target javascript language. [es3 | es5 (grunt-ts default) | es6]
				module: 'amd',                 // target javascript module style. [amd (default) | commonjs]
				sourceMap: true,               // generate a source map for every output js file. [true (default) | false]
				sourceRoot: './src',                // where to locate TypeScript files. [(default) '' == source ts location]
			},
			dev: {
				src: ["./src/**/*.ts", "!./src/**/*.test.ts"],          // The source typescript files, http://gruntjs.com/configuring-tasks#files
				// html: ['app/**/**.tpl.html'],  // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
				// reference: 'app/reference.ts', // If specified, generate this file that you can use for your reference management
				out: './src/game.js',             // If specified, generate an out.js file which is the merged js file
				// watch: 'app',                  // If specified, watches this directory for changes, and re-runs the current target
			}
		},
		watch: {
			files: ['./src/**/*.ts', './src/**/*.html.ejs', '!./src/**/*.test.ts'],
			tasks: ['clean:dev', 'ts:dev', 'copy:dev']
		},
		open: {
			dev: {
				path: 'http://localhost:8080/index.html'
			}
		}
	});

	grunt.registerTask('default', ['connect', 'watch', 'open']);

}