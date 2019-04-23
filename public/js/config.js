function onLoadPageInit()
{
   // Initial page configuration - Loads current config, set all field to read only and hides (Cancel and Save) buttons
   loadConfig('current');
   loadOsInformation();
   loadServicesStatus();
}

function cancelAction()
{
   // Restores page to previous (unchanged) configuration
   if (configversion.value === "previous") loadConfig('previous')
   else loadConfig('current')
}

function editAction()
{
   edit_all_fields();
   actionButtonPage(2);
   configButtonDisable();
   alertMessages('edit');
}

function saveAction()
{
      $('#saveConfirmationDialog').modal('hide');
      saveConfigurationToServer();
      setTimeout(function () { 
         onLoadPageInit();
         alertMessages('save');
      }, 4000);
}

function loadConfig(params)
{
   loadConfigurationFromServer(params);
   readonly_all_fields();
   actionButtonPage(1);
   (params === "current") ? configButtonPage(1) : configButtonPage(2);
   alertMessages(params);
   configversion.value = params;

}

// Loads information about the server where the service is installed and refreshes screen info
function loadOsInformation() {

   let xmlhttp = new XMLHttpRequest();

   let osInformationData = {};

   xmlhttp.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 400) { console.log("ERRO 400:", JSON.parse(this.responseText)); }
      if (this.readyState == 4 && this.status == 404) { console.log("ERRO 404:", JSON.parse(this.responseText)); }
      if (this.readyState == 4 && this.status == 200) { 
      
         let osInformationData = JSON.parse(this.responseText);

         uptime.innerHTML = (typeof osInformationData.uptime !== "undefined") ? osInformationData.uptime : "";
         memory_free.innerHTML = (typeof osInformationData.freeMemory !== "undefined") ? osInformationData.freeMemory + " MB" : "";
         pb_util_mem.style.width = (Math.ceil((osInformationData.totalMemory - osInformationData.freeMemory) / osInformationData.totalMemory * 100)) + "%";
         util_1min.innerHTML = (typeof osInformationData.util[0] !== "undefined") ? Math.ceil(osInformationData.util[0])+ "%" : "";
         pb_util_1min.style.width = Math.ceil(osInformationData.util[0]) + "%";
         util_5min.innerHTML = (typeof osInformationData.util[1] !== "undefined") ? Math.ceil(osInformationData.util[1]) + "%" : "";
         pb_util_5min.style.width = Math.ceil(osInformationData.util[1]) + "%";
         util_15min.innerHTML = (typeof osInformationData.util[2] !== "undefined") ? Math.ceil(osInformationData.util[2]) + "%" : "";
         pb_util_15min.style.width = Math.ceil(osInformationData.util[2]) + "%";
      }
   }

   function osInformationRequest() {
      
      let hostname = window.location.hostname;
      let portNumber = window.location.port;
      let url = `http://${hostname}:${portNumber}/api/v1/controlServices/osInformation`;

      xmlhttp.open("GET", url, true);
      xmlhttp.send();

   }

   setTimeout(osInformationRequest, 1000); // Issues the request when page is loaded and...
   setInterval(osInformationRequest, 10000); // Refreshes the page every 10 seconds (10000 milliseconds)
   
}

