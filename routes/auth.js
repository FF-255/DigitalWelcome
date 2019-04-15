/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * a module that performs:
 *   - Middleware functions for DigitalWelcome project
 * 
 */

/* jshint esversion: 6 */

const { User } = require('../models/User');
const crypto = require('../components/crypto');
const Joi = require('joi');
const mongoose = require('mongoose');
const _ = require('lodash');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {

   // Validate if parameters are correct
   const { error } = validate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   // Validate if user is present in the database
   let user = await User.findOne({ email: req.body.email });
   if (!user) return res.status(400).send('Invalid username or password');

   const validPassword = await bcrypt.compare(req.body.password, user.password);
   if (!validPassword) return res.status(400).send('Invalid username or password');

   const token = user.generateAuthToken();
   res.send(token);

})

// Parameter validation function
function validate(params) {
   const schema = {
      username: Joi.string().min(5).max(255).required(),
      password: Joi.string().min(5).max(255).required()
   }

   return Joi.validate(params, schema);
}

module.exports = router;