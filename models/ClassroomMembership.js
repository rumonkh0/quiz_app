const mongoose = require('mongoose');

const ClassroomMembershipSchema = new mongoose.Schema({
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClassroomMembership', ClassroomMembershipSchema);
