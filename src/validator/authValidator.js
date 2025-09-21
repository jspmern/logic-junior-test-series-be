const { body } = require('express-validator');

const registerValidationRules = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First name can only contain letters and spaces'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last name can only contain letters and spaces'),

    body('middleName')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Middle name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]*$/)
        .withMessage('Middle name can only contain letters and spaces'),

    body('age')
        .isInt({ min: 18, max: 120 })
        .withMessage('Age must be between 18 and 120'),

    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be male, female, or other'),

    body('isPremium')
        .optional()
        .isBoolean()
        .withMessage('isPremium must be a boolean'),

    body('photoUrl')
        .optional()
        .isURL()
        .withMessage('Photo URL must be a valid URL'),

    body('about')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('About section cannot exceed 500 characters'),

    body('hobbies')
        .optional()
        .isArray({ max: 20 })
        .withMessage('Cannot have more than 20 hobbies')
        .custom((hobbies) => {
            if (hobbies.some(hobby => typeof hobby !== 'string' || hobby.trim().length === 0)) { 
                throw new Error('All hobbies must be non-empty strings');
            }
            return true;
        })
];
const loginValidationRules = [
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
];
module.exports={registerValidationRules,loginValidationRules};