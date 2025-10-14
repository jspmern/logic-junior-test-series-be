const Category = require("../models/Category");

const getAllCategoriesHandler=async(req,res,next)=>{
    try{
        const categories=await Category.find({});
        res.status(200).json({success:true,message:"All categories fetched successfully",data:categories,total:categories.length})
    }catch(err){
        return next(err);
    }
}
const createCategoryHandler=async(req,res,next)=>{
    try{
        res.status(201).json({success:true,message:"Category created successfully"})
    }
    catch(err){
        return next(err);
    }
}
const updateCategoryHandler=()=>{}
const deleteCategoryHandler=()=>{}
module.exports={getAllCategoriesHandler,createCategoryHandler,updateCategoryHandler,deleteCategoryHandler}