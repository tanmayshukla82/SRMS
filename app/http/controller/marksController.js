const Marks = require('../../models/student_marks');
const Student = require('../../models/student_profile');

function marksController(){
    return {

        uploadStudentMarks : async(req, res)=>{
            try {
                const marks = new Marks();
                marks.student = req.body.student;
                const arr_marks = req.body.marks;
                for (let index = 0; index < arr_marks.length; index++) {
                    console.log(arr_marks[index]);
                    marks.marks.push(arr_marks[index]);
                }
                console.log(req.body.marks);
                const result = await marks.save();
                console.log("result = ", result);
                res.send(result)
            } catch (error) {
                return res.send(error);
            }
        },
        getStudentMarks : async(req, res)=>{
            try {
                const _id = req.params._id;
                const stud_marks = await Marks.findOne({student : _id}).populate('student');
                res.send(stud_marks);
            } catch (error) {
                return res.send(error);
            }
        }
    }
}
module.exports = marksController;