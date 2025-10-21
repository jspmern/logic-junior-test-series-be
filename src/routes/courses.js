const upload = require("../config/multer");
const cache = require("../middleware/cacheMiddleware");
const { createCourseController, getCourseByIdController, updateCourseController, deleteCourseController, getAllCourseController, uploadThumbnailController } = require("../controller/courseController");
const { createCoureseValidationRule, getCourseByIdValidationRule, updateCourseValidationRule, deleteCourseValidationRule } = require("../validator/courseValidator");

const express=require('express');
const router=express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     CourseInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *           description: MongoDB ObjectId of category
 *         isPaid:
 *           type: boolean
 *         price:
 *           type: number
 *         duration:
 *           type: string
 *         totalMarks:
 *           type: integer
 *         totalQuestions:
 *           type: integer
 *         isPublished:
 *           type: boolean
 *         thumbnail:
 *           type: string
 *         author:
 *           type: string
 *           description: MongoDB ObjectId of author
 *       required:
 *         - title
 *         - description
 *         - category
 *         - author
 *
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             thumbnail:
 *               type: string
 */

/*
	GET /api/courses
*/
router.get('/',cache('courses'),getAllCourseController);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseInput'
 *           examples:
 *             minimal:
 *               summary: Minimal required fields
 *               value:
 *                 title: "Basic Logic Course"
 *                 description: "An introductory logic course for juniors"
 *                 category: "64a7b2f9e4b0f2a5d8c3f1a2"
 *                 author: "64a7b2f9e4b0f2a5d8c3f1b3"
 *                 isPaid: false
 *             full:
 *               summary: Full payload with optional fields
 *               value:
 *                 title: "Advanced Logic Course"
 *                 description: "A deeper dive into logical reasoning and puzzles"
 *                 category: "64a7b2f9e4b0f2a5d8c3f1a2"
 *                 author: "64a7b2f9e4b0f2a5d8c3f1b3"
 *                 isPaid: true
 *                 price: 19.99
 *                 duration: "4 weeks"
 *                 totalMarks: 100
 *                 totalQuestions: 50
 *                 isPublished: false
 *                 thumbnail: "https://example.com/uploads/courses/sample.jpg"
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Course created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 */
router.post('/',createCoureseValidationRule,createCourseController);

router.get('/:id',getCourseByIdValidationRule,getCourseByIdController);
router.put('/:id',updateCourseValidationRule,updateCourseController);
router.delete('/:id',deleteCourseValidationRule,deleteCourseController);

/**
 * @openapi
 * /api/courses/upload/thumbnail:
 *   post:
 *     summary: Upload course thumbnail image
 *     tags:
 *       - Courses
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       400:
 *         description: Bad request / missing file
 */
router.post('/upload/thumbnail',upload.single('thumbnail'),uploadThumbnailController);
module.exports=router;