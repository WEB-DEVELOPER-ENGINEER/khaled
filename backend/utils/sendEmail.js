const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // Log email configuration (without password)
    console.log('Email Configuration:');
    console.log('- Host:', process.env.EMAIL_HOST);
    console.log('- Port:', process.env.EMAIL_PORT);
    console.log('- User:', process.env.EMAIL_USER);
    console.log('- From:', process.env.EMAIL_FROM);
    console.log('- Password set:', !!process.env.EMAIL_PASSWORD);

    const port = parseInt(process.env.EMAIL_PORT);
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port,
      secure: port === 465, // true for 465 (implicit TLS), false for other ports (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000, // 10 seconds
      greetingTimeout: 10000, // 10 seconds
      socketTimeout: 10000 // 10 seconds
    });

    const fromName = process.env.EMAIL_FROM_NAME || 'Sign2GPT';
    const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const message = {
      from: `${fromName} <${fromAddress}>`,
      to: options.email,
      subject: options.subject,
      html: options.html
    };

    console.log('Attempting to send email to:', options.email);
    const info = await transporter.sendMail(message);
    console.log('✅ Email sent successfully!', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Email Error Details:');
    console.error('- Error Message:', error.message);
    console.error('- Error Code:', error.code);
    console.error('- Error Response:', error.response);
    console.error('- Full Error:', error);
    throw error;
  }
};

module.exports = sendEmail;
