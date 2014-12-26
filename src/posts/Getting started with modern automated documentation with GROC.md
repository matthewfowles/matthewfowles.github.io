---
title: Getting started with modern automated documentation with GROC
layout: post.hbs
post: true
url : /articles/getting-started-with-modern-automated-documentation-with-groc/
description: A look at one good technique for building well documented code. Why you should document your code and a look at how to get get set up and cover some of the advantages and disavantages of using it.
---

# Getting started with modern automated documentation with GROC

Good code is Documented/Commented code. All developers should be in the mindset of creating neat readable code with explanations on their methods. This can be as easy as putting inline comments everywhere. Or you can use well versed techniques like [JS-DOC](http://usejsdoc.org/) but they can all have their advantages and disadvantages.

If you go with inline comments you get the added bonus of being able to see the code making it easy for your developers to tie their comments to directly to the code. However this can get messy and un-neat. But does have the added bonus of not needing extra files for documenting and no repetition of code.

Another way of heading forwards is to use a solution like [JS-DOC](http://usejsdoc.org/) which is very similar to Java doc and basically a port. This is a good system because the tags clearly define what is going on and build structure around your code. However a lot of tags are old fashioned and do not always fit the model you are looking for. Also the tags are merely define structure and you can put in place your own structure anyway. Also it would be nice to have something that fits more languages than Javascript alone.

A new way of documenting that has emerged is [Groc](http://nevir.github.io/groc/). It is a fork of something very similar called [Docco](https://github.com/jashkenas/docco). The real upside to it is you can document more than JS. You can do handlebars or SASS. Anything you wish really. [Groc](http://nevir.github.io/groc/) takes markdown so there are no tags but any markdown is valid. The plugin works by searching for block comments and taking them out and processing as markdown. It will then build documentation in a two columns style. With the documentation on one side and the representative code on the other. And of course this will all run on Grunt.

The nice thing about Groc is it has a modern interface. The markdown allows you to be flexible. Hell you could even write a table inline.

So lets get started…

### Getting Grunt setup

For this tutorial I will assume you are using grunt to build your documentation. If you are not you can use Groc straight from the source or there are other solutions out there. Firstly you want to go to the Github page for [Grunt Groc](https://github.com/jdcataldo/grunt-groc) created by [Justin Cataldo](https://github.com/jdcataldo).

To start with go to the root of your project in the command and install the NPM plugin via this command. 

``` bash
npm install grunt-groc --save-dev
```

Once you have the plugin go to your Gruntfile.js. If you do not already have one you will need to create it. Then between the grunt init:

``` js
grunt.initConfig({ 
	// place the code here.
});


```

You will need to place this code inside initConfig:


``` js
groc: { 
		javascript: [ 
				'src/js/*/**.js'
				// place a comma delimited array of the files you want to document. 
		], 
		options: { 
			"out": “public/docs” 
			// place the destination folder of the documentation here. 
}}

```

Then make sure at the bottom of the grunt file you load the plugin. by placing this line:

```js
grunt.loadNpmTasks('grunt-groc');

```

Thats it your setup. Congratulations. Now lets start generating documentation.

If you go to your command line you should be able to run grunt groc and you will see it create html files were you specified your output. And that’s it.

### Whats next…

Now you have full automated documentation solution. And hopefully all in less than ten minutes. Now it’s time to look at what was created and define a clear way of documenting to your preferred style. Groc has many features and you can see some of the options you can pass it [here](http://nevir.github.io/groc/cli.html). (notice how the documentation is done through code ;)) Also take a look at making your own jade template. this will allow your to style the template and change the layout. From this point on it’s up to you to use how you wish.

### Conclusion

This short post was an introduction to Groc and hopefully also to automated documentation. We should all be documenting our code and putting time into it. You should not have to add weeks of work onto your projects when building or making changes to update your code. This should be done as you go along and thats what is so great about this solution it’s all there in the same file. I hope that in future I see Github projects were their pages have included documentation of their code. This would be such a bonus to open source projects. Having this as a mainstay of programming is an important thing. Happy documenting…