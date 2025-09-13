
require('dotenv').config()
const express=require("express")
const cors=require('cors')
const ejs=require('ejs')
const dbCon=require('./app/config/dbCon')
const path=require('path')
const fs=require('fs')
const methodOverride = require('method-override');
const session = require('express-session');
const adminRoutes = require('./app/routes/admin/adminRoutes');

dbCon()
const app=express()
app.use(cors())
// Fix CSP here
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src * 'self' data: blob:;");
    next();
});

app.use(session({
  secret: 'myquizsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // use true if using HTTPS
}));


app.use(express.json())
app.use(express.urlencoded({extended:true}))
//method override
app.use(methodOverride('_method'));
// set ejs engine
app.set("view engine", "ejs")
// app.set("views", "views")

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

//routes front end 
//routes catgeory
const categoryRoutes =require('./app/routes/categoryRoutes')
app.use('/api',categoryRoutes )
// user auth route
const userAuthRoues=require('./app/routes/userAuthRoutes')
app.use ('/api/auth',userAuthRoues)
// job route
const jobRoute=require('./app/routes/jobRoutes')
app.use('/api',jobRoute)
app.use("/admin",adminRoutes)

// //admin route
// const adminRoute = require('./app/routes/adminRoutes')
// app.use( adminRoute)

app.get("/", (req, res) => {
  // res.send("✅ Freelance Job Board API is running");
  res.redirect("/admin/login")
});


const port=2001

app.listen(port,()=>{
    console.log("😊😀sever is running at port:",port)
})