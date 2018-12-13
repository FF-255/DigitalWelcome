
/*
Created by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Webex Teams integration for DigitalWelcome project
 * 
 */

/* jshint esversion: 6 */

const fs = require('fs');
var file = fs.readFileSync(__dirname + '/file.jpg');

const validation = require('validation');

//########## DW BOT TOKEN  ##########
ACCESS_TOKEN = "MDk2OTU2NjAtOWQ3ZC00ZGM5LTk2ZjItNzAwMmUzZTEyNjI4NjU3N2QxNDMtYjMx";

const WebexTeams = require("node-sparkclient");

function sendMessage(params, callback) {

   //##########   OWN Token   ##########
   //##########  or DW Token  ##########
   
   const teams = new WebexTeams(params.token || ACCESS_TOKEN);

   //########## Multiple Msgs ##########
   if (Array.isArray(params.email)) {
      
      let counter = 0;

      const intervalId = setInterval(() => {

         if (params.file) {
            teams.createMessage(params.email[counter], params.message, { 'markdown': true, 'file': params.file, 'filename': params.fileName }, function (err, message) { if (err) callback(err, message); });
         } else {
            teams.createMessage(params.email[counter], params.message, { 'markdown': true }, function (err, message) { if (err) callback(err, message); });
         }

         counter++;

         if (counter === params.email.length) {
            //console.log('Done');
            clearInterval(intervalId);
            callback(null, "All messages sent. Command completed sucessfully");
         }

      }, 2000);    
   
   //##########  Single Msg   ##########
   } else if (params.file) {
      teams.createMessage(params.email, params.message, { 'markdown': true, 'file': params.file, 'filename': params.fileName }, function (err, message) { callback(err, null); });
   } else {
      teams.createMessage(params.email, params.message, { 'markdown': true }, function (err, message) { callback(err, null); });
   } 
   
   callback("Invalid parameters, cannot complete request.", null);
   
}

module.exports.sendMessage = sendMessage;

//##########  Test Module  ##########

let params = {
   email: ['ffurlan@cisco.com', 'fabiano.furlan@gmail.com'],
   message: '**Mensagem** _teste_ 2',
   file: file,
   fileName: 'file.jpg',
   token: 'NGIyNTIzMWYtYzMxZi00Y2JkLTlkMjMtZDQxNzYxOTZjZDdkOTkwOGZmMGItODc1'
}

sendMessage(params, (err, message) => {
   if (err) { console.log("Error.....:", err); }
   if (message) { console.log("Resultado.....:)", message); }
});

//validation.validateTeamsMessageParams(params, sendMessage);

//########## Params Model  ##########
/*
params = {
   email: ['email1', 'email2, 'email4', .... ], //Required: Type: String - Single or Array of Strings
   message: '**Mensagem** _teste_ 2', //Required: Type: String - Contains the message to be displayed with or without markdown
   file: file, //Optional: Type: Buffer
   fileName: 'file.jpg', //Required: Type: String - mandatory if file parameter is used
   token: 'NGIyNTIzMWYtYzMxZi00Y2JkLTlkMjMtZDQxNzYxOTZjZDdkOTkwOGZmMGItODc1' //Optional: Type: String - Use your account or your BOT to send message
}
*/
