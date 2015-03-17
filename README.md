# mad_scientist
A basic hapi-lab-gulp setup for starting a project.

## Installation:

Either **clone** this directory and simply 
1. npm install
2. npm install gulp lab -g

OR ALTERNATIVELY if you want to do it yourself:

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
Make a *test* folder in your root. Within that, make a test file (I prefer to name my tests __filename.js e.g.  a server test would be __server.js, but that's preference)
With lab, we must not only require lab but also export a script:
```js
var lab = exports.lab = require("lab").script();
// OR
var Lab = require("lab");
var lab = exports.lab = Lab.script();
```
We must also import an assertion library. Chai's assert has been chosen in this example.
```js
var assert = require("chai").assert;
```

We can then get testing. The lab testing structure is as follows:
```js
lab.experiment("My blah blah: ", function() {
  lab.test("Should, more specifically, blah blah", function(done) {
    assert.equal(actual, expected, "comments blah blah blah");
    done();
  });
});
```
The aim here is to write a failing test, but one that you wish to pass. A simple example is writing a test for a 200 Status Code response to a "/" GET request. Once the test is failing, write code incrementally to make it pass, then write another failing test. The goal is to have as short feedback loops as possible, and to generate sufficiently robust code such that you don't need to worry about building on it or adding to it later. If your tests are failing, it means you are allowed to write more code. However, they should be failing for the right reason (there being some mismatch between code-intention and code-implementation, rather than a random error that the tests have picked up but you haven't fixed yet). Having a rock-solid codebase gives you more freedom, and the necessary planning that comes with writing tests first will give you a more robust knowledge of both your code and the project as a whole. Ultimately, this allows for more creativity.     

As a further note, if you can't think of how to test something, then you're probably trying to do something too complicated in one go. "Untestable" code often is just a weak way of describing code that tries to do too much all at once, and tightly couples things that shouldn't be so tightly coupled.

## A basic server
Make a basic hapi server file, preferably in some non-root folder (we chose the api folder). Remember to export the server.

If you have just one file for your server, you'll need to include the following if you don't want your server to start every time you test. An alternative is to import your server into a dedicated file for starting it (see app.js).
```js
if (!module.parent) {
  server.start();
}
```


## Using gulp
Gulp is an easy way to automate and speed up our workflow. We can set gulp up to run tasks for us, be they build, test, linting or otherwise. With the help of gulp, we can have a terminal always present on the screen, running tests and linting our code when designated files change.
Gulp is set up in this example to watch our api and test folders, and run our tests when any javascript files in these folders change. These options can be changed in the gulpfile according to your file structure.
We use gulp-lab to facilitate easy gulp interaction with our lab tests.


##Useful links
- http://chaijs.com/ 
- http://codepipet.com/blog/hapi-testing-simplified-using-lab/
- https://medium.com/the-spumko-suite/testing-hapi-services-with-lab-96ac463c490a
