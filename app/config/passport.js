const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const mongoose = require('mongoose');
const Faculty = require('../models/faculty')
const Student = require('../models/student_profile');
const Admin = require('../models/admin');

const cookieExtractor = req => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['jwt']
    }
    return jwt
}
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            //console.log(jwt_payload)
            const student = await Student.findById(jwt_payload._id)
            const faculty = await Faculty.findById(jwt_payload._id)
            const admin = await Admin.findById(jwt_payload._id)
            if (faculty) {
                return done(null, faculty)
            }
            else if (student) {
                return done(null, student)
            }
            else if (admin) {
                return done(null, admin)
            }    
            else {
                console.log("Error in passport");
            }
        }
        )
    )
};