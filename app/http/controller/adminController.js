const bcrypt = require('bcrypt');
const Admin = require('../../models/admin');
const Subject = require('../../models/student_subject');
const jwt = require('jsonwebtoken');
const Faculty = require('../../models/faculty');
const Student = require('../../models/student_profile');
const Marks = require('../../models/student_marks');
const Status = require('../../models/status');
const mongoose = require('mongoose');
function adminController(){
    return { 
        addAdminPage : (req, res)=>{
            return res.render("./admin/addAdmin.ejs",{layout : './layouts/adminDashboard.ejs'});
        },    
        addAdmin : async(req, res)=>{
            try {
                const { name, email,
                    department, dob,joiningYear,contactNumber} = req.body
                    Admin.exists({email: email}, (err, result)=>{
                        if(result){
                            res.json({message : "Email alredy exists"});
                        }
                    });
                const admins = await Admin.find({department});
                const date = new Date();
                if(admins.length<=9)
                {
                    helper = "00" + admins.length.toString();
                }
                else if(admins.length>=10 && stud.length<100)
                {
                    helper = "0" + admins.length.toString();
                }
                else {
                    helper = admins.length.toString();
                }
                const components = ["ADM", date.getFullYear(), helper];
                const registrationNumber = components.join("");

                const hashedPassword = await bcrypt.hash(dob, 10);
                const newAdmin = new Admin();
                newAdmin.name = req.body.name;
                newAdmin.email = req.body.email;
                newAdmin.password = hashedPassword;
                newAdmin.registrationNumber = registrationNumber;
                newAdmin.department = req.body.department;
                newAdmin.dob = req.body.dob;
                newAdmin.joiningYear = req.body.joiningYear;
                newAdmin.contactNumber = req.body.contactNumber;
                newAdmin.role = req.body.role;
                await newAdmin.save();
                return res.render("./admin/studentRegister.ejs",{layout : './layouts/adminDashboard.ejs'});

            } catch (error) {
                return res.send(error.message)
            }
        },
        admin : (req,res)=>{
            return res.status(200).render('./auth/admin.ejs',{layout : './layouts/adminLogin.ejs'});
        },
        adminLogin : async(req, res)=>{
            try {
                const admin = await Admin.findOne({registrationNumber: req.body.registrationNumber});
                if(!admin)
                {
                    req.flash('error', "Admin not registered");
                    res.status(404).render('./auth/admin.ejs',{layout : './layouts/adminLogin.ejs'});
                }
                // Check password
                bcrypt.compare(req.body.password, admin.password).then(isMatch => {
                if (isMatch) {
                // User matched
                // Create JWT Payload
                const payload = {
                    _id : admin._id,
                    registrationNumber : admin.registrationNumber
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
                    }).status(200).render('./admin/profile.ejs',{layout : './layouts/adminDashboard.ejs',admin:admin});
                    }
                );
                } else {
                req.flash("error","Invalid Credential")
                return res
                    .status(404)
                    .render('./auth/admin.ejs',{layout : './layouts/adminLogin.ejs'});
                }
            });
            } catch (error) {
                 req.flash("error","Error in connection")
                return res
                    .status(404)
                    .render('./auth/admin.ejs',{layout : './layouts/adminLogin.ejs'});
            }
        },
        getAllStudent : async(req, res)=>{
            try {
                const stud = await Student.find({});
                if(stud.length === 0)
                {
                    req.flash("error","No Student Found");
                    return  res.status(200).render('./admin/getStudent',{layout : './layouts/adminDashboard.ejs'});
                }
                return  res.status(200).render('./admin/getStudent',{layout : './layouts/adminDashboard.ejs', stud : stud});
            } catch (err) {
                req.flash("error","unable to fetch details of student.")
                return  res.status(200).render('./admin/getStudent',{layout : './layouts/adminDashboard.ejs'});
            }
        },
        getAllFaculty : async(req, res)=>{
            try {
                const fac = await Faculty.find({});
                if(!fac)
                {
                    req.flash("error","No Faculty Found");
                    return  res.status(200).render('./admin/getFaculty.ejs',{layout : './layouts/adminDashboard.ejs'});
                }
                return  res.status(200).render('./admin/getFaculty.ejs',{layout : './layouts/adminDashboard.ejs', fac:fac});
            } catch (err) {
                req.flash("error","unable to fetch details of faculty.")
                return  res.status(200).render('./admin/getFaculty.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
        },
        register : (req,res)=>{
            return res.render('./admin/studentRegister.ejs',{layout : './layouts/adminDashboard.ejs'});
        },
        postRegister : async(req,res)=>{
            try {
                const {Email,DOB,Department,Semester,batch} = req.body;

                const st = await Student.findOne({Email});
                if(st)
                {
                    req.flash("error","Already registered");
                    return res.render('./admin/studentRegister.ejs',{layout : './layouts/adminDashboard.ejs'})
                }
                const hashedPassword = await bcrypt.hash(DOB, 10);
                const stud = await Student.find({Department});
                const date = new Date();
                if(stud.length<=9)
                {
                    helper = "00" + stud.length.toString();
                }
                else if(stud.length>=10 && stud.length<100)
                {
                    helper = "0" + stud.length.toString();
                }
                else {
                    helper = stud.length.toString();
                }
                const d = date.getFullYear();
                const components = ["STU", d, helper];
                const registrationNumber = components.join("");
                const student = new Student();
                student.Name = req.body.Name;
                student.Semester = req.body.Semester;
                student.section = req.body.section;
                student.Course = req.body.Course;
                student.Branch = req.body.Branch;
                student.DOB = req.body.DOB;
                student.Father_name = req.body.Father_name;
                student.registrationNumber = registrationNumber;
                student.Email = req.body.Email;
                student.Department = req.body.Department;
                student.phone_number = req.body.phone_number;
                student.aadharCard = req.body.aadharCard;
                student.gender = req.body.gender;
                student.role = req.body.role;
                student.password = hashedPassword;
                student.batch = batch;
                const subjects = await Subject.find({semester : Semester});
                if(subjects!==0)
                {
                    for(let i= 0;i<subjects.length;i++)
                    {
                        student.subjects.push(subjects[i]._id);
                    }
                }
                await student.save();
                req.flash("success","Registered Successfully");
                return res.render('./admin/studentRegister.ejs',{layout : './layouts/adminDashboard.ejs'})
            } catch (error) {
                 if (error.name == "ValidationError") {
                    return res.status(400).json({
                        success: false,
                        message: `${error.message}`,
                    });
            }}   
        },
        profileAdmin : async (req,res)=>{
            try {
                const admin = await Admin.find({});
                return res.render("./admin/profile.ejs",{layout : './layouts/adminDashboard.ejs',admin:admin[0]});
            } catch (error) {
                req.flash("error","Error in connection");
                return res.status(400).render("./admin/profile.ejs",{layout : './layouts/adminDashboard.ejs'});
            }
        },
        addFaculty : async(req, res)=>{
            try{
                const {name ,dob ,email ,gender ,facultyMobileNumber ,aadharCard} = req.body;

                Faculty.exists({email},(err, result)=>{
                    if(result)
                    {
                        req.flash("error","Email already exists");
                        req.flash('name',name);
                        req.flash('email',email);
                        req.flash('dob',dob);
                        req.flash('facultyMobileNumber',facultyMobileNumber);
                        req.flash('aadharCard',aadharCard);
                        return res.render('./admin/facultyRegister.ejs',{layout : './layouts/adminDashboard.ejs'})
                    }
                });
                const faculties = await Faculty.find({});
                const date = new Date();
                const hashedPassword = await bcrypt.hash(dob, 10);
                if(faculties.length<=9)
                {
                    helper = "00" + faculties.length.toString();
                }
                else if(faculties.length>=10 && faculties.length<100)
                {
                    helper = "0" + faculties.length.toString();
                }
                else {
                    helper = faculties.length.toString();
                }
                const components = ["FAC", date.getFullYear(),helper];
                const registrationNumber = components.join("");
                const faculty = new Faculty();
                faculty.name = name;
                faculty.dob = dob;
                faculty.email = email;
                faculty.password = hashedPassword;
                faculty.registrationNumber = registrationNumber;
                faculty.gender = gender;
                faculty.facultyMobileNumber = facultyMobileNumber;
                faculty.aadharCard = aadharCard;

                await faculty.save();
                req.flash("success","Faculty registered successfully");
                return res.status(200).render('./admin/facultyRegister.ejs',{layout : './layouts/adminDashboard.ejs'});
            }catch(err){
                req.flash("error","Error in connection");
                return res.status(400).render('./admin/facultyRegister.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
        },
        facultyRegister: (req, res)=>{
            return res.render('./admin/facultyRegister.ejs',{layout : './layouts/adminDashboard.ejs'});
        },
        updateStudent : async (req, res)=>{
            try {
                const registrationNumber = req.params.id;
                const stud = await Student.findOne({registrationNumber});
                return res.status(200).render('./admin/updateStudent.ejs',{layout : './layouts/adminDashboard.ejs',stud:stud});
            } catch (error) {
                return res.status(400).json({"error" : error.message});
            }
        },
        update : async(req, res)=>{
            try {
                const Email = req.body.Email;
                const stud = await Student.findOne({Email});
                await Student.findByIdAndUpdate(stud._id, req.body);
                const student = await Student.find({});
                req.flash("success","Updated Successfully");
                return res.status(200).render('./admin/getStudent.ejs',{layout : './layouts/adminDashboard.ejs',stud:student});
            } catch (err) {
                req.flash("error","Error in updating");
                return res.status(400).render('./admin/getStudent.ejs',{layout : './layouts/adminDashboard.ejs',stud:student});
            }
        },
        delete : async(req, res)=>{
            try {
                const id = req.params.id;
                const stud = await Student.findOne({registrationNumber : id});
                console.log(stud);
                await Student.deleteOne({registrationNumber : id});
                const m = await Marks.deleteMany({student:stud._id});
                const student = await Student.find({});
                return res.status(200).render('./admin/getStudent.ejs',{layout : 'layouts/adminDashboard.ejs',stud:student});
            } catch (error) {
                req.flash("error","Error in deleting");
                return res.status(400).render('./admin/getStudent.ejs',{layout : 'layouts/adminDashboard.ejs',stud:student});
            }
        },
        deleteFac : async(req, res)=>{
            try {
                const id = req.params.id;
                await Faculty.deleteOne({registrationNumber : id});
                const facAll = await Faculty.find({});
                return res.status(200).render('./admin/getFaculty.ejs',{layout : 'layouts/adminDashboard.ejs',fac:facAll});
            } catch (error) {
                req.flash("error","Error in deleting");
                return res.status(200).render('./admin/getFaculty.ejs',{layout : 'layouts/adminDashboard.ejs'});
            }
        },
        logout : (req,res)=>{
            if (req.cookies['jwt']) {
                res
                .clearCookie('jwt')
                .status(200)
                .render('./auth/admin.ejs',{layout : './layouts/adminLogin.ejs'})
            } else {
                res.status(401).json({
                    error: 'Invalid jwt'
                })
            }
        },
        studentMarks: async (req, res) => {
            try {
                const {subjectCode, examType, totalMarks,reg,name, mark, department, section, batch, semester} = req.body;
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
                        section:sec,
                        marks: mark[i],
                        totalMarks,
                        batch,
                        semester
                    });
                    await newMarks.save()
                }
            }
                req.flash("success","Uploaded Successfully");
                return res.status(200).render('./admin/uploadMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
            catch (err) {
                req.flash("error","Error in uploading marks");
                return res.status(400).render('./admin/uploadMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
            }    
        },
        uploadMarks : (req, res)=>{
            return res.status(200).render('./admin/uploadMarks.ejs',{layout : './layouts/adminDashboard.ejs'})
        },
        getStudentForMarks : async(req, res)=>{
            try {
                const {subjectCode, examType, totalMarks, section, department, batch, semester} = req.body;
                const subject = await Subject.findOne({ subjectCode });
                const sec = section.toLowerCase();
                const stud = await Student.find({section:sec,batch});
                const isAlready = await Marks.find({subject:subject._id,examType,section:sec,batch});
                    if (isAlready.length !== 0) {
                        req.flash("error","Already uploaded");
                        return res.status(200).render('./admin/uploadMarks.ejs',{layout : './layouts/adminDashboard.ejs',subjectCode,examType,section:sec,stud,totalMarks,department,batch,semester});
                    }
                return res.status(200).render('./admin/uploadMarksStudent.ejs',{layout : './layouts/adminDashboard.ejs',subjectCode,examType,section:sec,stud,totalMarks,department,batch,semester});
            } catch (err) {
                req.flash("error","Error in getting details of the student");
                return res.status(400).render("./admin/uploadMarks.ejs",{layout : './layouts/adminDashboard.ejs'});
            }
        },
        updateMarksPage: (req,res)=>{
            return res.status(200).render('./admin/updateMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
        },
        updateMarks : async(req, res)=>{
            try {
                const {registrationNumber, section, semester, department, examType} = req.body;
                const stud = await Student.find({registrationNumber});
                if(!stud)
                {
                    req.flash('error','Unable to find student');
                    return res.status(404).render('./admin/updateMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
                }
                const marks = await Marks.find({student:stud[0]._id, examType, section});
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
                return res.status(200).render('./admin/postUpdateMarksPage.ejs',{layout : './layouts/adminDashboard.ejs',marksWithSubject,stud : stud[0],examType});
            } catch (error) {
                req.flash('error','Error in updating marks.');
                return res.status(404).render('./admin/updateMarks.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
        },
        postUpdateMarks : async(req,res)=>{
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
        prePublish : (req, res)=>{
            return res.status(200).render('./admin/prePublish.ejs',{layout : './layouts/adminDashboard.ejs'});
        },
        publish : async(req, res)=>{
            try {
                const {batch, semester,examType, Department} = req.body;
                const subject = await Subject.find({semester});
                const studentWithMarks = await Marks.find({examType,Department});
                const totalStudent = await Student.find({batch, Department});
                studentWithMarksLength = studentWithMarks.length;
                totalStudentLength = totalStudent.length*subject.length;
                return res.status(200).render('./admin/publish.ejs',{layout : './layouts/adminDashboard.ejs',studentWithMarksLength,totalStudentLength,batch,examType})
            } catch (error) {
                return res.status(404).json({"error" : error.message});
            }
        },
        postPublish : async(req,res)=>{
            try {
                const {batch,examType,publish} = req.body;
                if(publish=="yes")
                {
                    const status = await new Status({
                        batch,
                        examType,
                        status : publish
                    })
                    await status.save();
                }
                req.flash("success","Published Successfully");
                return res.status(200).render('./admin/prePublish.ejs',{layout : './layouts/adminDashboard.ejs'});
            } catch (error) {
                req.flash("error","Error in publishing.");
                return res.status(200).render('./admin/prePublish.ejs',{layout : './layouts/adminDashboard.ejs'});
            }
        }
    }
}
module.exports = adminController;
