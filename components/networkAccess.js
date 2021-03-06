/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * Guest Access request module for DigitalWelcome project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const request = require('request').defaults({ rejectUnauthorized: false });

const config = require('config');
let iseHostName = config.get("networkaccess.hostname");
let isePort = config.get("networkaccess.port");
let sponsorUserName = config.get("networkaccess.sponsor_username");
let sponsorPassword = config.get("networkaccess.sponsor_password");
let sponsorUserId = config.get("networkaccess.sponsor_userid");
let guestPortalId = config.get("networkaccess.guest_portalid");
let guestType = config.get("networkaccess.guest_type");
let guestLocation = config.get("networkaccess.guest_location");

function iseRequest(method, type, params) {

   let options = {
      method: '',
      url: '',
      headers: {
         'cache-control': 'no-cache',
         'Content-Type': 'application/json',
         'Accept': 'application/json',
         Authorization: "Basic " + new Buffer.from(sponsorUserName + ":" + sponsorPassword).toString("base64")
      }
   }

   return new Promise((resolve, reject) => {

      options.method = method;

      // GET user info using email
      if (method == 'GET' && type == 'email') options.url = `https://${iseHostName}:${isePort}/ers/config/guestuser/?filter=emailAddress.EQ.${params}`

      // GET user info using ID
      if (method == 'GET' && type == 'id') options.url = `https://${iseHostName}:${isePort}/ers/config/guestuser/${params}`

      // POST new user info
      if (method == 'POST' && type == 'json') {
         options.url = `https://${iseHostName}:${isePort}/ers/config/guestuser`;
         options.body = params.body;
         options.json = true;
      }

      // PUT to update user info to activate account
      if (method == 'PUT' && type == 'json') {
         options.url = `https://${iseHostName}:${isePort}/ers/config/guestuser/${params.id}`;
         options.body = params.body;
         options.json = true;
      }

      request(options, (error, response, body) => {

         if (error) return reject(new Error(error))
         if (response.statusCode == 200 && method == 'PUT' || response.statusCode == 201) return resolve(true)

         if (typeof(body) == 'string') body = JSON.parse(body);
         if (response.statusCode == 400 || response.statusCode == 404) return reject("Error: " + body.ERSResponse.messages[0].title)
         if (response.statusCode == 200 && method == 'GET') return resolve(body)
         
         return reject("Error: Unkown error detected.");

      })  
   })
}

function readIseUserByUsername(params) {

   return new Promise(async (resolve, reject) => {

      let userId = "";
      let userArray = [];
      
      try {
         // Read guest information from email
         let { SearchResult } = await iseRequest('GET', 'email', params.email);

         if (SearchResult.total == 0) return resolve (null)
         if (SearchResult.total == 1) userId = SearchResult.resources[0].id;
         if (SearchResult.total > 1) {
            let userArray = SearchResult.resources;
            for (let user in userArray) {
               if (userArray[user].name === params.email) userId = userArray[user].id
            }
         }

         // Read guest information from Id
         let { GuestUser } = await iseRequest('GET', 'id', userId);
         return resolve(GuestUser);

      }
      catch (error) { 
         return reject (new Error("Invalid request to ISE server \n" + error));
      }
   })
}

function createNewAccount(params) {

   return new Promise(async (resolve, reject) => {

      let password = randomPasswordGenerate();

      let options = {
         body: {
            GuestUser: {
               customFields: {},
               guestType: guestType,
               portalId: guestPortalId,
               sponsorUserName: sponsorUserName,
               sponsorUserId: sponsorUserId,
               guestInfo: {
                  userName: params.email,
                  firstName: params.name.firstName,
                  lastName: params.name.lastName,
                  emailAddress: params.email,
                  password: password,
                  enabled: true
               },
               guestAccessInfo: {
                  location: guestLocation,
                  fromDate: iseDate('Start'),
                  toDate: iseDate('End'),
                  validDays: 1
               }
            }
         }
      }

      try {
         let { GuestUser } = await iseRequest('POST', 'json', options);
         return resolve (GuestUser);

      } catch (error) { return reject(new Error(error)) }
   })
}

function activateAccount(params) {

   return new Promise(async (resolve, reject) => {

      let password = randomPasswordGenerate();

      let options = {
         id: params.id,
         body: {
            GuestUser: {
               customFields: {},
               guestType: guestType,
               portalId: guestPortalId,
               sponsorUserName: sponsorUserName,
               sponsorUserId: sponsorUserId,
               status: 'ACTIVE',
               guestInfo: {
                  userName: params.guestInfo.userName,
                  emailAddress: params.guestInfo.emailAddress,
                  password: password,
               },
               guestAccessInfo: {
                  location: guestLocation,
                  fromDate: iseDate('Start'),
                  toDate: iseDate('End'),
                  validDays: 1
               }
            }
         }
      }

      try {
         let { GuestUser } = await iseRequest('PUT', 'json', options);
         return resolve (GuestUser);
      }
      catch (error) { return reject(new Error(error)) }
   })
}

function createGuestAccess (params) {

   return new Promise(async (resolve, reject) => {
      
      try {

         iseUser = await readIseUserByUsername(params); // Look for username (email) in ISE database

         if (iseUser == null) {
            let isUserCreated = await createNewAccount(params); // If not found create new guest access
            return resolve(await readIseUserByUsername(params)) // And then read user info from database for the new user (🤣)
         }

         if (iseUser.status == "AWAITING_INITIAL_LOGIN") return resolve(iseUser) // If exists and is active return user info

         if (iseUser.status == "EXPIRED") {
            let isUserUpdated = await activateAccount(iseUser); // If exists but already expired create new password and activate account
            return resolve(await readIseUserByUsername(params)) // And then read user info from database for the updated username (🤣)
         }

      } catch (error) { reject(new Error(error)) }

   })
}

//########## Aux Functions ##########

//Returns current date in the format DD-MM-YYYY 00:00
function randomPasswordGenerate(params = 8) {
   
   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#@$&*";
   let password = "";

   for (let i = 0; i < params; i++)
      password += characters.charAt(Math.floor(Math.random() * characters.length));

   return (password);
}

//Returns current date in the format MM-DD-YYYY <hour>:<minutes> or 23:59
function iseDate(params) {

   let date = new Date();

   dd = date.getDate();
   mo = date.getMonth() + 1;
   yyyy = date.getFullYear();
   hh = date.getHours();
   mi = date.getMinutes() + 1;

   if (params == 'Start') return (`${mo}/${dd}/${yyyy} ${hh}:${mi}`)
   if (params == 'End') return (`${mo}/${dd}/${yyyy} 23:59`)
}

module.exports.createGuestAccess = createGuestAccess;
module.exports.iseRequest = iseRequest;