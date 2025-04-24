const mongoose = require("mongoose");

/**
 * Quiz Schema
 * @description Schema for managing quizzes with associated metadata
 */
const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Quiz title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classroom",
      required: [true, "Classroom is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startsOn: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endsOn: {
      type: Date,
      validate: {
        validator: function (value) {
          // endsOn should be after startsOn if provided
          return !value || value > this.startsOn;
        },
        message: "End date must be after start date",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [2000, "Instructions cannot be more than 2000 characters"],
    },
    passScore: {
      type: Number,
      min: [0, "Pass score cannot be negative"],
      default: 0,
    },
    shuffleQuestions: {
      type: Boolean,
      default: false,
    },
    showResults: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
QuizSchema.index({ classroom: 1 });
QuizSchema.index({ createdBy: 1 });
QuizSchema.index({ startsOn: 1 });
QuizSchema.index({ isActive: 1 });

// Virtual field for questions
QuizSchema.virtual("questions", {
  ref: "Question",
  localField: "_id",
  foreignField: "quiz",
  justOne: false,
});

// Virtual field for submissions
QuizSchema.virtual("submissions", {
  ref: "Submission",
  localField: "_id",
  foreignField: "quiz",
  justOne: false,
});

// Calculate if the quiz is currently active
QuizSchema.virtual("isCurrentlyActive").get(function () {
  const now = new Date();
  const hasStarted = now >= this.startsOn;
  const hasEnded = this.endsOn ? now > this.endsOn : false;
  return this.isActive && hasStarted && !hasEnded;
});

// Method to get quiz status
QuizSchema.methods.getStatus = function () {
  const now = new Date();
  if (!this.isActive) return "inactive";
  if (now < this.startsOn) return "scheduled";
  if (this.endsOn && now > this.endsOn) return "ended";
  return "active";
};

module.exports = mongoose.model("Quiz", QuizSchema);
