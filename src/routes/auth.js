const express=require('express');
const { registerValidationRules } = require('../validator/userValidator');
const { validationResult } = require('express-validator');
const router=express.Router();
 router.post("/register", registerValidationRules, (req,res,next)=>{
    const errors=validationResult(req);
     if (!errors.isEmpty()) {
              const error = new Error('Validation failed');
               error.status = 400;
                error.errors = errors.array();
                return next(error);
        }
     res.send("Register endpoint", req.body);
 })
module.exports=router;