// Loads information about the server where the service is installed and refreshes screen info
function loadServicesStatus() {

   let xmlhttp = new XMLHttpRequest();

   let servicesStatusData = {};

   xmlhttp.onreadystatechange = function () {

      if (this.readyState == 4 && this.status == 400) { console.log("ERRO 400:", JSON.parse(this.responseText)); }
      if (this.readyState == 4 && this.status == 404) { console.log("ERRO 404:", JSON.parse(this.responseText)); }
      if (this.readyState == 4 && this.status == 200) {

         let servicesStatusData = JSON.parse(this.responseText);

         let serviceStatusGlobal = true;

         for (let service in servicesStatusData){

            serviceInputId = "service_" + service;

            document.getElementById(serviceInputId).classList.remove("bg-dark", "bg-success", "bg-danger");

            if (servicesStatusData[service] === "disabled") {
               document.getElementById(serviceInputId).value = "Disabled";
               document.getElementById(serviceInputId).classList.add("bg-dark");

            } else {
               
               if (servicesStatusData[service] !== "disabled" && servicesStatusData[service] == "true") {
                  document.getElementById(serviceInputId).value = "Up";
                  document.getElementById(serviceInputId).classList.add("bg-success");
               }
               
               if (servicesStatusData[service] !== "disabled" && servicesStatusData[service] == "false") {
                  document.getElementById(serviceInputId).value = "Down";
                  document.getElementById(serviceInputId).classList.add("bg-danger");
                  serviceStatusGlobal = false;
               }
            }
         }

         service_status_global.classList.remove("bg-success", "bg-danger");

         if (serviceStatusGlobal === true) service_status_global.classList.add("bg-success")
         else service_status_global.classList.add("bg-danger")

      }
   }

   function servicesStatusRequest() {

      let hostname = window.location.hostname;
      let portNumber = window.location.port;
      let url = `http://${hostname}:${portNumber}/api/v1/controlServices/servicesStatus`;

      xmlhttp.open("GET", url, true);
      xmlhttp.send();

   }

   setInterval(servicesStatusRequest, 10000); // Refreshes the page every 10 seconds (10000 milliseconds)

}

// Alerts admins with usefull messages about the current action
function alertMessages(params){

   let messages = {
      "init": true,
      "previous": true,
      "edit": true,
      "current": true,
      "save": true
   }

   switch (params) {

      case ("init"):
         messages.init = false;
         break;

      case ("previous"):
         messages.previous = false;
         break;

      case ("edit"):
         messages.edit = false;
         break;

      case ("save"):
         messages.save = false;
         break;

      case ("current"):

   }

   warning_initial_config.hidden = messages.init;
   warning_previous_configuration.hidden = messages.previous;
   warning_edit_configuration.hidden = messages.edit;
   success_save_and_apply.hidden = messages.save;
}

function configButtonDisable()
{
   let elements = document.getElementsByClassName("configButtonPage_1");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = true; }

   elements = document.getElementsByClassName("configButtonPage_2");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = true; }
}

function configButtonPage(pageNumber)
{
   let elements = document.getElementsByClassName("configButtonPage_1");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = !(pageNumber == 1); }

   elements = document.getElementsByClassName("configButtonPage_2");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = pageNumber == 1; }
}

function actionButtonPage(pageNumber) {

   let elements = document.getElementsByClassName("actionButtonPage_1");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = !(pageNumber == 1); }
   
   elements = document.getElementsByClassName("actionButtonPage_2");
   for (let i = 0; i < elements.length; i++) { elements[i].hidden = pageNumber == 1; }

}

