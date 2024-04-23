const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PasswordSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    },
    service: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    sharedWith: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'passwords'
});

const PasswordModel = mongoose.model('PasswordModel', PasswordSchema);
module.exports = PasswordModel;
