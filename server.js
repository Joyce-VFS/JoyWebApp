require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//app.use(cors());
const corsOptions = {
    origin: "http://127.0.0.1:5500", // Allow frontend to communicate with backend
    methods: "POST",
    allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));

// Set SendGrid API Key
//console.log("SendGrid API Key:", process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve static files from the current directory
const path = require('path');
app.use(express.static('public'));

app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const msg = {
        to: process.env.EMAIL_TO, // Your email
        from: process.env.EMAIL_FROM, // Must match your SendGrid verified sender
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        //await sgMail.send(msg);
        await sgMail.send(msg); // Sends email to you

        const autoReply = {
        to: email, // Sends response to the user
        from: process.env.EMAIL_FROM, // Your email
        subject: "Thank you for reaching out!",
        text: `Hi ${name},\n\nThank you for contacting Joyce! She has received your message and will respond as soon as possible.\n\nBest regards,\nJoyce V.F.S.`,
};

await sgMail.send(autoReply);
res.redirect('/thank-you.html');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
