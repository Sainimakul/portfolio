const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};