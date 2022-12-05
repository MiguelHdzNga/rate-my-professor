
let urlParams = new URLSearchParams(window.location.search),
  pid = urlParams.get("pid");


function initData() {


  let url = "http://localhost:3000/api/professors?pid="+pid;
  console.log(url);
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = function () {

    if (xhr.status != 200) {
      
      alert(xhr.status + ": " + xhr.statusText);
    } else {
      console.log(xhr.response);
      let professor = JSON.parse(xhr.response);


      let professorName = professor[0].nombre;
  
       
      let header = document.getElementById("headerContent");
      header.innerHTML = "Calificando profesor: "+ professor[0].nombre+" "+professor[0].apellido;
      let subHeader = document.getElementById("headerSubContent");
      subHeader.innerHTML = "Departamento de "+ professor[0].departamento;
      document.getElementById("professorProfile").href = "perfiles.html?pid="+pid;

      
      if(professor[0].departamento=='humanidades')
      document.getElementById("courseCode").innerHTML = '<option value="" selected disabled hidden>Selecciona materia</option><option value="Psicología">Psicología</option><option value="Filosofía">Filosofía</option><option value="Derechos Humanos">Derechos humanos</option><option value="Inteligencia Emocional">Inteligencia emocional</option><option value="Ética">Ética</option>'

      if(professor[0].departamento=='ingenierías')
      document.getElementById("courseCode").innerHTML = '<option value="" selected disabled hidden>Selecciona materia</option><option value="Electromagnetismo">Electromagnetismo</option><option value="Estática y Dinámica">Estática y Dinámica</option><option value="Química industrial">Química industrial</option><option value="Cálculo Multivariable">Cálculo Multivariable</option><option value="Álgebra Lineal">Álgebra Lineal</option>'

      if(professor[0].departamento=='negocios')
      document.getElementById("courseCode").innerHTML = '<option value="" selected disabled hidden>Selecciona materia</option><option value="Macroeconomía">Macroeconomía</option><option value="Portafolios de Inversión">Portafolios de Inversión</option><option value="Economía Social">Economía Social</option><option value="Contaduría Pública">Contaduría Pública</option><option value="Finanzas Bursátiles">Finanzas Bursátiles</option><option value="Marketing Digital">Marketing Digital</option>'
    }
  };
}

function getAnswers() {
  let courseCode = document.getElementById("courseCode").value;
  
  let onlineCourse = document.getElementById("onlineCourse").checked;
 
  let rateValues = document.getElementsByName("rating");
  let rateNumber = 0;
  for (let i = 0; i < rateValues.length; i++) {
    if (rateValues[i].checked) rateNumber = rateValues[i].value;
  }
  // alert("Calificación del profe: " + rateNumber);

  let difficultyValues = document.getElementsByName("difficulty");
  let difficultyNumber = 0;
  for (let i = 0; i < difficultyValues.length; i++) {
    if (difficultyValues[i].checked)
      difficultyNumber = difficultyValues[i].value;
  }
  // alert("Dificultad del profe: " + difficultyNumber);

  let classAgain = document.getElementById("q1true").checked;
  // alert("Volver a tomar clase: " + classAgain);

  let usesBooks = document.getElementById("q2true").checked;
  // alert("Usa libros: " + usesBooks);

  let attendance = document.getElementById("q3true").checked;
  // alert("Asistencia obligatoria: " + attendance);

  let grade = document.getElementById("grade");

  // alert("Calificación obtenida: " + grade.value);

  let tagList = [];
  for (let i = 1; i < 13; i++) {
    if (document.getElementById("chk" + i).checked)
      tagList.push(document.getElementById("chk" + i).value);
  }
  // alert("Etiquetas del profesor: " + tagList);

  let opinion = document.getElementById("opinion").value;
  // alert("Opinión: "+opinion);

  let body = {
    pid: pid,
    cursos: courseCode,
    online: onlineCourse,
    calificacion: rateNumber,
    dificultad: difficultyNumber,
    retomar: classAgain,
    libros: usesBooks,
    asistencia: attendance,
    calificacionObtenida: grade.value,
    tags: tagList,
    comentario: opinion,
  };

  let xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/api/postComment");

  xhr.setRequestHeader("content-Type", "application/json");
  xhr.setRequestHeader("x-user-token", "YP9J7N17IM-637eba43228f2b70f38ceac3");

  xhr.send(JSON.stringify(body));
  alert("Registrando usuario...");

  xhr.onload = function () {
    if (xhr.status == 200) {
      alert("Usuario registrado exitosamente");
      window.location.href="perfiles.html?pid="+pid;
    } else {
      window.location.href="perfiles.html?pid="+pid;
      alert("Error: " + xhr.response);
    }
  };
}
