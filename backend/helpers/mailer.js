const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4,

});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};