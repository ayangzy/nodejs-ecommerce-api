const CustomError = require("../errors");
const User = require("../models/userModel");
const { successResponse } = require("../responses/apiResponses");

exports.getAllUsers = async(req, res) => {
    const users = await User.find({role: 'user'}).select('-password');

    successResponse(res, 'Users retreived successfully', users);
}

exports.getSingleUser = async(req, res) => {

    const userId = req.params.id;
    const user = await User.findOne({_id: userId}).select('-password')
    if(!user){
        throw new CustomError.NotFoundError(`No user with the Id ${req.params.id}`);
    }

    successResponse(res, 'User retreived successfully', user);
}

exports.getCurrentUser = async(req, res) => {
    const currentUser = req.user;
    
    successResponse(res, {user: currentUser});
}

exports.updateUser = async(req, res) =>{

    const { name, email } = req.body;
    if(!name || !email){
        throw new CustomError.BadRequestError('Please provide all values');
    }

   const user = await User.findOne({_id: req.user.userId})

   user.email = email;
   user.name = name;

   await user.save

   successResponse(res, 'User updated successfully');
}

exports.changePassword = async(req, res) => {

    const { oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError('Please provide all values');
    }

    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new CustomError.BadRequestError('Old password does not match');
    }

    user.password = newPassword;

    await user.save();

    successResponse(res, 'Password changed successfull');
}