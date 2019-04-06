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
const contacts = require('../routes/contacts');
const rooms = require('../routes/rooms');
const meetings = require('../routes/meetings');
const totems = require('../routes/totems');
const checkins = require('../routes/checkins');
const digitalSignage = require('../routes/digitalSignage');
const webexDevices = require('../routes/webexDevices');
const notify = require('../routes/notify');
const configs = require('../routes/configs');
const controlServices = require('../routes/controlServices');
const networkAccess = require('../routes/networkAccess');
const kiosk = require('../routes/kiosk');

module.exports = function (welcomeWebApp) {
   welcomeWebApp.use('/', home);
   welcomeWebApp.use('/config.html', home);
   welcomeWebApp.use('/kiosk.html', kiosk);
   welcomeWebApp.use('/api/v1/contacts', contacts);
   welcomeWebApp.use('/api/v1/rooms', rooms);
   welcomeWebApp.use('/api/v1/meetings', meetings);
   welcomeWebApp.use('/api/v1/totems', totems);
   welcomeWebApp.use('/api/v1/checkins', checkins);
   welcomeWebApp.use('/api/v1/digitalSignage', digitalSignage);
   welcomeWebApp.use('/api/v1/webexDevices', webexDevices);
   welcomeWebApp.use('/api/v1/notify', notify);
   welcomeWebApp.use('/api/v1/configs', configs);
   welcomeWebApp.use('/api/v1/controlServices', controlServices);
   welcomeWebApp.use('/api/v1/networkAccess', networkAccess);
}
