'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/**', 'example/js/**'],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files: ['src/**', 'example/js/**'],
      tasks: ['jshint', 'build'],
      options: {
        livereload: true,
      },
    },
    browserify: {
      dist: {
        src: 'example/js/app.js',
        dest: 'example/bundle.js'
      },
      options: {
        browserifyOptions: {
          debug: true
        }
      }
    },
    clean: ['example/bundle.js'],
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'example',
          livereload: true,
          open: true
        }
      }
    }
  });

  // Load all modules
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default',
    ['jshint', 'clean', 'browserify', 'connect', 'watch']
  );

};
