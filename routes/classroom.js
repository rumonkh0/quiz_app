const { Router } = require("express");
const {
  createClassroom,
  getTeacherClassrooms,
  getClassroomById,
  updateClassroom,
  deleteClassroom,
  joinClassroom,
  removeStudent,
} = require("../controllers/classroom");
const { protect, authorize } = require("../middleware/auth");

const router = Router();

router.use(protect);

router.post("/", authorize("teacher"), createClassroom);
router.get("/", authorize("teacher"), getTeacherClassrooms);
router.get("/:id", getClassroomById);
router.put("/:id", authorize("teacher"), updateClassroom);
router.delete("/:id", authorize("teacher"), deleteClassroom);
router.post("/join", authorize("student"), joinClassroom);
router.put("/:id/remove-student", authorize("teacher"), removeStudent);

module.exports = router;
