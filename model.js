var db = require ('mongojs').connect('mongodb://gregaubs:gregaubs@ds041157.mongolab.com:41157/hapiblog',['blogcollection']);


function blogpost (title, text, date, author, id){
	this.title = title;
	this.text = text;
	this.date = date;
	this.author = author;
	this.id = id; 
}

var blogpost1 = new blogpost("Second", "lorem ispum2", "18 March 2015", "Greg", 2);

db.blogcollection.save(blogpost1, function(err, savedBlog){
	if(err || !savedBlog) console.log("not saved because of ", err);
	else console.log(savedBlog.title, " has been saved");
});