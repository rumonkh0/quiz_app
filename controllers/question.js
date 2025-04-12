const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// @desc    Create new question
// @route   POST /api/questions
// @access  Private (Teacher only)
exports.createQuestion = asyncHandler(async (req, res, next) => {
  const { quiz, text, options, correctAnswer } = req.body;

  const quizExists = await Quiz.findById(quiz);
  if (!quizExists) {
    return next(new ErrorResponse("Quiz not found", 404));
  }

  const question = await Question.create({
    quiz,
    text,
    options,
    correctAnswer,
  });

  res.status(201).json({ success: true, data: question });
});

// @desc    Get all questions of a quiz
// @route   GET /api/questions/quiz/:quizId
// @access  Private (Teacher/Student)
exports.getQuestionsByQuiz = asyncHandler(async (req, res, next) => {
  const questions = await Question.find({ quiz: req.params.quizId });

  res
    .status(200)
    .json({ success: true, count: questions.length, data: questions });
});

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private (Teacher/Student)
exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse("Question not found", 404));
  }

  res.status(200).json({ success: true, data: question });
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private (Teacher only)
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse("Question not found", 404));
  }

  question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: question });
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private (Teacher only)
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new ErrorResponse("Question not found", 404));
  }

  await question.remove();

  res.status(200).json({ success: true, data: {} });
});
