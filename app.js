process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require("express");
const app = express();
app.set('query parser', 'extended');
const path = require("path");
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const methodOVerride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const Review = require("./models/review")
const {campgroundSchema,reviewSchema} = require('./schemas.js');
const userCampgrounds = require('./routes/campgrpund');
const userReviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/users')
const sanitizeV5 = require('./utils/mongosanitize.js');
// 'mongodb://127.0.0.1:27017/yelp-camp'
const MongoStore = require('connect-mongo');
const dbUrl =  process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';

// rocess.env.DB_URL ||
mongoose.connect(dbUrl,{
})
  .then(() => {
    console.log("MongoDB connection open!");
  })
  .catch(err => {
    console.error(" MongoDB connection error:", err);
  });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: 'thisshouldbeabettersecret!!',
  touchAfter: 24 * 60 * 60 // in seconds
});

store.on("error",function(e) {
  console.log(e)
})
const sessionConfig = {
  store,
    secret: 'thisshouldbeabettersecret!!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(sanitizeV5({ replaceWith: '_' }));


app.use(express.urlencoded({extended: true}))
app.use(methodOVerride('_method'));
app.engine('ejs', ejsMate);

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})





app.get('/',(req,res) => {
    res.render('home')
});

app.use('/campgrounds',userCampgrounds);
app.use('/campgrounds/:id/reviews',userReviews)
app.use('/',userRoutes);


app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404,"Page Not Found!!"))
})

app.use((err,req,res,next) => {
    const {status = 500} = err;
    if(!err.message) err.message = "Something Went Wrong!!!";
    res.status(status).render("error",{ err });
})

app.listen(3000,() => {
    console.log("Connection Successfull!!!");
});