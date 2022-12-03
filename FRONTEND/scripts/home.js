"use strict";
var search = "";
var comentarios = [];


function proffesorsList(){
    let url = "http://localhost:3000/api/professors?nombre="
    let xhr = new XMLHttpRequest();
    xhr.open('GET',url);

    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { 
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            
            let departments = document.getElementById('standard-select').value;
            search = document.getElementById('searchProffesor').value;

            
            let data = JSON.parse(xhr.responseText);
            

            //agregar dom con filtros de search y departments

            if(data != null){
                document.getElementById('profesores').replaceChildren();

                //Hacer los filtros de search y departamento

                if(search != undefined){
                    data = data.filter(function (el)
                    {
                        return el.nombre.toUpperCase().includes(search.toUpperCase());
                    }
                    );
                }

                data = data.filter(function (el)
                    {
                        return el.departamento.toUpperCase().includes(departments.toUpperCase());
                    }
                    );
                
                
                    // Aqui debo mostrar cada tarjetita de los profesores
                
                    if(data.length == 0){
                        let nohay = document.createElement('div');
                        nohay.style = "height: 100px"
                        let textoo = document.createElement('h3');
                        textoo.style = "color: #ffff"
                        textoo.innerText = "No se encontraron profesores";

                        nohay.append(textoo);
                        document.getElementById('profesores').append(nohay);
    
                    }

                for(let i=0;i<data.length;i++){
                    
                    //obtener comments del profesor
                   

                    let nombre = "" + data[i].nombre + " " +data[i].apellido;
                    let promedioGrupo = 0.0;
                    let rating = 0.0;
                    let nivelDificultad = 0.0;
                    let facultad = data[i].departamento;
                    let url = "perfiles.html?pid="+data[i]._id;
                    let color = "background-color:rgba(40, 38, 32, 0.395)"


                    let division = 0;

                    for(let j =0;j<comentarios.length;j++){
                        if(comentarios[j].pid == data[i]._id){
                            promedioGrupo += comentarios[j].calificacionObtenida;
                        rating += comentarios[j].calificacion;
                        nivelDificultad += comentarios[j].dificultad;
                        division++;
                        }
                        
                    }

                    if(division >0){
                        promedioGrupo = promedioGrupo/division;
                        rating = rating/division;
                        nivelDificultad = nivelDificultad/division;

                        if(rating>=4){
                            color = "background-color:rgba(53, 208, 180, 0.682)";
                        }else if(rating>=3){
                            color = "background-color:rgba(237, 186, 19, 0.685)";
                        }else{
                            color = "background-color:rgba(251, 91, 73, 0.725)";
                        }
                    }
                   
                    let ratingCount = division;

                    let rectangulo = document.createElement('div');
                    rectangulo.style = "width: 800px; height: 200px;background-color: white; margin: 15px; border-radius: 10px; display: flex;";

                    let subDiv1 = document.createElement('div');
                    subDiv1.style = "width: 220px; display: flex;flex-direction: column; justify-content: center; align-items: center;";

                    //parrafo del subDiv1
                    let titulo = document.createElement('p');
                    titulo.style = "font-size:20px";
                    titulo.innerText = "Rating";
                    subDiv1.append(titulo);

                    //Div dentro del subDiv1
                    let cuadro = document.createElement('div');
                    cuadro.style = "height: 90px; width:95px;"+color+";display: flex;justify-content: center; align-items: center;";
                    //Parrafo dentro de div cuadro
                    let numero = document.createElement('p');
                    numero.style = "font-size:45px; margin-top: 15px;";

                    numero.innerText = rating.toFixed(1);
                    cuadro.append(numero);

                    subDiv1.append(cuadro);

                    let cantidad = document.createElement('p');
                    cantidad.style = "font-size: small; color:#5c5a5a;";
                    cantidad.innerText = ratingCount + " " + "ratings";

                    subDiv1.append(cantidad);

                    rectangulo.append(subDiv1);
                    //Segundo div dentro del subDiv1
                    //Informacion DIV
                    let informacion = document.createElement('div');
                    informacion.style = "display: flex; flex-direction:column;justify-content:center;width: 40%;";

                    let dir = document.createElement('a');
                    dir.setAttribute('href', url);
                    let dirComment = document.createElement('p');
                    dirComment.style = "font-size: 32px; padding:5px;margin-bottom: 1px;";
                    dirComment.innerText = nombre;
                    dir.append(dirComment);

                    informacion.append(dir);

                    let materia = document.createElement('p');
                    materia.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:#5c5a5a";
                    materia.innerText = facultad;

                    informacion.append(materia);

                    let uni = document.createElement('p');
                    uni.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:#5c5a5a";
                    uni.innerText = "ITESO";

                    informacion.append(uni);

                    // Div dentro de div de informacion

                    let ultimoDiv = document.createElement('div');
                    ultimoDiv.style = "display: flex; flex-direction:row";

                    let prom = document.createElement('p');
                    prom.innerText = promedioGrupo.toFixed(1);

                    ultimoDiv.append(prom);

                    let promText = document.createElement('p');
                    promText.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:hsl(281, 28%, 15%)";
                    promText.innerText = "Promedio del grupo";

                    ultimoDiv.append(promText);

                    let barra = document.createElement('p');
                    barra.style = "font-family:Verdana, Geneva, Tahoma, sans-serif";
                    barra.innerText = "|";

                    ultimoDiv.append(barra);

                    let difi = document.createElement('p');
                    difi.innerText = nivelDificultad.toFixed(1);

                    ultimoDiv.append(difi);

                    let texto = document.createElement('p');
                    texto.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:hsl(281, 28%, 15%)";
                    texto.innerText = "Nivel de dificultad";

                    ultimoDiv.append(texto);

                    informacion.append(ultimoDiv);
                    rectangulo.append(informacion);
                    
                    rectangulo.className = "box";

                    document.getElementById('profesores').append(rectangulo);
                }
            }

        }

    };

}