// Loads configuration type (current / previous) from API Server
function loadConfigurationFromServer(params) {

   let xmlhttp = new XMLHttpRequest();

   xmlhttp.onreadystatechange = function () {

      let configData = {
         general: {
            database: {},
            proxy: {}
         },
         notification: {},
         email: {},
         sms: {},
         webexteams: {},
         networkaccess: {},
         digitalsignage: {}
      };

      if (this.readyState == 4 && this.status == 404) { alert_messages('init'); }

      if (this.readyState == 4 && this.status == 200) {
         
         configData = JSON.parse(this.responseText);

         general_port.value = (typeof configData.general.port !== "undefined") ? configData.general.port : 85;
         general_service_interval.value = (typeof configData.general.serviceinterval !== "undefined") ? configData.general.serviceinterval : 30;
         general_proxy_enable.value = ((typeof configData.general.proxy.enable !== "undefined") && (configData.general.proxy.enable)) ? "Enabled" : "Disabled";
         general_proxy_hostname.value = (typeof configData.general.proxy.hostname !== "undefined") ? configData.general.proxy.hostname : "";
         general_proxy_port.value = (typeof configData.general.proxy.port !== "undefined") ? configData.general.proxy.port : "";
   
         // Notification
         switch (configData.notification.language) {
            case ("en"):
               notification_language_select.value = "English";
               break;
   
            case ("es"):
               notification_language_select.value = "Español";
               break;
   
            case ("pt-br"):
               notification_language_select.value = "Português do Brasil";
               break;
   
            case ("de"):
               notification_language_select.value = "Deutsche";
               break;
   
            case ("fr"):
               notification_language_select.value = "Français";
               break;
   
            default:
               notification_language_select.value = "English";
         }
   
         database_hostname.value = (typeof configData.database.hostname !== "undefined") ? configData.database.hostname : "";
         database_port.value = (typeof configData.database.port !== "undefined") ? configData.database.port : "";
         database_authentication.value = ((typeof configData.database.authentication !== "undefined") && (configData.database.authentication)) ? "Enabled" : "Disabled";
         database_username.value = (typeof configData.database.username !== "undefined") ? configData.database.username : "";
         database_password.value = (typeof configData.database.password !== "undefined") ? configData.database.password : "";
   
         notification_email.value = ((typeof configData.notification.email !== "undefined") && (configData.notification.email)) ? "Enabled" : "Disabled";
         notification_sms.value = ((typeof configData.notification.sms !== "undefined") && (configData.notification.sms)) ? "Enabled" : "Disabled";
         notification_webexteams.value = ((typeof configData.notification.webexteams !== "undefined") && (configData.notification.webexteams)) ? "Enabled" : "Disabled";
         notification_networkaccess.value = ((typeof configData.notification.networkaccess !== "undefined") && (configData.notification.networkaccess)) ? "Enabled" : "Disabled";
         notification_digitalsignage.value = ((typeof configData.notification.digitalsignage !== "undefined") && (configData.notification.digitalsignage)) ? "Enabled" : "Disabled";
   
         // Email
         email_service.value = (typeof configData.email.service !== "undefined") ? configData.email.service.toUpperCase() : "SMTP";
         email_hostname.value = (typeof configData.email.hostname !== "undefined") ? configData.email.hostname : "";
         email_port.value = (typeof configData.email.port !== "undefined") ? configData.email.port : "";
         email_username.value = (typeof configData.email.username !== "undefined") ? configData.email.username : "";
         email_password.value = (typeof configData.email.password !== "undefined") ? configData.email.password : "";
         email_authentication_enable.value = ((typeof configData.email.authentication !== "undefined") && (configData.email.authentication)) ? "Enabled" : "Disabled";
   
         // Sms
         sms_service.value = (typeof configData.sms.service !== "undefined") ? configData.sms.service.toUpperCase() : "";
         sms_account.value = (typeof configData.sms.account !== "undefined") ? configData.sms.account : "";
         sms_token.value = (typeof configData.sms.token !== "undefined") ? configData.sms.token : "";
         sms_phone.value = (typeof configData.sms.phone !== "undefined") ? configData.sms.phone : "";
   
         // Webex Teams
         webexteams_access_token.value = (typeof configData.webexteams.access_token !== "undefined") ? configData.webexteams.access_token : "";
   
         // Guest (Network) Access
         networkaccess_hostname.value = (typeof configData.networkaccess.hostname !== "undefined") ? configData.networkaccess.hostname : "";
         networkaccess_port.value = (typeof configData.networkaccess.port !== "undefined") ? configData.networkaccess.port : "";
         networkaccess_ers_username.value = (typeof configData.networkaccess.ers_username !== "undefined") ? configData.networkaccess.ers_username : "";
         networkaccess_ers_password.value = (typeof configData.networkaccess.ers_password  !== "undefined") ? configData.networkaccess.ers_password : "";
         networkaccess_sponsor_username.value = (typeof configData.networkaccess.sponsor_username !== "undefined") ? configData.networkaccess.sponsor_username : "";
         networkaccess_sponsor_password.value = (typeof configData.networkaccess.sponsor_password !== "undefined") ? configData.networkaccess.sponsor_password : "";
         networkaccess_sponsor_userid.value = (typeof configData.networkaccess.sponsor_userid !== "undefined") ? configData.networkaccess.sponsor_userid : "";
         networkaccess_guest_portalid.value = (typeof configData.networkaccess.guest_portalid !== "undefined") ? configData.networkaccess.guest_portalid : "";
         networkaccess_guest_type.value = (typeof configData.networkaccess.guest_type !== "undefined") ? configData.networkaccess.guest_type : "";
         networkaccess_guest_location.value = (typeof configData.networkaccess.guest_location !== "undefined") ? configData.networkaccess.guest_location : "";
   
         // Digital Signage
         digitalsignage_hostname.value = (typeof configData.digitalsignage.hostname !== "undefined") ? configData.digitalsignage.hostname : "";
         digitalsignage_port.value = (typeof configData.digitalsignage.port !== "undefined") ? configData.digitalsignage.port : "";
         digitalsignage_username.value = (typeof configData.digitalsignage.username !== "undefined") ? configData.digitalsignage.username : "";
         digitalsignage_password.value = (typeof configData.digitalsignage.password !== "undefined") ? configData.digitalsignage.password : "";
         digitalsignage_authentication_enable.value = ((typeof configData.digitalsignage.authentication !== "undefined") && (configData.digitalsignage.authentication)) ? "Enabled" : "Disabled";
         digitalsignage_trigger.value = (typeof configData.digitalsignage.trigger !== "undefined") ? configData.digitalsignage.trigger : "";

      }
      
   };

   let hostname = window.location.hostname;
   let portNumber = window.location.port;
   let configType = (params === 'previous') ? "/previous" : "";

   let url = `http://${hostname}:${portNumber}/api/v1/configs${configType}`;

   xmlhttp.open("GET", url, true);
   xmlhttp.send();
}

