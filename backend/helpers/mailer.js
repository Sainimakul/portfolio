const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendMail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Makul Saini <noreply@update.makulsaini.online>",
      to,
      subject,
      html,
    });

    console.log("Mail sent:", response);
    return response;
  } catch (err) {
    console.error("Mail error:", err);
    throw err;
  }
};