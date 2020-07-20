const express = require('express');
const User = require('../models/user');
const app = express();
//library to crypt the password
const bcrypt = require('bcrypt');
const _ = require('underscore');

//To get a user registry
app.get('/user', function (req, res) {
    
    //params to show registries
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);
    

    User.find({ status: true}, 'name email role status google img')//2cond parameter is for exclusion of fields
        .skip(from)
        .limit(limit)
        .exec((err, users) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count({status: true},(err, counting) =>{
                res.json({
                    ok:true,
                    users,
                    totalusers: counting
                })

            })


        })


})
  
//to creaate new registry in a db
app.post('/user', function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email : body.email,
        password: bcrypt.hashSync(body.password,10),
        role : body.role
    });

    user.save( (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } 
        //this line is to hidde the the password in the petition (as a option)
        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        });
    })
});
  
//to update a user registry
app.put('/user/:id', function (req, res) {
    let userid = req.params.id;
    //paratmers that are goin to be updated
    let body = _.pick( req.body ,['name','email','img','role','status']);

    User.findByIdAndUpdate( userid , body ,{ new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok : true,
            user: userDB
        });
    })
})
  
  // To delete a user registry
  app.delete('/user/:id', function (req, res) {
      
    let id =req.params.id;
    
    let changeStatus = {
        status:false
    };

    //User.findByIdAndRemove(id,(err, userRemoved) => {
    User.findByIdAndUpdate(id, changeStatus,{new :true}, (err, userRemoved) => {    
    
        if (err) {
            return res.json({
                ok: false,
                err
            });
        };

        //we verify if the user exists
        if (userRemoved === null) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'User not found'
                }
            })
        }
        
        res.json({
            ok: true,
            user:userRemoved
        });
    });
});

  module.exports = app;