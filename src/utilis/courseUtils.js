const prepareCourseData=(course)=>{
  const {title,description,thumbnail,category,isPaid,price,duration,totalMarks,totalQuestions,isPublished,author}= course;
  const courseData={
    title,
    description,
    category,
  }
  if(thumbnail) courseData.thumbnail=thumbnail;
  if(isPaid!==undefined) courseData.isPaid=isPaid;
  if(isPaid && price) courseData.price=price;
  if(duration) courseData.duration=duration;
  if(totalMarks) courseData.totalMarks=totalMarks;
  if(totalQuestions) courseData.totalQuestions=totalQuestions;
  if(isPublished!==undefined) courseData.isPublished=isPublished;
  if(author) courseData.author=author;
  return courseData;
}
const validateCourseData=(courseData)=>{
    const errors=[];
    if(courseData.isPaid && (courseData.price===undefined || courseData.price<=0)){
        errors.push({msg:"Price must be greater than 0 for paid courses",param:"price"});
    }
    
    if(!courseData.title){
        errors.push({msg:"Title is required",param:"title"});
    }
    if(!courseData.description){
        errors.push({msg:"Description is required",param:"description"});
    }
    if(!courseData.category || courseData.category.length === 0){
        errors.push({msg:"At least one category is required",param:"category"});
    }
    if(!courseData.thumbnail){
        errors.push({msg:"Thumbnail is required",param:"thumbnail"});
    }
    return errors;
}
module.exports={prepareCourseData,validateCourseData};