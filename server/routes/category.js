const express = require('express');
let app = express()
let { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');
let Category = require('../models/category');
const { json } = require('body-parser');

//=======================
 //Show all the categories
 //=======================
 app.get('/category', verifyToken ,(req,res) =>{
    Category.find({})
    .sort('description')
    .populate('user','name email')
    .exec((err, categories) =>{
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        res.json({
            ok:true,
            categories: categories
        });


    })
 });

//=====================
//Show a category by id
//=====================
app.get('/category/:id', verifyToken,(req,res) =>{
    //Category.findbyId(....);

    let id = req.params.id;

    Category.findById(id,(err, categoryDB) => {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(500).json({
                ok:false,
                err:{
                    message: 'ID not found'
                }
            });
        }

        res.json({
            ok:true,
            category: categoryDB
        });


    })

});

//=====================
//create a category
//=====================
app.post('/category', verifyToken ,(req,res) =>{
    //return the new cateogry
    //req.user._id

    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });

    category.save((err,categoryDB) =>{
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });

});

//=====================
//Update a category
//=====================
app.put('/category/:id', verifyToken ,(req,res) =>{
    let id = req.params.id;
    let body = req.body;

    //the description of the category
    let descCategory = {
        description : body.description
    };

    Category.findByIdAndUpdate(id,descCategory,{ new: true, runValidators: true, useFindAndModify:false },(err, categoryDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        });

    });
});

//=====================
//Delete a category
//=====================
app.delete('/category/:id', [verifyToken, verifyAdmin_Role] ,(req,res) =>{
    //just  an admin can delete category
    let id = req.params.id;

    Category.findByIdAndRemove(id, {useFindAndModify : false}, (err,categoryDB) => {
        
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'The ID does´t exists'
                }
            });
        }

        res.json({
            ok:true,
            message: 'Category Removed'
        })

    })

});


module.exports = app;
 
