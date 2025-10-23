const { body, param } = require("express-validator");

const createQuestionValidationRules = [
 body("questionText").notEmpty().withMessage("Question text is required"),
  body('options').custom((opts) => {
    if (!Array.isArray(opts)) return true;
    for (const opt of opts) {
      if (!opt) throw new Error('Invalid option object');
      const hasText = typeof opt.text === 'string' && opt.text.trim() !== '';
      const hasImage = typeof opt.image === 'string' && opt.image.trim() !== '';
      if (!hasText && !hasImage) {
        throw new Error('Each option must have text or image');
      }
    }
    return true;
  }),
  body('options').custom((opts) => {
    if (!Array.isArray(opts)) return true;
    const correctCount = opts.filter(o => !!o && o.isCorrect === true).length;
    if (correctCount < 1) throw new Error('At least one option must be marked isCorrect');
    return true;
  }),
  body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID'),
  body("courseId").notEmpty().withMessage("Course ID is required").isMongoId().withMessage("Invalid Course ID"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("marks").optional().isNumeric().withMessage("Marks must be a number"),
  body("negativeMarks").optional().isNumeric().withMessage("Negative marks must be a number"),
  body("difficulty")
    .optional()
    .isIn(["easy", "medium", "hard"])
    .withMessage("Difficulty must be one of: easy, medium, hard"),
];  
const getQuestionValidationRules = [
  param("id").isMongoId().withMessage("Invalid question ID"),
];
const updateQuestionValidationRules = [
  param("id").isMongoId().withMessage("Invalid question ID"),
  body("text").optional().notEmpty().withMessage("Question text cannot be empty"),
    body("options").optional().isArray({ min: 2 }).withMessage("At least two options are required"),
    body("correctOption").optional().notEmpty().withMessage("Correct option cannot be empty"),
];
const deleteQuestionValidationRules = [
  param("id").isMongoId().withMessage("Invalid question ID"),
];
module.exports = {
  createQuestionValidationRules,
  getQuestionValidationRules,
  updateQuestionValidationRules,
  deleteQuestionValidationRules
};