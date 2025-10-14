const express=require('express');
const { getAllCategoriesHandler, createCategoryHandler, updateCategoryHandler, deleteCategoryHandler } = require('../controller/categoryController');
const { deleteCategoryValidationRule, updateCategoryValidationRule, createCategoryValidationRule } = require('../validator/categoryValidator');
const router=express.Router();
router.get('/',getAllCategoriesHandler);
router.post('/',createCategoryValidationRule,createCategoryHandler);
router.put('/:id',updateCategoryValidationRule,updateCategoryHandler);
router.delete('/:id',deleteCategoryValidationRule,deleteCategoryHandler);
module.exports=router;