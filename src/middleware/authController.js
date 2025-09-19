const { validationResult } = require("express-validator");
const { prepareUserData, validateUserData, hashPassword, createUserResponse } = require("../utilis/authUtilis");
const user = require("../models/user");

const registerHandler =async (req,res,next)=>{
    try {
         const errors=validationResult(req);
     if (!errors.isEmpty()) {
              const error = new Error('Validation failed');
               error.status = 400;
                error.errors = errors.array();
                return next(error);
        }
        const userData=prepareUserData(req.body);
        const additionalErrors=validateUserData(userData);
        if (additionalErrors.length > 0) {
            const error = new Error('Validation failed');
            error.status = 400;
            error.errors = additionalErrors;
            return next(error);
        }
        const existinUser= await user.findOne({email:userData.email});
        if(existinUser){
            const error=new Error('User with this email already exists');
            error.status=400;
            return next(error);
        }
        const hashedPassword=await hashPassword(userData.password);
        userData.password=hashedPassword;
          // Create new user
        const newUser = new user(userData);
        // Save user to database
        await newUser.save();
            // Return success response
        const userResponse = createUserResponse(newUser);
         res.status(201).json({ success: true,     message: 'User registered successfully', user: userResponse });
        
    } catch (error) {
      console.error('Error during registration:', error);
      next(error); 
    }
   
   
 }
 module.exports={registerHandler};