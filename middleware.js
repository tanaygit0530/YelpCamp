const ExpressError = require("./utils/ExpressError");
const {campgroundSchema} = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review')
const {reviewSchema} = require('./schemas.js');
module.exports.isLoggedin = (req,res,next) => {
    if(!req.isAuthenticated()){
     req.session.returnTo = req.originalUrl;
    req.flash('error','You must be signed in!!!!')
    return res.redirect('/login')
  }
  else{
    next();
  }
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}
module.exports.validateCampground = (req,res,next) => {
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,msg)
    }
    else{
        next();
    }
}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); 
    if (!campground.author.equals(req.user._id)) {  
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId); 
    if (!review.author.equals(req.user._id)) {  
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};



module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400,msg)
    }
    else{
        next();
    }
}