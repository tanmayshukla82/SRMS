const profileController = require('../app/http/controller/profileController');
const adminController = require('../app/http/controller/adminController');
const facultyController = require('../app/http/controller/facultyController');
const mongoose = require('mongoose');
const passport = require('passport');
const Faculty = require('../app/models/faculty');


const initRoute = (app)=>{
    
    //student
    app.get('/student',profileController().student);
    app.post('/studentLogin',profileController().studentLogin);
    app.post('/forgotPassword',profileController().forgotPassword);
    app.post('/postOTP',profileController().postOTP);
    app.get('/studentLogout',profileController().studentLogout);
    app.post('/viewMarks',passport.authenticate('jwt',{session:false}),profileController().viewMarks);
    
    //admin
    app.get('/addAdmin',adminController().addAdminPage);
    app.post('/addAdmin', adminController().addAdmin);
    app.get('/admin',adminController().admin);
    app.post('/adminLogin', adminController().adminLogin);
    app.get('/adminLogout',passport.authenticate('jwt',{session:false}),adminController().logout);
    app.get('/getStudent',passport.authenticate('jwt',{session:false}),adminController().getAllStudent);
    app.post('/register',passport.authenticate('jwt',{session:false}),adminController().postRegister);
    app.get('/studentRegister',passport.authenticate('jwt',{session:false}),adminController().register);
    app.post('/addFaculty',passport.authenticate('jwt',{session:false}),adminController().addFaculty);
    app.get('/facultyRegister',passport.authenticate('jwt',{session:false}),adminController().facultyRegister);
    app.get('/profile',passport.authenticate('jwt',{session:false}),adminController().profileAdmin);
    app.get('/getFaculties',passport.authenticate('jwt',{session:false}));
    app.get('/updateStudent/:id',passport.authenticate('jwt',{session:false}),adminController().updateStudent);
    app.post('/updateStudent',passport.authenticate('jwt',{session : false}),adminController().update);
    app.get('/stud_delete/:id',passport.authenticate('jwt',{session : false}),adminController().delete);
    app.get('/uploadMarks',passport.authenticate('jwt',{session:false}),adminController().uploadMarks);
    app.post('/uploadMarks',passport.authenticate('jwt',{session:false}),adminController().getStudentForMarks);
    app.post('/studentMarks',passport.authenticate('jwt',{session:false}),adminController().studentMarks);
    app.get('/updateMarksPage',passport.authenticate('jwt',{session:false}),adminController().updateMarksPage);
    app.post('/updateMarks',passport.authenticate('jwt',{session:false}),adminController().updateMarks);
    app.post('/postUpdateMarks',passport.authenticate('jwt',{session:false}),adminController().postUpdateMarks);
    app.get('/publish',passport.authenticate('jwt',{session:false}),adminController().prePublish);
    app.post('/publish',passport.authenticate('jwt',{session:false}),adminController().publish);
    app.post('/postPublish',passport.authenticate('jwt',{session:false}),adminController().postPublish);
    app.get('/getFaculty',passport.authenticate('jwt',{session : false}),adminController().getAllFaculty);
    app.get('/fac_delete/:id',passport.authenticate('jwt',{session : false}),adminController().deleteFac);


    //faculty
    app.get('/faculty',facultyController().faculty);
    app.post('/facultyLogin', facultyController().facultyLogin);
    app.post('/facultyForgotPassword',facultyController().forgotPassword);
    app.post('/facultyUpdatePassword',facultyController().updatePassword);
    app.post('/postOTPFaculty',facultyController().postOTP);
    app.get('/facultyLogout',passport.authenticate('jwt',{session:false}),facultyController().logout);
    app.get('/uploadMarksFaculty',passport.authenticate('jwt',{session:false}),facultyController().uploadMarksFaculty);
    app.post('/uploadMarksFaculty',passport.authenticate('jwt',{session:false}),facultyController().getStudentForMarksFaculty);
    app.post('/studentMarksFaculty',passport.authenticate('jwt',{session:false}),facultyController().studentMarksFaculty);
    app.get('/updateMarksPageFaculty',passport.authenticate('jwt',{session:false}),facultyController().updateMarksPageFaculty);
    app.post('/updateMarksFaculty',passport.authenticate('jwt',{session:false}),facultyController().updateMarksFaculty);
    app.post('/postUpdateMarksFaculty',passport.authenticate('jwt',{session:false}),facultyController().postUpdateMarksFaculty);
};

module.exports = initRoute;