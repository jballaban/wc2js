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
					base: './dist'
				}
			}
		},
		clean: {
			dev: ['./src/dist', './src/bin'],
			cleanup: ['./.tscache', './src/bin', './*.tmp.txt']
		},
		copy: {
			dev: {
				files: [
					{
						src: './src/index.html.ejs',
						dest: './dist/index.html',
					},
					{
						expand: true,
						src: [
							'./src/bin/game.js',
							'./node_modules/fpsmeter/dist/fpsmeter.js',
							'./node_modules/requirejs/require.js'
						],
						dest: './dist',
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
			default: {
				tsconfig: true
			}
		},
		open: {
			dev: {
				path: 'http://localhost:8080/index.html'
			}
		},
		watch: {
			files: ['./src/**/*.ts', './src/**/*.html.ejs'],
			'tasks': ['bump', 'readpkg', 'clean:dev', 'ts', 'copy:dev', 'clean:cleanup']
		},
		bump: {
			options: {
				commit: false,
				push: false,
				createTag: false
			}
		}
	});
	grunt.registerTask('readpkg', 'Read in the package.json file', function () {
		grunt.config.set('pkg', grunt.file.readJSON('./package.json'));
	});
	grunt.registerTask('default', ['connect', 'open', 'watch']);
}