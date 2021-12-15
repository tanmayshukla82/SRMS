require('dotenv').config();
const express = require('express');
const connection = require('./app/config/connection');
const initRoute = require('./routes/web');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const initPassport = require('./app/config/passport');
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const Admin = require('./app/models/admin');

connection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended : false}));


//session config
const url = "mongodb://localhost:27017/srms";
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoStore.create({
        mongoUrl: url,
        collection: 'sessions'
    }),
    saveUninitialized :false,
    cookie: {maxAge: 1000*60*60*24}//24 hours
}))
app.use(flash());


app.use(passport.initialize());
initPassport(passport);

//asset setting
app.use(express.static(__dirname+'/public'));

app.use(expressLayout);


app.set('layout','./layouts/student.ejs','./layouts/admin.ejs');
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs');



initRoute(app);



app.listen(PORT,()=>{
    console.log("connection successful!!");
});