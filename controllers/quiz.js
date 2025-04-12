const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Quiz = require("../models/Quiz");
const Classroom = require("../models/Classroom");
const Question = require("../models/Question");
const Submission = require("../models/Submission");

// @desc    Create a quiz
// @route   POST /api/quizzes
// @access  Private (Teacher only)
exports.createQuiz = asyncHandler(async (req, res, next) => {
  const { title, classroomId, questions } = req.body;

  const classroom = await Classroom.findById(classroomId);
  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  const quiz = await Quiz.create({
    title,
    classroom: classroomId,
    teacher: req.user._id,
  });

  if (questions && questions.length > 0) {
    const createdQuestions = await Question.insertMany(
      questions.map((q) => ({
        ...q,
        quiz: quiz._id,
      }))
    );

    quiz.questions = createdQuestions.map((q) => q._id);
    await quiz.save();
  }

  classroom.quizzes.push(quiz._id);
  await classroom.save();

  res.status(201).json({ success: true, data: quiz });
});

// @desc    Get quizzes by teacher
// @route   GET /api/quizzes/teacher
// @access  Private (Teacher only)
exports.getTeacherQuizzes = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find({ teacher: req.user._id })
    .populate("classroom", "name")
    .populate("questions");

  res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
});

// @desc    Get quiz by ID
// @route   GET /api/quizzes/:id
// @access  Private
exports.getQuizById = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id)
    .populate("classroom", "name")
    .populate("teacher", "name email")
    .populate("questions");

  if (!quiz) {
    return next(new ErrorResponse("Quiz not found", 404));
  }

  res.status(200).json({ success: true, data: quiz });
});

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private (Teacher only)
exports.updateQuiz = asyncHandler(async (req, res, next) => {
  const { title, questions } = req.body;

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next(new ErrorResponse("Quiz not found", 404));
  }

  if (quiz.teacher.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to update this quiz", 401));
  }

  quiz.title = title || quiz.title;

  if (questions && questions.length > 0) {
    // Remove old questions
    await Question.deleteMany({ quiz: quiz._id });

    const newQuestions = await Question.insertMany(
      questions.map((q) => ({
        ...q,
        quiz: quiz._id,
      }))
    );

    quiz.questions = newQuestions.map((q) => q._id);
  }

  await quiz.save();

  res.status(200).json({ success: true, data: quiz });
});

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (Teacher only)
exports.deleteQuiz = asyncHandler(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next(new ErrorResponse("Quiz not found", 404));
  }

  if (quiz.teacher.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to delete this quiz", 401));
  }

  await Question.deleteMany({ quiz: quiz._id });
  await quiz.remove();

  res.status(200).json({ success: true, message: "Quiz deleted successfully" });
});

// @desc    Get quizzes by classroom ID
// @route   GET /api/quizzes/classroom/:classroomId
// @access  Private
exports.getQuizzesByClassroom = asyncHandler(async (req, res, next) => {
  const quizzes = await Quiz.find({ classroom: req.params.classroomId })
    .populate("teacher", "name email")
    .populate("questions");

  if (quizzes.length === 0) {
    return next(new ErrorResponse("No quizzes found for this classroom", 404));
  }

  res.status(200).json({ success: true, count: quizzes.length, data: quizzes });
});

// @desc    Submit quiz answers
// @route   POST /api/quizzes/:id/submit
// @access  Private (Student only)
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  const { answers } = req.body; // answers should be an array of { questionId, selectedOption }

  const quiz = await Quiz.findById(req.params.id).populate("questions");
  if (!quiz) {
    return next(new ErrorResponse("Quiz not found", 404));
  }

  const correctAnswers = quiz.questions.map((q) => q.correctAnswer);
  let score = 0;

  // Calculate the score
  answers.forEach((answer, index) => {
    if (answer.selectedOption === correctAnswers[index]) {
      score++;
    }
  });

  // Save the submission
  const submission = await Submission.create({
    quiz: quiz._id,
    student: req.user._id,
    answers: answers.map((answer) => ({
      question: answer.questionId,
      selectedOption: answer.selectedOption,
    })),
    score,
  });

  res.status(200).json({ success: true, data: submission });
});

// @desc    Get quiz leaderboard
// @route   GET /api/quizzes/:id/leaderboard
// @access  Private
exports.getQuizLeaderboard = asyncHandler(async (req, res, next) => {
  const { id } = req.params; // Quiz ID

  // Fetch all submissions for the quiz, populate student details
  const submissions = await Submission.find({ quiz: id })
    .populate("student", "name email") // Populate student details (name, email, etc.)
    .sort({ score: -1 }); // Sort by score in descending order

  if (!submissions || submissions.length === 0) {
    return next(new ErrorResponse("No submissions found for this quiz", 404));
  }

  // Format leaderboard data
  const leaderboard = submissions.map((submission) => ({
    student: submission.student,
    score: submission.score,
    submittedAt: submission.submittedAt,
  }));

  res.status(200).json({ success: true, leaderboard });
});
