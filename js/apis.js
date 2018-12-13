
/*
Created by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Web Server API's for DigitalWelcome project
 * 
 */

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const command = require('./command');

//##########  Server Init  ##########

const express = require('express');
const welcomeWebApp = express();
welcomeWebApp.use(express.json());
welcomeWebApp.use(express.static('/Users/ffurlan/CiscoApps/DigitalWelcome'));

//##########     API's     ##########

//########## Data Creation ##########

welcomeWebApp.post('/api/contacts', (req, res) => {
   command.createContact(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.post('/api/rooms', (req, res) => {
   command.createRoom(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.post('/api/checkin', (req, res) => {
   command.createCheckin(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

//##########   Data Read   ##########

welcomeWebApp.get('/', (req, res) => {
   res.sendFile('/html/visitor.html');
});

welcomeWebApp.get('/api/contacts', (req, res) => {
   command.readContact(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.get('/api/rooms', (req, res) => {
   command.readRoom(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.get('/api/checkin', (req, res) => {
   command.readCheckin(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

//##########  Data Update  ##########

welcomeWebApp.put('/api/contacts', (req, res) => {
   command.updateContact(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.put('/api/rooms', (req, res) => {
   command.updateRoom(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

welcomeWebApp.put('/api/checkin', (req, res) => {
   command.createCheckin(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

//########## Notification  ##########

welcomeWebApp.post('/api/notify', (req, res) => {
   command.contactNotify(req.body, (err, data) => {
      if (err) { res.status(400).send('Error.....: ' + err); }
      else { res.status(200).send(data); }
   });
});

//########## Server Start  ##########

const port = process.env.port || 5000; // Linha de comando - export PORT = ##### ou 5000
welcomeWebApp.listen (port, () => console.log(`Listening on port: ${port}`));
