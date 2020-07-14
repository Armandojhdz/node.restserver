require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//-----------------------------------------------------
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
//-----------------------------------------------------

//To get a user registru
app.get('/user', function (req, res) {
  res.json('get User');
})

//to creaate new registry in a db
app.post('/user', function (req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            menssage: 'The name is necessary'
        })
    } else {
        res.json({
            person : body
        })
    }
});

//to update a user registry
app.put('/user/:id', function (req, res) {
    let userid = req.params.id;
    res.json({
        id : userid
    });
})

// To delete a user registry
app.delete('/user', function (req, res) {
    res.json('delete User');
})
   
 
app.listen(process.env.PORT,() =>{
    console.log('listening port: ', process.env.PORT);
})





//TO TEST THIS CODE YOU COULD USE POSTMAN TO SEND YOUR PETITIONS IN A CLOUD SERVER OR IN YOUR LOCAL HOST.