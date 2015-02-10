
module.exports = function( grunt ) {

  grunt.initConfig({

    jshint: {
      dev: [ 'resources/js/*.js'  ],
      options: grunt.file.readJSON('.jshintrc')
    },

    connect: {
      dev: {
        options: {
          hostname: 'localhost',
          port: 4000,
          livereload: true,
          keepalive: true
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask( 'default', [
    'jshint',
    'connect'
  ]);

};