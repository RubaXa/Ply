'use strict';

module.exports = function (grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		es6transpiler: {
			core: {
				src: 'src/Ply.es6',
				dest: 'Ply.js'
			},
			ui: {
				src: 'src/Ply.ui.es6',
				dest: 'Ply.ui.js'
			}
		},

		watch: {
			scripts: {
				files: 'src/*.es6',
				tasks: ['es6transpiler'],
				options: { interrupt: true }
			}
		},

		qunit: {
			all: ['tests/*.html'],
			options: {
				'--web-security': 'no',
				coverage: {
					src: ['Ply.js', 'Ply.ui.js'],
					instrumentedFiles: 'temp/',
					htmlReport: 'report/coverage',
					coberturaReport: 'report/',
					linesThresholdPct: 95,
					statementsThresholdPct: 95,
					functionsThresholdPct: 95,
					branchesThresholdPct: 95
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.exportName %> <%= pkg.version %> - <%= pkg.license %> | <%= pkg.repository.url %> */\n'
			},
			dist: {
				files: {
					  '<%= pkg.exportName %>.min.js': ['<%= pkg.exportName %>.js']
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-qunit-istanbul');
	grunt.loadNpmTasks('grunt-es6-transpiler');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('es', ['es6transpiler']);
	grunt.registerTask('build', ['es6transpiler', 'qunit']);
	grunt.registerTask('min', ['build', 'uglify']);
	grunt.registerTask('default', ['build']);
};
