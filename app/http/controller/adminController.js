const bcrypt = require('bcrypt');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
function adminController(){
    return {        
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
                if(admins.length<9)
                {
                    helper = "00" + admins.length.toString();
                }
                else if(admins.length>9 && stud.length<100)
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
                return res.send(newAdmin);

            } catch (error) {
                return res.send(error.message)
            }
        },
        adminLogin : async(req, res)=>{
            try {
                // const {registrationNumber, password} = req.body;
                const admin = await Admin.findOne({registrationNumber: req.body.registrationNumber});
                console.log(admin);
                if(!admin)
                {
                    req.flash('error', "User not registered");
                    res.status(404).send("Admin not found");
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
              expiresIn: '30s' 
            },
            (err, token) => {
              res.cookie('jwt',
              token, {
                  httpOnly : true,
                  secure : false
              }).status(200).send("logged in");
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
        } catch (error) {
            return res.status(400).send(error.message);
        }
        },
        index : (req, res, next)=>{
            res.send("hello this is from the home page");
        },
        getAllStudent : async(req, res)=>{
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
        },
        getStudentByRollNumber : async(req, res)=>{
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
        },
        register : (req,res)=>{
            res.send('hello this is register page');
        },
        postRegister : async(req,res)=>{
            try {
                const {Name,Semester,Course,Branch,DOB,Father_name,Admission_number,department,
                        Email,Age,phone_number,aadharCard,gender} = req.body;

                Student.exists({Email: Email}, (err, result)=>{
                    if(result){
                        res.json({message : "Email alredy exists"});
                    }
                });
                const hashedPassword = await bcrypt.hash(DOB, 10);
                const stud = await Student.find({department});
                const date = new Date();
                if(stud.length<9)
                {
                    helper = "00" + stud.length.toString();
                }
                else if(stud.length>9 && stud.length<100)
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
                student.Course = req.body.Course;
                student.Branch = req.body.Branch;
                student.DOB = req.body.DOB;
                student.Father_name = req.body.Father_name;
                student.Admission_number = req.body.Admission_number;
                student.registrationNumber = registrationNumber;
                student.Email = req.body.Email;
                student.Age = req.body.Age;
                student.department = req.body.department;
                student.phone_number = req.body.phone_number;
                student.aadharCard = req.body.aadharCard;
                student.gender = req.body.gender;
                student.role = req.body.role;
                student.password = hashedPassword;
                const result = await student.save();
                res.send(result);
            } catch (err) {
                res.send(err.message);
            }
        },
        update : async(req, res)=>{
            try {
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
        },
        delete : async(req, res)=>{
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
        },
        logout : (req,res)=>{
            if (req.cookies['jwt']) {
                res
                .clearCookie('jwt')
                .status(200)
                .json({
                    message: 'You have logged out'
                })
            } else {
                res.status(401).json({
                    error: 'Invalid jwt'
                })
            }
        }
    }
}
module.exports = adminController;
