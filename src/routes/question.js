const express = require('express');
const {
  getAllQuestionController,
  createQuestionController,
  getQuestionByIdController,
  updateQuestionController,
  deleteQuestionController,
  uploadQuestionImageController,
  uploadQuestionOptionController,
  uploadQuestionExplanationController,
} = require('../controller/questionController');
const {
  createQuestionValidationRules,
  getQuestionValidationRules,
  updateQuestionValidationRules,
  deleteQuestionValidationRules,
} = require('../validator/questionValidator');
const createUpload = require('../config/multer');
const router = express.Router();

// -------------------------
//  Default Question Routes
// -------------------------
router.get('/', getAllQuestionController);

router.post('/', createQuestionValidationRules, createQuestionController);
router.delete('/:id', deleteQuestionValidationRules, deleteQuestionController);

/**
 * @swagger
 * /api/questions/{id}:
 *   get:
 *     summary: Get question by ID
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question
 *     responses:
 *       200:
 *         description: Successfully retrieved question
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 _id: "6523e1a..."
 *                 questionText: "What is React?"
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Question not found
 */
router.get('/:id', getQuestionValidationRules, getQuestionByIdController);

/**
 * @swagger
 * /api/questions/{id}:
 *   put:
 *     summary: Update an existing question
 *     tags: [Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the question
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             questionText: "Updated question text"
 *             options:
 *               - text: "Option A"
 *                 isCorrect: true
 *               - text: "Option B"
 *                 isCorrect: false
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: Question not found
 */
router.put('/:id', updateQuestionValidationRules, updateQuestionController);

/**
 * @swagger
 * /api/questions/upload/question-image:
 *   post:
 *     summary: Upload a question image
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               que-img:
 *                 type: string
 *                 format: binary
 *                 description: The question image file
 *     responses:
 *       200:
 *         description: Question image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Thumbnail uploaded successfully"
 *               data:
 *                 thumbnail: "https://example.com/uploads/questions/image.png"
 *       400:
 *         description: Image not provided
 */
router.post(
  '/upload/question-image',
  createUpload('questions').single('que-img'),
  uploadQuestionImageController
);

/**
 * @swagger
 * /api/questions/upload/question-option:
 *   post:
 *     summary: Upload an option image
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               opt-img:
 *                 type: string
 *                 format: binary
 *                 description: The option image file
 *     responses:
 *       200:
 *         description: Option image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Option image uploaded successfully"
 *               data:
 *                 thumbnail: "https://example.com/uploads/options/option.png"
 *       400:
 *         description: Image not provided
 */
router.post(
  '/upload/question-option',
  createUpload('options').single('opt-img'),
  uploadQuestionOptionController
);

/**
 * @swagger
 * /api/questions/upload/question-explanation:
 *   post:
 *     summary: Upload an explanation image
 *     tags: [Questions]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               exp-img:
 *                 type: string
 *                 format: binary
 *                 description: The explanation image file
 *     responses:
 *       200:
 *         description: Explanation image uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Explanation image uploaded successfully"
 *               data:
 *                 thumbnail: "https://example.com/uploads/explanations/explain.png"
 *       400:
 *         description: Image not provided
 */
router.post(
  '/upload/question-explanation',
  createUpload('explanations').single('exp-img'),
  uploadQuestionExplanationController
);

module.exports = router;
