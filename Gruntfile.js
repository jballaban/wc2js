module.exports = function(grunt) {
	 grunt.initConfig({
	 	clean: ['build','doc'],
        copy: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**'],
                    dest: 'build'
                }]
            }
        },
        jsdoc: {
            dist : {
                src: ['src/lib/**/*.js'],
                options: {
                    destination: 'doc',
                    template: './node_modules/jaguarjs-jsdoc-patched-2',
                    configure: 'jsdoc.json'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.registerTask('build', ['clean','copy', 'jsdoc']);
}