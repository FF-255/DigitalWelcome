
/*
Created by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Validation module for multiple functions of Digital Welcome
 * 
 */

/* jshint esversion: 6 */

const Joi = require('joi');

//##########   Contacts    ##########

function validateContact(params, callback) {

   const contactsCreateUpdateSchema = {
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(3).required(),
      email: Joi.string().min(3).required(),
      phone: Joi.string().min(10).required(),
      contactType: Joi.number().min(1).max(3).required(),
      isActive: Joi.boolean()
   };

   const contactsReadSchema = {
      firstName: Joi.string().min(3),
      lastName: Joi.string().min(3),
      email: Joi.string().min(3),
   };

   switch (params.command) {

      case "create":
         Joi.validate(contact, contactsCreateUpdateSchema, { abortEarly: false }, (err, data) => { callback(err, data); } );

      case "update":
         Joi.validate(contact, contactsCreateUpdateSchema, { abortEarly: false }, (err, data) => { callback(err, data); } );

      case "read":
         Joi.validate(contact, contactsReadSchema, { abortEarly: false }, (err, data) => { callback(err, data); });
   }
}

//##########  Webex Teams  ##########

function teamsMessageParams(params, callback) {

   const webexTeamsMessageSchema = Joi.object().keys({
      email: Joi.array().items(Joi.string().regex(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).required()).single(),
      message: Joi.string().min(4).required(),
      file: Joi.binary(),
      fileName: Joi.string().regex(/\.(jpg|jpeg|bmp|gif|png)$/i),
      token: Joi.string().min(64).max(64)
   }).with('file', 'fileName');

   Joi.validate({ 'email': params.email, 'message': params.message, 'file': params.file, 'fileName': params.fileName, 'token': params.token }, webexTeamsMessageSchema, { abortEarly: false }, (err, data) => { 
      if (err) {
         let errorMessage = "";
         for (let index = 0; index < err.details.length; index++) {
            errorMessage += `Error #${index + 1}: ${err.details[index].message}  \n`;
         }
         callback(errorMessage, null);
      } else { callback(null, data); }
   });
}

//##########     Email     ##########

module.exports.teamsMessageParams = teamsMessageParams;
module.exports.validateContact = validateContact;

/*
########## Params Model  ##########

##########  Webex Teams  ##########

params = {
   email: ['email1', 'email2, 'email4', .... ], //Required: Type: String - Single or Array of Strings
   message: '**Mensagem** _teste_ 2', //Required: Type: String - Contains the message to be displayed with or without markdown
   file: file, //Optional: Type: Buffer
   fileName: 'file.jpg', //Required: Type: String - mandatory if file parameter is used
   token: 'NGIyNTIzMWYtYzMxZi00Y2JkLTlkMjMtZDQxNzYxOTZjZDdkOTkwOGZmMGItODc1' //Optional: Type: String - Use your account or your BOT to send message
}

##########   Contacts    ##########

params = {
      firstName: 'Name' //Required: Type: String
      lastName: 'lastName' //Required: Type: String
      email: 'email1', //Required: Type: String - requires full e-mail,
      phone: //Required: Type: String - Minimum: 10 - Requires DDD and number,
      contactType: //Required: Type: Number - 1 = Cisco Employee, 2 = Customer, 3 = Partner,
      isActive: Joi.boolean()
   };

*/

//##########  Test Module  ##########

/*
const fs = require('fs');
var file = fs.readFileSync(__dirname + '/file.jpg');

let params = {
   email: ['ffurlan@cisco.com', 'fabiano.furlan@gmail.com', 'slimasil@cisco.com'],
   message: '**Mensagem** _teste_ 2',
   file: "teste",
   fileName: 'file.jpg',
   token: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
}

validateTeamsMessageParams(params, (err, data) => {
   if (err) {
      console.log(err);
   } else {
      console.log(data);
   }
});  
*/

