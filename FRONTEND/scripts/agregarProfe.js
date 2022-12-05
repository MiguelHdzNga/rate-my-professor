
function agregar(){
    let nombre = document.getElementById('nombreProfe').value;
    let apellido = document.getElementById('apellidoProfe').value;
    let dep = document.getElementById('seleccionar').value;

    if(nombre == '' || apellido == '' || dep == ''){
        alert('faltan datos');
    }else{

    const url = 'http://localhost:3000/api/professors';

    let body = {
    'nombre': nombre,
    'apellido': apellido,
    'departamento': dep
    }


    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/professors");
  
    xhr.setRequestHeader("content-Type", "application/json");
    xhr.setRequestHeader("x-user-token", "cI96qkRUxW-637e9c03a97bfc576bdf3ebb");
  
    xhr.send(JSON.stringify(body));
    alert("Registrando profesor...");
  
    xhr.onload = function () {
      if (xhr.status == 200) {
        alert("Profesor registrado exitosamente");
      } else {
        alert("Error: " + xhr.response);
      }
    };

    
}
}