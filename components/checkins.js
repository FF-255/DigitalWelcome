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

function createCheckin(params) {

   let allContactInfo = {};
   let guestAccountInfo = {};
   let networkAccessInfo = {};
   let checkinParams = {
      "visitorId": params.visitorId,
      "hostId": params.hostId,
   };

   return new Promise(async (resolve, reject) => {
      
      try {

         // if (process.env.STATUS_NETWORKACCESS) {
            // If ISE integration is Enabled AND Server is reachable

            allContactInfo = await database.getAllContactInfo(params); // Gather all contact information

            guestAccountInfo = await networkAccess.createGuestAccess(allContactInfo.visitor); // Create a new Guest Access

            networkAccessParams = {
               visitorId: params.visitorId,
               hostId: params.hostId,
               username: guestAccountInfo.guestInfo.userName,
               iseId: guestAccountInfo.id
            };

            //Create new entry in database for future search
            networkAccessInfo = await database.createNetworkAccess(networkAccessParams);

            checkinParams.networkAccessId = networkAccessInfo._id;
         // }

      }
      catch (error) { console.log(error); }
      
      try { return resolve(await database.createCheckin(checkinParams)); }
      catch (error) { return reject(new Error(error)); }
      
   })
}

module.exports.createCheckin = createCheckin;