const express = require('express');
let app = express();
let { verifyToken } = require('../middlewares/authentication');

let Product = require('../models/product');

//=======================
//Show all the products
//=======================
app.get('/products', verifyToken, (req, res) => {

    //params to show registries
    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({available:true})
        .skip(from)
        .limit(limit)
        .populate('user','name email')
        .populate('category','description')
        .exec((err, products) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                products: products
            });
        })
});

//=====================
//Show a Product by id
//=====================
app.get('/product/:id', verifyToken ,(req, res) => {

    let id = req.params.id;

    Product.findById(id)
    .populate('user','name email')
    .populate('category','description')
    .exec((err, productDB) => {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'ID not found'
                }
            });
        }
        
        res.json({
            ok:true,
            product: productDB
        });


    })

});

//=====================
//Find products
//=====================
app.get('/products/find/:term', verifyToken ,(req, res) => {

    let term = req.params.term;

    let regex = new RegExp(term, 'i');

    Product.find({name: regex})
        .populate('category','name')
        .exec((err,products) => {
            
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                products
            })
        })


})




//=====================
//create a Product
//=====================
app.post('/product', verifyToken ,(req,res) =>{
    //save a user
    //save a category

    let body = req.body;
    
    let product = new Product({
        user: req.user._id,
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.category
    });

    product.save((err,productDB) =>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.status(201).json({
            ok: true,
            product: productDB
        });

    });

});

//=====================
//Update a product
//=====================
app.put('/product/:id', verifyToken ,(req,res) =>{
    let id = req.params.id;
    let body = req.body;

    Product.findById(id,(err,productDB)=>{
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'The id doesnt exists'
                }
            })
        }

        productDB.name = body.name;
        productDB.price = body.price;
        productDB.category = body.category;
        productDB.available = body.available;
        productDB.description = body.description;

        productDB.save((err, savedProduct) =>{
            
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });
            }

            res.json({
                ok:true,
                product: savedProduct
            })

        })


    })
});

//=====================
//Delete a product
//=====================
app.delete('/product/:id', verifyToken, (req,res) =>{
    //just  an admin can delete category
    let id = req.params.id;

    Product.findById(id, {useFindAndModify : false}, (err,productDB) => {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'The ID does´t exists'
                }
            });
        }

        productDB.available = false;
        productDB.save((err,productRemoved) => {
            
            if (err) {
                return res.status(500).json({
                    ok:false,
                    err
                });   
            }
            res.json({
                ok:true,
                product: productRemoved,
                message: 'Product Removed'
            })

        })

    })

});

module.exports = app;




