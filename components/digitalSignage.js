/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * Digital Signage (DMP) integration module for Digital Welcome Project
*/

/* jshint esversion: 6 */

// process.env.APP_DIR = '/Users/ffurlan/CiscoApps/DigitalWelcome';
// process.env.NODE_CONFIG_DIR = '/Users/ffurlan/CiscoApps/DigitalWelcome/config';

//##########  Ext Modules  ##########
const request = require('request').defaults({ rejectUnauthorized: false, requestCert: true, agent: false });
const config = require('config');

const server = {
   hostname: config.get("digitalsignage.hostname"),
   port: config.get("digitalsignage.port")
}

const rooms = {
   default: config.get("digitalsignage.trigger")
}

//########## Commands and  ##########
//########## default video ##########

function playContent(roomName = "default") {

   trigger = rooms[roomName];
   
   return new Promise ((resolve, reject) => {

      selectCiscoVisionTrigger(trigger)
         .then(() => resolve("Content displayed sucessfully."))
         .catch((err) => reject(err))
   });
}

function selectCiscoVisionTrigger (params) {

   return new Promise((resolve, reject) => {
      
      let options =  {
         method: 'POST',
         url: `http://${server.hostname}:${server.port}/CiscoVision/ws/rest/trigger/input/${params}`,
         // headers: {
         //    'cache-control': 'no-cache',
         //    'Content-Type': 'application/json',
         //    // 'Authorization': 'Basic ' + new Buffer.from(server.username + ":" + server.password).toString('base64'),
         //    'Accept': 'application/json',
         // }
      }

      request(options, function (error, response, body) {

         if (error) return reject(new Error(error))
         if (response.statusCode == 400 || response.statusCode == 404) return reject("Could not play the requested content")
         if (response.statusCode == 200) return resolve(response)

      }); 
   });
}

module.exports.playContent = playContent;
