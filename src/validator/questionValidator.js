const { body, param } = require("express-validator");

const createQuestionValidationRules = [
  body("text").notEmpty().withMessage("Question text is required"),
  body("options").isArray({ min: 2 }).withMessage("At least two options are required"),
  body("correctOption").notEmpty().withMessage("Correct option is required"),
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