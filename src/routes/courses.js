const upload = require("../config/multer");
const { createCourseController, getCourseByIdController, updateCourseController, deleteCourseController, getAllCourseController, uploadThumbnailController } = require("../controller/courseController");
const { createCoureseValidationRule, getCourseByIdValidationRule, updateCourseValidationRule, deleteCourseValidationRule } = require("../validator/courseValidator");

const express=require('express');
const router=express.Router();
router.get('/',getAllCourseController);
router.post('/',createCoureseValidationRule,createCourseController);
router.get('/:id',getCourseByIdValidationRule,getCourseByIdController);
router.put('/:id',updateCourseValidationRule,updateCourseController);
router.delete('/:id',deleteCourseValidationRule,deleteCourseController);
router.post('/upload/thumbnail',upload.single('thumbnail'),uploadThumbnailController);
module.exports=router;