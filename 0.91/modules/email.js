/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * E-mail module for DigitalWelcome project 
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const config = require('config');
const nodemailer = require('nodemailer');

const emailType = config.get("email.service");
const emailSecure = config.get("email.authentication");
const emailUser = config.get("email.username");
const emailPassword = config.get("email.password");
const emailHost = config.get("email.hostname");
const emailPort = config.get("email.port");

let emailTransportParams = {};

if (emailType === "smtp") {

   emailTransportParams = {
      host: emailHost,
      port: emailPort
   };

   if (emailSecure == "Yes") {
      emailTransportParams.secure = true,
      emailTransportParams.auth = {
         user: emailUser,
         pass: emailPassword
      }
   } else {
      emailTransportParams.secure = false;
   }
   
} else if (emailType === "gmail") {

   emailTransportParams = {
      service: 'gmail',
      auth: {
         user: emailUser,
         pass: emailPassword
      }
   }
}

const transporter = nodemailer.createTransport(emailTransportParams);

//##########   Functions   ##########

function sendMessage(params) {

   //##########  Additional   ##########
   //##########   Variables   ##########
   let counter = 0;
   let message = "";

   return new Promise((resolve, reject) => {

      let mailOptions = {
         from: emailUser,
         to: null,
         subject: params.subject,
         html: params.message
      };

      if (params.attachments) mailOptions.attachments = params.attachments

      const intervalId = setInterval(() => {

         if (Array.isArray(params.email)) {
            //##########Multiple Emails##########
            mailOptions.to = params.email[counter];

         } else {
            //########## Single Email  ##########
            mailOptions.to = params.email;
         }

         transporter.sendMail(mailOptions, function (err, data) { if (err) reject(err); });

         if (counter == 0) message += params.email[counter];
         else message += " , " + params.email[counter];

         counter++;

         if (!Array.isArray(params.email) || counter === params.email.length) {
            clearInterval(intervalId);
            resolve(`Messages sent sucessfully to (${message}).`);
         }
      }, 400);
   });
}

//##########    Exports    ##########

module.exports.sendMessage = sendMessage;
