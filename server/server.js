require('./config/config');
const mongoose = require('mongoose');
const express = require('express');
const routes= require('./routes/index');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');


//-----------------------------------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json());

//Enable the folder public
app.use( express.static( path.resolve( __dirname , '../public') ) );


//-----------------------------------------------------

//we reference the routes (routes are wrapped on route)
app.use(routes);


mongoose.connect(process.env.URLDB, 
{ useNewUrlParser :true, useCreateIndex: true, useUnifiedTopology: true},
(err, res) =>{
    if (err) {
        throw err;
    } else {
        console.log('database ONLINE');
    }
});
 
app.listen(process.env.PORT,() =>{
    console.log('listening port: ', process.env.PORT);
})





//TO TEST THIS CODE YOU COULD USE POSTMAN TO SEND YOUR PETITIONS IN A CLOUD SERVER OR IN YOUR LOCAL HOST.