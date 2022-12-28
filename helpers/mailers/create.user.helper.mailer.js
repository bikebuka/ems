'use strict'

require('dotenv').config();
const url = require('url');
const http = require('http');
const nodemailer = require('nodemailer');
const models = require('../../models');

async function send(to, username, password) {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST, // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

// setup e-mail data, even with unicode symbols
    const message = {
        from: `Task Scheduler Mail  <${process.env.MAIL_USERNAME}>`, // sender address (who sends)
        to: to, // list of receivers (who receives)
        subject: 'Temporary login details', // Subject line
        text: 'Hello world ', // plaintext body
        html: '' // html body
    };

// send mail with defined transport object
    transporter.sendMail(message, function(error, info){
        if(error){
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
}

module.exports = {
    send: send
}
