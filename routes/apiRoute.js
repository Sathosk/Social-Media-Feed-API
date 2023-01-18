const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const apiController = require('../controller/api');

// @desc Post/Create new post
// @route POST api/post/createPost

router.post('/post/createPost', upload.single('profile-pic'),apiController.newPost);

// @desc Get all posts
// @route GET api/post/all

router.get('/post/all', apiController.getAllPosts);

// @desc Update post
// @route PUT api/post/update

router.put('/post/update', apiController.updatePost);

// @desc Delete post
// @route DELETE api/post/remove

router.delete('/post/remove', apiController.deletePost);



module.exports = router;