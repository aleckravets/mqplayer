module.exports = function(grunt) {

    grunt.initConfig({
        clean: {
            dist: "dist/**",
            tmp: ".tmp"
        },
        copy: {
            build: {
                files: [
                    {expand: true, dot: true, dest: 'dist', cwd: 'app', src: ['img/*', 'partials/*', 'tmpl/*', '*.*']},
                    {expand: true, dot: true, cwd: 'app', src: 'js/ie9.js', dest: 'dist'}
                ]
            },
            debug: {
                files: [
                    {expand: true, dest: 'dist', dot: true, cwd: '.tmp/concat', src: 'js/*'},
                ]
            }
        },
        ngmin: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/js',
                        src: 'app.js',
                        dest: '.tmp/concat/js'
                    }
                ]
            }
        },
        useminPrepare: {
            html: 'app/index.html',
            options: {
                dest: 'dist'
            }
        },
        usemin: {
            html: 'dist/index.html'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-ngmin');

    grunt.registerTask('default', [
        'clean:dist',
        'copy:build',
        'useminPrepare',
        'concat',
        'ngmin',
        'copy:debug',
        'uglify',
        'cssmin',
        'usemin',
//        'clean:tmp'
    ]);
};