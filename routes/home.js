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

const jwt = require('jsonwebtoken');
const config = require('config');
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {

   // If no token is received return to login page
   // const token = req.header('x-auth-token');
   // if (!token) return res.sendFile('/html/login.html', { 'root': process.env.APP_DIR + '/public' });

   // // if valid token return the configuration page ...
   // try {
   //    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
   //    req.user = decoded;
   //    res.header({ 'x-auth-token': token }).sendFile('/html/config.html', { 'root': process.env.APP_DIR + '/public' });

   //    // ... or redirect to login page
   // } catch (error) {
      res.sendFile('/html/config.html', { 'root': process.env.APP_DIR + '/public' });
   // }
});

//##########    Exports    ##########

module.exports = router;