'use-strict';

const nodeMailer = require('nodemailer');

module.exports = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: 'pablo.rodriguez96k@gmail.com',
        pass: process.env.EMAIL_PASS
    },
});
