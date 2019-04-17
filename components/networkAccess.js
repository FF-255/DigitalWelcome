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

// process.env.APP_DIR = '/Users/ffurlan/CiscoApps/DigitalWelcome';
// process.env.NODE_CONFIG_DIR = '/Users/ffurlan/CiscoApps/DigitalWelcome/config';

const request = require('request').defaults({ rejectUnauthorized: false, requestCert: true, agent: false });

const config = require('config');
let iseHostName = config.get("networkaccess.hostname");
let isePort = config.get("networkaccess.port");
let ersUserName = config.get("networkaccess.ers_username");
let ersPassword = config.get("networkaccess.ers_password");
let sponsorUserName = config.get("networkaccess.sponsor_username");
let sponsorPassword = config.get("networkaccess.sponsor_password");
let sponsorUserId = config.get("networkaccess.sponsor_userid");
let guestPortalId = config.get("networkaccess.guest_portalid");

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
         options.url = `https://${iseHostName}:${isePort}/ers/config/guestuser`
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

         if (typeof(body) == 'string') body = JSON.parse(body);

         if (error) return reject(new Error(error))
         if (response.statusCode == 400 || response.statusCode == 404) return reject("Error: " + body.ERSResponse.messages[0].title)
         if (response.statusCode == 200 && method == 'GET') return resolve(body)
         if (response.statusCode == 200 && method == 'PUT' || response.statusCode == 201) return resolve(true)
         return reject("Error: Unkown error in this awesome application.");

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
      catch (error) { return reject (new Error("Invalid request to ISE server")) }
   })
}

function createNewAccount(params) {

   return new Promise(async (resolve, reject) => {

      let password = randomPasswordGenerate();

      let options = {
         body: {
            GuestUser: {
               //id: '123456789',
               //name: 'digitalwelcoming',
               customFields: {},
               guestType: 'Daily (default)',
               portalId: guestPortalId,
               sponsorUserName: sponsorUserName,
               sponsorUserId: sponsorUserId,
               // status: 'ACTIVE',
               // personBeingVisited: params.host.email,
               // reasonForVisit: "Meeting",
               guestInfo: {
                  userName: params.email,
                  firstName: params.name.firstName,
                  lastName: params.name.lastName,
                  emailAddress: params.email,
                  // phoneNumber: params.phone,
                  password: password,
                  // creationTime: iseDate('Start'),
                  //company: 'Cisco Systems',
                  //notificationLanguage: 'English',
                  //smsServiceProvider: 'Global Default',
                  enabled: true
               },
               guestAccessInfo: {
                  location: 'San Jose',
                  fromDate: iseDate('Start'),
                  toDate: iseDate('End'),
                  //ssid: 'ssid',
                  //groupTag: 'DigitalWelcomingAPIUser'
                  validDays: 1
               },
               // link: {
               //    rel: 'self',
               //    href: `https://${iseHostName}:${isePort}/ers/config/guestuser/name/${params.visitor.email}`,
               //    type: 'application/xml'
               // }
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
               guestType: 'Contractor (default)',
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
                  location: 'San Jose',
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

         iseUser = await readIseUserByUsername(params); // Look for username (email) in the database

         if (iseUser == null) {
            let isUserCreated = await createNewAccount(params); // If new create guest access
            return resolve(await readIseUserByUsername(params)) // And then search database for the user again (🤣)
         }

         if (iseUser.status == "AWAITING_INITIAL_LOGIN") return resolve(iseUser) // If existing and active return current info

         if (iseUser.status == "EXPIRED") {
            let isUserUpdated = await activateAccount(iseUser); // If expired create new password and activate
            return resolve(await readIseUserByUsername(params))
         }

      } catch (error) { reject(new Error(error)) }

   })
}

//########## Aux Functions ##########

//Returns current date in the format DD-MM-YYYY 00:00
function randomPasswordGenerate(params = 8) {
   
   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#@$&*";
   let password = "";
   passwordLength = params;

   for (let i = 0; i < passwordLength; i++)
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