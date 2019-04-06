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

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const request = require('request');

const config = require('config');
let iseHostName = config.get("networkaccess.hostname");
let isePort = config.get("networkaccess.port");
let ersUserName = config.get("networkaccess.ers_username");
let ersPassword = config.get("networkaccess.ers_password");
let sponsorUserName = config.get("networkaccess.sponsor_username");
let sponsorPassword = config.get("networkaccess.sponsor_password");
let sponsorUserId = config.get("networkaccess.sponsor_userid");
let guestPortalId = config.get("networkaccess.guest_portalid");

function verifyGuestAccount(params) {

   return new Promise((resolve, reject) => {
      
      let options = {
         method: 'POST',
         url: `https://${iseHostName}:${isePort}/ers/config/guestuser/?filter=emailAddress.EQ.${params.email}`,
         headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: "Basic " + new Buffer.from(sponsorUserName + ":" + sponsorPassword).toString("base64")
         }
      }

      // $headers = [
      //    'Accept: application/vnd.com.cisco.ise.identity.guestuser.2.0+xml',
      // ];

      request(options,
         function (error, response, body) {
            if (error) {
               console.log("ERROR.....:\n", error);
               reject(new Error(error));
            } else {
               //console.log("RESPONSE.....:\n", response);
               console.log("BODY.....:\n", body);
               resolve(body);
            }
         });

   })
}

function createGuestAccount(params) {

   return new Promise((resolve, reject) => {

      let options = {
         method: 'POST',
         url: `https://${iseHostName}:${isePort}/ers/config/guestuser`,
         headers: {
            'cache-control': 'no-cache',
            Authorization: "Basic " + new Buffer.from(sponsorUserName + ":" + sponsorPassword).toString("base64"),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
         },
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
                  userName: params.visitor.email,
                  // firstName: params.visitor.name.firstName,
                  // lastName: params.visitor.name.lastName,
                  emailAddress: params.visitor.email,
                  // phoneNumber: params.visitor.phone,
                  password: randomPasswordGenerate(),
                  // creationTime: iseDateToday(),
                  //company: 'Cisco Systems',
                  //notificationLanguage: 'English',
                  //smsServiceProvider: 'Global Default',
                  enabled: true
               },
               guestAccessInfo: {
                  location: 'San Jose',
                  fromDate: iseDateToday(),
                  toDate: iseDateTomorrow(),
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
         },
         json: true
      }

      request(options,
         function (error, response, body) {
            if (error) {
               console.log("ERROR.....:\n", error);
               reject(new Error(error));
            } else {
               //console.log("RESPONSE.....:\n", response);
               console.log("BODY.....:\n", body);
               resolve(body); 
            } 
         });

      // let options 2 = 
      //
      // Need to call dbAPI and update status to created
      //
      // $dbURL = "http://24.239.120.11:9999/api/update-status-guest-account?emailid=".$emailaddy. "&status=completed&guestpassword=".$passwd;
      // $message = updateAPI($dbURL);
      // echo $message;
      
   });
}

function reEnableGuestAccount(params) {

   return new Promise((resolve, reject) => {

      let options = {
         method: 'POST',
         url: `https://${iseHostName}:${isePort}/ers/config/guestuser/?filter=emailAddress.EQ.${params.email}`,
         headers: {
            'cache-control': 'no-cache',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: "Basic " + new Buffer.from(sponsorUserName + ":" + sponsorPassword).toString("base64")
         }
      }

      // $headers = [
      //    'Accept: application/vnd.com.cisco.ise.identity.guestuser.2.0+xml',
      // ];

      request(options,
         function (error, response, body) {
            if (error) {
               console.log("ERROR.....:\n", error);
               reject(new Error(error));
            } else {
               //console.log("RESPONSE.....:\n", response);
               console.log("BODY.....:\n", body);
               resolve(body);
            }
         });

   })
}

//########## Aux Functions ##########

//Returns current date in the format DD-MM-YYYY 00:00
function randomPasswordGenerate(params) {
   
   let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#@$&*";
   let password = "";
   passwordLength = typeOf(params.passwordLength != 'undefined') ? params.passwordLength : 8;

   for (let i = 0; i < params.passwordLength; i++)
      password += characters.charAt(Math.floor(Math.random() * characters.length));

   return password;
}

//Returns current date in the format DD-MM-YYYY 00:00
function iseDateToday() {

   let date = new Date();

   dd = date.getDate();
   mo = date.getMonth();
   yyyy = date.getFullYear();
   hh = date.getHours();
   mi = date.getMinutes() + 1;

   return (`${dd}/${mo}/${yyyy} ${hh}:${mi}`);
}

//Returns tomorrow date in the format DD-MM-YYYY 00:00
function iseDateTomorrow() {

   let date = new Date();
   date.setTime(new Date().getTime() + 86400000);

   dd = date.getDate();
   mo = date.getMonth();
   yyyy = date.getFullYear();
   hh = date.getHours();
   mi = date.getMinutes() + 1;

   return (`${dd}/${mo}/${yyyy} ${hh}:${mi}`);
   
}

module.exports.createGuestAccount = createGuestAccount;
module.exports.verifyGuestAccount = verifyGuestAccount;
module.exports.reEnableGuestAccount = reEnableGuestAccount;
