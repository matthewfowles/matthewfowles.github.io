var broccoli = require('broccoli');
var uglifyJavaScript = require('broccoli-uglify-js');
var browserify = require('broccoli-browserify');
var mergeTrees = require('broccoli-merge-trees');
var jshintTree = require('broccoli-jshint');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');
var pickFiles = require('broccoli-static-compiler');

var treeCss = compileSass(['src/scss/'], './main.scss', 'css/app.css');

treeCss = autoprefixer(treeCss);

treeTest = jshintTree('src/js/');

var treeJs = browserify(
	'src/js/', 
	{
		entries: ['./app.js'],
		outputFile: 'js/app.js'
	}
);


treeJs = uglifyJavaScript(treeJs);


module.exports = mergeTrees([treeJs, treeCss, treeTest]);


