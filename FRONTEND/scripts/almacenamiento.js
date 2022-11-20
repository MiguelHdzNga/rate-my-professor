"use strict";




function login(loginEmail,loginPassword) {
    let url = "http://localhost:3000/api/login"
    let xhr = new XMLHttpRequest();
    xhr.open('POST',url);
    let body = {
        "email": loginEmail.toLowerCase(),
        "password": loginPassword
    }
    xhr.setRequestHeader("content-type", "application/json");
    xhr.send(JSON.stringify(body))
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { 
            alert(xhr.status + ': ' + xhr.statusText); 
        } else {
            localStorage.setItem("token",xhr.response);
            $('#iniciarSesion').modal("hide");
            document.getElementById("login_modal").reset();
            window.location.href = "usuarios.html?#";
        }

    };
}

function loadJSON(cbOk, cbErr) {
    let url = "http://localhost:3000/api/users?#"
    // 1. Crear XMLHttpRequest object
    
    let xhr = new XMLHttpRequest();
    
    
    
    // 2. Configurar: PUT actualizar archivo

    xhr.open('GET', url);
    xhr.setRequestHeader("x-user-token", localStorage.token);

    // 4. Enviar solicitud

    xhr.send();

    // 5. Una vez recibida la respuesta del servidor

    xhr.onload = function () {

        if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP

            // Ocurrió un error

            alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found

            // ejecutar algo si error
            
            cbErr();
        } else {

            let datos = JSON.parse(xhr.response); //esta es la línea que hay que probar

            // Ejecutar algo si todo está correcto

            // Significa que fue exitoso
            
            cbOk(datos);
        }

    };

}
function saveJSON(datos, urlJSON,cbOk,cbErr) {
    //crear htmlhttprequest
    let xhr = new XMLHttpRequest();
    //configurar porst actualizar el archivo
    xhr.open('POST', urlJSON);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send([JSON.stringify(datos)]);

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
            cbErr();
        }



        else {
            console.log("Guardado", xhr.responseText);
            cbOk();

        }
    }
}

