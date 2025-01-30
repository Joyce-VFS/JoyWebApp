require('dotenv').config();
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
    to: process.env.EMAIL_TO, 
    from: process.env.EMAIL_FROM, 
    subject: 'Test Email from Node.js',
    text: 'This is a test email to check if SendGrid is working!',
};

sgMail.send(msg)
    .then(() => console.log('Test email sent successfully!'))
    .catch(error => console.error('SendGrid Error:', error.response.body));
