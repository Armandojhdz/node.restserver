const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product')

//modules by default in node
const fs = require('fs');
const path = require('path');

//Default options
//tranform what is uploading into in req.files
app.use(fileUpload({
    useTempFiles : true
}));

app.put('/upload/:type/:id',function (req,res) {
    
    let type = req.params.type;
    let id = req.params.id;
    
    
    //Validation
    if (!req.files) {
        return res.status(400)
        .json({
            ok:false,
            err: {
                message: 'There is no file selected'
            }
        });
    }

    // type Validation
    let validTypes = ['products','users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400)
        .json({
            ok:false,
            err: {
                message: 'the types allowed are ' + validTypes.join(', ')
            }
        });
    }

    let archive = req.files.archive; //all the archive
    let nameCutted = archive.name.split('.'); // segmented name
    let extension = nameCutted[nameCutted.length -1];

    // Extensions allowed

    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok:false,
            err: {
                message: 'The valid extensions are ' + validExtensions.join(', '),
                ext: extension
            }
        })
    }

    //Changing the name of the archive
    // we add extra info with the date to avoid problems with cache
    let nameArchive = `${ id }-${ new Date().getMilliseconds()}.${extension}`;

    archive.mv(`uploads/${ type }/${nameArchive}`,(err) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }
        //at this point is the image is loaded
        if (type === 'users') {
            imageUser(id,res,nameArchive);  
        }else{
            imageProduct(id,res,nameArchive)
        }
    })
});




function imageUser(id, res, nameArchive) {
    User.findById(id, (err, userDB) => {
        
        if (err) {
            deleteArchive(nameArchive,'users');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!userDB) {
            deleteArchive(nameArchive,'users');
            return res.status(400).json({
                ok:false,
                err: {
                    message:'User doesnt exist'
                }
            });
        }

        //Validation
        // We verify if the route of the archive exists

        // let pathImage = path.resolve(__dirname, `../../uploads/users/${ userDB.img }`);
        // if (fs.existsSync(pathImage)) {
        //     fs.unlinkSync(pathImage);
        // }

        deleteArchive(userDB.img,'users');

        userDB.img = nameArchive;

        userDB.save((err ,userSaved) => {
            res.json({
                ok:true,
                user: userSaved,
                img: nameArchive
            })
        });


    });
}

function imageProduct(id,res,nameArchive) {
    
    Product.findById(id, (err, productDB) => {
        
        if (err) {
            deleteArchive(nameArchive,'products');
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (!productDB) {
            deleteArchive(nameArchive,'products');
            return res.status(400).json({
                ok:false,
                err: {
                    message:'User doesnt exist'
                }
            });
        }

        //Validation
        // We verify if the route of the archive exists
        deleteArchive(productDB.img,'products');

        productDB.img = nameArchive;

        productDB.save((err ,productSaved) => {
            res.json({
                ok:true,
                product: productSaved,
                img: nameArchive
            })
        });


    });
    
}

function deleteArchive(nameImage, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ nameImage }`);
        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage);
        }
}


module.exports = app;