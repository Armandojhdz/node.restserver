//THIS IS A FILE WITH A GLOBAL CONFIG

const { mongo } = require("mongoose");

//===========================
//PORT
//===========================

process.env.PORT = process.env.PORT || 3000;

//===========================
//Enviroment
//===========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
//Database
//===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
}else{
    urlDB = 'mongodb+srv://strider:f4rrkmKHTFSnKTf@cluster0.rgzow.mongodb.net/test'
}

process.env.URLDB = urlDB;