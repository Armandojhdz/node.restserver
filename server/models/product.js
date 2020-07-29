var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productSchema = new Schema({
    name: { 
        type: String,
        required: [true, 'The name is necessary']
    },
    price: { 
        type: Number,
        required: [true, 'The Unitary price is necessary']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


module.exports = mongoose.model('Product', productSchema);