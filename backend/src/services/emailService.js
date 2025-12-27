const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text, html) => {
    try {
        // Check if credentials exist
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('Skipping email: Missing EMAIL_USER or EMAIL_PASS in .env');
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // This must be an App Password, not login password
            },
        });

        const mailOptions = {
            from: `"AI Complaint System" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text, // Fallback to text if no HTML provided
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SENT] Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('[EMAIL ERROR]', error);
        // Don't throw, just log. We don't want to break the request if email fails.
    }
};

module.exports = sendEmail;
