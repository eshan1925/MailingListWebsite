var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var https = require('https');

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});
app.post("/", function (req, res) {
    var firstname = req.body.fname;
    var lastname = req.body.lname;
    var email = req.body.email;
    console.log(firstname + " " + lastname + " " + email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var url = "https://us20.api.mailchimp.com/3.0/lists/d1698557cf";
    var options = {
        method: "POST",
        auth: "eshan:52a699dee879cc612c82ea3ce363f8c5-us20"
    };
    var request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});

