import mongoose from "mongoose";

const PreferenceSchema = new mongoose.Schema({
  username: String,
  subjects: [String],
  minGPA: Number,
  minCredits: Number,
  maxCredits: Number,
  createdAt: { type: Date, default: Date.now },
});

const Preference = mongoose.model("Preference", PreferenceSchema);

export default Preference;
