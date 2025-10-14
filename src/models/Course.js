const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    thumbnail: { type: String, trim: true },
    category: { type: String, trim: true },
    isPaid: { type: Boolean, default: false },
    price: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return this.isPaid ? v > 0 : true;
        },
        message: "Paid courses must have a valid price",
      },
    },
    duration: { type: String, trim: true }, // "3 Weeks"
    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
