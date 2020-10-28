const nodemailer = require("nodemailer");
require('dotenv/config');
var handlebars = require('handlebars');
var fs = require('fs');

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.PASSWORD,
  },
});

exports.sendEmail = (mailContent, callback) => {
  readHTMLFile('public/pages/index.html', function(err, html) {
    var template = handlebars.compile(html);
    var replacements = {
      content: mailContent.content,
    };
    var htmlToSend = template(replacements);
    let mailDetails = {
      from: process.env.EMAIL_ID,
      to: mailContent.receiverEmail,
      subject: mailContent.subject,
      html: htmlToSend,
    };
  return mailTransporter.sendMail(mailDetails, callback);
  });
};

var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};



