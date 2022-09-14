const nodemailer = require('nodemailer');
const nodemailerConfig = require('../utils/nodemailerConfig');

exports.sendVerificationEmail = async (email, name, verificationToken) => {

  const transporter = nodemailer.createTransport(nodemailerConfig);

  const verifyEmail = `${process.env.USER_VERIFY_EMAIL}/verify-email?verificationToken=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link : 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  //define the email options
  const mailOptions = {
    from: 'John Doe <johndoe@gmail.com>',
    to: email,
    subject: 'Email Confirmation',
    html: `<h4> Hello, ${name}</h4>${message}
    `,
  };

  //actually send the email
  await transporter.sendMail(mailOptions);
  
};



