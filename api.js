var User = require('../models/user');
var jwt  =require('jsonwebtoken');
var secret='harrypotter';

module.exports= function(router) {
    router.post('/users',function(req, res){
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

    router.post('/authenticate',function(req, res){
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) throw err;
            
            if (!user) {
                res.send({ success: false, message: 'Could not authenticate user' }); // Username does not match username found in database
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password); // Password was provided. Now check if matches password in database
                } else {
                    res.send({ success: false, message: 'No password provided' }); // No password was provided
                }
                if (!validPassword) {
                    res.send({ success: false, message: 'Could not authenticate password' }); // Password does not match password found in database
                } else {
                    var token= jwt.sign({ username: user.username, email: user.email}, secret, {expiresIn:'24h'});
                    res.send({ success: true, message: 'user authenticated!', token: token });
                }
            } 
        });
    });

    router.use(function(req, res, next){
        
        var token =req.body.token || req.body.query || req.headers['x-access-token'];
        if(token){
            jwt.verify(token,secret,function(err, decoded){
                if(err) {
                    res.send({success: false, message:'No token provided'});
                } else {
                    req.decoded = decoded;
                    next();

                }

            });

        }else {
            res.send({success: false, message: 'no token provided'});
        }

    });
    
    router.post('/me',function(req,res){
        res.send(req.decoded);
    });

 return router;
}