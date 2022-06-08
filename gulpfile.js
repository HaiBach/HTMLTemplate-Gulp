const gulp = require('gulp')
const fileinclude = require('gulp-file-include')
const server = require('browser-sync').create()
const { watch, series } = require('gulp')

const sass = require('gulp-sass')(require('sass'))
sass.compiler = require('node-sass')

const paths = {
  src: './src',
  dest: './build/',
}

// Compile Sass
async function compileSass() {
  // gulp.src('src/assets/_scss/**/*.scss', { sourcemaps: true })
  //   .pipe(sass().on('error', sass.logError))
  //   .pipe(gulp.dest('src/assets/css', { sourcemaps: '.'}))

  gulp.src('src/assets/_scss/**/*.scss', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/assets/css', { sourcemaps: '.'}))
}

// Copy assets after build
async function copyAssets() {
  gulp.src([
      'src/assets/**/*',
      '!./src/assets/_scss/**',
      '!./src/assets/_template/**',
      '!./src/assets/_template/**/*',
    ])
    .pipe(gulp.dest('./build/assets'))
}

// Reload Server
async function reload() {
  server.reload()
}

async function includeHTML() {
  return gulp.src([
      'src/*.html',
      'src/**/*.html',
      '!src/assets/**', // ignore
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.dest))
}

// Build files html and reload server
async function buildAndReload() {
  await includeHTML()
  copyAssets()
  reload()
}


/** DEFAULT FUNCTION */
exports.default = async function() {
  // Init serve files from the build folder
  server.init({
    server: {
      baseDir: paths.dest
    },
    open: false
  })
  // Build and reload at the first time
  buildAndReload()
  compileSass()
  // Watch Sass task
  watch('src/assets/_scss/**/*.scss',  series(compileSass));
  // Watch other tasks
  watch(["src/**/*.html", "src/assets/**/*", "!src/assets/css/**/*"], series(buildAndReload))
}