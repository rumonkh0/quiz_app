const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Classroom = require("../models/Classroom");
const ClassroomMembership = require("../models/ClassroomMembership");

// @desc    Create a classroom
// @route   POST /api/classrooms
// @access  Private (Teacher only)
exports.createClassroom = asyncHandler(async (req, res, next) => {
  const { name } = req.body;

  let code;
  let classroomExists = true;

  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
    "firstName lastName email"
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
  const classroom = await Classroom.findById(req.params.id).populate(
    "teacher",
    "firstName lastName email"
  );

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  // Get all students in the classroom from membership
  const memberships = await ClassroomMembership.find({ classroom: classroom._id }).populate(
    "student",
    "firstName lastName email"
  );

  const students = memberships.map((membership) => membership.student);

  res.status(200).json({
    success: true,
    data: {
      ...classroom.toObject(),
      students, // add students array here
    },
  });
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
  const { code } = req.body;

  if (!code) {
    return next(new ErrorResponse("Class code is required", 400));
  }

  // Find classroom by code
  const classroom = await Classroom.findOne({ code }).populate("teacher", "firstName lastName");

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  // Check if already joined
  const alreadyMember = await ClassroomMembership.findOne({
    classroom: classroom._id,
    student: req.user._id,
  });

  if (alreadyMember) {
    return next(new ErrorResponse("Already joined this classroom", 400));
  }

  // Create membership
  const membership = await ClassroomMembership.create({
    classroom: classroom._id,
    student: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Joined classroom successfully",
    data: classroom,
  });
});


// @desc    Remove student from classroom
// @route   PUT /api/classrooms/:id/remove-student
// @access  Private (Teacher only)
exports.removeStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.body;

  if (!studentId) {
    return next(new ErrorResponse("Student ID is required", 400));
  }

  const classroom = await Classroom.findById(req.params.id);

  if (!classroom) {
    return next(new ErrorResponse("Classroom not found", 404));
  }

  // Verify the teacher owns this classroom
  if (classroom.teacher.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse(
        "Not authorized to remove students from this classroom",
        401
      )
    );
  }

  // Find and delete the ClassroomMembership
  const membership = await ClassroomMembership.findOneAndDelete({
    classroom: classroom._id,
    student: studentId
  });

  if (!membership) {
    return next(new ErrorResponse("Student not found in this classroom", 404));
  }

  // Get updated student list for response
  const memberships = await ClassroomMembership.find({ classroom: classroom._id }).populate(
    "student",
    "firstName lastName email"
  );

  const students = memberships.map((membership) => membership.student);

  res.status(200).json({ 
    success: true, 
    message: "Student removed successfully",
    data: {
      ...classroom.toObject(),
      students
    }
  });
});

// @desc    Get classrooms where the logged-in student is enrolled (using ClassroomMembership)
// @route   GET /api/classrooms/student
// @access  Private (Student only)
exports.getStudentClassrooms = asyncHandler(async (req, res, next) => {
  const memberships = await ClassroomMembership.find({
    student: req.user._id,
  }).populate({
    path: "classroom",
  });

  // Extract classrooms from memberships
  const classrooms = memberships.map((membership) => membership.classroom);

  res.status(200).json({
    success: true,
    count: classrooms.length,
    data: classrooms,
  });
});
