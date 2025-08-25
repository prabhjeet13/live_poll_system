const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Name: {
        type : String,
        required: true,
    },
    Role: { 
        type: String, 
        enum: ["Teacher", "Student"] 
    },
    SocketId:{
        type : String,
        default: null
    },
    IsActive: { type: Boolean, default: true },
},{timestamps:true});

module.exports = mongoose.model("User", UserSchema);

  
