const express=require('express');
const { registerValidationRules, loginValidationRules } = require('../validator/authValidator');
const { registerHandler, loginHandler } = require('../controller/authController');
 

const router=express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 650a1b2c3d4e5f6a7b8c9d0e
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         middleName:
 *           type: string
 *           example: Michael
 *         age:
 *           type: integer
 *           example: 25
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           example: male
 *         isPremium:
 *           type: boolean
 *           example: false
 *         photoUrl:
 *           type: string
 *           example: https://static.vecteezy.com/system/resources/previews/021/548/095/non_2x/default-profile-picture-avatar-user-avatar-icon-person-icon-head-icon-profile-picture-icons-default-anonymous-user-male-and-female-businessman-photo-placeholder-social-network-avatar-portrait-free-vector.jpg
 *         about:
 *           type: string
 *           example: Enthusiastic learner
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           example: ["reading", "coding"]
 *         refreshToken:
 *           type: string
 *           example: null
 *         refreshTokenExpiresAt:
 *           type: string
 *           format: date-time
 *           example: null
 *         refreshTokens:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               deviceInfo:
 *                 type: string
 *                 example: unknown
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - age
 *               - email
 *               - password
 *               - gender
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               middleName:
 *                 type: string
 *                 example: Michael
 *               age:
 *                 type: integer
 *                 example: 25
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *               about:
 *                 type: string
 *                 example: Enthusiastic learner
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["reading", "coding"]
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: User registered successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation failed or user already exists
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
 *                   example: Validation failed
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
router.post("/register", registerValidationRules, registerHandler);
router.post("/login",loginValidationRules,loginHandler)

module.exports = router;
