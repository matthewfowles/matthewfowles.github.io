---
post: true
title: Creating posts and pages from Markdown in Assemble
description: When writing posts or pages with lots of content you often want to use formats like Markdown, This is not something straight forward in Assemble till now.
layout: post.hbs
url: /articles/creating-posts-and-pages-from-markdown-in-assemble/
---

# Creating posts and pages from Markdown in Assemble

This is a rundown post about an Assemble plugin I built when making this very blog. Gonna cover the why and the how. Plus a little tutorial on how to use the plugin yourself.

## Use case

The main content of my site is these from articles and tutorials I write. After deciding to use Assemble to build the site I realised it did not do one thing I really wanted. The ability to write posts in markdown. Generally in Assemble if you want to use markdown then in you Handlebars templates you can use the markdown Handlebars helper and or write inline Markdown or include a Markdown file.

Even though the support was there to use Markdown I did not like the way it worked. In an ideal world I would be able to write a markdown file and it would go in a folder in my site and when I ran the build it would get directly turned into a page.

This option did not exist with Assemble. It does exist with other static site generators such as Jekyll. However I had especially avoided these generators to opt for a pure JS solution.

One of the great things about Assemble is it’s ability to be extended through plugins. So I thought the best option in the case was to have a go at extending myself. I had previously had a go at writing an assemble plugin for a project yet to be released. So I thought why not… 

## Requirements  

1. Pages will be written and markdown which will need to be converted to HTML.

2. Have to be able to include YAML Front Matter at the top of the markdown which will be out out and turned into a data object for the page.

3. Once compiled insert data and compiled HTML into the normal assemble build cycle. This will allow the HTML to placed into the normal layouts etc.


## 



