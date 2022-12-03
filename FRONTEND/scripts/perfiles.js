"use strict";



let urlParams = new URLSearchParams(window.location.search),
    pid = urlParams.get('pid');


let currentPage = 1;
let rows = 3;


window.addEventListener('load', () => {
    initData();
});

function initData() {
    let pagination = document.getElementById('pagination');
    let perfil = document.getElementById('perfilProfesor');
    let url = "http://localhost:3000/api/professors?pid=" + pid;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(xhr.status + ': ' + xhr.statusText);
        }
        else {
            let profesor = JSON.parse(xhr.response);
            profesor = profesor[0];
            url = "http://localhost:3000/api/comment?pid=" + pid;
            xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.send();
            xhr.onload = function () {
                if (xhr.status != 200) {
                    alert(xhr.status + ': ' + xhr.statusText);
                }
                else {
                    let comentarios = JSON.parse(xhr.response)
                    perfil.innerHTML = profileHTML(profesor, comentarios);
                    //datos.forEach((element) => { users.push(element); id_count++; });
                    currentPage = 1;
                    displayList(comentarios, rows, currentPage);
                    setupPagination(comentarios, pagination, rows);
                    /* let comentariosString = '',
                        comentariosDOM = document.getElementById('comentarios');
                    comentarios.forEach(commentToHTML)
                    function commentToHTML(item) {
                        comentariosString += commentTostring(item);
                    }
                    comentariosDOM.innerHTML = comentariosString; */
                }

            }
        }
    }
}

