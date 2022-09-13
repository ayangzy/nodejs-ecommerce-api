const User = require('../models/userModel')
const CustomError = require('../errors')
const {
  createdResponse,
  successResponse,
} = require('../responses/apiResponses')
const crypto = require('crypto')
const { sendVerificationEmail } = require('../utils/sendVerificationEmail')
const createHash = require('../utils/createHash')
const { sendResetPasswordEmail } = require('../utils/sendResetPasswordEmail')

exports.register = async (req, res) => {
  const { name, email, password } = req.body

  const emailAlreadyExist = await User.findOne({ email })
  if (emailAlreadyExist) {
    throw new CustomError.BadRequestError('Email already exist')
  }

  const verificationToken = crypto.randomBytes(40).toString('hex')

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  })

  const tokenUser = user.createJWT()

  const payload = {
    accessToken: tokenUser,
    email: email,
    name: name,
    role: user.role,
  }

  await sendVerificationEmail(email, name, verificationToken)

  createdResponse(
    res,
    'Registration successful, Please check your email to verify account',
    payload,
  )
}

exports.verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.query
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  if (user.verificationToken == '') {
    throw new CustomError.BadRequestError('Already verified')
  }

  if (user.verificationToken !== verificationToken) {
    throw new CustomError.UnauthenticatedError('Verification Failed')
  }

  (user.isVerified = true), (user.verified = Date.now());
  user.verificationToken = '' ;

  await user.save()

  successResponse(res, 'Email verified successfully')
}

exports.login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError.BadRequestError(
      'Please enter your email and password',
    )
  }

  const user = await User.findOne({ email: email })
  if (!user) {
    throw new CustomError.BadRequestError('Invalid credentials')
  }

  if (!user.isVerified) {
    throw new CustomError.BadRequestError('please verify your email')
  }

  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new CustomError.BadRequestError('Invalid credentials')
  }

  const tokenUser = user.createJWT()
  const userObjects = {
    email: user.email,
    name: user.name,
    role: user.role,
  }
  const payload = {
    accessToken: tokenUser,
    user: userObjects,
  }

  successResponse(res, 'User loggedIn successfully', payload)
}

exports.forgotPassword = async (req, res) => {
  const { email, callbackUrl } = req.body

  if (!email || !callbackUrl) {
    throw new CustomError.BadRequestError('Please enter an email')
  }
  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.BadRequestError(
      'Sorry we couldnt find user with this email',
    )
  }
  if (user.isVerified === false) {
    throw new CustomError.BadRequestError(
      'We noticed you registered without confirming your email, kindly do this to enable your reset password',
    )
  }
  const passwordToken = crypto.randomBytes(70).toString('hex')
  await sendResetPasswordEmail(email, user.name, passwordToken, callbackUrl)

  const tenMinutes = 1000 * 60 * 10
  const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes)

  user.passwordToken = createHash(passwordToken)
  user.passwordTokenExpirationDate = passwordTokenExpirationDate
  await user.save()

  successResponse(res, 'Please check your email for reset password link')
}

exports.resetPassword = async (req, res) => {
  const { passwordToken, email, password } = req.body
  if (!passwordToken || !email || !password) {
    throw new CustomError.BadRequestError('All fields are required')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new CustomError.BadRequestError('Invalid email')
  }

  if (passwordToken !== user.passwordToken) {
    throw new CustomError.BadRequestError('Invalid reset password token')
  }
  const isTokenExpired = new Date()
  if (user.passwordTokenExpirationDate < isTokenExpired) {
    throw new CustomError.BadRequestError('Password token is expired')
  }

  user.password = password
  user.passwordToken = null
  user.passwordTokenExpirationDate = null
  await user.save()

  successResponse(res, 'Password reset successful')
}
