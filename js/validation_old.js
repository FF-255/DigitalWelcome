function validateTeamsMessageParams_old(params, callback) {

   //let validator = [ true, true, true, true ];
   //let validador = { 'email': true, 'message': true, 'file': true, 'token': true };

   let email = true;
   let message = true;
   let file = true;
   let token = true;

   //##########     Email     ##########

   if (Array.isArray(params.email)) {
      if (params.email.length > 0) {
         for (let index = 0; index < params.email.length; index++) {
            if (!validateEmail(params.email[index])) {
               email = false;
               break;
            }
         }
      } else {
         email = false;
      }
   } else if (!(params.email && validateEmail(params.email))) {
      email = false;
   }

   function validateEmail(emailParam) {
      var expTest = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
      return (expTest.test(emailParam));
   }

   //##########    Message    ##########

   if (params.message) {
      message = (params.message.length >= 4);
   } else {
      message = false;
   }

   //##########   File and    ##########
   //##########   FileName    ##########

   if (params.file) { 
      file = (Buffer.isBuffer(params.file) && validateFileName(params.fileName));
   }
   
   function validateFileName(fileNameParam) {
      let expTest = RegExp(/\.(gif|jpg|jpeg|png)$/i);
      return (expTest.test(fileNameParam));
   }
   
   //##########     Token     ##########

   if (!params.token || params.token.length !== 64) {
      token = false;
   }

   //console.log("Email: ", email, " Message: ", message, " File: ", file, "Filename: ", fileName, "  Token: ", token);
   
   if (email && message && file && token) { callback (params); }
   else { return (false); }
}