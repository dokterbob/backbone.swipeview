'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      files: ['Gruntfile.js', 'src/js/**'],
      options: {
        jshintrc: true
      }
    },
    watch: {
      files: ['src/**'],
      tasks: ['jshint', 'build'],
      options: {
        livereload: true,
      },
    },
    browserify: {
      dist: {
        src: 'src/js/app.js',
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    sync: {
      dist: {
        expand: true,
        cwd: 'src/',
        src: ['**', '!js/**'],
        dest: 'dist/'
      },
    },
    clean: ['dist'],
    connect: {
      server: {
        options: {
          port: 9001,
          base: 'dist',
          livereload: true,
          open: true
        }
      }
    }
  });

  // Load all modules
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build',
    ['browserify', 'sync']
  );

  grunt.registerTask('default',
    ['jshint', 'clean', 'build', 'connect', 'watch']
  );

};
