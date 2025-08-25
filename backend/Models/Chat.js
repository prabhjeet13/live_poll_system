const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  Message: { type: String, required: true },
  IsActive: { type: Boolean, default: true },
},{timestamps:true});

module.exports = mongoose.model("Chat", chatSchema);
