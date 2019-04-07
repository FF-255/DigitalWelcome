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
const database = require('../modules/database');
const express = require('express');
const router = express.Router();

//########## Error Descr H ##########

const errDescHeader = '--- Error(s) Description ---  \n';

//########## Data Creation ##########

router.post('/', (req, res) => {

   validation.totemParams(req.body, "CREATE")
      .then(val1 => database.createTotem(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(errDescHeader + err));
});

//##########   Data Read   ##########

router.get('/', (req, res) => {

   validation.totemParams(req.body, "READ")
      .then(val1 => database.readTotem(req.body))
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + "Provided Digital Signage information was not found");
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

router.get('/:id', (req, res) => {

   validation.totemParams({ "_id": req.params.id }, "READ")
      .then(val1 => database.readTotem({ "_id": req.params.id }))
      .then(data => {
         if (data) res.status(200).send(data)
         else res.status(404).send(errDescHeader + "Provided Digital Signage information was not found");
      })
      .catch(err => res.status(400).send(errDescHeader + err));
});

//##########  Data Update  ##########

router.put('/', (req, res) => {

   validation.totemParams(req.body, "UPDATE")
      .then(val1 => database.updateTotem(req.body))
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(errDescHeader + err));
});

module.exports = router;