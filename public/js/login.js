function requestLogin() {

   userParams = {
      username: username.value,
      password: password.value
   }

   server = `http://${window.location.hostname}:${window.location.port}/api/v1/users`;

   fetch(
      server,
      {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userParams)
      })
   .then(response => response.json())
   .then(response => (response) => {

      console.log(response);
     
      if (response.status === 400) {
         status.innerText = response.body;
      } else if (response.status === 200) {
         localStorage.setItem("token", response.headers['x-auth-token']);
         location.reload();
         return;
      }
   })
}