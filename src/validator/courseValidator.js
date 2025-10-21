const { body } = require("express-validator")

 const createCoureseValidationRule =[
    body('title').notEmpty().withMessage('Title is required').isString().withMessage('Title must be a string'),
    body('description').notEmpty().withMessage('Description is required').isString().withMessage('Description must be a string'),
    body('category').notEmpty().withMessage('Category is required').isMongoId().withMessage('Category must be a valid Mongo ID'),
    body('isPaid').optional().isBoolean().withMessage('isPaid must be a boolean'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),
    body('duration').optional().isString().withMessage('Duration must be a string'),
    body('totalMarks').optional().isInt({ gt: 0 }).withMessage('Total marks must be an integer greater than 0'),
    body('totalQuestions').optional().isInt({ gt: 0 }).withMessage('Total questions must be an integer greater than 0'),
    body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean'),
    body('thumbnail').optional().isString().withMessage('Thumbnail must be a string'),
    body('author').notEmpty().withMessage('Author is required').isMongoId().withMessage('Author must be a valid Mongo ID'),
 ]
const getCourseByIdValidationRule =[]
const updateCourseValidationRule =[]
const deleteCourseValidationRule =[]
module.exports={createCoureseValidationRule,getCourseByIdValidationRule,updateCourseValidationRule,deleteCourseValidationRule}