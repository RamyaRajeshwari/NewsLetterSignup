/*jshint esversion: 6 */

const express = require("express");
const bodyParser = require("body-parser");
const request = require ("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us6.api.mailchimp.com/3.0/lists/1ffd2c80c8/members";

  const options = {
    methods:"POST",
    auth: "ramya:63c42af513f301406b1be3f4a150ca72-us6"
  };

  const request = https.request(url, options, function(response){

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();

});

app.post("/failure", function(req,res){
  res.redirect("/");
});



app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});






// API Key
// 63c42af513f301406b1be3f4a150ca72-us6

// List Id
// 1ffd2c80c8

// Heroku Newsletter Site Name
// https://nameless-meadow-78643.herokuapp.com/
