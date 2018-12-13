
/*
Created by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Database functions for DigitalWelcome project
 * 
 */

/* jshint esversion: 6 */

//##########   Database    ##########
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/digitalwelcome', { useNewUrlParser: true } )
   .then (() => console.log('Connected to MongoDB...'))
   .catch (err => console.error("Could not connect to MongoDB"));

//##########    Schemas    ##########

const ObjectId = mongoose.Schema.Types.ObjectId;

const contactSchema = new mongoose.Schema({
   name: {
      firstName: {type: String, required: true},
      lastName: {type: String, required: true},
   },
   email: { type: String, required: true },
   phone: { type: String, required: true },
   picture: { type: Buffer } ,
   type: { type: Number, min: 1, max: 3, required: true},
   date: { type: Date, default: Date.now },
   isActive: Boolean
});

const roomSchema = new mongoose.Schema({
   name: { type: String },
   size: { type: Number },
   table: { type: Boolean },
   video: { type: Boolean },
   whiteboard: { type: String },
   picture: { type: Buffer },
});

const visitSchema = new mongoose.Schema({
   hostId: { type: ObjectId },
   visitorId: { type: ObjectId },
   roomId: { type: ObjectId },
   date: { type: Date }
});

//##########     Models     ##########
const Contact = mongoose.model('Contact', contactSchema);
const Room = mongoose.model('Room', roomSchema);
const Visit = mongoose.model('Visit', visitSchema);


//##########   Functions   ##########

//##########   Contacts    ##########

async function createContact(params) {

   const contact = new Contact({
      name: {
         firstName: params.name.firstName,
         lastName: params.name.lastName,
      },
      email: params.email,
      phone: params.phone,
      picture: params.picture || null,
      type: params.type,
      isActive: true
   });

   return (result = await contact.save());

}

async function readContact(params) {

   if (params.email) {
      return (await Contact.findOne({ 'email': params.email }));
      //console.log(await Contact.findOne({ 'email': params.email }));
   }
   if (params.name.firstName && params.name.lastName) {
      return (await Contact.findOne({ 'name.firstName': params.firstName, 'name.lastName': params.lastName }));
      //console.log (await Contact.findOne({ name: {'firstName': params.name.firstName, 'lastName': params.name.lastName } }));
   }
}

//##########     Rooms     ##########

async function createRoom(params) {

   const room = new Contact({
      name: params.name,
      size: params.size,
      table: params.table,
      video: params.video,
      whiteboard: params.whiteboard,
      picture: params.picture || null,
   });
   return (result = await rooms.save());
}

async function readRoom(params) {

   if (params.name) { return (await Room.findOne({ 'name': params.name })); }
   if (params.roomId) { return (await Room.findOne({ '_id': params.id })); }

}

//##########    Visits     ##########

async function createVisit(params) {
   const visit = new Visit({
      hostId: params.hostId,
      visitorId: params.visitorId,
      roomId: params.roomId,
      //date: params.date //If empty (Date.now()) or Schedule a visit
   });
   return (result = await visit.save());
}

async function readVisit(params) {
   if (params.date)  { return (await Visit.findOne({ 'hostId': params.hostId, 'visitorId': params.visitorId, 'date': params.date })); }
   else { return (await Visit.findOne({ 'hostId': params.hostId, 'visitorId': params.visitorId })); }   
}

module.exports.createContact = createContact;
module.exports.readContact = readContact;
module.exports.createRoom = createRoom;
module.exports.readRoom = readRoom;
module.exports.createVisit = createVisit;
module.exports.readVisit = readVisit;

/*

##########  Parameters   ##########

Create Contact - Params must be a JSON object:
--------------

   name: {
      firstName: String,
      lastName: String,
   },
   email: String,
   phone: String,
   picture: Buffer,
   type: Number

Read Contact - Params must be a JSON object:
------------
   name: {
      firstName: String,
      lastName: String,
   }
   ** or **
   email: String

Create Room - Params must be a JSON object:
-----------
   name: String,
   size: Number, //Max number of participants that fit the room
   table: Boolean, //If this room has a table
   video: Boolean, //If this room has a video endpoint
   whiteboard: Boolean, //If this room has a whiteboard (analog ou digital)
   picture: Buffer, //(Optional) Inside picture of the room
});

Read Room - Params must be a JSON object:
---------
   name: String,
   ** or **
   roomId: _id //_id from Rooms collection

Create Visit - Params must be a JSON object:
------------
   hostId: _id, //_id from Contacts collection,
   visitorId: _id, //_id from Contacts collection,
   roomId: _id, //_id from Rooms collection,
   date: date, //(Optional) only used if scheduling for a later date

Read Visit - Params must be a JSON object:
----------
   hostId: _id, //_id from Contacts collection,
   visitorId: _id, //_id from Contacts collection,
   date: date, //(Optional)

*/