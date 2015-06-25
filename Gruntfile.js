
module.exports = function( grunt ) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
            ' * <%= pkg.name %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' * Version: <%= pkg.version %>\n' +
            ' * License: <%= pkg.license %>\n' +
            ' */\n',

    jshint: {
      dev: [ 'src/**/*.js'  ],
      options: grunt.file.readJSON('.jshintrc')
    },

    copy: {
      js: {
        files: {
          'dist/angular-packery.js': [ 'src/angular-packery.js' ]
        }
      }
    },

    uglify: {
      min: {
        files: {
          'dist/angular-packery.min.js': [ 'dist/angular-packery.js' ]
        }
      }
    },

    usebanner: {
      dist: {
        files: {
          src: [
            'dist/angular-packery.js',
            'dist/angular-packery.min.js'
          ]
        },
        options: {
          position: 'top',
          banner: '<%= banner %>'
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-banner');

  grunt.registerTask( 'default', [
    'test'
  ]);

  grunt.registerTask( 'dist', [
    'jshint',
    'copy',
    'uglify',
    'usebanner'
  ]);

  grunt.registerTask( 'test', [
    'jshint'
  ]);

};
