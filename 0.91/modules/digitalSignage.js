/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|

 * Digital Signage (DMP) integration module for Digital Welcome Project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const request = require('request').defaults({ rejectUnauthorized: false, requestCert: true, agent: false });

//########## Commands and  ##########
//########## default video ##########

const commandStartVideo = "/set_param?mng.command=start+video+file:///tmp/ftproot/usb_1/video/";
const defaultVideo = "DEFAULT.ts";

function playContent(device, params) {   
   
   return new Promise ((resolve, reject) => {

      if (params.content) {
         playRoomVideo(device, params)
            .then(() => setTimeout(() => { playRoomVideo(device, "default") }, 25000))
            .then(() => resolve("Content displayed sucessfully."))
            .catch((err) => reject(err))
      } else {
         playRoomVideo(device, "default")
            .then(() => resolve("Content displayed sucessfully."))
            .catch((err) => reject(err))
      }
   });
}

function playRoomVideo(device, params) {

   return new Promise((resolve, reject) => {

      let requestParamsVideo =  {
         url: null,
         headers: {}
      }

      if (params == "default") { requestParamsVideo.url = `https://${device.ip}:7777${commandStartVideo}${defaultVideo}`; }
      else {
         videoFile = params.content.slice(8).toUpperCase() + '.ts';
         requestParamsVideo.url = `https://${device.ip}:7777${commandStartVideo}${videoFile}`;
      }
      
      requestParamsVideo.headers = { "Authorization": "Basic " + new Buffer.from(device.username + ":" + device.password).toString("base64") };

      request(requestParamsVideo, function (error, response, body) {
         if (error) reject(error)
         else resolve(response)
      }); 
   });
}

module.exports.playContent = playContent;
