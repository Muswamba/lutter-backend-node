const nodemailer = require("nodemailer");

const sendMail = async (to, subject, html) => {
   const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT, 10), // ensure it's treated as number
      secure: false, // port 587 uses STARTTLS, so secure must be false
      auth: {
         user: process.env.MAIL_USER,
         pass: process.env.MAIL_PASSWORD,
      },
      tls: {
         rejectUnauthorized: false, // safe with Mailtrap sandbox; remove for production
      },
   });

   const mailOptions = {
      from: `Support <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
   };

   try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}`);
   } catch (error) {
      console.error("❌ Failed to send email:", error);
      throw error;
   }
};

module.exports = sendMail;
