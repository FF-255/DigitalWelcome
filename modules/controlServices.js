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

// const config = require("config");
const os = require('os');

//##########   Functions   ##########

async function servicesStatus() {

   return new Promise((resolve, reject) => {

      let status = {};

      status.database = process.env.STATUS_DATABASE ? process.env.STATUS_DATABASE : "disabled";
      status.email = process.env.STATUS_EMAIL ? process.env.STATUS_EMAIL : "disabled";
      status.sms = process.env.STATUS_SMS ? process.env.STATUS_SMS : "disabled";
      status.webexteams = process.env.STATUS_WEBEXTEAMS ? process.env.STATUS_WEBEXTEAMS : "disabled";
      status.networkaccess = process.env.STATUS_NETWORKACCESS ? process.env.STATUS_NETWORKACCESS : "disabled";
      status.digitalsignage = process.env.STATUS_DIGITALSIGNAGE ? process.env.STATUS_DIGITALSIGNAGE : "disabled";

      resolve(status);

   });
}

async function osInformation() {

   return new Promise((resolve, reject) => {

      let serverStatus = { networkInterfaces: [] };

      serverStatus.hostname = os.hostname();
      serverStatus.util = os.loadavg();
      serverStatus.totalMemory = Math.round(os.totalmem() / 1048576);
      serverStatus.freeMemory = Math.round(os.freemem() / 1048576);

      uptime = os.uptime();

      if (uptime > 86400) {
         days = Math.floor(uptime / 86400);
         hours = Math.floor((uptime - (days * 86400)) / 3600);
         minutes = Math.floor((uptime - (days * 86400) - (hours * 3600)) / 60);
         serverStatus.uptime = days + " days " + hours + " hours " + minutes + " minutes";
      } else if (uptime > 3600) {
         hours = Math.floor(uptime / 3600);
         minutes = Math.floor((uptime - (hours * 3600)) / 60);
         serverStatus.uptime = hours + " hours " + minutes + " minutes";
      } else {
         minutes = Math.floor(uptime / 60);
         serverStatus.uptime = minutes + " minutes";
      }

      let cpus = os.cpus();
      serverStatus.cpus = `${cpus.length} x ${cpus[0].model}`;

      let networkInterfaces = os.networkInterfaces();
      for (let i in networkInterfaces) {
         if (i.includes("en")) {
            for (let ii = 0; ii < networkInterfaces[i].length; ii++) {
               if (networkInterfaces[i][ii].family == "IPv4") {
                  serverStatus.networkInterfaces.push(networkInterfaces[i][ii].address);
               }
            }
         }
      }

      resolve(serverStatus);

   });
}

//##########    Exports    ##########

// module.exports.restart = restart;
module.exports.servicesStatus = servicesStatus;
module.exports.osInformation = osInformation;