"use strict";


bootstrapValidate('#new_email', 'email:Escribe un email valido!')
bootstrapValidate('#new_password', 'min:8:')
bootstrapValidate('#new_password_validate', 'matches:#new_password:Las contraseñas deben ser iguales!')
bootstrapValidate('#new_image', 'url:#Escribe un url valido!')



let loginBtn = document.getElementById('login');
loginBtn.addEventListener('click', () => {
    let loginEmail = document.getElementById('login_email');
    let loginPassword = document.getElementById('login_password');
    login(loginEmail.value, loginPassword.value);

});

// Example starter JavaScript for disabling form submissions if there are invalid fields

function register() {
    let sexo;
    if (document.getElementById("mujer").checked) {
        sexo = document.getElementById("mujer").value;
    } else {
        sexo = document.getElementById("hombre").value;
    }

    if (document.getElementById("new_password").value != document.getElementById("new_password_validate").value) {
        alert("Las contraseñas no coinciden!");
        return;
    }


    let request = {
        "nombre": document.getElementById("new_name").value,
        "apellidos": document.getElementById("new_last_name").value,
        "email": document.getElementById("new_email").value,
        "password": document.getElementById("new_password").value,
        "sexo": sexo,
        "fecha": document.getElementById("new_date").value
    }

    if (document.getElementById("new_image").value != "") {
        request.imagen = document.getElementById("new_image").value;
    }

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/users");
    xhr.setRequestHeader("content-Type", "application/json");
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send(JSON.stringify(request));

    xhr.onload = function () {
        if (xhr.status != 201) {
            alert("Error:\n" + xhr.response);
        } else {
            alert(xhr.response);
            $('#cuentaNueva').modal("hide");
            document.getElementById("new_user").reset();
        }
    }
}

window.addEventListener('load', () => {
    if (document.getElementById('head')) {
        initData();
    }
});

let users = [];
let id_count = 1;

function initData() {
    loadJSON(
        (datos) => {
            datos.forEach((element) => { users.push(element); id_count++; });
            currentPage = 1;
            displayList(users, rows, currentPage);
            setupPagination(users, pagination, rows);
        },
        () => {
            console.error("error");
            info.innerHTML = "Error al cargar los datos";
        }
    );
}


function userToHTML(user) {
    return [
        '<div class="media m-2 d-flex rounded border">',
        '<div class="media-left">',
        '<img class="m-3  rounded-circle align-self-center" src="' + user.imagen + '" alt="Generic placeholder image">',
        '</div>',
        '<div class="media-body ">',
        '<h5 class="mt-0 mb-1"> ' + user.nombre + " " + user.apellidos + '</h5>',
        '<p>Id: ' + user.uid + '</p>',
        '<p>Correo: ' + user.email + '</p>',
        '<p>Fecha de nacimiento: ' + user.fecha + '</p>',
        '<p>Genero: ' + user.sexo + '</p>',
        '<p>Contraseña: ' + user.password + '</p>',
        '</div>',
        '<div class="media-right d-flex flex-column">',
        '<button class="btn btn-primary m-2" onClick="javascript:inspectModal(this)" userId="' + user.uid + '" type="button" data-toggle="modal" data-target="#modal_inspect"><i class="fa fa-search"></i></button>',
        '<button class="btn btn-primary m-2" onClick="javascript:updateUserModal(this)" userId="' + user.uid + '" type="button" data-toggle="modal" data-target="#modal_edit"><i class="fa fa-pencil"></i></button>',
        '<button class="btn btn-primary m-2" onClick="javascript:deleteUserModal(this)" userId="' + user.uid + '" type="button" data-toggle="modal" data-target="#myModal"><i class="fa fa-trash"></i></button>',
        '</div>',
        '</div>'].join("");
}

