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
config = require(`${appDir}/components/configs`);
fs = require('fs');

//##########  Ext Modules  ##########

let configs = JSON.parse(fs.readFileSync(`${appDir}/config/config.json`));
let messages = require(`${appDir}/languages/${configs.notification.language}.js`);
let DEBUG = "sparkbot:utils,samples*";
process.env.CONFIG_ID = configs._id;

//##########  Ext Modules  ##########
//##########  Ext Modules  ##########

module.exports = {
   "jwtPrivateKey": "",
   "DEBUG": DEBUG,
   "general": configs.general,
   "database": configs.database,
   "notification": configs.notification,
   "email": configs.email,
   "sms": configs.sms,
   "webexteams": configs.webexteams,
   "networkaccess": configs.networkaccess,
   "digitalsignage": configs.digitalsignage,
   "messages": messages
}