const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.index({ userId: 1 });
noteSchema.index({ title: 1 });

const Note = mongoose.model("note", noteSchema);
module.exports = Note;
