const express=require('express');
const { registerValidationRules } = require('../validator/authValidator');
const { registerHandler } = require('../middleware/authController');
 
const router=express.Router();
 router.post("/register", registerValidationRules,registerHandler)
module.exports=router;
