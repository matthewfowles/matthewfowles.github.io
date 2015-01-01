var timer = require("grunt-timer");

module.exports = function(grunt) {

    timer.init(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),




        /*============================================================
      code complexity
    ============================================================*/


        complexity: {
            generic: {
                src: ['src/js/**/*.js'],
                options: {
                    jsLintXML: 'test_reports/report.xml',
                    checkstyleXML: 'test_reports/checkstyle.xml',
                    breakOnErrors: true,
                    errorsOnly: false, // show only maintainability errors
                    cyclomatic: [6], // or optionally a single value, like 3
                    halstead: [20], // or optionally a single value, like
                    maintainability: 100,
                    hideComplexFunctions: false, // only display maintainability
                    broadcast: true // broadcast data over event-bus
                }
            }
        },




        /*============================================================
      Git hooks
    ============================================================*/

        githooks: {
            all: {
                // Will run the jshint and test:unit tasks at every commit
                'pre-commit': 'test'
            }
        },


        /*============================================================
      code duplication
    ============================================================*/

        jscpd: {
            javascript: {
                path: 'src/js'
            }
        },


        /*============================================================
      Notifications for tasks
    ============================================================*/

        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5, // maximum number of notifications from jshint output
                title: "Matthew Fowles" // defaults to the name in package.json, or will use project directory's name
            },
            watch: {
                options: {
                    title: 'Task Complete', // optional
                    message: 'Watch completed succesfully' //required
                }
            }
        },


        /*============================================================
      SASS linting
    ============================================================*/

        scsslint: {
            allFiles: [
                'src/scss/**/*.scss'
            ],
        },


        /*============================================================
      Broccoli
    ============================================================*/


        broccoli: {
            dist: {
                config: 'Brocfile.js',
                dest: 'assets'
            }
        },


        /*============================================================
      Assemble
    ============================================================*/

        assemble: {
            options: {
                plugins: ['assemble-markdown-pages'],
                partials: ['src/partials/**/*.hbs'],
                layout: 'default.hbs',
                data: ['src/data/*.{json,yml}'],
                helpers: ['src/plugins/assemble-markdown-pages.js'],
                layoutdir: 'src/layouts/',
                markdownPages: {
                    src: ['src/posts/**/*.md'],
                    dest: 'articles/',
                    subFolder: true
                },
                collections: [{
                    name: 'post',
                }]
            },
            site: {
                expand: true,
                cwd: 'src/pages',
                src: ['./**/*.hbs'],
                dest: ''
            }
        },


        /*============================================================
      Watch
    ============================================================*/


        watch: {
            dist: {
                files: ['src/layouts/**/*', 'src/partials/**/*', 'src/pages/**/*', 'src/posts/**/*', 'src/drafts/**/*'],
                tasks: ['assemble'],
                options: {
                    spawn: false,
                },
            },
        },


        /*============================================================
      Concurrent
    ============================================================*/

        concurrent: {
            dist: {
                tasks: ['broccoli:dist:watch', 'connect', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },


        /*============================================================
      Connect
    ============================================================*/


        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: '0.0.0.0',
                    base: '',
                    keepalive: true,
                    livereload: true,
                    open: true,
                }
            }
        },


        /*============================================================
      Copy
    ============================================================*/


        copy: {
            main: {
                files: [

                    // makes all src relative to cwd
                    {
                        expand: true,
                        cwd: 'src/flash',
                        src: ['./**/*'],
                        dest: 'assets/flash/'
                    }, {
                        expand: true,
                        cwd: 'src/images',
                        src: ['./**/*'],
                        dest: 'assets/images/'
                    }
                ],
            },
        },




        /*============================================================
      favicons
    ============================================================*/

        favicons: {
            options: {
                trueColor: true,
                precomposed: true,
                appleTouchBackgroundColor: "#F7DF1E",
                coast: true,
                windowsTile: true,
                tileBlackWhite: false,
                tileColor: "auto",
                firefox: true,
                html: 'src/partials/favicons.hbs',
                HTMLPrefix: "/assets/favicons/"
            },
            icons: {
                src: 'src/favicon/ico.png',
                dest: 'assets/favicons'
            }
        }


    });


    /*============================================================
    Plugins
  ============================================================*/

    grunt.loadNpmTasks('grunt-complexity'); // code complexity
    grunt.loadNpmTasks('grunt-githooks'); // Hook into git tasks
    grunt.loadNpmTasks('grunt-jsbeautifier'); // Hook into git tasks
    grunt.loadNpmTasks('grunt-jscpd'); // code duplication detection
    grunt.loadNpmTasks('grunt-notify'); // notifications for tasks
    grunt.loadNpmTasks('grunt-scss-lint'); // SASS linting
    grunt.loadNpmTasks('grunt-broccoli'); // Broccoli
    grunt.loadNpmTasks('assemble'); // Assemble
    grunt.loadNpmTasks('grunt-contrib-watch'); // Watch
    grunt.loadNpmTasks('grunt-concurrent'); // Concurrent
    grunt.loadNpmTasks('grunt-contrib-connect'); // Connect
    grunt.loadNpmTasks('grunt-contrib-copy'); // Copy
    grunt.loadNpmTasks('grunt-favicons'); // favicons



    // Default task(s).
    grunt.registerTask('default', ['notify_hooks', 'assemble', 'copy', 'broccoli:dist:build', 'concurrent']);
    grunt.registerTask('test', ['notify_hooks', 'jscpd', 'scsslint', 'complexity']);


};