/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * RESTfull API's for Digital Welcome Project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const config = require('config');
const message = require('./messages');
const webexTeams = require('./webexTeams');
const email = require('./email');
const sms = require('./sms');
const digitalSignage = require('./digitalSignage');
const QRCode = require('qrcode');
const path = require('path');
const digitalSignageFallbackDevice = { "ip": process.env.DMP_IP || null, "username": process.env.DMP_USERNAME || null, "password": process.env.DMP_PASSWORD || null };
const logo = { fileName: "logo.png", filePath: `${path.normalize(`${__dirname}/../public/images/`)}/logo.png`, cid: "logo@logo.com" };

//########## Teams, Email, ##########
//########## SMS Messaging ##########

function notifyCheckin(params) {

   let errorMessage = [];

   return new Promise(async (resolve, reject) => {

      // Webex Teams
      try {
         if (config.get("notification.webexteams")) {
            let hostTeamsMessage = message.teamsCheckinMessageHost(params.visitor);
            let visitorTeamsMessage = message.teamsCheckinMessageVisitor(params.host);
            if (config.get("notification.networkaccess") && params.networkAccess) visitorTeamsMessage += message.teamsNetworkAccess(params.networkAccess);
            let teams1 = await webexTeams.sendMessage({ "email": params.host.email, "message": hostTeamsMessage });
            let teams2 = await webexTeams.sendMessage({ "email": params.visitor.email, "message": visitorTeamsMessage });
         }
      }
      catch (error) { errorMessage.push("Webex Teams - Could not send message"); }

      // Email
      try {
         if (config.get("notification.email")) {
            let emailSubject = message.emailCheckinSubject();
            let hostEmailMessage = message.emailCheckinMessageHost(params.visitor);
            let visitorEmailMessage = message.emailCheckinMessageVisitor(params.host);
            if (params.networkAccess) visitorEmailMessage += message.emailNetworkAccess(params.networkAccess)
            let attachments = [{ filename: logo.fileName, path: logo.filePath, cid: logo.cid }];
            let email1 = await email.sendMessage({ "email": params.host.email, "subject": emailSubject, "message": hostEmailMessage, "attachments": attachments });
            let email2 = await email.sendMessage({ "email": params.visitor.email, "subject": emailSubject, "message": visitorEmailMessage, "attachments": attachments });
         }
      }
      catch (error) { errorMessage.push("Email - Could not send message"); }

      // SMS
      try {
         if (config.get("notification.sms")) {
            let hostSmsMessage = message.smsCheckinMessageHost(params.visitor);
            let visitorSmsMessage = message.smsCheckinMessageVisitor(params.host);
            if (params.networkAccess) visitorSmsMessage += message.smsNetworkAccess(params.networkAccess);
            if (params.host.phone) { let sms1 = await sms.sendMessage({ "phone": params.host.phone, "message": hostSmsMessage }) }
            if (params.visitor.phone) { let sms2 = await sms.sendMessage({ "phone": params.visitor.phone, "message": visitorSmsMessage }) }
         }
      }
      catch (error) { errorMessage.push("SMS - Could not send message"); }

      // Digital Signage
      try {
         if (config.get("notification.digitalsignage")) {
            // if (params.digitalSignage && params.room && params.room.name) { let digitalSignage1 = digitalSignage.playContent(params.digitalSignage, params.room.name); }
            if (params.hasOwnProperty("room.name")) { let digitalSignage1 = digitalSignage.playContent(params.room.name); }
            else { let digitalSignage1 = digitalSignage.playContent(); }
         }
      }
      catch (error) { errorMessage.push("Digital Signage - Could not play content"); }

      if (errorMessage.length > 0) return reject ("Could not send all notifications", new Error(errorMessage))
      return resolve ("Notitications sent sucessfully");
   })
}

function notifyMeeting(params) {

   return new Promisse(async (resolve, reject ) => {

      try {

         let qrcode = generateQrcodeInfo(params.meeting._id); // QR code generation
         
         QRCode.toFile(qrcode.filePath, qrcode.text, qrcode.options, (error) => {
            if (error) { throw new Error (error) }
         });
         
         // Email
         let emailSubject = message.emailMeetingSubject();
         let hostEmailMessage = message.emailMeetingMessageHost(params);
         let visitorEmailMessage = message.emailMeetingMessageVisitor(params);
         let attachments1 = [{ filename: logo.fileName, path: logo.filePath, cid: logo.cid }];
         let attachments2 = [{ filename: logo.fileName, path: logo.filePath, cid: logo.cid }, { filename: qrcode.fileName, path: qrcode.filePath, cid: qrcode.cid }];
         let email1 = await email.sendMessage({ "email": params.host.email, "subject": emailSubject, "message": hostEmailMessage, "attachments": attachments1 });
         let email2 = await email.sendMessage({ "email": params.visitor.email, "subject": emailSubject, "message": visitorEmailMessage, "attachments": attachments2 })  
      }
      catch (error) { return reject (new Error(error)); }

      return resolve ("[Meeting - Notify] Notitications were sent correctly");
   })
};

function generateQrcodeInfo(params) {

   return ({
      text: `${params}`,
      fileName: `${params}.png`,
      filePath: `${path.normalize(`${__dirname}/../public/images/qrcode`)}/${params}.png`,
      cid: `${params}@qrcode.com`,
      options: { color: { dark: '#000', light: '#FFF' } }
   })
}


module.exports.notifyCheckin = notifyCheckin;
module.exports.notifyMeeting = notifyMeeting;