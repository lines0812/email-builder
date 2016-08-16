module.exports = function(grunt){

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// secrets.json is ignored in git because it contains sensitive data
		secrets: grunt.file.readJSON('secrets.json'),

		
		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'doctype-first': true,
					'spec-char-escape': true,
					'id-unique': true,
					'head-script-disabled': true,
					'style-disabled': false,
					'alt-require': true
				},
				src: ['*.html']
			}
		},
		sass: {
			app: {
			  // Takes every file that ends with .scss from the scss 
			  // directory and compile them into the css directory. 
			  // Also changes the extension from .scss into .css. 
			  // Note: file name that begins with _ are ignored automatically
			  files: [{
				expand: true,
				cwd: 'dev/sass',
				src: ['main.scss'],
				dest: 'build/css',
				ext: '.css'
			  }]
			},
			options: {
			  sourceMap: true, 
			  outputStyle: 'nested', 
			  imagePath: '../',
			}
		},
		inlinecss: {
			main: {
				options: {
					applyStyleTags: true,
					removeStyleTags: false
				},
				files: {
					'email-inlined.html': 'email.html'
				}
			}
		},
		mailgun: {
			marketingTemplates: {
				options: {
					key: '<%= secrets.mailgun.api_key %>',
					sender: '<%= secrets.mailgun.sender %>',
					recipient: '<%= secrets.mailgun.recipient %>',
					subject: 'Test Email',
					preventThreading: false,
					hideRecipient: false
					
				},
				src: ['email-inlined.html']
			}
		}
	});

	grunt.registerTask('clean-email', ['htmlhint','sass','inlinecss']);
	grunt.registerTask('test-email', 'mailgun');
};