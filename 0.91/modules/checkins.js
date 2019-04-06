/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * Create Checkin request module for DigitalWelcome project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

database = require('./database');
networkAccess = require('./networkAccess');

async function createCheckin(params) {
   
   try {

      let allContactInfo = {};
      let guestAccountInfo = {};
      let networkAccessInfo = {};

      if (process.env.ISE_ALIVE === "Yes") {

         allContactInfo = await database.getAllContactInfo(params);

         guestAccountInfo = await networkAccess.createGuestAccount(allContactInfo);

         networkAccessParams = {
            "visitorId": params.visitorId,
            "hostId": params.hostId,
            "username": guestAccountInfo.username
         };

         networkAccessInfo = await database.createNetworkAccess(networkAccessParams);
      }

      let checkinParams = {
         "visitorId": params.visitorId,
         "hostId": params.hostId,
         "username": networkAccessInfo.username || "notAvailable"
      };

      checkinResult = await database.createCheckin(checkinParams);

      return(checkinResult);
   }
   catch (error) {

      throw(new Error(error));
   }
};

module.exports.createCheckin = createCheckin;