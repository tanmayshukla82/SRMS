const profileController = require('../app/http/controller/profileController');
const marksController = require('../app/http/controller/marksController');
const subjectController = require('../app/http/controller/subjectController');
const adminController = require('../app/http/controller/adminController');
const mongoose = require('mongoose');
const passport = require('passport');


const initRoute = (app)=>{
    
    app.post('/studentLogin',profileController().studentLogin);
    app.post('/studentLogout',profileController().logout);
    //marks
    app.post('/upload_marks_student', marksController().uploadStudentMarks);
    app.get('/get_student_mark/:_id', marksController().getStudentMarks);

    //subject
    app.post('/subject_upload',subjectController().subjectUpload);

    //admin
    app.post('/addAdmin', adminController().addAdmin);
    app.post('/adminLogin', adminController().adminLogin);
    app.get('/adminLogout',adminController().logout);
    app.get('/',passport.authenticate('jwt',{session : false}),adminController().index);
    app.get('/get-student',passport.authenticate('jwt',{session : false}),adminController().getAllStudent);
    app.get('/get-studentByRollNumber',passport.authenticate('jwt',{session : false}),adminController().getStudentByRollNumber);
    app.post('/register',passport.authenticate('jwt',{session : false}),adminController().postRegister);
    app.get('/register',passport.authenticate('jwt',{session : false}),adminController().register)
    app.patch("/update_student/:id",passport.authenticate('jwt',{session : false}),adminController().update);
    app.delete('/stud_delete/:id',passport.authenticate('jwt',{session : false}),adminController().delete);
};

module.exports = initRoute;