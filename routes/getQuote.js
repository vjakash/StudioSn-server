var express = require('express');
var router = express.Router();

//dotenv import
const dotenv = require('dotenv');
dotenv.config();

//mongodb imports
let mongodb = require('mongodb');
let MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectID;
let dbURL = process.env.dbURL;

//bcrypt for hashing and comparing password
let bcrypt = require('bcrypt');
//node-mailer
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: process.env.OAuthClientId,
        clientSecret: process.env.OAuthClientSecret,
        refreshToken: process.env.OAuthRefreshToken,
        accessToken: process.env.OAuthAccessToken
            // xoauth2: xoauth2.createXOAuth2Generator({

        // })
    }
})
let mailOptions = {
    from: `Studio SN ${ process.env.EMAIL}`,
    to: '',
    subject: 'Sending Email using Node.js',
    html: `<h1>Hi from node</h1><p> Messsage</p>`
}



// getQuote route.

router.post('/', async(req, res) => {
    let data = req.body;
    // console.log(data.specialReq);

    mailOptions.subject = `Quotation Request-${data['firstName']} ${data['lastName']}`;
    let specialReq = "";

    if (data.specialReq.length > 0) {
        let tempLi = "";
        data.specialReq.forEach(item => {
            tempLi += `<li>${item}</li>`;
        });
        specialReq = `<h3 style="color:#3E2093">Special Requirements</h3>
        <ul>
          ${tempLi}
          </ul>`;
    }
    let message = "";
    if (data.message !== "") {
        message = `<h3 style="color:#3E2093">Message</h3>
        <p >
        ${data['message']}
        </p>`
    }
    let extraSessions = "";
    if (data.extraSession !== "") {
        extraSessions = `<h3 style="color:#3E2093">Extra Session</h3>
        <p >
        ${data['extraSession']}
        </p>`
    }
    mailOptions.html = `
    <html>
    <head>
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap" rel="stylesheet">
        <style>
            * {
                font-family: Roboto, "Helvetica Neue", sans-serif;
            }
        </style>
    </head>
    
    <body>
        <h1 style="color:#3E2093">Request for quotation</h1>
        <p>
            Name: &nbsp; <span style="font-size:1.2em;color:#3E2093;">${data['firstName']} ${data['lastName']}</span>
        </p>
        <p>
            Phone:&nbsp;
        <span style="font-size:1.2em;color:#3E2093;">
          <a href="tel:${data['phone']}"> ${data['phone']} </a>
        </span>
        </p>
        <p>
            Email:&nbsp;
        <span style="font-size:1.2em;color:#3E2093;">
          <a href="mailto:${data['email']}"> ${data['email']} </a>
        </span>
        </p>
      <p>
            Type of Event: &nbsp; 
        <span style="font-size:1.2em;color:#3E2093;"> ${data['typeOfWedding']}</span>
        </p>
      <p>
            Venue: &nbsp; 
        <span style="font-size:1.2em;color:#3E2093;"> ${data['venue']}</span>
        </p>
        <p>
            Expected no of Guests: &nbsp; 
        <span style="font-size:1.2em;color:#3E2093;"> ${data['expectedNoOfGuests']}</span>
        </p>
      <p>
            Event Start Date: &nbsp; 
        <span style="font-size:1.2em;color:#3E2093;">${new Date(data['startDate']).toDateString()}</span>
        </p>
      <p>
            Event Start time: &nbsp; 
        <span style="font-size:1.2em;color:#3E2093;">${data['startTime']}</span>
        </p>
        <p>
        Event End Date: &nbsp; 
    <span style="font-size:1.2em;color:#3E2093;">${new Date(data['endDate']).toDateString()}</span>
    </p>
  <p>
        Event End time: &nbsp; 
    <span style="font-size:1.2em;color:#3E2093;">${data['endTime']}</span>
    </p>
      
        ${specialReq}
      ${extraSessions}
      ${message}
    </body>
    </html>
    `;
    mailOptions.to = process.env.mailId;
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
            res.status(500).json({
                message: 'Error sending request'
            })
        } else {
            console.log('Email sent: ' + info.response);
            res.status(200).json({
                message: 'sent successfully'
            });
        }
    });



});
module.exports = router;