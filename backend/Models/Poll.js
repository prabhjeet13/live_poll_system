const mongoose = require("mongoose");

const PollSchema = new mongoose.Schema({
  Question: { type: String, required: true },
  Options: [{type: mongoose.Schema.Types.ObjectId, ref: "Option", required: true }],
  CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  AnsweredBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  IsActive: { type: Boolean, default: true },
  Time: {type: Number,required: true}
},{timestamps:true});

module.exports = mongoose.model("Poll", PollSchema);
