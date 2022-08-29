const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require('../middleware/authentication');



router
    .route('/')
    .get(authenticateUser, userController.getAllUsers)

router.route('/:id').get(authenticateUser, userController.getSingleUser)
router.route('/me/current').get(authenticateUser, userController.getCurrentUser)
router.route('/me/update').patch(authenticateUser, userController.updateUser)
router.route('/me/change-password').patch(authenticateUser, userController.changePassword)



module.exports = router