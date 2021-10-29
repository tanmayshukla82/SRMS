const Student = require('../../models/student_profile');
const bcrypt = require('bcrypt');
const passport = require('passport');

function profileController()
{
    return {
           studentLogin : async(req, res, next)=>{
            try {
                const {registrationNumber, password} = req.body;
                const student= await Student.find({registrationNumber});
                // console.log(student);
                if(!student)
                {
                    res.status(404).send("student not found");
                }
                
            }
            catch (err) {
                return res.status(400).send(err, "catch login");
            }
        },
        logout : (req, res)=>{
            req.logout();
            return res.send("logout");
        }
    }
}
module.exports = profileController;