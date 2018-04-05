const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  hash: { type: String, required: true },      // tin = taxpayer id # EIN or SS#
  email: { type: String, required: true },
  
 });

const Vendor = mongoose.model("Message", messageSchema);

module.exports = Message;