const { Router } = require("express");
const Student = require("../app/models/student_register");
const router = new Router;

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