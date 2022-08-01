const User = require('../models/userModel');
const CustomError = require('../errors');
const { createdResponse, successResponse } = require('../responses/apiResponses');

exports.register = async(req, res) => {
    const { name, email, password } = req.body;

    const emailAlreadyExist = await User.findOne({email});
    if(emailAlreadyExist){
        throw new CustomError.BadRequestError('Email already exist');
    }

    const user = await User.create({ name, email, password});
    const tokenUser = user.createJWT();

    const payload = {
        accessToken: tokenUser,
        email: email,
        name: name,
        role: user.role,
    }
    createdResponse(res, 'User registered successfully', payload);
   
};

exports.login = async(req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError('Please enter your email and password');
    }

    const user = await User.findOne({email: email});
    if(!user){
        throw new CustomError.BadRequestError('Invalid credentials');
    }


    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        throw new CustomError.BadRequestError('Invalid credentials');
    }

    const tokenUser = user.createJWT();
    const userObjects = {
        email: user.email,
        name: user.name,
        role: user.role,
    }
    const payload = {
        accessToken: tokenUser,
        user: userObjects
    }

    successResponse(res, 'User loggedIn successfully', payload);
   
}