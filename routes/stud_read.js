const { Router } = require("express");
const Student = require("../app/models/student_register");
const router = new Router();

router.get('/get-student',async(req,res)=>{
    try {
        const stud = await Student.find({});
        if(!stud)
        {
            return res.status(404).json({message : "No Student Found"});
        }
        return res.status(200).send(stud);
    } catch (err) {
        res.send("unable to fetch details of student.");
    }
});

//read by university roll number
router.get('/get-studentByRollNumber',async(req,res)=>{
    try {
        const universityRollNumber = req.body;
        const stud = await Student.findOne({universityRollNumber});
        if(!stud)
        {
            return res.status(404).json({message : "Student not found"})
        }
        return res.status(200).send(stud);
    } catch (error) {
        return res.status(400).json({message : error.message});
    }
});

module.exports = router;