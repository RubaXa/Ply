'use strict';

module.exports = function (grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		version: {
			src: ['src/Ply.es6']
		},

		es6transpiler: {
			core: {
				src: 'Ply.es6',
				dest: 'Ply.js'
			}
		},

		export: {
			src: "src/Ply.es6",
			dst: "Ply.es6"
		},

		watch: {
			scripts: {
				files: 'src/*.es6',
				tasks: ['es'],
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
					linesThresholdPct: 90,
					statementsThresholdPct: 90,
					functionsThresholdPct: 90,
					branchesThresholdPct: 90
				}
			}
		},

		uglify: {
			options: {
				banner: '/*! <%= pkg.exportName %> <%= pkg.version %> - <%= pkg.license %> | <%= pkg.repository.url %> */\n'
			},
			dist: {
				files: {
					  '<%= pkg.exportName %>.min.js': ['Ply.js']
				}
			}
		}
	});



	grunt.registerTask('export', 'Export es6 to js', function () {
		function file(rel, name) {
			return rel.split('/').slice(0, -1).concat(name).join('/') + '.es6';
		}

		function parse(src, pad) {
			grunt.log.writeln((pad || '') + 'Parse file:', src);

			return grunt.file.read(src)
				.replace(/module\.exports\s*=\s*([\s\S]+);/, '$1')
				.replace(/require\('(.*?)'\);?/g, function (_, name) {
					return parse(file(src, name), '  ');
				})
				.replace(/\/+\s+&import\s+"(.*?)".*?\n/g, function (_, name) {
					return parse(file(src, name), '  ');
				})
				.trim()
			;
		}

		var config = grunt.config(this.name);
		var content = parse(config.src).replace(/;;;[^\n]+/g, '');

		grunt.log.writeln(new Array(50).join('-'));
		grunt.log.oklns('Write file:', config.dst);

		grunt.file.write(config.dst, content);
	});



	grunt.loadNpmTasks('grunt-version');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-qunit-istanbul');
	grunt.loadNpmTasks('grunt-es6-transpiler');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	grunt.registerTask('es', ['export', 'es6transpiler']);
	grunt.registerTask('build', ['es', 'qunit']);
	grunt.registerTask('min', ['uglify']);
	grunt.registerTask('dev', ['es', 'watch']);
	grunt.registerTask('quick', ['es', 'min']);
	grunt.registerTask('default', ['version', 'build', 'min']);
};
