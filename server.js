var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var User = require('./app/models/user');
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

mongoose.connect('mongodb://localhost:27017/tutorial',function(err){
    if (err) {
        console.log('Not connected to the database: ' + err);
    
    } else {
        console.log('Successfully connected to MongoDB');
    }
});

app.post('/users',function(req, res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '') {
        res.send('ensure all fields are filled');

    } else {
        user.save(function(err) {
            if (err) {
                res.send('Username or email exists already');
            } else {
                res.send('User created');
            }
        });
    }

   
});

app.listen(port, function() {
    console.log('Running the server on port' + port);
});
 