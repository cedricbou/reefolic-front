module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.initConfig({

    'meta': {
      'jsFilesForTesting': [
        'public/lib/jquery/jquery.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-route/angular-route.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/restangular/dist/restangular.js',
        'public/lib/underscore/underscore.js',
        'public/lib/underscore/underscore.js',
        'test/**/*Spec.js'
      ]
    },

    'pkg': grunt.file.readJSON('package.json'),

    'karma': {
      'development': {
        'configFile': 'karma.conf.js',
        'options': {
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'source/**/*.js'
          ],
        }
      },
      'dist': {
        'options': {
          'configFile': 'karma.conf.js',
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
          ],
        }
      },
      'minified': {
        'options': {
          'configFile': 'karma.conf.js',
          'files': [
            '<%= meta.jsFilesForTesting %>',
            'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js'
          ],
        }
      }
    },

    'jshint': {
      'beforeconcat': ['source/**/*.js'],
    },

    'concat': {
      'dist': {
        'src': ['source/**/*.js'],
        'dest': 'dist/<%= pkg.namelower %>-<%= pkg.version %>.js'
      }
    },

    'uglify': {
      'options': {
        'mangle': false
      },  
      'dist': {
        'files': {
          'dist/<%= pkg.namelower %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.namelower %>-<%= pkg.version %>.js']
        }
      }
    },

    'jsdoc': {
      'src': ['source/**/*.js'],
      'options': {
        'destination': 'doc'
      }
    }

  });

  grunt.registerTask('test', ['karma:development']);
  grunt.registerTask('build',
    [
      'jshint',
      'karma:development',
      'concat',
      'karma:dist',
      'uglify',
      'karma:minified',
      'jsdoc'
    ]);

};