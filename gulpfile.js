var gulp 	= require("gulp");
var lab 	= require("gulp-lab");

gulp.task("lab", function (){
    return gulp.src("test/*.js")
      .pipe(lab(["-v", "-c", "-l"]));
});

gulp.task("watch-lab", function() {
	gulp.watch(["test/**.js", "lib/**.js"], ["lab"]);
});

gulp.task("default", ["lab", "watch-lab"]);