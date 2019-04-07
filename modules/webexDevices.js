/*
Module developed by:
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

//create the jsxapi connection object
const jsxapi = require('jsxapi');

function callControl(device, params) {
   
   return new Promise ((resolve, reject) => {
      
      const xapi = jsxapi.connect(`ssh://${device.ip}`, {
         username: device.username,
         password: device.password
      });
      
      xapi.on('error', (err) => {  //handler for any errors encountered with jsxapi
         console.error(`connection failed: ${err}, exiting`);
         callback(new Error(`connection failed: ${err}, exiting`))
      });
      
      //when the jsxapi connection is ready...
      xapi.on('ready', () => {
         console.log("connection successful");
      
         // Retrieve and display the current Standby status
         xapi.status
            .get('Standby')
            .then((status) => {
               console.log(`Current Standby status: ${status.State}`);
            });
      });

      if (params.command === "CALL" && params.contact) {
         callConnect(params.contact, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.command === "CALL") {
         callConnect(device.defaultContact, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      } else if (params.command === "DISCONNECT") {
         callDisconnect(null, (err, data) => {
            if (err) reject(err);
            else resolve(data);
         });
      }      
      
      function callConnect(contact, callback) {
         xapi.command('Dial', { Number: contact })
            .then((call) => {
               console.log(call);
               callback(null, call);
            })
      
            .catch((err) => {
               console.log(err);
               callback(err, null);
            })
      };
      
      function callDisconnect(CallId, callback) {
         xapi.command('Call Disconnect')
            .then((call) => {
               console.log(call);
               callback (null, call);
            })
      
            .catch((err) => {
               console.log(err);
               callback(err, null);
            })
      };
   });
}

//##########    Exports    ##########

module.exports.callControl = callControl;