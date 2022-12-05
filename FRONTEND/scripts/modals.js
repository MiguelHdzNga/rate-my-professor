function loginFront(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;   

  let body = {
      email: email,
      pass: pass,
    };

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/login");
    xhr.setRequestHeader("content-Type", "application/json");
    xhr.send(JSON.stringify(body));
    alert("Ingresando datos...");
    xhr.onload = function () {
      if (xhr.status != 200) {
        alert("Error al iniciar sesión:\n" + xhr.response);
      } else {
        localStorage.setItem('token',xhr.response);
        //alert("Token: " + xhr.response);
      }
    };
  }

function signInFront() {
    
      let email = document.getElementById("signIn_email").value;
      let pass = document.getElementById("signIn_password").value;
      let confirmedPass = document.getElementById("signIn_passwordConfirm").value;
 
      let body = {
        email: email,
        pass: pass,
      };
    
      if (pass == confirmedPass) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3000/api/users");
    
        xhr.setRequestHeader("content-Type", "application/json");
    

        xhr.send(JSON.stringify(body));
        alert("Registrando usuario...");
    
        xhr.onload = function () {
          if (xhr.status == 201 || xhr.status == 200) {
            alert("Usuario registrado exitosamente");
          } else {
            alert("Error: " + xhr.response);
          }
        };
      } else {
        alert("Las contraseñas no coinciden!");
      }
    }