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