module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-ssh');

  grunt.initConfig({

    'meta': {
      'jsFilesForTesting': [
        'bower_components/jquery/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'bower_components/restangular/dist/restangular.js',
        'bower_components/underscore/underscore.js',
        'bower_components/underscore/underscore.js',
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
    },

    'sftp': {
       'prodA': {
          files: {
	     './': 'dist/**'
	  },
          options: {
             path: '/public/',
             srcBasePath: 'dist/',
             host: 'fiddlewith.it',
             port: 9922,
             privateKey: grunt.file.read("~/.ssh/id_prodA"),
             username: 'deploy_prodA',
             showProgress: true
          }
       },
       'prodB': {
          files: {
	     './': 'dist/**'
	  },
          options: {
             path: '/public/',
             srcBasePath: 'dist/',
             host: 'fiddlewith.it',
             port: 9922,
             privateKey: grunt.file.read(process.env['HOME'] + "/.ssh/id_prodB"),
             username: 'deploy_prodB',
             showProgress: true
         }
       }
    }
  });

  grunt.registerTask('deployProdA', ['sftp:prodA']);
  grunt.registerTask('test', ['karma:development']);
  grunt.registerTask('build',
    [
      'jshint',
      'karma:development',
      'concat',
      'karma:dist',
      'uglify',
      'karma:minified',
      'jsdoc',
      'sftp:prodA'
    ]);

};
