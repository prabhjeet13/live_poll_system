const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  Text: { type: String, required: true },
  IsCorrect: { type: Boolean, default: false },
  Submits: { type: Number, default: 0 }
},{timestamps:true});

module.exports = mongoose.model("Option", OptionSchema);
