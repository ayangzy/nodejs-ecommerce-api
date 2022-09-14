const nodemailer = require('nodemailer');
const nodemailerConfig = require('../utils/nodemailerConfig');

exports.sendResetPasswordEmail = async (email, name, passwordToken, callbackUrl) => {

  const transporter = nodemailer.createTransport(nodemailerConfig);

  const resetURL =  `${callbackUrl}/reset-password?passwordToken=${passwordToken}&email=${email}`;

  const message = `<p>Please reset password by clicking on the following link : 
  <a href="${resetURL}">Reset Password</a></p>`;

  //define the email options
  const mailOptions = {
    to: email,
    subject: 'Reset Password',
    html: `<h4>Hello, ${name}</h4>
   ${message}
   `,
  };

  //actually send the email
  await transporter.sendMail(mailOptions);
  
};



