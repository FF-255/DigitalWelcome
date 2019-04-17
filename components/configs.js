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

const appDir = process.env.APP_DIR;

//##########  Ext Modules  ##########

const fs = require('fs');

//##########   Functions   ##########

function prepareConfigurationFiles() {

   /*
   
   1. If new configuration file (config_new.json) exists:
      - Copies config.json files to previous.json file
      - Copies config_new.json file to config.json file
      - Validates if file was copied successfully and removes config_new.json

   2. If no config.json file exists:
      - Try to copy previous configuration from previous.json
   
   3. Copies default configuration (initial.json) to config.json
   
   */

   if (fs.existsSync(`${appDir}/config/config_new.json`)) {
      fs.copyFileSync(`${appDir}/config/config.json`, `${appDir}/config/previous.json`);
      fs.copyFileSync(`${appDir}/config/config_new.json`, `${appDir}/config/config.json`);
      if (fs.readFileSync(`${appDir}/config/config.json`).equals(fs.readFileSync(`${appDir}/config/config_new.json`)))
         fs.unlinkSync(`${appDir}/config/config_new.json`);

      console.log("----------------------------------------------------------");
      console.log(" CONFIG: new configuration version was found and applied  ");
      console.log("----------------------------------------------------------");

      return (true);

   } else if (!fs.existsSync(`${appDir}/config/config.json`) && fs.existsSync(`${appDir}/config/previous.json`)) {
      fs.copyFileSync(`${appDir}/config/previous.json`, `${appDir}/config/config.json`);

      console.log("----------------------------------------------------------");
      console.log(" CONFIG: current configuration not found. Using previous. ");
      console.log("----------------------------------------------------------");

      return (true);

   } else if (!fs.existsSync(`${appDir}/config/config.json`)) {
      fs.copyFileSync(`${appDir}/config/initial.json`, `${appDir}/config/config.json`);

      console.log("----------------------------------------------------------");
      console.log("       CONFIG: No previous configuration file found       ");
      console.log("----------------------------------------------------------");
      console.log(" ******************** W A R N I N G ********************* ");
      console.log("                                                          ");
      console.log("    Please access API settings page for initial setup:    ");
      console.log("                  http://<HOSTNAME>:85/                   ");
      console.log("----------------------------------------------------------");

      return (false);
   }

   console.log("----------------------------------------------------------");
   console.log("           CONFIG: existing configuration found           ");
   console.log("----------------------------------------------------------");

   return (true);

}

async function saveConfigToDisk(params) {

   //Creates a new config file and saves to disk
   return new Promise((resolve, reject) => {

      const config = {

         general: {
            port: params.general.port,
            serviceinterval: params.general.serviceinterval,
            proxy: {
               enable: params.general.proxy.enable,
               hostname: params.general.proxy.hostname,
               port: params.general.proxy.port
            }
         },
         database: {
            hostname: params.database.hostname,
            port: params.database.port,
            authentication: params.database.authentication,
            username: params.database.username,
            password: params.database.password,
         },
         notification: {
            language: params.notification.language,
            email: params.notification.email,
            sms: params.notification.sms,
            webexteams: params.notification.webexteams,
            digitalsignage: params.notification.digitalsignage,
            networkaccess: params.notification.networkaccess
         },
         email: {
            service: params.email.service,
            hostname: params.email.hostname,
            port: params.email.port,
            username: params.email.username,
            password: params.email.password,
            authentication: params.email.authentication
         },
         sms: {
            service: params.sms.service,
            account: params.sms.account,
            token: params.sms.token,
            phone: params.sms.phone
         },
         webexteams: {
            access_token: params.webexteams.access_token
         },
         networkaccess: {
            hostname: params.networkaccess.hostname,
            port: params.networkaccess.port,
            ers_username: params.networkaccess.ers_username,
            ers_password: params.networkaccess.ers_password,
            sponsor_username: params.networkaccess.sponsor_username,
            sponsor_password: params.networkaccess.sponsor_password,
            sponsor_userid: params.networkaccess.sponsor_userid,
            guest_portalid: params.networkaccess.guest_portalid
         },
         digitalsignage: {
            hostname: params.digitalsignage.hostname,
            port: params.digitalsignage.port,
            authentication: params.digitalsignage.authentication,
            username: params.digitalsignage.username,
            password: params.digitalsignage.password,
            trigger: params.digitalsignage.trigger
         }
      };

      fs.writeFileSync(`${appDir}/config/config_new.json`, JSON.stringify(config));

      resolve("Configuration saved sucessfully!");

   })
}

async function readCurrentConfigFromDisk(params) {

   //Creates a new config file and saves to disk
   return new Promise((resolve, reject) => {

      resolve(JSON.parse(fs.readFileSync(`${appDir}/config/config.json`)));

   })
}

async function readPreviousConfigFromDisk(params) {

   //Creates a new config file and saves to disk
   return new Promise((resolve, reject) => {

      resolve(JSON.parse(fs.readFileSync(`${appDir}/config/previous.json`)));

   })
}

//##########    Exports    ##########

module.exports.prepareConfigurationFiles = prepareConfigurationFiles;
module.exports.saveConfigToDisk = saveConfigToDisk;
module.exports.readCurrentConfigFromDisk = readCurrentConfigFromDisk;
module.exports.readPreviousConfigFromDisk = readPreviousConfigFromDisk;