function saveConfigurationToServer() {

   let configData = {
      "general": {
         "port": general_port.value,
         "serviceinterval": general_service_interval.value,
         "proxy": {
            "enable": general_proxy_enable.value === "Enabled",
            "hostname": general_proxy_hostname.value,
            "port": general_proxy_port.value
         }
      },
      "database": {
         "hostname": database_hostname.value,
         "port": database_port.value,
         "authentication": database_authentication.value === "Enabled",
         "username": database_username.value,
         "password": database_password.value
      },
      "notification": {
         "language": "",
         "email": notification_email.value === "Enabled",
         "sms": notification_sms.value === "Enabled",
         "webexteams": notification_webexteams.value === "Enabled",
         "digitalsignage": notification_digitalsignage.value === "Enabled",
         "networkaccess": notification_networkaccess.value === "Enabled"
      },
      "email": {
         "service": email_service.value.toLowerCase(),
         "hostname": email_hostname.value,
         "port": email_port.value,
         "username": email_username.value,
         "authentication": email_authentication_enable.value === "Enabled",
         "password": email_password.value
      },
      "sms": {
         "service": sms_service.value.toLowerCase(),
         "account": sms_account.value,
         "token": sms_token.value,
         "phone": sms_phone.value
      },
      "webexteams": {
         "access_token": webexteams_access_token.value
      },
      "networkaccess": {
         "hostname": networkaccess_hostname.value,
         "port": networkaccess_port.value,
         "ers_username": networkaccess_ers_username.value,
         "ers_password": networkaccess_ers_password.value,
         "sponsor_username": networkaccess_sponsor_username.value,
         "sponsor_password": networkaccess_sponsor_password.value,
         "sponsor_userid": networkaccess_sponsor_userid.value,
         "guest_portalid": networkaccess_guest_portalid.value,
         "guest_type": networkaccess_guest_portalid.value,
         "guest_location": networkaccess_guest_portalid.value
      },
      "digitalsignage": {
         "hostname": digitalsignage_hostname.value,
         "port": digitalsignage_port.value,
         "authentication": digitalsignage_authentication_enable.value === "Enabled",
         "username": digitalsignage_username.value,
         "password": digitalsignage_password.value,
         "trigger": digitalsignage_trigger.value
      }
   };

   switch (notification_language_select.value) {

      case "English":
         configData.notification.language = "en";
         break;

      case "Español":
         configData.notification.language = "es";
         break;

      case "Português do Brasil":
         configData.notification.language = "pt-br";
         break;

      case "Deutsche":
         configData.notification.language = "de";
         break;

      case "Français":
         configData.notification.language = "fr";
         break;
   }

   let hostname = window.location.hostname;
   let portNumber = window.location.port;

   let xmlhttp = new XMLHttpRequest();
   
   let url = `http://${hostname}:${portNumber}/api/v1/configs`;
   xmlhttp.open("POST", url, true);
   xmlhttp.setRequestHeader("Content-Type", "application/json");
   xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
         var json = JSON.parse(xmlhttp.responseText);
      }

      if (xmlhttp.readyState === 4 && xmlhttp.status === 400) {
         var json = JSON.parse(xmlhttp.responseText);
      }
   };

   xmlhttp.send(JSON.stringify(configData));
}

