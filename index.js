const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Validate email request
const validateEmailRequest = (req, res, next) => {
  const { to, subject, text, from, smtp_user, smtp_password } = req.body;
  
  if (!to || !subject || !text || !from || !smtp_user || !smtp_password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required fields: to, subject, text, from, smtp_user, smtp_password are all required' 
    });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to) || !emailRegex.test(from)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email format for "to" or "from" fields' 
    });
  }
  
  next();
};

app.post('/send-email', validateEmailRequest, async (req, res) => { 
    const { 
        to, 
        subject, 
        text, 
        from,
        smtp_user,
        smtp_password,
        smtp_host = 'smtp.gmail.com',  // Default to Gmail
        smtp_port = 465                // Default port
    } = req.body;
    
    console.log(`Attempting to send email from ${from} to ${to}`);
    
    const transporter = nodemailer.createTransport({
        host: smtp_host, 
        port: smtp_port,
        secure: true,
        auth: {
            user: smtp_user,
            pass: smtp_password
        },
    });
    
    try {
        await transporter.sendMail({ 
            from: from,
            to,
            subject,
            html: text
        });
    
        console.log(`Email sent successfully to ${to}`);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send email',
            error: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'Service is running' });
});

app.listen(PORT, () => {
    console.log(`Email server running on http://localhost:${PORT}`);
});