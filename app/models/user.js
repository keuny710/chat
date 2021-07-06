const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  email: {
    type: String, 
    require: true, 
    unique: true
  }
});

module.exports = mongoose.model('User', userSchema);