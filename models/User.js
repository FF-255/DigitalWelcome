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

const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

userSchema = new mongoose.Schema ({
   name: {
      type: String,
      required: true,
      minlenght: 5,
      maxlenght: 50
   },
   email: {
      type: String,
      required: true,
      minlenght: 5,
      maxlenght: 255,
      unique: true
   },
   password: {
      type: String,
      required: true,
      minlenght: 5,
      maxlenght: 1024
   }
});

// Generates a web token
userSchema.methods.generateAuthToken = function() {
   const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'));
   return(token);
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
   const schema = {
      name: Joi.string().min(5).max(50).required(),
      email: Joi.string().min(5).max(255).email().required(),
      password: Joi.string().min(5).max(255).required()
   }

   return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;