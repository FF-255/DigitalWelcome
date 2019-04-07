/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * Webex Teams integration for DigitalWelcome project
*/

/* jshint esversion: 6 */

const config = require('config');
const WebexTeams = require('node-sparkclient');

//########## DW BOT TOKEN  ##########
accessToken = config.get("webexteams.access_token");

function sendMessage(params) {

   //##########   Own Token   ##########
   //##########  or DW Token  ##########
   const teams = new WebexTeams(params.token || accessToken);

   //##########  Additional   ##########
   //##########   Variables   ##########
   let counter = 0;
   let message = "";

   return new Promise ((resolve, reject) => {
      
      const intervalId = setInterval(() => {
   
         //########## Message/Files ##########
         const messageArgs = { "markdown": true };
         if (params.file) {
            messageArgs.file = params.file,
            messageArgs.filename = params.fileName
         }
   
         if (Array.isArray(params.email)) {
            //##########Multiple Emails##########
            teams.createMessage(params.email[counter], params.message, messageArgs, (err, message) => { });

         } else {
            //########## Single Email  ##########
            teams.createMessage(params.email, params.message, messageArgs, (err, message) => { });
         }
   
         if (counter == 0) message += params.email[counter]
         else message += " , " + params.email[counter]
   
         counter++;
   
         if (!Array.isArray(params.email) || counter === params.email.length) {
            clearInterval(intervalId);
            resolve(`Message(s) sent sucessfully to (${message}).`);
         }
   
      }, 400);
   });
}

//##########    Exports    ##########

module.exports.sendMessage = sendMessage;