require('dotenv').config();
const path = require('path');
const express=require('express');
const connectDB=require('./src/config/db')
const morgan=require('morgan');
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");
const options = require('./src/config/swagger');
const healthRoute=require('./src/routes/health');
const authRoute=require('./src/routes/auth');
const categoryRoute=require('./src/routes/categories');
const courseRoute=require('./src/routes/courses');
const errorHandler = require('./src/middleware/errorHandler');
const PORT=process.env.PORT || 5000;
const app=express();
app.use(express.json());
app.set('trust proxy', true);
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public', 'uploads'), {
    dotfiles: 'ignore',
    maxAge: '1d',
    index: false,
  })
);
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
 
app.use('/api',healthRoute);
app.use('/api/auth',authRoute);
app.use('/api/categories',categoryRoute);
app.use('/api/courses',courseRoute);

app.use(errorHandler)

app.listen(PORT,async()=>{
    try{
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
})