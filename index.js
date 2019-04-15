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

//########## Env variables ##########

process.env.APP_DIR = __dirname;
process.env.NODE_CONFIG_DIR = (__dirname + '/config');

//##########  Ext Modules  ##########

const configs = require('./components/configs');
const express = require('express');
const welcomeWebApp = express();

//##########  Server Init  #########
welcomeWebApp.use(express.json());
welcomeWebApp.use(express.static('./public'));

isConfigValid = configs.prepareConfigurationFiles();

if (isConfigValid) require('./startup/full_routes')(welcomeWebApp)
else require('./startup/initial_routes')(welcomeWebApp)

//########## Server Start  ##########

const config = require('config');
const port = process.env.SERVER_PORT || config.get("general.port");

welcomeWebApp.listen (port, () => {
  console.log("----------------------------------------------------------");
  console.log(`               API: listening on port ${port}             `);
  console.log("----------------------------------------------------------");
});

//##########    Services   ##########
//##########    Monitor    ##########
require('./components/serviceStatus')();