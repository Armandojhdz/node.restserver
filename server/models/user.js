const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = moongose.Schema;

//we define the Valid roles
let validRoles = {
    values: ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} is not a valid role'
}
//--------------------------
let userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'The name is necessary']
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'the email is necessary']
    },
    password:{
        type: String,
        required: [true, 'the password is necessary']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    status:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

//password hidding 
userSchema.methods.toJSON = function(){
    let userr = this;
    let userObject = userr.toObject();
    delete userObject.password;

    return userObject;
}

userSchema.plugin( uniqueValidator, {message: '{PATH} must be unique'})

module.exports = moongose.model('User',userSchema) ;