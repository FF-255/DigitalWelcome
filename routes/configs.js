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

const auth = require('../middleware/auth.js');
const validation = require('../components/validation');
const database = require('../components/database');
const configs = require('../components/configs.js');
const express = require('express');
const router = express.Router();

//########## Error Descr H ##########

const errDescHeader = '--- Error(s) Description ---  \n';

//########## Data Creation ##########

router.post('/', (req, res) => {

   validation.configParams(req.body, "CREATE")
      // .then(val1 => database.createConfig(req.body))
      .then(data => configs.saveConfigToDisk(req.body))
      .then(data => res.status(201).send(data))
      .catch(err => {
         console.log(err);
         res.status(400).send(errDescHeader + err)
      });

});

//##########   Data Read   ##########

router.get('/', (req, res) => {

   validation.configParams(req.body, "READ")
      .then(val1 => configs.readCurrentConfigFromDisk())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

router.get('/previous', (req, res) => {

   validation.configParams(req.body, "READ")
      .then(val1 => configs.readPreviousConfigFromDisk())
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + err);
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

//##########    Exports    ##########

module.exports = router;