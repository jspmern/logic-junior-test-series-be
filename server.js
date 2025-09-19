const express=require('express');
const connectDB=require('./src/config/db')
const PORT=process.env.PORT || 5000;
const app=express();
require('dotenv').config();
app.use(express.json());
app.listen(PORT,async()=>{
    try{
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
})