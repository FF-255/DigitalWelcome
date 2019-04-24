/*
Module developed by:
  ______    _     _                     ______          _
 |  ____|  | |   (_)                   |  ____|        | |
 | |__ __ _| |__  _  __ _ _ __   ___   | |__ _   _ _ __| | __ _ _ __
 |  __/ _` | '_ \| |/ _` | '_ \ / _ \  |  __| | | | '__| |/ _` | '_ \
 | | | (_| | |_) | | (_| | | | | (_) | | |  | |_| | |  | | (_| | | | |
 |_|  \__,_|_.__/|_|\__,_|_| |_|\___/  |_|   \__,_|_|  |_|\__,_|_| |_|
 
 * Messaging format functions for DigitalWelcome project
*/

/* jshint esversion: 6 */

//##########  Ext Modules  ##########

const fs = require('fs');
const config = require('config');

//##########  Decoration   ##########

//##########   Markdown    ##########

const mMARKS = '> ✅ ';
const mStrong = '**';
const mItalic = '_';
const mUList = '- ';
const mLE = '  \n';

//##########    E-mail     ##########

const hHTMLS = fs.readFileSync(process.env.APP_DIR + '/public/html/meetingEmailStart.html', 'utf8');
const hHTMLE = fs.readFileSync(process.env.APP_DIR + '/public/html/meetingEmailEnd.html', 'utf8');

const hBColor = '<body style="background-color:#EEEEEE">';

const hFGreen = '<font color="MEDIUMSEAGREEN">';
const hFBlue = '<font color="STEELBLUE">';
const hFontE = '</font>';

const hItalicS = '<i>';
const hItalicE = '</i>';

const hStrongS = '<strong>';
const hStrongE = '</strong>';

const hParagS = '<p style="line-height: 1.5; color: #888">';
const hParagE = '</p>';

const hLE = '<br>';

const hHeadS = '<h2>';
const hHeadE = '</h2>';

const hQrcodeS = '<img src="cid:';
const hQrcodeD = "@qrcode.com";
const hQrcodeE = '"/ style="display: block; margin-left: auto; margin-right: auto;">';

//##########      SMS      ##########

const sMARKS = '✅ ';
const sLE = '\n';

//##########      SMS      ##########
//##########   Messages    ##########

const MES_HEADER = config.get("messages.MES_HEADER");
const MES_NAME = config.get("messages.MES_NAME");
const MES_EMAIL = config.get("messages.MES_EMAIL");
const MES_PHONE = config.get("messages.MES_PHONE");
const MES_DATE = config.get("messages.MES_DATE");
const MES_HOST = config.get("messages.MES_HOST");
const MES_VISITOR = config.get("messages.MES_VISITOR");
const MES_SUBJECT = config.get("messages.MES_SUBJECT");
const MES_ROOM = config.get("messages.MES_ROOM");
const MES_END = config.get("messages.MES_END");
const MES_CHECKIN_SUBJECT = config.get("messages.MES_CHECKIN_SUBJECT");
const MES_CHECKIN_HOST_LINE1 = config.get("messages.MES_CHECKIN_HOST_LINE1");
const MES_CHECKIN_VISITOR_LINE1 = config.get("messages.MES_CHECKIN_VISITOR_LINE1");
const MES_CHECKIN_GUEST_HEADER = config.get("messages.MES_CHECKIN_GUEST_HEADER");
const MES_MEETING_SUBJECT = config.get("messages.MES_MEETING_SUBJECT");
const MES_MEETING_LINE1 = config.get("messages.MES_MEETING_LINE1");
const MES_MEETING_LINE2 = config.get("messages.MES_MEETING_LINE2");
const MES_NETWORKACCESS = config.get("networkaccess.ssid");

//##########    Config     ##########

function configNotFound() {

   vMessage =  "************************ WARNING *************************\n";
   vMessage += "             Configuration settings not found.            \n";
   vMessage += "    Please access API settings page for initial setup:    \n";
   vMessage += "                  http://<HOSTNAME>:85/                   \n";
   vMessage += "----------------------------------------------------------\n";

   return (vMessage);
}

//##########    Checkin    ##########

//##########    General    ##########

function emailCheckinSubject() {
   return (MES_HEADER + " - " + MES_CHECKIN_SUBJECT);
}

//##########     Host      ##########

