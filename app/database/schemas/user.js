const Mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Mongoose.Schema({
    username: {type: String, required: true},
    password: {type: Stringg, required: true},
    picture: {type: String, default: "/img/user.jpg"},
});

UserSchema.pre('save', function(next){
    let user = this;

    if(!user.picture) {
        user.picture = '/img/user.jpg';
    }

    if(!user.isModified('password')){
        return next();
    }
})