const { validationResult } = require("express-validator");
const { prepareUserData, validateUserData, hashPassword, createUserResponse, validateLoginCredentials, comparePassword, generateTokens } = require("../utilis/authUtilis");
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
 const loginHandler=async(req,res,next)=>{
     try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
              const error = new Error('Validation failed');
               error.status = 400;
                error.errors = errors.array();
                return next(error);
        } 
        const {email,password}=req.body;
        const additionalErrors=validateLoginCredentials(req.body)
        if((await additionalErrors).length>0)
        {
           const error= new Error("Validation failed")
            error.status=400;
            error.errors=additionalErrors;
            return next(error)
        }
        const User=await user.findById({email:email.toLowerCase()})
        if(!User){
            return res.send({ 
                 success: false,
                message: 'Invalid email or password'})
        }
           const isMatch = await comparePassword(password, User.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        const {accessToken, refreshToken}=generateTokens(User._id, User.email)
        const hashedRefreshToken = await require('bcryptjs').hash(refreshToken, 12);
        const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
            await user.findByIdAndUpdate(User._id, {
            refreshToken: hashedRefreshToken,
            refreshTokenExpiresAt: refreshTokenExpiry,
            $push: {
                refreshTokens: {
                    token: hashedRefreshToken,
                    expiresAt: refreshTokenExpiry,
                    deviceInfo: req.headers['user-agent'] || 'unknown'
                }
            }
        });
          // Create login response with both tokens
        const userResponse = createUserResponse(User);
        const loginResponse = {
            user: userResponse,
            accessToken,
            refreshToken,
            expiresIn: {
                accessToken: '15m',
                refreshToken: '7d'
            }
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: loginResponse
        });
     }
     catch(error){
        next(error);
     }
 }
 module.exports={registerHandler,loginHandler};