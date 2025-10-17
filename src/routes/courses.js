const { createCourseController, getCourseByIdController, updateCourseController, deleteCourseController, getAllCourseController } = require("../controller/courseController");
const { createCoureseValidationRule, getCourseByIdValidationRule, updateCourseValidationRule, deleteCourseValidationRule } = require("../validator/courseValidator");

const express=require('express');
const router=express.Router();
router.get('/',getAllCourseController);
router.post('/',createCoureseValidationRule,createCourseController);
router.get('/:id',getCourseByIdValidationRule,getCourseByIdController);
router.put('/:id',updateCourseValidationRule,updateCourseController);
router.delete('/:id',deleteCourseValidationRule,deleteCourseController);
module.exports=router;