function teamsCheckinMessageHost(params) {

   let vMessage = `${mMARKS}${mStrong}${MES_HEADER}${mStrong}${mLE}${mLE}`;
   vMessage += `${MES_CHECKIN_HOST_LINE1}${mLE}${mLE}`;
   vMessage += `${MES_NAME}${mStrong}${params.name.firstName} ${params.name.lastName}${mStrong}${mLE}`;
   vMessage += `${MES_EMAIL}${mStrong}${params.email}${mStrong}${mLE}`;
   if (params.phone !== "") vMessage += `${MES_PHONE}${mStrong}${params.phone}${mStrong}${mLE}`;

   return (vMessage);
}

function emailCheckinMessageHost(params) {

   // let vMessage = `${hHTMLS}${hBColor}${hHeadS}${hFGreen}${MES_HEADER}${hFontE}${hHeadE}`;
   let vMessage = `${hHTMLS}${MES_CHECKIN_SUBJECT}${hHeadE}${hLE}`;
   vMessage += `${hParagS}${MES_CHECKIN_HOST_LINE1}${hParagE}`;
   vMessage += `${hParagS}${MES_NAME}${hStrongS}${params.name.firstName} ${params.name.lastName}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_EMAIL}${hStrongS}${params.email}${hStrongE}${hParagE}`;
   if (params.phone !== "") vMessage += `${hParagS}${MES_PHONE}${hStrongS}+55${params.phone}${hStrongE}${hParagE}${hHTMLE}`;

   return (vMessage);
}

function smsCheckinMessageHost(params) {

   let vMessage = `${sMARKS}${MES_HEADER}${sLE}${sLE}`;
   vMessage += `${MES_CHECKIN_HOST_LINE1}${sLE}`;
   vMessage += `${MES_NAME}${params.name.firstName} ${params.name.lastName}${sLE}`;
   vMessage += `${MES_EMAIL}${params.email}${sLE}`;
   if (params.phone !== "") vMessage += `${MES_PHONE}${params.phone}${sLE}`;

   return (vMessage);
}

//##########    Visitor    ##########

function teamsCheckinMessageVisitor(params) {

   let vMessage = `${mMARKS}${mStrong}${MES_HEADER}${mStrong}${mLE}${mLE}`;
   vMessage += `${MES_CHECKIN_VISITOR_LINE1}${mLE}${mLE}`;
   vMessage += `${MES_NAME}${mStrong}${params.name.firstName} ${params.name.lastName}${mStrong}${mLE}`;
   vMessage += `${MES_EMAIL}${mStrong}${params.email}${mStrong}${mLE}${mLE}`;
   vMessage += `${MES_END}${mLE}${mLE}`;

   return (vMessage);
}

function emailCheckinMessageVisitor(params) {

   // let vMessage = `${hHTMLS}${hBColor}${hHeadS}${hFGreen}${MES_HEADER}${hFontE}${hHeadE}`;
   let vMessage = `${hHTMLS}${MES_CHECKIN_SUBJECT}${hHeadE}${hLE}`;
   vMessage += `${hParagS}${MES_CHECKIN_VISITOR_LINE1}${hParagE}`;
   vMessage += `${hParagS}${MES_NAME}${hStrongS}${params.name.firstName} ${params.name.lastName}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_EMAIL}${hStrongS}${params.email}${hStrongE}${hParagE}${hLE}`;
   vMessage += `${hParagS}${MES_END}${hParagE}${hLE}${hHTMLE}`;

   return (vMessage);
}

function smsCheckinMessageVisitor(params) {

   let vMessage = `${sMARKS}${MES_HEADER}${sLE}${sLE}`;
   vMessage += `${MES_CHECKIN_VISITOR_LINE1}${sLE}`;
   vMessage += `${MES_NAME}${params.name.firstName} ${params.name.lastName}${sLE}`;
   vMessage += `${MES_EMAIL}${params.email}${sLE}`;
   vMessage += `${MES_END}${sLE}${sLE}`;

   return (vMessage);
}

function teamsNetworkAccess(params) {

   let vMessage = `${mStrong}${MES_CHECKIN_GUEST_HEADER}${mStrong}${mLE}${mLE}`;
   vMessage += `SSID: ${mStrong}${MES_NETWORKACCESS}${mStrong}${mLE}`;
   vMessage += `Username: ${mStrong}${params.username}${mStrong}${mLE}`;
   vMessage += `Password: ${mStrong}${params.password}${mStrong}${mLE}${mLE}`;

   return (vMessage);
}

