const mongoose = require("mongoose");

const PreferenceSchema = new mongoose.Schema({
  username: String,
  subjects: [String],
  minGPA: Number,
  minCredits: Number,
  maxCredits: Number,
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model("Preference", PreferenceSchema);
