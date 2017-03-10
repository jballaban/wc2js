module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-aws");
  grunt.loadNpmTasks('grunt-jsdoc');
  /*grunt.loadNpmTasks('grunt-contrib-clean');*/
  /*grunt.loadNpmTasks('grunt-contrib-copy');*/

  grunt.initConfig({

    aws: grunt.file.readJSON("aws-credentials.json"),
    
/*
    clean: ['play/dist'],
    copy: {
        www: {
            files: [{
                expand: true,
                cwd: 'src',
                src: ['**'],
                dest: 'dist'
            }]
        }
    },
*/
    s3: {
      options: {
        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        region: 'us-east-1',
        access: 'public-read',
        overwrite: true
      },
      www: {
        options: {
            bucket: "www.wc2js.com"
        },
        cwd: "www",
        src: "**"
      },
      doc: {
        options: {
            bucket: "doc.wc2js.com"
        },
        cwd: "doc",
        src: "**"
      },
      play: {
        options: {
            bucket: "play.wc2js.com"
        },
        cwd: "play",
        src: "**"
      }
    },

    jsdoc: {
        src: ['play/lib/**/*.js'],
        options: {
            destination: 'doc',
            template: './node_modules/jaguarjs-jsdoc-patched-2',
            configure: 'jsdoc.json'
        }
    }
  });
  
  grunt.registerTask("default", ["jsdoc","s3"]);
};