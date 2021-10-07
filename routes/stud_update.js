const { Router } = require("express");
const Student = require("../app/models/student_register");
const router = new Router();

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

module.exports = router;