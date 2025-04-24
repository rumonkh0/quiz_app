const mongoose = require("mongoose");

const ClassroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ClassroomSchema.virtual('students', {
//   ref: 'ClassroomMembership',
//   localField: '_id',
//   foreignField: 'student',
//   justOne: false
// });

module.exports = mongoose.model("Classroom", ClassroomSchema);
