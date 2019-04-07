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

const validation = require('../modules/validation');
const controlServices = require('../modules/controlServices');
const express = require('express');
const router = express.Router();

//########## Error Descr H ##########

const errDescHeader = '--- Error(s) Description ---  \n';

//##########   Data Read   ##########

router.get('/status', (req, res) => {

   validation.controlServiceStatusParams(req.body, "READ")
      .then(val1 => controlServices.status())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => {
         console.log(err);
         res.status(400).send(errDescHeader + err);
      });
});

router.post('/restart', (req, res) => {

   validation.controlServicesRestartParams(req.body, "CREATE")
      .then(val1 => controlServices.restart())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => {
         console.log(err);
         res.status(400).send(errDescHeader + err);
      });
});

router.get('/osInformation', (req, res) => {

   validation.osInformationParams(req.body, "READ")
      .then(val1 => controlServices.osInformation())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

router.get('/servicesStatus', (req, res) => {

   validation.controlServicesStatusParams(req.body, "READ")
      .then(val1 => controlServices.servicesStatus())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

//##########    Exports    ##########

module.exports = router;