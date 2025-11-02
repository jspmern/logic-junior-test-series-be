// models/Result.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const attemptItemSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
  selectedOptionIndex: { type: Number, required: false, default: null }, // null -> skipped
  isCorrect: { type: Boolean, required: true },
  marksObtained: { type: Number, required: true }, // can be negative
  timeTakenMs: { type: Number, default: 0 } // ms spent on this question
}, { _id: false });

const resultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  examTitle: { type: String, trim: true, default: null },

  // attempt data
  items: { type: [attemptItemSchema], default: [] },

  // aggregated stats (store to avoid computing every time)
  totalQuestions: { type: Number, required: true },
  attempted: { type: Number, required: true },
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  skipped: { type: Number, required: true },

  totalMarks: { type: Number, required: true },
  marksObtained: { type: Number, required: true },
  percentage: { type: Number, required: true }, // 0 - 100
  pass: { type: Boolean, required: true },

  // timing
  startedAt: { type: Date, required: true },
  finishedAt: { type: Date, required: true },
  durationMs: { type: Number, required: true },

  // meta
  deviceInfo: { type: String },
  ipAddress: { type: String },
  notes: { type: String, default: null },

  // optional: certificate id if later generated (won't describe certificate flow now)
  certificateId: { type: String, default: null, index: true }
}, { timestamps: true });

// indexes for quick queries
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ courseId: 1, percentage: -1, marksObtained: -1 });

module.exports = mongoose.model('Result', resultSchema);
