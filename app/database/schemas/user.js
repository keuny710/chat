const Mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const SALT_WORK_FACTOR = 10;


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

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});
//유저의 password와 db의 password를 비교해서 유효한지 검증하는 메소드
UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

const userModel = Mongoose.model('user', UserSchema);

module.exports = userModel;