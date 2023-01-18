const express = require('express');
const router = express.Router();
const indexController = require('../controller/index');

// @desc Landing page
// @route GET /

router.get('/', indexController.getIndex);

module.exports = router;