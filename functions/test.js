
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
const admin = require('firebase-admin');

const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

var serviceAccount = {
    "type": "service_account",
    "project_id": "nottmystyle-447aa",
    "private_key_id": "9e63bdff412718b48054c7769b5644e476171df0",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCnDBnh4CalD1KA\nS8LrODJktymkhmCf/eAEGOiSUgdPfHOtXH+xnPsPlgXFlEVyPoX78AWJnYgj+Hf1\nWajwgazjo/Kr7sEO6S+EB7qP7D7p2fRJvsaMSQcSGrf/JKAEbbrMvw/bxuYGEFLg\n0xN9MbWOqH3H8Fmln63GbdnZNwGIicbXIQxQOe9O0P1J9HqAa3tewS96OvwhQjoR\nPgcSLT5050YJGB1AEelXBR478Ir/dSwMDIJgYf7GdSBs/WEW+NwWm/mxNTLdwiFL\nVn2fIBOIVqrw+WNSQlNWHqHyu6wAWtwM50wEKJY7acREiKauzpFvf+lVL3RmQSG8\nZzkDo/YPAgMBAAECgf91dpStHXF0DG1YACxCl+h6lIAFRFmtm52Rco2buyIqzi2/\nxY1amadV9SxAoBXYNDY5Q9A0bOMjzPVHjZnsnCulDd49fJo9DJzc8N/tsXQPzi9i\nGHqztmhOENELjO+yyKyGe3Z44ki2rUe5FeoeaG1GgmMHX6nYsckfZekjVNRG81ek\nyUOru3gViQ4+i4GwgEIHzXN6W+vXoVeI0HkU7uUvun0l1Bpr63p7QUJhSWAf3Vlu\nFScJlaR9sMyVJNIu9yVOPnN1K8Irkt7rPB2tu7e/sLkuX8N7mvOPGNj65aZH2oRw\nRngL4+Y2aCkiR5j4PqssHwrUdd3ZoflbPjg2ZXUCgYEA5HIQROKG04QBcZbBnfBZ\n7eJrI9hX99h6enRRPHAzjdwTS/nD92zxqjc8G0OhB/QsRVSTBlFIUznzYrBMH67d\nzO+DCxYqj86dpfwDOV1xHqNeTK0xZCSyQ2MPZovoHcBtkeQscf+84y9CHzKZzWT3\nSMGKbh8wmhYbV71iPaXrNvMCgYEAuzIuwJ27kk2jSIcvmIzeaQbGnJbuRz8CyKpi\nlBgZp7jM2qBc3LRuii73mT2l8JuWnY4SX2GtE2fgi3ebizw8795s5u2hVLmELaS3\nea/aLShZXo4m9+eXluxgKozJ/5e/gmmJXEOPTsA4AcWctKYMoag+/v9IpuQnrTmO\nPGpFA3UCgYEAqT13oBDSIdEh4Kz3M7LkbL/Y7+1O/mZ6Fk4mAMh+6RGpmhenfp5P\nSvMwrGIl4maahaJqabu+ASpljS9etfouh6zJQGVjkrZXRKi3GsCHFVOigNuuQ6qM\nBjBVMHtlsuTkR7jq1GnJ3eUc70/lcazjJht8GqkwsHbAOvgq19EbuNECgYBeMBbE\nBdlN+NByesqg+CgkMiuWuH51zKeK7egh2ap28I3qZwuyZPrFfnJIYXNwB+kVp1lp\nMo1SGU8q/Wh++zUx//lNjD1DkwCFsr46dRfS5t1orR/AVn+4iYCtiB9PAjxy0sUx\nbjDaD+9ePN7nKjFq2WuxBCO7DUtFZpNBpLrKzQKBgE2WMHcOiPRqMX/ikJBEtT5v\n3RCutvUYByEq4VIp+wZjOVwGgvmiF/39BivGXp1bKE3NvS1NTX/amvw/17L3JTdt\nqnR8GpEuQ6Ca8zoLpdhDX+3PsTrjvnOAi4vMt5p5momjlU7O77M/8nsT4uWItoS+\nT8k7Lxs5dWvKXnIyI0uW\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-w99mt@nottmystyle-447aa.iam.gserviceaccount.com",
    "client_id": "113044774365290280149",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-w99mt%40nottmystyle-447aa.iam.gserviceaccount.com"
}
  
const firebaseAdminConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://nottmystyle-447aa.firebaseio.com'
}

// Step 1
let transporter = nodemailer.createTransport({
    // service: 'gmail',
    auth: gmailConfig,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    // auth: {
    //     xoauth2: gmailConfig
    // }
});

// console.log(transporter);

// Step 2
transporter.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: './views/partials',
        layoutsDir: './views/layouts',
        defaultLayout: '',
      },
    viewPath: './views',
    extName: '.handlebars',
}));

admin.initializeApp(firebaseAdminConfig);



let uid = "LJ5iio1mhoQRoN0cZfGLPwrYp2B3"
admin.auth().getUser(uid)
.then(userRecord => {
    let sendTo = userRecord.email;
    let name = "Imad Rajwani";
    // console.log(sendTo, name);
    let mailOptions = {
        from: 'nottmystyleapp@gmail.com', // TODO: email sender
        to: sendTo, // TODO: email receiver
        subject: `${name}, Welcome to NottMyStyle`,
        text: 'Wooohooo it works!!',
        template: 'layouts/welcome',
        context: {
            name: 'Accime Esterling'
        } // send extra values to template
    };
    
    // Step 4
    
        
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            console.log(err);
            console.log('Error occurs');
        }
        else {
            console.log(data);
            console.log('Email sent!!!');
        }
    
    })
        
    

    // gmailConfig.generateToken(function (err, token, access) {
    //     console.log(err, token, access);
    //     transporter.sendMail(mailOptions, (err, data) => {
    //         if (err) {
    //             console.log(err);
    //             console.log('Error occurs');
    //         }
    //         else {
    //             console.log(data);
    //             console.log('Email sent!!!');
    //         }
        
    //     })
        
    // })
    return null
})
.catch((e)=>console.log('failed to send because ' + e))
