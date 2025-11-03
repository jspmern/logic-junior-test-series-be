const express=require('express');
const { submitResultValidationRules, getSingleResultValidationRules, listUserResultsValidationRules } = require('../validator/resultValidator');
const { sumbmitResultController, getSingleResultController, listUserResultsController } = require('../controller/resultController');
const router=express.Router();
router.post('/submit',submitResultValidationRules,sumbmitResultController);
router.get('/:id',getSingleResultValidationRules,getSingleResultController);
router.get('/user/:userId',listUserResultsValidationRules,listUserResultsController);
module.exports=router;