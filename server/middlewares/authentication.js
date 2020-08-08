const jwt = require('jsonwebtoken');
//===========================
//TOKEN VERIFICATION
//===========================

let verifyToken = (req,res,next) => {
    let token = req.get('token');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if (err) {
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Invalid Token'
                }
            });
        }
        //decoded is the payload
        req.user = decoded.user;
        next();

    });
   
}

//===========================
//ADMIN-ROLE VERIFICATION
//===========================

let verifyAdmin_Role = (req,res,next) => {
    let user = req.user;
    if (user.role === 'ADMIN_ROLE') {
        next();
    }else{
        res.json({
            ok:false,
            err:{
                message: 'the user is not an Admin'
            }
        });
    }
}


//================================
//TOKEN VERIFICATION FOR THE IMAGE
//================================

let verifyTokenImg = (req,res,next) => {
    let token = req.query.token;

    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if (err) {
            return res.status(401).json({
                ok:false,
                err:{
                    message: 'Invalid Token'
                }
            });
        }
        //decoded is the payload
        req.user = decoded.user;
        next();

    });
}


module.exports = {
    verifyToken,
    verifyAdmin_Role,
    verifyTokenImg
}