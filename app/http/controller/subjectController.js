const Subject = require('../../models/student_subject');
function subjectController(){
    return {
        subjectUpload : async(req, res)=>{
            try {
                const subject = new Subject();
                subject.department = req.body.department;
                subject.subjectName = req.body.subjectName;
                subject.subjectCode = req.body.subjectCode;
                subject.semester = req.body.semester;
                subject.year = req.body.year;
                const sub = await subject.save();
                if(!sub)
                {
                    return res.status(404).json({message : "Data Not Found."});
                }
                return res.status(200).send(sub);
            } catch (error) {
                return res.status(400).json({message : error.message})
            }
        }
    }
}

module.exports = subjectController;