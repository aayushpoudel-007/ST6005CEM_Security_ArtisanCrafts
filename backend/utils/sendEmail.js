import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text, html) => {
  // Create a transporter object using your email service configuration
  let transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use any email service provider
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or application-specific password
    },
  });

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER, // Sender address
    to, // List of recipients
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  });
};

export default sendEmail;