function emailNetworkAccess(params) {

   let vMessage = `${hParagS}${hStrongS}${MES_CHECKIN_GUEST_HEADER}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}SSID: ${hStrongS}${MES_NETWORKACCESS}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}Username: ${hStrongS}${params.username}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}Password: ${hStrongS}${params.password}${hStrongE}${hParagE}${hLE}${hHTMLE}`;

   return (vMessage);
}

function smsNetworkAccess(params) {

   let vMessage = `${MES_CHECKIN_GUEST_HEADER}${sLE}${sLE}`;
   vMessage += `SSID: ${MES_NETWORKACCESS}${sLE}`;
   vMessage += `Username: ${params.username}${sLE}`;
   vMessage += `Password: ${params.password}${sLE}`;

   return (vMessage);
}

//##########    Meeting    ##########

//##########    General    ##########

function emailMeetingSubject() {
   return (MES_HEADER + " - " + MES_MEETING_SUBJECT);
}

//##########     Host      ##########

function emailMeetingMessageHost(params) {

   // let vMessage = `${hHTMLS}${hBColor}${hHeadS}${hFGreen}${MES_HEADER}${hFontE}${hHeadE}`;
   let vMessage = `${hHTMLS}${MES_MEETING_SUBJECT}${hHeadE}${hLE}`;
   vMessage += `${hParagS}${MES_MEETING_LINE1}${hParagE}${hLE}`;
   vMessage += `${hParagS}${MES_DATE}${hStrongS}${params.meeting.date}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_SUBJECT}${hStrongS}${params.meeting.subject}${hStrongE}${hParagE}`;
   if (params.room) vMessage += `${hParagS}${MES_ROOM}${hStrongS}${params.room.name}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_VISITOR}${hStrongS}${params.visitor.name.firstName} ${params.visitor.name.lastName}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_EMAIL}${hStrongS}${params.visitor.email}${hStrongE}${hParagE}`;
   if (params.visitor.phone !== "") vMessage += `${hParagS}${MES_PHONE}${hStrongS}+55${params.visitor.phone}${hStrongE}${hParagE}${hHTMLE}`;

   return (vMessage);
}

//##########    Visitor    ##########

function emailMeetingMessageVisitor(params) {

   // let vMessage = `${hHTMLS}${hBColor}${hHeadS}${hFGreen}${MES_HEADER}${hFontE}${hHeadE}`;
   let vMessage = `${hHTMLS}${MES_MEETING_SUBJECT}${hHeadE}${hLE}`;
   vMessage += `${hParagS}${MES_MEETING_LINE1}${hParagE}${hLE}`;
   vMessage += `${hParagS}${MES_DATE}${hStrongS}${params.meeting.date}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_SUBJECT}${hStrongS}${params.meeting.subject}${hStrongE}${hParagE}`;
   if (params.room) vMessage += `${hParagS}${MES_ROOM}${hStrongS}${params.room.name}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_HOST}${hStrongS}${params.host.name.firstName} ${params.host.name.lastName}${hStrongE}${hParagE}`;
   vMessage += `${hParagS}${MES_EMAIL}${hStrongS}${params.host.email}${hStrongE}${hParagE}${hLE}`;
   vMessage += `${hParagS}${MES_MEETING_LINE2}${hParagE}${hLE}${hQrcodeS}${params.meeting._id}${hQrcodeD}${hQrcodeE}${hHTMLE}`;

   return (vMessage);
}

//##########    Exports    ##########

module.exports.configNotFound = configNotFound;
module.exports.emailCheckinSubject = emailCheckinSubject;
module.exports.teamsCheckinMessageHost = teamsCheckinMessageHost;
module.exports.emailCheckinMessageHost = emailCheckinMessageHost;
module.exports.smsCheckinMessageHost = smsCheckinMessageHost;
module.exports.teamsCheckinMessageVisitor = teamsCheckinMessageVisitor;
module.exports.emailCheckinMessageVisitor = emailCheckinMessageVisitor;
module.exports.smsCheckinMessageVisitor = smsCheckinMessageVisitor;
module.exports.teamsNetworkAccess = teamsNetworkAccess;
module.exports.emailNetworkAccess = emailNetworkAccess;
module.exports.smsNetworkAccess = smsNetworkAccess;
module.exports.emailMeetingSubject = emailMeetingSubject;
module.exports.emailMeetingMessageHost = emailMeetingMessageHost;
module.exports.emailMeetingMessageVisitor = emailMeetingMessageVisitor;