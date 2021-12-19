const Student = require('../../models/student_profile');
const bcrypt = require('bcrypt');
const passport = require('passport');
const sendEmail = require('../../../utils/sendEmail');
const generateOTP = require('../../../utils/generateOTP');
const jwt = require('jsonwebtoken');
const Status = require('../../models/status');
const Marks = require('../../models/student_marks');
const Subject = require('../../models/student_subject');
function profileController()
{
    return {
        student : (req,res)=>{
            return res.status(200).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
        },
        studentLogin : async(req, res)=>{
            try {
                const {registrationNumber, psw} = req.body;
                const student = await Student.findOne({registrationNumber});
                if(student === null)
                {
                    req.flash('error', "User not registered");
                    res.status(404).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
                }
                // Check password
                await bcrypt.compare(psw,student.password).then(isMatch => {
                if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    _id : student._id,
                    registrationNumber : student.registrationNumber
                };
                // Sign token
                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                    expiresIn: '1h' 
                    },
                    (err, token) => {
                    res.cookie('jwt',
                    token, {
                        httpOnly : true,
                        secure : false
                    }).status(200).render('./student/postLogin.ejs',{layout : './layouts/postStudentLogin.ejs',stud:student});
                    }
                );
                } else {
                    req.flash("error","Password Incorrect");
                    return res.render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
                }
            });
        } catch (error) {
            // req.flash("error","Error in logging in");
            // return res.render('./auth/admin.ejs',{layout : './layouts/studentLogin.ejs'});
            res.json({"error":error.message});
        }
        },
        forgotPassword : async(req, res)=>{
            try {
                const {email} = req.body;
                const student = await Student.findOne({email});
                if(!student)
                {
                   req.status('error','User not registered');
                   return res.status(404).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
                }
                const otp = generateOTP();
                student.otp = otp;
                await student.save()
                sendEmail(otp,email);
                setTimeout(()=>{
                    student.otp = "";
                    student.save();
                },600000);
                return res.status(200).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'})
            } catch (error) {
                // req.status('error','Error');
                return res.status(400).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
            }
        },
        postOTP : async(req, res)=>{
            try {
                const {email,otp, newPassword, confirmPassword} = req.body;
                const student = await Student.findOne({email});
                if(!student)
                {
                    req.flash("error","Email does not registered");
                    res.status(404).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'});
                }
                if(student.otp!==otp)
                {
                    req.flash("error","OTP does not match");
                    res.status(404).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'});
                }
                if(newPassword!==confirmPassword)
                {
                    req.flash("error","Password mismatched");
                    res.status(404).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'});
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                student.password = hashedPassword;
                await student.save();
                return res.status(200).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
            } catch (error) {
                req.flash("error","Error");
                res.status(404).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'});
            }
        },
    
        studentLogout : (req,res)=>{
            if (req.cookies['jwt']) {
                res
                .clearCookie('jwt')
                .status(200)
                .render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'})
            } else {
                res.status(401).json({
                    error: 'Invalid jwt'
                })
            }
        },
        viewMarks : async(req, res)=>{
            try {
                const {registrationNumber, batch, examType, semester} = req.body;
                const status = await Status.findOne({batch,examType});
                if(status!==null)
                {
                    const student = await Student.findOne({registrationNumber});
                    if(examType === "Mid Term"){
                        const marks = await Marks.find({student:student._id, examType});
                        const marksFinal = [];
                        for(let i=0;i<marks.length;i++)
                        {
                            const id = marks[i].subject;
                            const subjectName = await Subject.findOne({_id:id});
                            const od = {
                                subjectName : subjectName.subjectName,
                                mark : marks[i].marks
                            }
                            marksFinal.push(od);
                        }
                        return res.status(200).render('./student/midTerm.ejs',{layout : './layouts/postStudentLogin.ejs',marksFinal});
                    } 
                    else if(examType === "End Term")
                    {
                         const marks = await Marks.find({student:student._id, examType});
                         const marksFinal = [];
                         let totalMarksObtained = 0;
                         let totalMarksAllSubject = 0;
                         let percent = 0.0;
                         let resultStatus = "PASS";
                         for(let i=0;i<marks.length;i++)
                         {
                             const id = marks[i].subject;
                             const subjectName = await Subject.findOne({_id:id});
                             const studentMidTerm = await Marks.findOne({student:marks[i].student,subject:subjectName._id,examType:"Mid Term"});
                             const ob = {
                                 mid : {
                                     subjectName:subjectName.subjectName,
                                     mark : studentMidTerm.marks,
                                     totalMarks : studentMidTerm.totalMarks
                                 },
                                 end :{
                                     subjectName:subjectName.subjectName,
                                     mark : marks[i].marks,
                                     totalMarks : marks[i].totalMarks
                                 }
                             }
                          
                             totalMarksObtained += Number(studentMidTerm.marks)+Number(marks[i].marks)/2;
                            
                             totalMarksAllSubject += Number(studentMidTerm.totalMarks)+Number(marks[i].totalMarks)/2;
                             marksFinal.push(ob);
                         }
                         percent = Number((totalMarksObtained/totalMarksAllSubject)*100).toFixed(2);
                         if(percent>40.0)
                         {
                             resultStatus = "PASS";
                         }
                         else{
                             resultStatus = "FAIL";
                         }
                         const final = {
                             totalMarksObtained,
                             totalMarksAllSubject,
                             percent,
                             resultStatus
                         };
                         return res.status(200).render('./student/endTerm',{layout : './layouts/postStudentLogin.ejs',marksFinal,final,student});
                    }
                }
                else{
                    return res.status(200).render('./student/resultND.ejs',{layout : './layouts/postStudentLogin.ejs'});
                }

            } catch (error) {
                return res.status(404).json({"error" : error.message});
            }
        }
    }
}
module.exports = profileController;