function editMode(event) {

   let isDisabled = (event.target.value == "Disabled");
   let className = "";

   switch (event.target.id) {

      case "database_authentication_enable":
         className = "database";
         break;

      case "general_proxy_enable":
         className = "proxy";
         break;

      case "notification_email":
         className = "email";
         break;

      case "notification_sms":
         className = "sms";
         break;

      case "notification_webexteams":
         className = "webexteams";
         break;

      case "notification_networkaccess":
         className = "networkaccess";
         break;

      case "notification_digitalsignage":
         className = "digitalsignage";
         break;

      case "email_service":
         isDisabled = (event.target.value === "GMAIL");
         className = "email_service";
         email_authentication_enable.value = "Enabled";
      break;
   }

   let elements = document.getElementsByClassName(className);
   for (let i = 0; i < elements.length; i++) {
      elements[i].disabled = isDisabled;
   }

   if (event.target.id == "notification_email" && email_service.value == "GMAIL") {
      let elements = document.getElementsByClassName("email_service");
      for (let i = 0; i < elements.length; i++) {
         elements[i].disabled = true;
      }

   }
}

// ****** Turn Read Only Mode on ******
// ****** Disables fields all ******
function readonly_all_fields() {
   let elements = document.getElementsByClassName("general");
   for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
}

// ****** Turn Edit Mode on ******
// ****** Disables fields whose services are disabled ******
function edit_all_fields() {

   let elements = document.getElementsByClassName("general");
   for (let i = 0; i < elements.length; i++) { elements[i].disabled = false; }

   if (database_authentication.value === "Disabled") {
      elements = document.getElementsByClassName("database");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }

   if (general_proxy_enable.value === "Disabled") {
      elements = document.getElementsByClassName("proxy");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }

   if (notification_email.value === "Disabled") {
      elements = document.getElementsByClassName("email");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }
   
   if (notification_sms.value === "Disabled") {
      elements = document.getElementsByClassName("sms");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }

   if (notification_webexteams.value === "Disabled") {
      webexteams_access_token.disabled = true;
   }

   if (notification_networkaccess.value === "Disabled") {
      elements = document.getElementsByClassName("networkaccess");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }

   if (notification_digitalsignage.value === "Disabled") {
      elements = document.getElementsByClassName("digitalsignage");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }

   if (email_service.value === "GMAIL") {
      elements = document.getElementsByClassName("email_service");
      for (let i = 0; i < elements.length; i++) { elements[i].disabled = true; }
   }
}
