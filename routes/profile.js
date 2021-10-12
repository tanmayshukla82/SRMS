const { Router } = require("express");
const Student = require("../app/models/student_profile");
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

//registeration
router.post('/register',async(req,res)=>{
    try {
        const student = new Student();
        student.Name = req.body.Name;
        student.Semester = req.body.Semester;
        student.Course = req.body.Course;
        student.Branch = req.body.Branch;
        student.DOB = req.body.DOB;
        student.Father_name = req.body.Father_name;
        student.Admission_number = req.body.Admission_number;
        student.University_roll_num = req.body.University_roll_num;
        student.Email = req.body.Email;
        student.Age = req.body.Age
        student.phone_number = req.body.phone_number;
        const result = await student.save();
        res.send(result);
    } catch (err) {
        res.send(err.message);
    }
});

//updation
router.patch("/update_student/:id",async(req,res)=>{
    try {
        // const {Name, Semester, Course, Branch, DOB, Father_name, Admission_number,
        //        University_roll_num, Email, Age, phone_number } = req.body;
        const _id = req.params.id;
        const student = await Student.findByIdAndUpdate(_id, req.body);
        if(!student)
        {
            return res.status(400).json("Unable to find student.");
        }
        return res.status(200).send(student);
    } catch (err) {
        return res.status(404).json({message : err.message});
    }
});

//deletion'
router.delete('/stud_delete/:id',async(req,res)=>{
    try {
        const _id = req.params.id;
        const student = await Student.deleteOne({_id});
        if(!student)
        {
            return res.status(400).json("Not Found");
        }
        return res.status(200).send(student);
    } catch (error) {
        return res.status(404).json({message : error.message});
    }
});

module.exports = router;