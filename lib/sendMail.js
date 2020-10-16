const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

exports.sendEmail = (token, rcvEmail, callback) => {
  let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.PASSWORD,
    },
  });

  let mailDetails = {
    from: process.env.EMAIL_ID,
    to: rcvEmail,
    subject: "Email to reset password",
    html: `<h2>Please click on given link to reset your password</h2>
        <span>${process.env.CLIENT_URL}/forgot-password/${token}</span>`,
  };

  return mailTransporter.sendMail(mailDetails, callback);
};
