const nodemailer = require('nodemailer');

exports.transactionMail = async (email, name) => {

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //define the email options
  const mailOptions = {
    from: 'John Doe <johndoe@gmail.com>',
    to: email, 
    subject: 'Order payment',
    text: `Dear ${name} Your order has been received. Thank you for transacting with us`,
  };

  //actually send the email
  await transporter.sendMail(mailOptions);
  
};




