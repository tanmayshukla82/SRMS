const { Router } = require('express');
const Student = require('../app/models/student_register');
const router = new Router();
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

module.exports = router;