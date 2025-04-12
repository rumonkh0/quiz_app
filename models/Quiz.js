const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    title: { type: String, required: true },
    questions: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: Number, required: true }, // index of the correct option
      },
    ],
    totalMarks: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", QuizSchema);
