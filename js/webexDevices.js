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

//########## Data Creation ##########

const device_ip = "111.111.111.111"

//create the jsxapi connection object
const jsxapi = require('jsxapi');
const xapi = jsxapi.connect(`ssh://${device_ip}`, {
   username: 'integrator',
   password: 'C!sco123'
});

xapi.on('error', (err) => {  //handler for any errors encountered with jsxapi
   console.error(`connection failed: ${err}, exiting`);
   process.exit(1); //just exit the app
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

async function callConnect(personEmail, callback) {
   xapi.command('Dial', { Number: 'user@example.com' })
      .then((call) => {
         console.log(call);
         callback(call);
      })

      .catch((err) => {
         console.log(err);
         callback(err);
      })
};

async function callDisconnect(CallId, callback) {
   xapi.command('Call Disconnect', { 'CallId': CallId })
      .then((call) => {
         console.log(call);
         callback (call);
      })

      .catch((err) => {
         console.log(err);
         callback(err);
      })
};


