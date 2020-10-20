const nodemailer = require("nodemailer");
require('dotenv/config');

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD,
  },
});

exports.sendEmail = (mailContent, callback) => {
  let mailDetails = {
    from: process.env.EMAIL_ID,
    to: mailContent.receiverEmail,
    subject: mailContent.subject,
    html: mailContent.content,
  };
  return mailTransporter.sendMail(mailDetails, callback);
};


