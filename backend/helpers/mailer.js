const nodemailer = require("nodemailer");

const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
  rejectUnauthorized: false,
}
});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.verify();
  console.log("SMTP ready");
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};