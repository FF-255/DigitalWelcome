<!-- version -->

# 0.0.0 API Reference Guide
<!-- versionstop -->

<!-- toc -->

**Main Documentation**
  - 
  Installation Guide
  - 

**Database API's**
  - [`Contacts`](#contacts)
  - [`Rooms`](#rooms)
  - [`Meetings`](#meetings)
  - [`Network Access`](#networkaccess)
  - [`Checkins`](#checkins)
  - [`WebexDevices`](#webexdevices)
  - [`DigitalSignage`](#digitalsignage)

**Notification API's**
  - [`notify/meeting`](#notify/meeting)
  - [`notify/checkin`](#notify/checkin)
  - [`notify/teams`](#notify/teams)
  - [`notify/email`](#notify/email)
  - [`notify/sms`](#notify/sms)

**Action API's**
  - [`SignageContent`](#signagecontent)
  - [`CallConnect`](#callconnect)

<!-- tocstop -->

### `Contacts`

API endpoint: _/api/v1/contacts_ or _/api/v1/contacts/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _name_: Auto-generated by database
    - _firstName_: Required - Type: String
    - _lastName_: Required - Type: String
 - _email_: Required - Type: String - requires full e-mail
 - _type_: Required - Type: Number - 1 = Cisco Employee, 2 = Customer, 3 = Partner, 4 = Supplier, 5 = Future Use
 - _phone_: Required - Type: String - Minimum: 10 digits - Requires area code (DDD) and number
 - _photo_: Optional - Type Buffer (binary)
 - _date_: Auto-generated by database - Creation date

Example:

``` json
{
      "firstName": "Fabiano",
      "lastName": "Furlan",
      "email": "fabiano.furlan@email.com",
      "contactType": 1,
      "phone": "11992511111",
      "photo": "0101011001010010100101010101010101001010101010010101..."
}
```

Document information / Parameters used for **READ**:

_\_id_ or complete _email_: these options return the exact result
_firstName_, _lastName_, _type_ and a partial _email_ can be used in any combination and return all matched records

### `Rooms`

API endpoint: _/api/v1/rooms_ or _/api/v1/rooms/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _name_: Required - Type: String - Use the same room name as in the e-mail (without @cisco.com).
 - _seats_: Required - Type: Number - Maximum number of participants
 - _table_: Required - Type: Boolean - Determines if room has a table
 - _whiteboard_: Required - Type: Boolean - Determines if room has a whiteboard
 - _video_: Required - Required - Type: Boolean - Determines if room has a Webex video endpoint
 - _videoType_: Optional - Type: String - Webex Room enpoint type (Room 70S, Room 70D, Board 55, ....)
 - _photo_: Optional - Type Buffer (binary)
 - _location_: Optional - Type: String (may be used with )
 - _tags_: Optional - Array of strings

Example:

``` json
{
      "name": "SPL1-26-SIBIPIRUNA",
      "seats": 12,
      "table": true,
      "whiteboard": true,
      "video": true,
      "videoType": "Room 70D",
      "photo": "0101011001010010100101010101010101001010101010010101...",
      "location": "<WIRELESS LOCATION INFORMATION?>",
      "tags": ["São Paulo", "26 andar", "janelas" ]
}
```

Document information / Parameters used for **READ**: _none_ or _\_id_ or _name_ or _seats_

### `Meetings`

API endpoint: _/api/v1/meetings_ or _/api/v1/meetings/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _date_: Required - Type: Date - Format: _yyyy/mm/dd hh:mm:ss_
 - _subject_: Required - Type: String - Information visible to visitor during checkin
 - _hostId_: Required - Type: string - Id generated in Contacts document (table)
 - _visitorId_: Required - Type: string - Id generated in Contacts document (table)
 - _roomId_: Required - Type: string - Id generated in Roomns document (table)
 - _participants_: Optional - Type: Arrays of strings (e-mails) - May be used for other actions such provide guest access for multiple users
 - _tags_: Optional - Type: Array of strings

Example:

``` json
{
      "date": "2018/12/26 00:00:00",
      "subject": "[<Customer Name>] Cisco Day - Collaboration",
      "hostId": "5c0a65a0ce418d3403aaaaaa",
      "visitorId": "5c0a65a0ce418d3403bbbbbb",
      "roomId": "5c0a65a0ce418d3403cccccc",
      "participants": ["email1@email.com", "email2@email.com", ...],
      "tags": ["Cisco Day", "Collaboration", "CX Level" ]
}
```

Document information / Parameters used for **READ**: none or _\_id_ or _hostId_ and _visitorID_ and _date, or _hostId_ and _visitorID_

### `NetworkAccess`

API endpoint: _/api/v1/networkaccess or _/api/v1/networkaccess/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _date_: Required - Type: Date - Format: _yyyy/mm/dd hh:mm:ss_
 - _visitorId_: Required - Type: string - Id generated in Contacts document (table)
 - _username_: Required - Type: string - username used for guest access. Generated with ISE's Guest Access API.
 - _hostId_: Required - Type: string - Id generated in Contacts document (table)
 

Example:

``` json
{
      "date": "2018/12/26 00:00:00",
      "visitorId": "5c0a65a0ce418d3403bbbbbb",
      "username": "email1@email.com",
      "roomId": "5c0a65a0ce418d3403cccccc",
      "hostId": "5c0a65a0ce418d3403aaaaaa"
}
```

Document information / Parameters used for **READ**: none or _\_id_ or _hostId_ and _visitorID_ and _date, or _hostId_ and _visitorID_

### `Checkins`

API endpoint: _/api/v1/checkins_ or _/api/v1/checkins/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _date_: Auto-generated by database
 - _visitorId_: Required - Type: string - Id generated in Contacts document (table)
 - _hostId_: Required - Type: string - Id generated in Contacts document (table)
 - _meetingId_: Type: string - Id generated in Meetings document (table)

Example:

``` json
{
      "visitorId": "5c0a65a0ce418d3403bbbbbb",
      "hostId": "5c0a65a0ce418d3403dddddd",
      "meetingId": "5c0a65a0ce418d3403eeeeee"
}
```

Document information / Parameters used for **READ**: none or _\_id_ or _visitorID_

### `WebexDevices`

API endpoint: _/api/v1/webexDevices or _/api/v1/webexDevices/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _name_: Required - Type: String - Use building id as the start (Ex: SPL1-26-########).
 - _model_: Required - Type: String - Please add the equipament modelo (DX80)
 - _ip_: Required - Type: String
 - _username_: Required - Type: String
 - _password_: Required - Type: String
 - _date_: Auto-generated by database - Creation date
 
Example:

``` json
{
      "name": "SPL1-26-DX80",
      "model": "DX80",
      "ip": "10.97.255.255",
      "username": "admin",
      "password": "<password>"
}
```
Document information / Parameters used for **READ**: none or _\_id_ or _name_

### `DigitalSignage`

API endpoint: _/api/v1/digitalSignage or _/api/v1/digitalSignage/:id_

Document information / Parameters:
 - _\_id_: Auto-generated by database
 - _name_: Required - Type: String - Use building id as the start (Ex: SPL1-26-########).
 - _model_: Required - Type: String - Please add the equipament modelo (DX80)
 - _ip_: Required - Type: String
 - _username_: Required - Type: String
 - _password_: Required - Type: String
 - _defaultContent_: Optional - Type: String - Digital signage default content
 - _date_: Auto-generated by database - Creation date
 
Example:

``` json
{
      "name": "SPL1-26-DMP",
      "model": "DMP-4305G",
      "ip": "10.97.255.255",
      "username": "admin",
      "password": "<password>",
      "defaultContent": "newvideofile"
}
```

Document information / Parameters used for **READ**: none or _\_id_ or _name_

### `notify/checkin`

Use this endpoint to notify host the visitor has arrived and provide visitor with checkin information.
This command will notify using all available options such as **Webex Teams**, **Email** and **SMS**.

API endpoint: _/api/v1/notify/checkin/:id/_

Command parameters:
 - _:id_: Required - Type: string - Id generated in **Checkin** document (table)

### `notify/teams`

Use this endpoint to send notifications using **Webex Teams** only.
You can provide your own access token or use the Digital Welcome BOT (default).

API endpoint: _/api/v1/notify/teams_

Command parameters:
 - _email_: Required - Type: Array of strings
 - _message_: Required - Type: String - Message can be formatted using markdown
 - _file_: Optional - Type: Buffer (binary)
 - _filename_: Optional - Type: String - Name of the file to be send
 - _token_: Optional - Type: String - Use this field to send messages with your own BOT

Example:

 ``` json
{
      "email": ["email@email.com"],
      "message": "**This** is a _test message_!",
      "file": "0101011001010010100101010101010101001010101010010101...",
      "filename": "file.ext",
      "token": "MDk2OTU2NjAtOWQ3ZC00ZGM5LTk2ZjItNzAwMmUzZTEyxxxxxxxxxxxxxxxxxxxx"
}
```

### `notify/email`

Use this endpoint to notify host the visitor has arrived and provide visitor with checkin information.
This command will notify using **email** only.

API endpoint: _/api/v1/notify/email_

Command parameters:
 - _email_: Required - Type: Array of strings
 - _subject_: Required - Type: String
 - _message_: Required - Type: String

Example:

 ``` json
{
      "email": ["email@email.com"],
      "subject": "[Digital Welcome] Message to you",
      "message": "This is a notification message to you.",
}
```

### `notify/sms`

Use this endpoint to notify host the visitor has arrived and provide visitor with checkin information.
This command will notify using **SMS** only.

API endpoint: _/api/v1/notify/sms_

Command parameters:
 - _phone_: Required - Type: String
 - _subject_: Required - Type: String
 - _message_: Required - Type: String

Example:

 ``` json
{
      "phone": "11992511111",
      "subject": "[Digital Welcome] Message to you",
      "message": "This is a notification message to you."
}
```

### `signageContent`

Use this endpoint to dynamically change digital signage content.

API endpoint: _/api/v1/digitalSignage/:id/signageContent_

Command parameters:
 - _:id_: Required - Type: string - Id of the digital media player generated in **digitalSignage** document (table)
 - _content_: Required - Type: string - Digital signage content is room name (Ex: SPL1-26-SIBIPIRUNA) or keywork _default_.

Example:

 ``` json
{
      "content": "SPL1-26-SIBIPIRUNA"
}
```

### `callConnect`

Use this endpoint to signal the Webex device to call a contact or the recepcionist.

API endpoint: _/api/v1/webexDevices/:id/callConnect_

Command parameters:
 - _:id_: Required - Type: string - Id of the Webex device generated in **webexDevice** document (table)
 - _command_: Required - Type: string - Can be either _CALL_ or _DISCONNECT_.
 - _contact_: Optional - Type: string - SIP address or none to call _defaultContact_ (recepcionist) and disconnect call

Example:

 ``` json
{
      "command": "CALL",
      "contact": "email@email.com"
}
```