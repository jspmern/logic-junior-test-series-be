const express=require('express');
const connectDB=require('./src/config/db')
const morgan=require('morgan');
const PORT=process.env.PORT || 5000;
const app=express();
require('dotenv').config();
app.use(morgan('dev'));
app.use(express.json());
app.get("/health",(req,res)=>{
    res.send("API is running");
})
app.listen(PORT,async()=>{
    try{
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
})