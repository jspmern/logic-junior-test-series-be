const Course = require("../models/Course");

 
 const getAllCourseController=async(req,res,next)=>{
    try{
        const course=await Course.find({}).populate('category').populate('author','name email').sort({createdAt:-1});
        res.status(200).json({success:true,message:"All courses fetched successfully",data:course,total:course.length})
    }
    catch(error){
       return next(error);
    }
 }
 const createCourseController=async(req,res,next)=>{
    try{}
    catch(error){
       return next(error);
    }
 }
 const getCourseByIdController=async(req,res,next)=>{
    try{}
    catch(error){
       return next(error);
    }
 }
 const updateCourseController=async(req,res,next)=>{
    try{}
    catch(error){
      return  next(error);
    }
 }
 const deleteCourseController=async(req,res,next)=>{
    try{}
    catch(error){
      return  next(error);
    }
 }
 module.exports={
    getAllCourseController,
    createCourseController,
    getCourseByIdController,
    updateCourseController,
    deleteCourseController
 }
