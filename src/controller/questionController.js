const { validationResult } = require("express-validator");
const { prepareQuestionData, validateQuestionData } = require("../utilis/questionUtilis");
const Question = require("../models/Question");

const getAllQuestionController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const getQuestionByIdController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const createQuestionController = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.status = 400;
        error.details = errors.array();
        return next(error);
    }
    const questionData = prepareQuestionData(req.body);
         const additionalErrors = validateQuestionData(questionData);
         if (additionalErrors) {
             const error = new Error("Validation failed");
             error.status = 400;
             error.details = additionalErrors;
             return next(error);
         }
        const newQuestion = new Question(questionData);
         await newQuestion.save();
        res.status(201).json({ success: true, message: "Question created successfully", data: newQuestion });

  } catch (error) {
    return next(error);
  }
};
const updateQuestionController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const deleteQuestionController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const uploadQuestionImageController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const uploadQuestionOptionController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
const uploadQuestionExplanationController = async (req, res, next) => {
  try {
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  getAllQuestionController,
  getQuestionByIdController,
    createQuestionController,
    updateQuestionController,
    deleteQuestionController,
    uploadQuestionImageController,
    uploadQuestionOptionController,
    uploadQuestionExplanationController
};