function updateUserModal(update) {
    let id = update.getAttribute('userId');
    let url = 'http://localhost:3000/api/users?uid=' + id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {

            let user = JSON.parse(xhr.response)[0];
            let modalObject = [
                '<form id="edit_user" class="needs-validation">',
                '<div class="form-group">',
                '<input id="edit_name" type="text" min="6" class="form-control" placeholder="Nombre" name="nombre" required>',
                '</div>',
                '<div class="form-group">',
                '<input id="edit_last_name" type="text" min="6" class="form-control" placeholder="Apellido" name="Apellido"',
                'required>',
                '</div>',
                '<div class="form-group">',
                '<input id="edit_email" type="email" id="new_email" class="form-control" placeholder="Email"',
                'name="new email" required>',
                '</div>',
                '<div class="form-group">',
                '<input type="password" id="edit_password" class="form-control" placeholder="Contraseña"',
                'name="nueva contraseña" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_=+-]).{8,}"',
                'title="Must contain at least one number and one uppercase and lowercase letter, and at least 6 or more characters"',
                'required>',
                '<div class="invalid-feedback">',
                'La contraseña debe contener almenos:',
                '1 caracter numerico,',
                '1 caracter especial,',
                '1 letra mayuscula,',
                '1 letra minuscula,',
                'minimo 8 caracteres.',
                '</div>',
                '</div>',
                '<div class="form-group">',
                '<input type="password" id="edit_password_validate" class="form-control" placeholder="Confirmar contraseña"',
                'name="confirmar contraseña"',
                'title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"',
                'required>',
                '</div>',
                '<div class="form-group">',
                '<input id="edit_date" type="date" min="1900-01-01" max="2024-10-10" class="form-control"',
                'placeholder="dd/mm/aaaa" name="fecha" required>',
                '</div>',
                '<div class="form-group">',
                '<input id="edit_mujer" type="radio" name="genero" value="M" checked>',
                '<span style="font-weight: bold; color: rgb(102, 102, 102)">Mujer</span>',
                '</div>',
                '<div class="form-group">',
                '<input id="edit_hombre" type="radio" name="genero" value="H">',
                '<span style="font-weight: bold; color: rgb(102, 102, 102)">Hombre</span>',
                '</div>',
                '<div class="form-group input-group">',
                '<input id="edit_image" type="url" class="form-control" placeholder="Url imagen de perfil" name="Imagen">',
                '</div>',
                '</div>',
                '<div class="modal-footer">',
                '<button type="submit" class="btn btn-default bg-success text-light" onClick="javascript:editValidation(this)" userId="' + id + '">Editar</button>',
                '<button type="button" class="btn btn-default bg-danger text-light" data-dismiss="modal">Cerrar</button>',
                '</div>',
                '</form>',
                '<script>',
                'bootstrapValidate("#edit_email", "email: Escribe un email valido!")',
                'bootstrapValidate("#edit_password", "min: 8: ")',
                'bootstrapValidate("#edit_password_validate", "matches:#new_password:Las contraseñas deben ser iguales!")',
                'bootstrapValidate("#edit_image", "url: #Escribe un url valido!")',
                '</script>'
            ].join("");
            //alert(modalObject);
            user_edit.innerHTML = modalObject;
        }
    }

}

function editValidation(edit) {


    let id = edit.getAttribute('userId');
    let sexo;

    if (document.getElementById("edit_mujer").checked) {
        sexo = document.getElementById("edit_mujer").value;
    } else {
        sexo = document.getElementById("edit_hombre").value;
    }

    if (document.getElementById("edit_password").value != document.getElementById("edit_password_validate").value) {
        alert("Las contraseñas no coinciden!");
        this.preventDefault();
        this.stopPropagation();
    }


    let request = {
        "nombre": document.getElementById("edit_name").value,
        "apellidos": document.getElementById("edit_last_name").value,
        "email": document.getElementById("edit_email").value,
        "password": document.getElementById("edit_password").value,
        "sexo": sexo,
        "fecha": document.getElementById("edit_date").value
    }

    if (document.getElementById("edit_image").value != "") {
        request.imagen = document.getElementById("edit_image").value;
    }
    console.log(request);
    let xhr = new XMLHttpRequest();
    xhr.open("PUT", "http://localhost:3000/api/users/" + id);
    xhr.setRequestHeader("content-Type", "application/json");
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send(JSON.stringify(request));

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert("Login fallido:\n" + xhr.response);
        } else {
            alert(xhr.response);
            $('#modal_edit').modal("hide");
            document.getElementById("edit_user").reset();
        }
    }
}

