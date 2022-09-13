const mongoose = require('mongoose')
const validator = require('validator')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },

  verificationToken: String,

  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
})

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  const token = jwt.sign(
    { userId: this._id, name: this.name, email: this.email },
    process.env.JWT_SERCRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    },
  )
  return token
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  isMatch = await bycrypt.compare(candidatePassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)
