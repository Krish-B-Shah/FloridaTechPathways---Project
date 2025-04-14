const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',        // YOUR EMAIL
    pass: 'your-app-password'             // YOUR APP PASSWORD (not your normal Gmail password!)
  }
});

// Scheduled function - every day at 9 AM
exports.sendReminderEmail = functions.pubsub.schedule('0 9 * * *').onRun(async (context) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient@example.com',
    subject: 'Daily Internship Reminder!',
    text: 'Hey, don’t forget to check your internships today!'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reminder email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return null;
});