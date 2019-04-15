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

//########## Teams, Email, ##########
//########## SMS Messaging ##########

function notifyCheckin(params) {

   console.log(params);

   let logoFileName = "logo.png";
   let logoFilePath = `${path.normalize(`${__dirname}/../public/images/`)}/logo.png`;
   let logoCID = "logo@logo.com";
   let attachments = [{ filename: logoFileName, path: logoFilePath, cid: logoCID }];

   let errorMessage = null;

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
      catch (error) {
         console.log(error);
         errorMessage += "Webex Teams - Could not send message";
      }

      // Email
      try {
         if (config.get("notification.email")) {
            let emailSubject = message.emailCheckinSubject();
            let hostEmailMessage = message.emailCheckinMessageHost(params.visitor);
            let visitorEmailMessage = message.emailCheckinMessageVisitor(params.host);
            if (params.networkAccess) visitorEmailMessage += message.teamsNetworkAccess(params.networkAccess);
            let email1 = await email.sendMessage({ "email": params.host.email, "subject": emailSubject, "message": hostEmailMessage, "attachments": attachments });
            let email2 = await email.sendMessage({ "email": params.visitor.email, "subject": emailSubject, "message": visitorEmailMessage, "attachments": attachments });
         }
      }
      catch (error) {
         console.log(error);
         errorMessage += "Email - Could not send message";
      }

      // SMS
      try {
         if (config.get("notification.sms")) {
            let hostSmsMessage = message.smsCheckinMessageHost(params.visitor);
            let visitorSmsMessage = message.smsCheckinMessageVisitor(params.host);
            if (params.networkAccess) visitorSmsMessage += message.teamsNetworkAccess(params.networkAccess);
            if (params.host.phone) { let sms1 = await sms.sendMessage({ "phone": params.host.phone, "message": hostSmsMessage }) }
            if (params.visitor.phone) { let sms2 = await sms.sendMessage({ "phone": params.visitor.phone, "message": visitorSmsMessage }) }
         }
      }
      catch (error) {
         console.log("SMS Error:", error);
         errorMessage += "SMS - Could not send message";
      }

      // Digital Signage
      try {
         if (config.get("notification.digitalsignage")) {
            if (params.digitalSignage && params.room && params.room.name) { let digitalSignage1 = digitalSignage.playContent(params.digitalSignage, params.room.name ); }
            else if (params.digitalSignage) { let digitalSignage2 = digitalSignage.playContent(params.digitalSignage, "SP1-26-CAFETERIA"); }
            else if (digitalSignageFallbackDevice.ip) { let digitalSignage3 = digitalSignage.playContent(digitalSignageFallbackDevice, "SP1-26-CAFETERIA"); }
         }
      }
      catch (error) {
         console.log(error);
         errorMessage += "Digital Signage - Could not send notification";
      }

      if (errorMessage) {
         console.log(errorMessage);
         reject (new Error(errorMessage));
      }
      else {
         resolve ("All notitications were sucessfully sent");
      }
   })
}

