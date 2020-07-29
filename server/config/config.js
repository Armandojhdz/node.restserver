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
//Expiration date
//===========================
// 60 seconds
// 60 min
// 24 hrs
// 30 days
process.env.EXPIRATION_TOKEN = "1d";



//===========================
//SEED
//===========================
process.env.SEED = process.env.SEED || 'this-is-a-dev-seed';



//===========================
//Database
//===========================

let urlDB;

// if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
// }else{
//     urlDB = process.env.MONGO_URL;
// }

process.env.URLDB = urlDB;

//===========================
//Google client
//===========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '844451016009-5ok4bqp7c3mnk591nm0ii36qutao32jb.apps.googleusercontent.com';