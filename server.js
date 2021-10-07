const express = require('express');
const connection = require('./app/config/connection');
const student_register = require('./routes/stud_register');
const getStudents = require('./routes/stud_read');
const updateStudent = require('./routes/stud_update');
const deleteStudent = require('./routes/stud_delete');
connection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(student_register);
app.use(getStudents);
app.use(updateStudent);
app.use(deleteStudent);

app.get('/',(req,res)=>{
    res.send("Hello");
})


app.listen(PORT,()=>{
    console.log("connection successful!!");
});