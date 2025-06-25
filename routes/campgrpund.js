const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const {isLoggedin,isAuthor,validateCampground} = require('../middleware');
const campground = require('../controllers/campgrounds');
const {storage} = require('../cloudinary')
const multer = require('multer');
const upload = multer({storage});


router.get('/', campground.index);
router.get('/new',isLoggedin,campground.renderNewForm);

router.post('/',isLoggedin,upload.array('image'), validateCampground, catchAsync(campground.createCampground));
router.get('/:id', catchAsync(campground.showCampground));
router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(campground.renderEditForm));
router.put('/:id',isLoggedin, upload.array('image'),validateCampground, catchAsync(campground.updateCampground));
router.delete('/:id',isLoggedin,isAuthor, catchAsync(campground.deleteCampground));
module.exports = router;