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

const express = require('express');

const home = require('../routes/home');
const configs = require('../routes/configs');
const osInformation = require('../routes/controlServices');
const users = require('../routes/users');
const auth = require('../routes/auth');


module.exports = function (welcomeWebApp) {
   welcomeWebApp.use('/', home);
   welcomeWebApp.use('/api/v1/configs', configs);
   welcomeWebApp.use('/api/v1/controlServices', osInformation);
   welcomeWebApp.use('/api/v1/users', users);
   welcomeWebApp.use('/api/v1/auth', auth);
}
