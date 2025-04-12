const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true }, // joining code
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classroom", ClassroomSchema);
