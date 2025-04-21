const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Classroom = require("../models/Classroom");

// @desc    Create a classroom
// @route   POST /api/classrooms
// @access  Private (Teacher only)
exports.createClassroom = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  let code;
  let classroomExists = true;

  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";

  while (classroomExists) {
    code = Array.from(
      { length: 6 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");

    const existingClassroom = await Classroom.findOne({ code });
    if (!existingClassroom) {
      classroomExists = false;
    }
  }

  const classroom = await Classroom.create({
    name,
    code,
    teacher: req.user._id,
  });

  res.status(201).json({ success: true, data: classroom });
});

// @desc    Get classrooms created by the logged-in teacher
// @route   GET /api/classrooms/teacher
// @access  Private (Teacher only)
exports.getTeacherClassrooms = asyncHandler(async (req, res, next) => {
  const classrooms = await Classroom.find({ teacher: req.user._id }).populate(
    "teacher",
    "name email"
  );
  // .populate("students", "name email")
  // .populate("quizzes", "title");

  res
    .status(200)
    .json({ success: true, count: classrooms.length, data: classrooms });
});

// @desc    Get classroom by ID
// @route   GET /api/classrooms/:id
// @access  Private
exports.getClassroomById = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id)
    .populate("teacher", "name email")
    .populate("students", "name email")
    .populate("quizzes", "title");

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  res.status(200).json({ success: true, data: classroom });
});

// @desc    Update classroom
// @route   PUT /api/classrooms/:id
// @access  Private (Teacher only)
exports.updateClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to update this classroom", 401)
    );
  }

  classroom.name = req.body.name || classroom.name;
  classroom.description = req.body.description || classroom.description;

  await classroom.save();

  res.status(200).json({ success: true, data: classroom });
});

// @desc    Delete classroom
// @route   DELETE /api/classrooms/:id
// @access  Private (Teacher only)
exports.deleteClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to delete this classroom", 401)
    );
  }

  await classroom.remove();

  res.status(200).json({ success: true, message: "Classroom removed" });
});

// @desc    Student joins a classroom
// @route   PUT /api/classrooms/:id/join
// @access  Private (Student only)
exports.joinClassroom = asyncHandler(async (req, res, next) => {
  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  // Prevent duplicate entry
  if (classroom.students.includes(req.user._id)) {
    return next(
      new ErrorResponse("You have already joined this classroom", 400)
    );
  }

  classroom.students.push(req.user._id);
  await classroom.save();

  res.status(200).json({ success: true, data: classroom });
});

// @desc    Remove student from classroom
// @route   PUT /api/classrooms/:id/remove-student
// @access  Private (Teacher only)
exports.removeStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;

  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  if (classroom.teacher.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse(
        "Not authorized to remove students from this classroom",
        401
      )
    );
  }

  classroom.students = classroom.students.filter(
    (id) => id.toString() !== studentId
  );

  await classroom.save();

  res.status(200).json({ success: true, data: classroom });
});
