const upload = require("../config/multer");
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
router.get('/',getAllCourseController);

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
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation failed
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