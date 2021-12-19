const Faculty = require('../../models/faculty');
const Subject = require('../../models/student_subject');
const Marks = require('../../models/student_marks');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../../../utils/sendEmail');
const generateOTP = require('../../../utils/generateOTP');
const Student = require('../../models/student_profile');
const flash = require('connect-flash');
function facultyController(){
    return {
        faculty : async(req,res)=>{
            try {
                return res.status(200).render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
            } catch (error) {
                return res.status(404).json({"message" : error.message});
            }
        },
        facultyLogin: async (req, res) => {
            try {
                const { registrationNumber, password } = req.body;
    
                const faculty = await Faculty.findOne({ registrationNumber })
                if (!faculty) {
                    req.flash("error","Faculty not found");
                    return res.render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
                }
                bcrypt.compare(password, faculty.password).then(isMatch => {
                    if (isMatch) {
                      // User matched
                      // Create JWT Payload
                      const payload = {
                        _id: faculty._id, faculty
                      };
                    // Sign token
                      jwt.sign(
                        payload,
                        process.env.JWT_SECRET,
                        {
                          expiresIn: '3h' 
                        },
                        (err, token) => {
                          res.cookie('jwt',
                          token, {
                              httpOnly : true,
                              secure : false
                          }).status(200).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'});
                        }
                      );
                    } else {
                       req.flash("error","Password Incorrect");
                       return res.render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
                    }
                  });
            }
            catch (err) {
               req.flash("error","Error in faculty login.");
               return res.render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
            }
        },
        studentMarksFaculty : async (req, res) => {
            try {
                const {subjectCode, examType, totalMarks,reg,name, mark, department, section,batch, semester} = req.body;
                const subject = await Subject.findOne({ subjectCode });
                 if(!Array.isArray(mark))
                {
                    const registrationNumber = reg;
                    const stud = await Student.findOne({registrationNumber});
                    const sec = section.toLowerCase();
                    
                    const newMarks = await new Marks({
                        student: stud._id,
                        subject: subject._id,
                        examType,
                        department,
                        section:sec,
                        marks: mark,
                        totalMarks,
                        batch,
                        semester
                    })
                    await newMarks.save()
                }
                else{
                for (let i = 0; i < mark.length; i++) {
                    const registrationNumber = reg[i];
                    const stud = await Student.findOne({registrationNumber});
                    const sec = section.toLowerCase();
                    const newMarks = await new Marks({
                        student: stud._id,
                        subject: subject._id,
                        examType,
                        department,
                        section : sec,
                        marks: mark[i],
                        totalMarks,
                        semester,
                        batch
                    });
                    await newMarks.save()
                }
            }
                req.flash("success","Uploaded Successfully");
                return res.status(200).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'});
            }
            catch (err) {
                req.flash("error","Error in uploading marks.");
                return res.status(200).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'});
            }    
        },
        uploadMarksFaculty : (req, res)=>{
            return res.status(200).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'})
        },
        getStudentForMarksFaculty : async(req, res)=>{
            try {
                const {subjectCode, examType, totalMarks, section, department, semester, batch} = req.body;
                const subject = await Subject.findOne({ subjectCode });
                const sec = section.toLowerCase();
                const stud = await Student.find({section : sec});
                const isAlready = await Marks.find({ examType:examType, department, subject:subject._id, section:sec, batch});
                if (isAlready.length !== 0) {
                    req.flash("error","Already uploaded");
                    return res.status(200).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs',subjectCode:subjectCode,examType:examType,section:section,stud:student,totalMarks:totalMarks,department:department,semester,batch});
                }
                return res.status(200).render('./faculty/uploadMarksStudentFaculty.ejs',{layout : './layouts/facultyDashboard.ejs',subjectCode:subjectCode,examType:examType,section:section,stud:stud,totalMarks:totalMarks,department:department,semester,batch});
            } catch (err) {
                req.flash("error","Error in getting student for marks");
                return res.status(400).render('./faculty/uploadMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'});
            }
        },
        updateMarksPageFaculty: (req,res)=>{
            return res.status(200).render('./faculty/updateMarksFaculty.ejs',{layout : './layouts/facultyDashboard.ejs'});
        },
        updateMarksFaculty : async(req, res)=>{
            try {
                const {registrationNumber, section, semester, department, examType} = req.body;
                const stud = await Student.find({registrationNumber});
                if(!stud)
                {
                    req.flash("error","No Student Found");
                    return res.status(404).render('./faculty/updateMarksFaculty',{layout : './layouts/facultyDashboard.ejs'})
                }
                const marks = await Marks.find({student:stud[0]._id, department, examType});
                const marksWithSubject = [];
                for(let i=0;i<marks.length;i++)
                {
                    const sub = await Subject.find({_id : marks[i].subject});
                    const ob = {
                        subjectName : sub[0].subjectName,
                        subjectCode : sub[0].subjectCode,
                        mark : marks[i].marks
                    }
                    marksWithSubject.push(ob);
                }
                return res.status(200).render('./faculty/postUpdateMarksPageFaculty.ejs',{layout : './layouts/facultyDashboard.ejs',marksWithSubject,stud : stud[0],examType});
            } catch (error) {
                req.flash("error","Error in updating marks");
                return res.status(400).render('./faculty/updateMarksFaculty',{layout : './layouts/facultyDashboard.ejs'})
            }
        },
         postUpdateMarksFaculty : async(req,res)=>{
            try {
                const {registrationNumber, subjectCode, subjectName, mark,examType} = req.body;
                const stud = await Student.find({registrationNumber});
                for(let i=0;i<subjectCode.length;i++)
                {
                    const s = await Subject.findOne({subjectCode:subjectCode[i]});
                    const m = await Marks.findOne({student:stud[0],subject:s._id});
                    m.marks = mark[i];
                    await m.save();
                }
                req.flash('success','Marks updated successfully');
                return res.status(200).render('./admin/updateMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
            } catch (error) {
                req.flash('error','Error in updating marks');
                return res.status(400).render('./admin/postUpdateMarksPage.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
        },
        updatePassword : async(req, res)=>{
            try {
                const {oldPassword, newPassword, confirmPassword, email} = req.body;

                const faculty = await Faculty.findOne({email});
                if(!faculty)
                {
                    req.flash("error","Faculty not registered");
                    return res.status(404).render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                const isCorrect = await bcrypt.compare(oldPassword, faculty.password);
                if(!isCorrect)
                {
                    req.flash("error","Invalid Credential");
                    return res.status(404).render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                if(newPassword!==confirmPassword)
                {
                    req.flash("error","Invalid Credential");
                    return res.status(404).render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                else{
                    hashedPassword = await bcrypt.hash(newPassword, 10);
                    faculty.password = hashedPassword;
                    await faculty.save();
                    req.flash("success","Password Updated Successfully");
                    return res.status(200).render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
                }
            } catch (error) {
                req.flash("error","Error in updating marks.");
                return res.status(400).render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
            }
        },
        forgotPassword : async(req, res)=>{
            try {
                const {email} = req.body;
                const faculty = await Faculty.findOne({email});
                if(!faculty)
                {
                   req.flash("error","Faculty Not Registered");
                   return res.render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
                }
                const otp = generateOTP();
                faculty.otp = otp;
                await faculty.save()
                sendEmail(otp,email);
                setTimeout(()=>{
                    faculty.otp = "";
                    faculty.save();
                },600000);
                return res.status(200).render('./faculty/postForgotPassword',{layout:'./layouts/facultyLogin.ejs'});
            } catch (error) {
                req.flash("error","Error in sending mail");
                return res.render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
            }
        },
        postOTP : async(req, res)=>{
            try {
                const {email,otp, newPassword, confirmPassword} = req.body;
                const faculty = await Faculty.findOne({email});
                if(!faculty)
                {
                    req.flash("error","Faculty Not Registered");
                    return res.render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                if(faculty.otp!==otp)
                {
                    req.flash("error","Wrong OTP");
                    return res.render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                if(newPassword!==confirmPassword)
                {
                    req.flash("error","Invalid password");
                    return res.render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'});
                }
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                faculty.password = hashedPassword;
                await faculty.save();
                return res.status(200).render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'});
            } catch (error) {
                req.flash("error","Error in updating password");
                return res.render('./faculty/postForgotPassword',{layout : './layouts/facultyLogin.ejs'}); 
            }
        },
        logout : (req,res)=>{
            if (req.cookies['jwt']) {
                res
                .clearCookie('jwt')
                .status(200)
                .render('./auth/faculty.ejs',{layout : './layouts/facultyLogin.ejs'})
            } else {
                res.status(401).json({
                    error: 'Invalid jwt'
                })
            }
        }
    }
}
module.exports = facultyController;