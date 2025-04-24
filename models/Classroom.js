const mongoose = require("mongoose");

/**
 * Classroom Schema
 * @description Schema for managing classroom information and associations
 */
const ClassroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Classroom name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    code: {
      type: String,
      required: [true, "Classroom code is required"],
      unique: true,
      minlength: [6, "Code must be at least 6 characters"],
      maxlength: [10, "Code cannot be more than 10 characters"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher is required"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for faster queries
// ClassroomSchema.index({ code: 1 });
// ClassroomSchema.index({ teacher: 1 });

// Virtual field for students
ClassroomSchema.virtual("students", {
  ref: "ClassroomMembership",
  localField: "_id",
  foreignField: "classroom",
  justOne: false,
});

// Virtual field for quizzes
ClassroomSchema.virtual("quizzes", {
  ref: "Quiz",
  localField: "_id",
  foreignField: "classroom",
  justOne: false,
});

// Methods to generate a unique classroom code
ClassroomSchema.statics.generateClassroomCode = function () {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from(
    { length: 6 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

// Pre-save hook to handle any pre-save operations
ClassroomSchema.pre("save", function (next) {
  // Any additional operations before saving
  next();
});

module.exports = mongoose.model("Classroom", ClassroomSchema);
