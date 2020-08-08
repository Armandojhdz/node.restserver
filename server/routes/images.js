const express = require('express');
const fs = require('fs');

const path = require('path');

const { verifyTokenImg } = require('../middlewares/authentication');

let app = express();

app.get('/image/:type/:img', verifyTokenImg,(req,res)=>{

    let type = req.params.type;
    let img = req.params.img;

    //path absolute
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);
    
    if (fs.existsSync(pathImage)) {
        res.sendFile( pathImage);
    }else{
        //path absolute
        let noImagePath = path.resolve(__dirname,'../assets/no_image.png');
        //this sentence return the file itself
        res.sendFile(noImagePath);
    }
});



module.exports = app;