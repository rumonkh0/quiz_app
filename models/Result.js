const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    answers: [{ type: Number }], // index-based answers
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", ResultSchema);
