
// require('dotenv').config();
const functions = require('firebase-functions');
// const Chatkit = require('@pusher/chatkit-server');

// const Storage = require('@google-cloud/storage');
// const gcs = Storage();

// const {tmpdir} = require('os');
// const {join, dirname} = require('path');
// const sharp = require('sharp');

// const fs = require('fs-extra');


const {gmailConfig} = require('./keys.js')
// // ///Users/{uid}/{profile}/uri/
// const chatkit = new Chatkit.default({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     key: CHATKIT_SECRET_KEY,
// });
// The Firebase Admin SDK to access the Firebase Realtime Database.
// const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-handlebars');

// Step 1
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: gmailConfig
});

// // Step 2
// transporter.use('compile', hbs({
//     viewEngine: 'express-handlebars',
//     viewPath: './views/'
// }));

// admin.initializeApp();



// let uid = "LJ5iio1mhoQRoN0cZfGLPwrYp2B3"
// admin.auth().getUser(uid)
// .then(userRecord => {
//     let sendTo = userRecord.email;
//     let name = userRecord.displayName;
//     console.log(sendTo, name);
//     // let mailOptions = {
//     //     from: 'nottmystyle.help@gmail.com', // TODO: email sender
//     //     to: sendTo, // TODO: email receiver
//     //     subject: `${name}, Welcome to NottMyStyle`,
//     //     text: 'Wooohooo it works!!',
//     //     template: 'welcome',
//     //     context: {
//     //         name: 'Accime Esterling'
//     //     } // send extra values to template
//     // };
    
//     // // Step 4
//     // transporter.sendMail(mailOptions, (err, data) => {
//     //     if (err) {
//     //         return log('Error occurs');
//     //     }
//     //     return log('Email sent!!!');
//     // });
//     return null
// })
// .catch((e)=>console.log('failed to send because ' + e))
