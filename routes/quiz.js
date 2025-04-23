const { Router } = require("express");
const {
  createQuiz,
  getTeacherQuizzes,
  getQuizzesByClassroom,
  getQuizById,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
  getQuizLeaderboard
} = require("../controllers/quiz");
const { protect, authorize } = require("../middleware/auth");

const router = Router();

router.use(protect);

router.post("/", authorize("teacher"), createQuiz);
router.get("/teacher", authorize("teacher"), getTeacherQuizzes);
router.get("/classroom/:classroomId", getQuizzesByClassroom);
router.get("/:id", getQuizById);
router.put("/:id", authorize("teacher"), updateQuiz);
router.delete("/:id", authorize("teacher"), deleteQuiz);
router.post("/:id/submit", authorize("student"), submitQuiz);
router.get("/:id/leaderboard", getQuizLeaderboard);

module.exports = router;
