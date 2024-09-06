const { authentication, restrictTo } = require('../controller/authController');
const { createProject, getAllProject } = require('../controller/projectController');

const router = require('express').Router();

router
    .route('/')
    .post(authentication, restrictTo('1'), createProject)
    .get(authentication, getAllProject);

module.exports = router;