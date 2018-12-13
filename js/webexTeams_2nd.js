
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

//const validation = require('./validation');

//########## DW BOT TOKEN  ##########
ACCESS_TOKEN = "MDk2OTU2NjAtOWQ3ZC00ZGM5LTk2ZjItNzAwMmUzZTEyNjI4NjU3N2QxNDMtYjMx";

const WebexTeams = require("node-sparkclient");

function sendMessage(params, callback) {

   //########## Params Token  ##########
   //##########  or DW Token  ##########
   const teams = new WebexTeams(params.token || ACCESS_TOKEN);

   //##########Multiple Emails##########
   if (Array.isArray(params.email)) {

      let counter = 0;

      const intervalId = setInterval(() => {

         const messageArgs = { "markdown": true };
         if (params.file) {
            messageArgs.file = params.file,
            messageArgs.filename = params.fileName
         }

         teams.createMessage(params.email[counter], params.message, messageArgs, (err, message) => { callback(err, null); });
   
         counter++;
         if (counter === params.email.length) {
            //console.log('Done');
            clearInterval(intervalId);
         }

      }, 2000);

   } else {

      //########## Single Email  ##########
      const messageArgs = { "markdown": true };
      if (params.file) {
         messageArgs.file = params.file,
            messageArgs.filename = params.fileName
      }

      teams.createMessage(params.email, params.message, messageArgs, function (err, message) { callback(err, null); });
   }
}

module.exports.sendMessage = sendMessage;

//##########  Test Module  ##########

const fs = require('fs');
var file = Buffer.from(fs.readFileSync(__dirname + '/file.jpg'));

let params = {
   email: ['fabiano.furlan@gmail.com', 'ffurlan@cisco.com'],
   message: '**Mensagem** _teste_ 2',
   file: file,
   fileName: 'file.jpg',
   token: 'NGIyNTIzMWYtYzMxZi00Y2JkLTlkMjMtZDQxNzYxOTZjZDdkOTkwOGZmMGItODc1'
};

sendMessage(params, (err, message) => {
   //if (err) { console.log("Error.....:", err); }
   //if (message) { console.log("Resultado.....:)", message); }
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
