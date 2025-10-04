/* global module:false */
module.exports = function(grunt) {
	// Just-in-time plugin loader:
	// Automatically loads any grunt plugin tasks as they are needed.
	// This is faster and cleaner than writing `grunt.loadNpmTasks()` for every plugin.
	require('jit-grunt')(grunt);

	// Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Development Server
		connect: {
			server: {
				options: {
					port: grunt.option('port') || 8000,
					base: '.',
					// Injects a script into your pages for live reloading
					livereload: true
				}
			}
		},

		//  Watch for Changes & LiveReload 
		watch: {
			options: {
				// Enables the livereload functionality in the browser
				livereload: true,
				// Prevents the Grunt process from crashing on an error
				spawn: false
			},
			// Target for Sass files
			sass: {
				files: ['**/*.scss'],
				tasks: ['sass', 'autoprefixer']
			},
			// Target for JavaScript files
			js: {
				files: ['**/*.js', '!node_modules/**'],
				tasks: ['jshint']
			},
			// Target for reloading when Gruntfile itself changes
			gruntfile: {
				files: ['Gruntfile.js']
			}
		},

		// --- Sass Compilation ---
		sass: {
			options: {
				// Use the modern Dart Sass implementation
				implementation: require('node-sass'),
				sourceMap: true
			},
			dist: {
				// DYNAMIC MAPPING:
				// This automatically finds all .scss files in any subdirectory
				// and compiles them to a .css file in the same directory.
				files: [{
					expand: true,    // Enable dynamic expansion
					src: ['**/*.scss', '!node_modules/**'], // Source files pattern
					ext: '.css'      // The output file extension
				}]
			}
		},

		// --- CSS Vendor Prefixes ---
		autoprefixer: {
			options: {
				// Configure which browsers to support
				browsers: ['last 2 versions', 'ie 11']
			},
			dist: {
				// DYNAMIC MAPPING:
				// Automatically finds all generated CSS files to add prefixes to them.
				files: [{
					expand: true,
					src: ['**/*.css', '!node_modules/**']
				}]
			}
		},

		// --- JavaScript Linting ---
		jshint: {
			options: {
				curly: false,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				eqnull: true,
				browser: true,
				expr: true,
				globals: {
					head: false,
					module: false,
					console: false
				}
			},
			// Check our Gruntfile and all JS files, excluding vendor libraries
			all: ['Gruntfile.js', '**/*.js', '!node_modules/**']
		},
		
		// --- Production Build Tasks ---

		// Clean task to remove generated files
		clean: {
			css: ['**/*.css', '**/*.css.map', '!node_modules/**']
		},

		// Minify CSS
		cssmin: {
			build: {
				files: [{
					expand: true,
					src: ['**/*.css', '!**/*.min.css', '!node_modules/**'], // Source all CSS but not already minified ones
					dest: '.',
					ext: '.min.css' // Output as .min.css
				}]
			}
		},

		// Minify JavaScript (This was in your dependencies but not used)
		uglify: {
			build: {
				options: {
					banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				files: [{
					expand: true,
					src: ['**/*.js', '!**/*.min.js', '!Gruntfile.js', '!node_modules/**'],
					dest: '.',
					ext: '.min.js'
				}]
			}
		}

	});

	// --- Task Registration ---

	// Default task: Compile Sass and add vendor prefixes.
	// Run with: `grunt`
	grunt.registerTask('default', ['sass', 'autoprefixer']);

	// Development task: Start a server and watch for changes.
	// Run with: `grunt serve`
	grunt.registerTask('serve', ['default', 'connect', 'watch']);
	
	// Production Build task: Clean, lint, compile, and minify all assets.
	// Run with: `grunt build`
	grunt.registerTask('build', ['clean', 'jshint', 'default', 'cssmin', 'uglify']);
};
