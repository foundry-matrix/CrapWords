# mad_scientist
A basic hapi-lab-gulp setup for starting a project.

## Installation:

Either **clone** this directory and simply npm install, OR if you want to do it yourself:

```js
npm init --> test: "./node_modules/lab/bin/lab -c -v" // (optional as we run tests with gulp)
```
-c gives us coverage, -v gives us verbose output.

```js
npm install lab -g                                // Install lab globally
npm install hapi --save                           // Installing hapi
npm install lab chai gulp gulp-lab --save-dev     // Note: add lab to your devdep even when installing -g.
```

## Writing our test first
Make a *test* folder in your root. Within that, make a test file (I prefer to call my e.g. server test __server.js, but that's preference)
With lab, we must not only require lab but also export a script:
```js
var lab = exports.lab = require("lab").script();
// OR
var Lab = require("lab");
var lab = exports.lab = Lab.script();
```
We must also import an assertion library. Chai's assert has been chosen in this example.
```js
var assert = require("chai").assert
```

We can then get testing. The lab testing structure is as follows:
```js
lab.experiment("My blah blah: ", function() {
  lab.test("Should, more specifically, blah blah", function(done) {
    assert.equal(actual, expected, "comments blah blah blah");
    done()
  });
});
```

## A basic server
Make a basic hapi server file, preferably in some non-root folder. Remember to export the server.

If you have just one file for your server, you'll need to include the following if you don't want your server to start every time you test. An alternative is to import your server into a dedicated file for starting it (see app.js).
```js
if (!module.parent) {
  server.start()
}
```


## Using gulp
Gulp is set up in this example to run our tests on save within the api and test folders. These options can be changed in the gulpfile according to your file structure.
We use gulp-lab to facilitate easy gulp interaction with our lab tests.


##Useful links
- http://chaijs.com/ 
- http://codepipet.com/blog/hapi-testing-simplified-using-lab/
- https://medium.com/the-spumko-suite/testing-hapi-services-with-lab-96ac463c490a
