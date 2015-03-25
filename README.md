# Crapwords
-- A webapp that instantly shows you your app's underperforming keywords in the App Store --




# Getting Started
1. Clone this repo.
2. Run npm install
3. run nodemon app.js in your terminal


## Tests:
1. run 'npm test' in your terminal

## Explanation of structure
The functions have been laid out so the app completes each task in the correct order.  Due to node's asynchronous nature we had to careful the app did not get ahead of itself at any stage and try and execute functions too early. 

The flow goes:
- User clicks the 'submit button' in their browser
- The 'save' function in model.js is invoked. This saves the payload into the database.
- Then the 'fetchId' function in model.js is called. This fishes out the ID that mongoDB automatically assigns its documents. 
- Next, the 'takeScreenShot' function in screenshot.js is invoked. This makes use of the Webshot module and points it at a URL that is dynamically created using the mongoDB ID fetched from the database. It is on this unique URL that the report is generated. 
- Once the screnshot of the report is done, we invoke the 'sendEmail' function in mandrill.js. This attaches the screenshot to the email and then sends it to the user's email address. 

As you can see, if the tasks aren't completed in this exact order, the app would collapse into a useless heap. 