function profileHTML(profesor, comentarios) {
    return [
        '<div class="row">',
        '<div class="">',
        '<div class="well profile" style="font-family: "Poppins";">',
        '<div class="col-sm-12">',
        '<div class="col-xs-12 col-sm-8">',
        '<h2>' + profesor.nombre.toUpperCase() + " " + profesor.apellido.toUpperCase() + '</h2>',
        '<p><strong>Departamento: </strong>' + profesor.departamento.toUpperCase() + '</p>',
        '<p><strong>Cursos: </strong> Algoritmos y programacion, Programacion Estructurada </p>',
        '<p><strong>Top Tags: </strong>',
        tagsToHTML(comentarios),
        '</p>',
        '</div>',

        '<div class="col-xs-12 col-sm-4 text-center">',
        '<figure>',
        '<img src="http://www.localcrimenews.com/wp-content/uploads/2013/07/default-user-icon-profile.png" alt=""',
        'class="img-circle img-responsive">',
        '<figcaption class="ratings">',
        '<p><strong>Ratings:</strong><br>',
        ratingToHTML(comentarios),

        '</p>',
        '</figcaption>',
        '</figure>',
        '<div>',
        '<a href="rateMyProfessor.html?pid=' + pid + '"><button class="btn btn-primary">Calificar a este profesor</button></a>',
        '</div>',
        '</div>',
        '</div>',
        '<div class="col-xs-12 divider text-center">',
        '<div class="col-xs-12 col-sm-4 emphasis">',
        '<h2><strong> ' + rating(comentarios, "dificultad") + ' / 5 </strong></h2>',
        '<p><small>Dificultad</small></p>',
        '</div>',
        '<div class="col-xs-12 col-sm-4 emphasis">',
        '<h2><strong>' + porcentaje(comentarios) + '%</strong></h2>',
        '<p><small>La volveria a cursar</small></p>',
        '</div>',
        '<div class="col-xs-12 col-sm-4 emphasis">',
        '<h2><strong>' + rating(comentarios, "calificacionObtenida") + '</strong></h2>',
        '<p><small>Promedio de calificaciones</small></p>',
        '</div>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join("");
}

function rating(comentarios, atributo) {
    let promedio = 0;
    comentarios.forEach(ratings);
    function ratings(item) {
        promedio += item[atributo];
    }
    let toReturn = (promedio / comentarios.length).toFixed(1);
    if (isNaN(toReturn)) {
        toReturn = 0;
    }
    return toReturn;
}
function ratingToHTML(comentarios) {
    let estrellas = Math.floor(rating(comentarios, 'calificacion'));
    let htmlString = '';
    for (let i = 0; i < estrellas; i++) {
        htmlString += [
            '<a href="#">',
            '<span class="fa fa-star fa-3x"></span>'].join("");
    }
    for (let i = estrellas; i < 5; i++) {
        htmlString += [
            '<a href="#">',
            '<span class="fa fa-star-o fa-3x"></span>'].join("");
    }
    return htmlString;
}

function tags(comentarios) {
    let tagObject = {};
    comentarios.forEach(topTags);
    function topTags(item) {
        let atribute = "";
        if (item.tags.length != 0) {
            for (let i = 0; i < item.tags.length; i++) {
                atribute = item.tags[i];
                if (tagObject[atribute]) {
                    tagObject[atribute]++;
                }
                else {
                    tagObject[atribute] = 1;
                }
            }
        }
    }
    let tagList = [];
    for (let i = 0; i < 3; i++) {
        let max = 0
        for (let e in tagObject) {

            if (max < tagObject[e]) {
                max = tagObject[e];
                tagList[i] = e;
            }
        }
        delete tagObject[tagList[i]];
    }
    return tagList;
}

function tagsToHTML(comentarios) {
    let tagList = tags(comentarios),
        htmlString = '';
    for (let i in tagList) {
        htmlString += '<span class="tags ">' + tagList[i] + '</span> '
    }
    return htmlString;
}

function porcentaje(comentarios) {
    let suma = 0;
    comentarios.forEach(percent);
    function percent(item) {

        if (item.retomar) {
            console.log(item.retomar);
            suma++;
        }
    }
    let toReturn = ((suma / comentarios.length) * 100).toFixed(0);
    if (isNaN(toReturn)) {
        toReturn = 0;
    }
    return toReturn;
}



function commentTostring(comentario) {
    return [
        '<div class="media row d-flex rounded border well profile " style="font-family: "Poppins";">',
        '<div class="media-left">',
        '<p class="text-center"><strong>Calidad:</strong></p>',
        '<div class="m-3 d-flex align-items-center rounded divider" style="width: 75px; height: 75px; justify-content: center;' + colorBoxCalidad(comentario) + '">',
        '<div><h2 class="m-2"><strong>' + comentario.calificacion + '</strong></h2></div>',

        '</div>',
        '<p class="text-center"><strong>Dificultad:</strong></p>',
        '<div class="m-3 d-flex align-items-center rounded divider" style="width: 75px; height: 75px; justify-content: center;' + colorBoxDificultad(comentario) + '">',
        '<div><h2 class="m-2"><strong>' + comentario.dificultad + '</strong></h2></div>',

        '</div>',
        '</div>',
        '<div class="m-2 media-body">',
        '<div class="pull-right"><strong>' + fecha(comentario.fecha) + '</strong></div>',
        '<p>Requiere libro: <strong>' + truefalse(comentario.libros) + '</strong></p>',
        '<p>Toma asistencia: <strong>' + truefalse(comentario.asistencia) + '</strong></p>',
        '<p><strong>Top Tags: </strong>',
        tagString(comentario),
        '</p>',
        '<strong>Comentario:</strong>',
        '<p>' + comentario.comentario + '</p>',

        '</div>',
        '</div>',
        '</div>'].join("");
}
function colorBoxCalidad(comentario) {
    let color = '';
    if (comentario.calificacion >= 4) {
        color = "background-color:rgba(53, 208, 180, 0.682)";
    } else if (comentario.calificacion >= 3) {
        color = "background-color:rgba(237, 186, 19, 0.685)";
    } else {
        color = "background-color:rgba(251, 91, 73, 0.725)";
    }
    return color;
}
function truefalse(atribute) {
    if (atribute) {
        return 'Si';
    }
    else {
        return 'no';
    }
}
function colorBoxDificultad(comentario) {
    let color = '';
    if (comentario.dificultad >= 4) {
        color = "background-color:rgba(251, 91, 73, 0.725)";
    } else if (comentario.dificultad >= 3) {
        color = "background-color:rgba(237, 186, 19, 0.685)";
    } else {
        color = "background-color:rgba(53, 208, 180, 0.682)";
    }
    return color;
}
function tagString(comentario) {
    let htmlString = '';
    for (let i in comentario.tags) {
        htmlString += '<span class="tags ">' + comentario.tags[i] + '</span> '
    }
    return htmlString;
}
function fecha(attribute) {
    if (!attribute) {
        return "";
    }
    return attribute;
}
function displayList(items, rowsPerPage, pageToDisplay) {
    pageToDisplay--;
    let start = rowsPerPage * pageToDisplay;
    let end = start + rowsPerPage;
    let paginatedItems = items.slice(start, end);
    //userListToHTML(paginatedItems);
    let comentariosString = '',
        comentariosDOM = document.getElementById('comentarios');
    
    paginatedItems.forEach(commentToHTML)
    function commentToHTML(item) {
        comentariosString += commentTostring(item);
    }
    comentariosDOM.innerHTML = comentariosString;

}
function setupPagination(items, wrapper, rowsPerPage) {
    wrapper.innerHTML = "";
    let pageCount = Math.ceil(items.length / rowsPerPage);
    let pagList = document.createElement('ul');
    pagList.classList.add('list-group');
    pagList.classList.add('list-group-horizontal')

    
    for (let i = 1; i < pageCount + 1; i++) {
        let element = paginationButton(i, items);
        pagList.appendChild(element);
    }
    wrapper.appendChild(pagList);
}
function paginationButton(page, items) {
    let button = document.createElement('button');
    button.classList.add('list-group-item')
    button.innerText = page;
    if (currentPage == page) {
        button.classList.add('active');
    }
    button.addEventListener('click', function () {
        currentPage = page;
        displayList(items, rows, currentPage);
        let currentButton = document.querySelector('.list-group button.active');
        currentButton.classList.remove('active');
        button.classList.add('active');
    })
    return button;
}
