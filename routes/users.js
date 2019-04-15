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

const { User, validate } = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const crypto = require('../components/crypto');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

   // Validate if parameters are correct
   const { error } = validate(req.body);
   if (error) {return res.status(400).send(error.details[0].message);

   // Validate if user is present in the database
   let user = await User.findOne({ email: req.body.email });
   if (user) return res.status(400).send('User already registered in the database');

   // If new user, save it in the database and return
   user = new User (_.pick(req.body, ['name', 'email', 'password']));
   user.password = await crypto.passwordHash(user.password);
   await user.save();

   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
}})

module.exports = router;