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

const validation = require('../components/validation');
const database = require('../components/database');
const notify = require('../components/notify');
const message = require('../components/messages');
const webexTeams = require('../components/webexTeams');
const email = require('../components/email');
const sms = require('../components/sms');
const express = require('express');
const router = express.Router();

//########## Error Descr H ##########

const errDescHeader = '--- Error(s) Description ---  \n';

//########## Teams, Email, ##########
//########## SMS Messaging ##########

router.post('/checkin/:id', (req, res) => {

   validation.notifyCheckinParams(req.body)
      .then(() => database.getAllCheckinInfo({ "_id": req.params.id }))
      .then((allCheckinInfo) => notify.notifyCheckin(allCheckinInfo))
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(503).send(errDescHeader + err));
})

router.post('/meeting/:id', (req, res) => {

   validation.notifyMeetingParams(req.body)
      .then(() => database.getAllMeetingInfo({ "_id": req.params.id }))
      .then((allMeetingInfo) => notify.notifyMeeting(allMeetingInfo))
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(503).send(errDescHeader + err));
})

router.post('/teams', (req, res) => {

   validation.webexTeamsParams(req.body)
      .then(val1 => webexTeams.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(503).send(errDescHeader + err));
});

router.post('/email', (req, res) => {

   validation.emailParams(req.body)
      .then(val1 => email.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(503).send(errDescHeader + err));
});

router.post('/sms', (req, res) => {

   validation.smsParams(req.body)
      .then(val1 => sms.sendMessage(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(503).send(errDescHeader + err));
});

module.exports = router;