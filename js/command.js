
/*
Created by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Middleware functions for DigitalWelcome project
 * 
 */

/* jshint esversion: 6 */

const database = require('./database');
const webexTeams = require('./webexTeams');
const validation = require('./validation');
const webexDevices = require('./webexDevices');
const validation = require('./validation');

//########## Data Creation ##########


//########## Notifications ##########


//##########  Webex Teams  ##########

function teamsContactNotify (params, callback) {

   if (validation.teamMessageParams(params)) {
      webexTeams.sendMessage(params, (err, data) => {
         callback (err, data);
      });
   }
}

//########## Webex Devices ##########

function dialContact(params, callback) {

   webexDevices.callConnect(params.email, (err, data) => {
      if (err) { console.log ('Error.....:', err )};
      callback (err, data);
   });
}

function disconnectContact(params, callback) {

   webexDevices.callDisconnect(params.callId, (err, data) => {
      if (err) { console.log('Error.....:', err) };
      callback(err, data);
   });
}

module.exports.teamsContactNotify = teamsContactNotify;
module.exports.dialContact = dialContact;
module.exports.disconnectContact = disconnectContact;

/*
//########## Params Model  ##########

params = {
   email: ['email1', 'email2, 'email4', .... ], //Required: Type: String - Single or Array of Strings
   message: '**Mensagem** _teste_ 2', //Required: Type: String - Contains the message to be displayed with or without markdown
      file: file, //Optional: Type: Buffer
      fileName: 'file.jpg', //Required: Type: String - mandatory if file parameter is used
      token: 'NGIyNTIzMWYtYzMxZi00Y2JkLTlkMjMtZDQxNzYxOTZjZDdkOTkwOGZmMGItODc1' //Optional: Type: String - Use your account or your BOT to send message
}
*/