const express = require('express');
const connection = require('./app/config/connection');
const studentsProfile = require('./routes/stud_profile');
connection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(studentsProfile);

app.get('/',(req,res)=>{
    res.send("Hello");
})


app.listen(PORT,()=>{
    console.log("connection successful!!");
});