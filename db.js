const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const MessageSchema = new mongoose.Schema({
  message: String,
  user: String,
  timestamp: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique:true
    },
    user: String
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = { Message, User };