const nodeMailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
   const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASSWORD,
      },
   });
   const mailOptions = {
      from: `Support <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
   };
   await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