function selectList(){
    let url = "http://localhost:3000/api/professors?nombre="
    let xhr = new XMLHttpRequest();
    xhr.open('GET',url);

    xhr.send();
    xhr.onload = function () {
        if (xhr.status != 200 && xhr.status != 201) { 
            alert(xhr.status + ': ' + xhr.statusText);
        } else {
            
  
            let departments = document.getElementById('standard-select').value;
            
            let data = JSON.parse(xhr.responseText);
   

            

            // agregar dom con filtros de search y departments

            if(data != null){
                document.getElementById('profesores').replaceChildren();

                //Hacer los filtros de search y departamento

                if(search != undefined){
                    data = data.filter(function (el)
                    {
                        return el.nombre.toUpperCase().includes(search.toUpperCase());
                    }
                    );
                }

                data = data.filter(function (el)
                    {
                        return el.departamento.toUpperCase().includes(departments.toUpperCase());
                    }
                    );
                
                
                    // Aqui debo mostrar cada tarjetita de los profesores

                    if(data.length == 0){
                        let nohay = document.createElement('div');
                        nohay.style = "height: 100px"
                        let textoo = document.createElement('h3');
                        textoo.style = "color: #ffff"
                        textoo.innerText = "No se encontraron profesores";

                        nohay.append(textoo);
                        document.getElementById('profesores').append(nohay);
    
                    }

                for(let i=0;i<data.length;i++){
                    
                    //obtener comments del profesor
                    
                    

                    let nombre = "" + data[i].nombre + " " +data[i].apellido;
                    let promedioGrupo = 0.0;
                    let rating = 0.0;
                    let nivelDificultad = 0.0;
                    
                    let facultad = data[i].departamento;
                    let url = "perfiles.html?pid="+data[i]._id;
                    let color = "background-color:rgba(40, 38, 32, 0.395)"


                    let division = 0;

                    for(let j =0;j<comentarios.length;j++){
                        if(comentarios[j].pid == data[i]._id){
                            promedioGrupo += comentarios[j].calificacionObtenida;
                            rating += comentarios[j].calificacion;
                            nivelDificultad += comentarios[j].dificultad;
                            division++;
                        }
                        
                    }

                    if(division > 0){
                        promedioGrupo = promedioGrupo/division;
                        rating = rating/division;
                        nivelDificultad = nivelDificultad/division;

                        if(rating>=4){
                            color = "background-color:rgba(53, 208, 180, 0.682)";
                        }else if(rating>=3){
                            color = "background-color:rgba(237, 186, 19, 0.685)";
                        }else{
                            color = "background-color:rgba(251, 91, 73, 0.725)";
                        }
                    }
                    
                   
                    let ratingCount = division;

                    
                    let rectangulo = document.createElement('div');
                    rectangulo.style = "width: 800px; height: 200px;background-color: white; margin: 15px; border-radius: 10px; display: flex;";

                    let subDiv1 = document.createElement('div');
                    subDiv1.style = "width: 220px; display: flex;flex-direction: column; justify-content: center; align-items: center;";

                    //parrafo del subDiv1
                    let titulo = document.createElement('p');
                    titulo.style = "font-size:20px";
                    titulo.innerText = "Rating";
                    subDiv1.append(titulo);

                    //Div dentro del subDiv1
                    let cuadro = document.createElement('div');
                    cuadro.style = "height: 90px; width:95px;"+color+";display: flex;justify-content: center; align-items: center;";
                    //Parrafo dentro de div cuadro
                    let numero = document.createElement('p');
                    numero.style = "font-size:45px; margin-top: 15px;";
                    numero.innerText = rating.toFixed(1);
                    cuadro.append(numero);

                    subDiv1.append(cuadro);

                    let cantidad = document.createElement('p');
                    cantidad.style = "font-size: small; color:#5c5a5a;";
                    cantidad.innerText = ratingCount + " " + "ratings";

                    subDiv1.append(cantidad);

                    rectangulo.append(subDiv1);
                    //Segundo div dentro del subDiv1
                    //Informacion DIV
                    let informacion = document.createElement('div');
                    informacion.style = "display: flex; flex-direction:column;justify-content:center;width: 40%;";

                    let dir = document.createElement('a');
                    dir.setAttribute('href', url);
                    let dirComment = document.createElement('p');
                    dirComment.style = "font-size: 32px; padding:5px;margin-bottom: 1px;";
                    dirComment.innerText = nombre;
                    dir.append(dirComment);

                    informacion.append(dir);

                    let materia = document.createElement('p');
                    materia.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:#5c5a5a";
                    materia.innerText = facultad;

                    informacion.append(materia);

                    let uni = document.createElement('p');
                    uni.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:#5c5a5a";
                    uni.innerText = "ITESO";

                    informacion.append(uni);

                    // Div dentro de div de informacion

                    let ultimoDiv = document.createElement('div');
                    ultimoDiv.style = "display: flex; flex-direction:row";

                    let prom = document.createElement('p');
                    prom.innerText = promedioGrupo.toFixed(1);

                    ultimoDiv.append(prom);

                    let promText = document.createElement('p');
                    promText.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:hsl(281, 28%, 15%)";
                    promText.innerText = "Promedio del grupo";

                    ultimoDiv.append(promText);

                    let barra = document.createElement('p');
                    barra.style = "font-family:Verdana, Geneva, Tahoma, sans-serif";
                    barra.innerText = "|";

                    ultimoDiv.append(barra);

                    let difi = document.createElement('p');
                    difi.innerText = nivelDificultad.toFixed(1);

                    ultimoDiv.append(difi);

                    let texto = document.createElement('p');
                    texto.style = "font-size: 10px; padding:5px;margin-bottom: 1px;color:hsl(281, 28%, 15%)";
                    texto.innerText = "Nivel de dificultad";

                    ultimoDiv.append(texto);

                    informacion.append(ultimoDiv);
                    rectangulo.append(informacion);


                    rectangulo.className = "box";
                    document.getElementById('profesores').append(rectangulo);
                }
            }



        }

    }; //Aqui termina el ELSE

}


function comments(){
        let url = "http://localhost:3000/api/comment?pid=";
        let xhr = new XMLHttpRequest();
        xhr.open('GET',url);

        xhr.send();
        xhr.onload = function () {
            if (xhr.status != 200 && xhr.status != 201) { 
                alert(xhr.status + ': ' + xhr.statusText);
                

            } else {
                let data = JSON.parse(xhr.responseText);

                comentarios = data;
          
                selectList();
            }
    
        };
    
    
}


comments();


var boxes = document.getElementsByClassName('box');

window.addEventListener('scroll',checkBoxes);

checkBoxes();

function checkBoxes(){
    const triggerBottom = window.innerHeight/5*4;
    console.log(window.innerHeight/5*4);

    for(let k=0; k<boxes.length;k++){
        const boxTop = boxes[k].getBoundingClientRect().top;

        if(boxTop < triggerBottom){
            boxes[k].classList.add('show');
        }else{
            boxes[k].classList.remove('show');
        }
    }

}

var scrollEventHandler = function()
{
  window.scroll(0, window.pageYOffset)
}


window.addEventListener("scroll", scrollEventHandler, false);
