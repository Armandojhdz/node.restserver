const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');
const app = express();

app.post('/login',(req,res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err,userDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: '(User) or password invalid'
                }
            });
        }
    
        if(!bcrypt.compareSync(body.password, userDB.password)){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'User or (password) invalid'
                }
            });
        }

        let token = jwt.sign({
            //payload
            user: userDB
        },process.env.SEED,{ expiresIn: process.env.EXPIRATION_TOKEN});
    
        res.json({
            ok:true,
            user: userDB,
            token: token
        });
    })
})


//GOOGLE CONFIGURATIONS

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

 
  }


app.post('/google',async (req,res)=>{
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e =>{
            res.status(403).json({
                ok:false,
                err:e
            });
        });
    
 //VALIDATIONS FOR THE GOOGLE USER       
    //Verifing that google user doest have an email
    User.findOne({email: googleUser.email}, (err,userDB) =>{
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };


        if (userDB) {
            //we check if the user is authenticated with google
            if (userDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err:{
                        message: 'Must use the normal Auth'
                    }
                });
            }else{
                let token = jwt.sign({
                    user: userDB
                },process.env.SEED,{expiresIn : process.env.EXPIRATION_TOKEN});

                return res.json({
                    ok:true,
                    user: userDB,
                    token,
                });
            }
        } else {
            //if the user doesn't exist in our Database
            let user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password =  ':)';  

            user.save( (err,userDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                    user: userDB
                },process.env.SEED,{expiresIn : process.env.EXPIRATION_TOKEN});

                return res.json({
                    ok:true,
                    user: userDB,
                    token,
                });

            })
            
        }
    });







});

module.exports = app;