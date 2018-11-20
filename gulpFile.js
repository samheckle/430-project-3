const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');

const webpack = require('webpack-stream');

gulp.task('sass', () => {
    gulp.src('./scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted/'));
});

gulp.task('loginBundle', () => {
    gulp.src(['./client/login/client.js',
            './client/helper/helper.js'
        ])
        .pipe(concat('loginBundle.js'))
        .pipe(babel({
            presets: ['env', 'react']
        }))
        .pipe(gulp.dest('./hosted/'))
});

gulp.task('appBundle', () => {
    gulp.src(['./client/app/maker.js'])
        .pipe(webpack({
            entry: ['./client/app/maker.js', './client/helper/helper.js'],
            output: {
                "path": __dirname + '/hosted',
                "filename": "appBundle.js"
            },
            module: {
                rules: [{
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "env",
                                "react"
                            ]
                        }
                    }
                }]
            }
        }))
        .pipe(gulp.dest('./hosted/'))
});


gulp.task('lint', () => {
    return gulp.src(['./server/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('watch', () => {
    gulp.watch('./scss/style.scss', ['sass']);
    gulp.watch(['./client/login/client.js', './client/helper/helper.js'], ['loginBundle']);
    gulp.watch(['./client/app/maker.js', './client/helper/helper.js'], ['appBundle']);
    nodemon({
        script: './server/app.js',
        ext: 'js',
        tasks: ['lint']
    })
});

gulp.task('build', () => {
    gulp.start('sass');
    gulp.start('loginBundle');
    gulp.start('appBundle')
    gulp.start('lint');
});