// *** Constant Require Section:

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

// *** Static Folder ***

app.use(express.static("public"));

// *** Body Parser ***

app.use(bodyParser.urlencoded({extended: true}));

// *** Tracking HTML File ***

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/sign-in.html");
});

// *** Signup Route ***

app.post("/", function(req, res) {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    // *** Construct Requesting data ***

    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    
    // *** Stringify inputed data ***

    const jsonData = JSON.stringify(data);

    // *** url = "https://<data center>.api.mailchimp.com/3.0/lists/{listID}";

    const url = "https://us21.api.mailchimp.com/3.0/lists/fab2911c46";

    const options = {

        method: "POST",
        auth: "william547228:b4c0ef6d6ddafb19ff18c65d6407ff2a-us21"
    }

    // *** Requesting and send back our data to mailchimp ***

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }


        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

// b4c0ef6d6ddafb19ff18c65d6407ff2a-us21

// fab2911c46