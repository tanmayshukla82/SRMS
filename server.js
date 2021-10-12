const express = require('express');
const connection = require('./app/config/connection');
const studentProfile = require('./routes/profile');
const studentSubject = require('./routes/subject');
const studentMarks = require('./routes/marks');
connection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(studentProfile);
app.use(studentSubject);
app.use(studentMarks);

app.get('/',(req,res)=>{
    res.send("Hello");
})


app.listen(PORT,()=>{
    console.log("connection successful!!");
});