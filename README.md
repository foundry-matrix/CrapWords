# Hapi.js Blog
-- A basic blog CMS built using the Hapi.js framework. --

The front-end has been left intentionally barebones. You won't find a single line of CSS here. For this project, the beauty is all in the back-end. The aim is to produce a simple blogging platform with a RESTful approach. 

Users can: 
- create new blogposts, which will then be saved to a MongoDB database using the mongojs module. 
- read blogposts; either the individual ones or a blogpost category. If a user navigates to a category URL, (e.g. platform.com/marketing), they will then see a list of blogposts belonging to that category. Joi has been used to impose some restrictions on the requests the users send to the application. This preserves the integrity of the data that makes it into the database. 
- update blogposts, which will therefore update the entry in the database. 
- delete blogposts. 


# Error Messages
As you navigate the application, you may encounter some errors - particularly if you are doing perculiar/nefarious things.  These errors have been left looking ugly but you should still be able to decipher what's going on. 
For example if you try and navigate yourself to '/cheeeeese' - then you will get an error scolding you for believing 'cheeeeese' to be a real category. 


## Getting Started:
1. Clone the repo
2. Run 'npm install' in your terminal to install the dependencies. 


## Tests:
1. Run 'npm test'
2. You will see: 
- a list of passing (and potentially failing) tests.
- a coverage %.
- details on where there is missing coverage. 
