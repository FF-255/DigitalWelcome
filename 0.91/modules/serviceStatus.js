/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * SMS module for DigitalWelcome project 
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const config = require('config');
const request = require('request');
const isPortReachable = require('is-port-reachable');

//##########   Functions   ##########

module.exports = function() {

   console.log("----------------------------------------------------------");
   console.log(`                SERVICES: Monitor enabled                 `);
   console.log("----------------------------------------------------------");

   let interval = config.get("general.serviceinterval") * 1000;

   let notification = {
      email: config.get("notification.email"),
      sms: config.get("notification.sms"),
      webexteams: config.get("notification.webexteams"),
      networkaccess: config.get("notification.networkaccess"),
      digitalsignage: config.get("notification.digitalsignage")
   }

   // Proxy
   const proxy = `http://${process.env.PROXY_HOST}:${process.env.PROXY_PORT}`;

   //Database
   const databaseHostname = config.get("database.hostname");
   const databasePort = config.get("database.port");

   // Webex Teams
   let webexTeamsOptions = {
      method: 'GET'
      , headers: { 'content-type': 'application/json;charset=UTF-8' }
      , uri: 'https://api.ciscospark.com/v1/people/me'
      , body: JSON.stringify({})
      , auth: {'bearer': config.get("webexteams.access_token") }
   }

   // Twilio
   const smsService = config.get("sms.service");
   const accountSid = config.get("sms.account");
   const authToken = config.get("sms.token");
   const auth = "Basic " + new Buffer.from(accountSid + ":" + authToken).toString("base64");
   let twilioOptions = {
      method: 'GET'
      , headers: { 'content-type': 'application/json;charset=UTF-8', 'Authorization': auth }
      , uri: `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`
      , body: JSON.stringify({})
   }

   // Email
   emailService = config.get("email.service");
   emailPort = config.get("email.port");
   emailHostname = config.get("email.hostname");
   emailUsername = config.get("email.username");
   emailPassword = config.get("email.password");

   // Network Access
   networkAccessHostname = config.get("networkaccess.hostname");
   networkAccessPort = config.get("networkaccess.port");

   setInterval(async ()=>{

      // Database
      process.env.STATUS_DATABASE = await isPortReachable(databasePort, { host: databaseHostname });

      // Email
      if (notification.email && emailService === "smtp") {
         process.env.STATUS_EMAIL = await isPortReachable(emailPort, { host: emailHostname });
      }

      // Network Access
      if (notification.networkaccess) {
         process.env.STATUS_NETWORKACCESS = await isPortReachable(networkAccessPort, { host: networkAccessHostname });
      }

      //Digital Signage
      if (notification.digitalsignage) {
         process.env.STATUS_DIGITALSIGNAGE = await isPortReachable(networkAccessPort, { host: networkAccessHostname });
      }

      // Webex Teams
      if (notification.webexteams) {
         if (process.env.PROXY_ENABLED === "yes") { webexTeamsOptions.proxy = proxy }
         request(webexTeamsOptions, (error, response, body) => { process.env.STATUS_WEBEXTEAMS = (response && response.statusCode == 200) })
      }

      // Twilio
      if (notification.sms && smsService === "twilio") {
         if (process.env.PROXY_ENABLED === "yes") { twilioOptions.proxy = proxy }
         request(twilioOptions, (error, response, body) => { process.env.STATUS_SMS = (response && response.statusCode == 200) })
      }

   }, interval);

}

//##########    Exports    ##########
