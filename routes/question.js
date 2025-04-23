const express = require("express");
const {
  createQuestion,
  getQuestionsByQuiz,
  getQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/question");

// Middleware
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Create question
router.route("/").post(protect, authorize("teacher"), createQuestion);

// Get, update and delete specific question
router
  .route("/:id")
  .get(protect, getQuestion)
  .put(protect, authorize("teacher"), updateQuestion)
  .delete(protect, authorize("teacher"), deleteQuestion);

// Get all questions for a specific quiz
router.route("/quiz/:quizId").get(protect, getQuestionsByQuiz);

module.exports = router;