/* async function notifyCheckin(params) {

   let logoFileName = "logo.png";
   let logoFilePath = `${path.normalize(`${__dirname}/../public/images/`)}/logo.png`;
   let logoCID = "logo@logo.com";
   let attachments = [{ filename: logoFileName, path: logoFilePath, cid: logoCID }];
   
   try {

      // Webex Teams
      if (config.get("notification.webexteams")) {
         let hostTeamsMessage = message.teamsCheckinMessageHost(params.visitor);
         let visitorTeamsMessage = message.teamsCheckinMessageVisitor(params.host);
         if (config.get("notification.networkaccess") && params.networkAccess) visitorTeamsMessage += message.teamsNetworkAccess(params.networkAccess);
         let teams1 = await webexTeams.sendMessage({ "email": params.host.email, "message": hostTeamsMessage });
         let teams2 = await webexTeams.sendMessage({ "email": params.visitor.email, "message": visitorTeamsMessage });
      }

      // Email
      if (config.get("notification.email")) {
         let emailSubject = message.emailCheckinSubject();
         let hostEmailMessage = message.emailCheckinMessageHost(params.visitor);
         let visitorEmailMessage = message.emailCheckinMessageVisitor(params.host);
         if (params.networkAccess) visitorEmailMessage += message.teamsNetworkAccess(params.networkAccess);
         let email1 = await email.sendMessage({ "email": params.host.email, "subject": emailSubject, "message": hostEmailMessage, "attachments": attachments });
         let email2 = await email.sendMessage({ "email": params.visitor.email, "subject": emailSubject, "message": visitorEmailMessage, "attachments": attachments });
      }

      // SMS
      if (config.get("notification.sms")) {
         let hostSmsMessage = message.smsCheckinMessageHost(params.visitor);
         let visitorSmsMessage = message.smsCheckinMessageVisitor(params.host);
         if (params.networkAccess) visitorSmsMessage += message.teamsNetworkAccess(params.networkAccess);
         if (params.host.phone) { let sms1 = await sms.sendMessage({ "phone": params.host.phone, "message": hostSmsMessage }) }
         if (params.visitor.phone) { let sms2 = await sms.sendMessage({ "phone": params.visitor.phone, "message": visitorSmsMessage }) }
      }

      // Digital Signage
      if (config.get("notification.digitalsignage")) {
         if (params.digitalSignage && params.room && params.room.name) { let digitalSignage1 = digitalSignage.playContent(params.digitalSignage, params.room.name ); }
         else if (params.digitalSignage) { let digitalSignage2 = digitalSignage.playContent(params.digitalSignage, "SP1-26-CAFETERIA"); }
         else if (digitalSignageFallbackDevice.ip) { let digitalSignage3 = digitalSignage.playContent(digitalSignageFallbackDevice, "SP1-26-CAFETERIA"); }
      }
   }
   catch (error) {
      return new Error(error);
   }

   return ("[Checkin - Notify] Notitications were sent correctly");
}; */

async function notifyMeeting(params) {

   return new Promisse(async (resolve, reject ) => {

      try {

         // QR code generation

         let logoFileName = "logo.png";
         let logoFilePath = `${path.normalize(`${__dirname}/../public/images/`)}/logo.png`;
         let logoCID = "logo@logo.com";
         

         let qrcodeText = `${params.meeting._id}`;
         let qrcodeFileName = `${params.meeting._id}.png`;
         let qrcodeFilePath = `${path.normalize(`${__dirname}/../public/images/qrcode`)}/${params.meeting._id}.png`;
         let qrcodeCID = `${params.meeting._id}@qrcode.com`;
         let qrcodeOptions = { color: { dark: '#000', light: '#FFF' } };
         
         QRCode.toFile(qrcodeFilePath, qrcodeText, qrcodeOptions, (error) => {
            if (error) { throw new Error (error) }
         });
         
         // Email
         let emailSubject = message.emailMeetingSubject();
         let hostEmailMessage = message.emailMeetingMessageHost(params);
         let visitorEmailMessage = message.emailMeetingMessageVisitor(params);
         let attachments1 = [{ filename: logoFileName, path: logoFilePath, cid: logoCID }];
         let attachments2 = [{ filename: logoFileName, path: logoFilePath, cid: logoCID }, { filename: qrcodeFileName, path: qrcodeFilePath, cid: qrcodeCID }];
         let email1 = await email.sendMessage({ "email": params.host.email, "subject": emailSubject, "message": hostEmailMessage, "attachments": attachments1 });
         let email2 = await email.sendMessage({ "email": params.visitor.email, "subject": emailSubject, "message": visitorEmailMessage, "attachments": attachments2 })  
      }
      catch (error) {
         reject (new Error(error));
      }

      resolve ("[Meeting - Notify] Notitications were sent correctly");
   })
};

module.exports.notifyCheckin = notifyCheckin;
module.exports.notifyMeeting = notifyMeeting;