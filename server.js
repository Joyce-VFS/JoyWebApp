require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: "*", // Allow all origins (before was locally only)
    methods: "POST",
    allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Serve static files from root and assets folders
app.use(express.static(path.join(__dirname, '/')));   // Serve from root
app.use(express.static(path.join(__dirname, 'assets')));  // Serve from assets folder
app.use(express.static(path.join(__dirname, 'images')));  // Serve from images folder
app.use(express.static(path.join(__dirname, 'public')));  // Serve from public folder

// Serve index.html on root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// POST route for sending emails
app.post('/send', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const msg = {
        to: process.env.EMAIL_TO,
        from: process.env.EMAIL_FROM,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await sgMail.send(msg);

        const autoReply = {
            to: email,
            from: process.env.EMAIL_FROM,
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

// Set port and start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
