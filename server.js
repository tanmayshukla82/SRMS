const express = require('express');
const connection = require('./app/config/connection');
const student_register = require('./routes/stud_register');
connection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(student_register);

app.get('/',(req,res)=>{
    res.send("Hello");
})

app.listen(PORT,()=>{
    console.log("connection successful!!");
});