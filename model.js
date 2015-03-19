var db = require ('mongojs').connect('mongodb://gregaubs:gregaubs@ds041157.mongolab.com:41157/hapiblog',['blogcollection', 'usercollection']);


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


function blogpost (title, text, date, author, category, auth_id, blog_id){
	this.title = title;
	this.text = text;
	this.date = date;
	this.author = author;
	this.category = category;
	this.auth_id = auth_id;
	this.blog_id = blog_id;
}

// var blogpost1 = new blogpost("Second", "lorem ispum2", "18 March 2015", "Greg", 2);

// db.blogcollection.save(blogpost1, function(err, savedBlog){
// 	if(err || !savedBlog) console.log("not saved because of ", err);
// 	else console.log(savedBlog.title, " has been saved");
// });

function saveBlog(title, text, author, category, auth_id){
	var blog_id;
	var options = {"sort": [["blog_id",-1]], "limit": 1}
	db.blogcollection.find({}, options, function(err,blog){
		blog_id = blog[0].blog_id + 1;
		var newBlogObject = new blogpost(title, text, '', author, category, auth_id, blog_id);
		db.blogcollection.save(newBlogObject, function(err, savedBlog){
			if(err || !savedBlog) console.log("not saved because of ", err);
		});

	});

}

function readBlog(renderFunction){
	db.blogcollection.find( { title: 'hardcoded' }, function(err, fetchedBlog){
		if( err || !fetchedBlog) console.log("No such blog found");
		else {
			renderFunction(fetchedBlog); 
		}
	});
}

function viewBlogs(category, reply){
	db.blogcollection.find( { category: category }, function(err, fetchedBlog){
		if( err || !fetchedBlog) console.log("No such blog found");
		else { 
			reply(fetchedBlog); 
		}
	});
}


module.exports = {
	saveBlog : saveBlog,
	readBlog : readBlog,
	db:db,
	user:user,
	blogpost:blogpost,
	viewBlogs:viewBlogs
}