function inspectModal(inspect) {
    let id = inspect.getAttribute('userId');
    let url = 'http://localhost:3000/api/users?uid=' + id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let user = JSON.parse(xhr.response)[0];
            let modalObject = [
                '<div class="media m-2 d-flex rounded border">',
                '<div class="media-left">',
                '<img class="m-3  rounded-circle align-self-center" src="' + user.imagen + '" alt="Generic placeholder image">',
                '</div>',
                '<div class="media-body ">',
                '<h5 class="mt-0 mb-1"> ' + user.nombre + " " + user.apellidos + '</h5>',
                '<p>Id: ' + user.uid + '</p>',
                '<p>Correo: ' + user.email + '</p>',
                '<p>Fecha de nacimiento: ' + user.fecha + '</p>',
                '<p>Genero: ' + user.sexo + '</p>',
                '<p>Contraseña: ' + user.password + '</p>',
                '</div>',
                '</div>'].join("");
            user_inspect.innerHTML = modalObject;
        }
    }

}

function deleteUserModal(button) {
    let id = button.getAttribute('userId');
    let url = 'http://localhost:3000/api/users?uid=' + id;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let user = JSON.parse(xhr.response)[0];
            let deleteModal = [
                '<div class="media m-2 d-flex rounded border">',
                '<div class="media-left">',
                '<img class="m-3  rounded-circle align-self-center" src="' + user.imagen + '" alt="Generic placeholder image">',
                '</div>',
                '<div class="media-body ">',
                '<h5 class="mt-0 mb-1"> ' + user.nombre + " " + user.apellidos + '</h5>',
                '<p>Id: ' + user.uid + '</p>',
                '<p>Correo: ' + user.email + '</p>',
                '<p>Fecha de nacimiento: ' + user.fecha + '</p>',
                '<p>Genero: ' + user.sexo + '</p>',
                '<p>Contraseña: ' + user.password + '</p>',
                '</div>',
                '</div>',
                '<div class="modal-footer">',
                '<button type="button" onClick="javascript:deleteUser(this)" userId="' + user.uid + '" class="btn btn-default">Si</button>',
                '<button type="button" class="btn btn-default" data-dismiss="modal">No</button>',
                '</div>'].join("");
            usuario_a_eliminar.innerHTML = deleteModal;
        }
    }
}
function deleteUser(eliminar) {
    let id = eliminar.getAttribute('userId');
    let url = 'http://localhost:3000/api/users/' + id;
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", url);
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            alert(xhr.response);
        }
    }
}
function userListToHTML(user_array) {
    info.innerHTML = user_array.map(userToHTML);
}

let searchInput = document.getElementById('search_input');
let searchButton = document.getElementById('search_button');

searchInput.addEventListener('keypress', (event) => {
    if (event.key == 'Enter') {
        searchButton.click();
    }
});

searchButton.addEventListener('click', () => {
    let url = 'http://localhost:3000/api/users/?nombre=' + searchInput.value;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader("x-user-token", localStorage.token);
    xhr.send();

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            let users = JSON.parse(xhr.response);
            currentPage = 1;
            setupPagination(users, pagination, rows);
            displayList(users, rows, currentPage);


        }
    }
});
let pagination = document.getElementById('pagination');
let currentPage = 1;
let rows = 3;
function displayList(items, rowsPerPage, pageToDisplay) {
    pageToDisplay--;
    let start = rowsPerPage * pageToDisplay;
    let end = start + rowsPerPage;
    let paginatedItems = items.slice(start, end);
    userListToHTML(paginatedItems);

}
function setupPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = "";
    let pageCount = Math.ceil(items.length / rowsPerPage);
    let pagList = document.createElement('ul');
    pagList.classList.add('pagination');
    for (let i = 1; i < pageCount + 1; i++) {
        let element = paginationButton(i, items);
        pagList.appendChild(element);
    }
    wrapper.appendChild(pagList);
}
function paginationButton(page, items) {
    let button = document.createElement('div');
    button.innerHTML = '<li class="page-item"><a class="page-link" href="#">' + page + '</a></li>';
    if (currentPage == page) {
        button.classList.add('active');
    }
    button.addEventListener('click', function () {
        currentPage = page;
        displayList(items, rows, currentPage);
        let currentButton = document.querySelector('.pagenumbers button.active');
        currentButton.classList.remove('active');
        button.classList.add('active');
    })
    return button;
}

(function () {


    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()

                }
                form.classList.add('was-validated')
            }, false)
        })


})()
