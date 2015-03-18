var db = require ('mongojs').connect('mongodb://gregaubs:gregaubs@ds041157.mongolab.com:41157/hapiblog',['blogcollection', 'usercollection']);


function blogpost (title, text, date, author, id){
	this.title 	= title;
	this.text 	= text;
	this.date 	= date;
	this.author = author;
	this.id 	= id; 
}


function user (name,auth_method,auth_id,password){
	this.username 	 = name;
	this.auth_method = auth_method;
	this.auth_id     = auth_id;
	this.password 	 = password;

}

//var blogpost1 = new blogpost("Second", "lorem ispum2", "18 March 2015", "Greg", 2);

/*
var user1 = new user("per","123","");

db.usercollection.save(user1, function(err,user){
	if (err){
		console.log(err);
	}
	else{
		console.log(user,' has been saved');
	}
})

*/
/*
db.blogcollection.save(blogpost1, function(err, savedBlog){
	if(err || !savedBlog) console.log("not saved because of ", err);
	else console.log(savedBlog.title, " has been saved");
});
*/

module.exports = {
	db:db,
	user:user,
	blogpost:blogpost
}