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
        student : async(req,res)=>{
            try {
                return res.status(200).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
            } catch (error) {
                return res.status(404).json({"message" : error.message});
            }
        },
        studentLogin : async(req, res)=>{
            try {
                const {registrationNumber, psw} = req.body;
                
                const student = await Student.findOne({registrationNumber});
                
                if(!student)
                {
                    req.flash('error', "User not registered");
                    res.status(404).send("Student not found");
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
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
        } catch (error) {
            return res.status(400).json({"error":error.message});
        }
        },
        // forgotPassword: (req,res)=>{
        //         return res.status(200).render('./student/forgotPassword.ejs',{layout : './layouts/studentLogin.ejs'});
        // },
        forgotPassword : async(req, res)=>{
            try {
                const {email} = req.body;
                const student = await Student.findOne({email});
                if(!student)
                {
                   return res.status(404).json({message : "Email not registered"});
                }
                const otp = generateOTP();
                student.otp = otp;
                await student.save()
                sendEmail(otp,email);
                // res.status(200).json({message : "Check your registered email"});
                setTimeout(()=>{
                    student.otp = "";
                    student.save();
                },600000);
                return res.status(200).render('./student/postForgotPassword',{layout : './layouts/postStudentLogin.ejs'})
            } catch (error) {
                return res.status(400).json({error : error.message});
            }
        },
        postOTP : async(req, res)=>{
            try {
                const {email,otp, newPassword, confirmPassword} = req.body;
                const student = await Student.findOne({email});
                if(!student)
                {
                    res.status(404).json({message : "Email does not registered"});
                }
                if(student.otp!==otp)
                {
                    return res.json({message : "wrong OTP"});
                }
                if(newPassword!==confirmPassword)
                {
                    return res.json({message : "password mismatched"});
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                student.password = hashedPassword;
                await student.save();
                return res.status(200).render('./auth/student.ejs',{layout : './layouts/studentLogin.ejs'});
            } catch (error) {
                return res.status(400).json({error : error.message}); 
            }
        },
        updateProfile: async (req, res) => {
            try {
                const { email, gender, phone_number,
                    aadharCard } = req.body
                const student = await Student.findOne({ email })
                if (gender) {
                    student.gender = gender
                    await student.save()
                }
                if (phone_number) {
                    student.phone_number = phone_number
                    await student.save()
                }
                if (aadharCard) {
                    student.aadharCard = aadharCard
                    await student.save()
                }
                await student.save()
                res.status(200).json(student)
            }
            catch (err) {
                console.log("Error in updating Profile", err.message)
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