import chalk from 'chalk';
import express, { query } from 'express';
import mongoose from "mongoose";
//import url from "url";
import cors from 'cors';
import bcrypt from 'bcrypt';
import randomize from 'randomatic';
//import path from 'path';

//const __filename =  url.fileURLToPath(import.meta.url);
//const __dirname = url.fileURLToPath(new URL(',',import.meta.url));


const app = express();
const port = 3000;

app.use(express.json());
//app.use(express.static(__dirname));

/* app.get('/', (req, res) => {
    console.log(chalk.blue("Entró a la raíz"));
    //res.send('Raíz del sitio');
    res.sendFile(path.join(__dirname, '../FRONTEND/home.html'));
}); */

app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

let userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },

    pass: {
        type: String,
        required: true
    },
    token: {
        type: String
    }
});

let professorSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    departamento: {
        type: String,
        required: true
    }

});
let commentSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    pid: {
        type: String,
        required: true
    },
    calificacion: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    dificultad: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    retomar: {
        type: Boolean,
        required: true
    },
    libros: {
        type: Boolean,
        required: true
    },
    asistencia: {
        type: Boolean,
        required: true
    },
    calificacionObtenida: {
        type: Number,
        min: 5,
        max: 10,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    comentario: {
        type: String,
    },
    fecha: {
        type: String
    },
    cursos: {
        type: String,
        //required: true
    },
    online: {
        type: Boolean,
        //required: true
    }

});

let mongoConnection = "mongodb+srv://admin:qLZM8U%40f0nQC@cluster0.gxqdpgm.mongodb.net/test";
let db = mongoose.connection;

db.on('connecting', () => {
    console.log(chalk.blue('Conectando...'));
    console.log(mongoose.connection.readyState);
});
db.on('connected', () => {
    console.log(chalk.green('Conectado exitosamente!'));
    console.log(mongoose.connection.readyState);
});

function authenticator(req, res, next) {
    let token = req.get("x-user-token");
    if (token) {
        User.find({
            token: token
        }, (err, doc) => {
            if (err) {
                console.log("Error: " + err);
                res.send(err);
            }
            else {
                if (doc.length == 0) {
                    res.status(401);
                    res.send('Usuario no autenticado');
                    return;
                }
                else {
                    next();
                }
            }
        });
    }
    else {
        return res.status(401).send("Usuario no autenticado");
    }
}

app.use("/api/postComment", authenticator);

mongoose.connect(mongoConnection, { useNewUrlParser: true });
let Profesor = mongoose.model('professor', professorSchema);

app.post('/api/professors', (req, res) => {
    if (req.body.nombre == undefined) {
        res.status(400);
        res.send("Falta nombre");
        return;
    }
    if (req.body.apellido == undefined) {
        res.status(400);
        res.send("Falta apellido");
        return;
    }
    if (req.body.departamento == undefined) {
        res.status(400);
        res.send("Falta apellido");
        return;
    }

    req.body.nombre = req.body.nombre.toLowerCase();
    req.body.apellidos = req.body.apellido.toLowerCase();
    req.body.departamento = req.body.departamento.toLowerCase();
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let departamento = req.body.departamento;
    let newProfesor = { nombre: nombre, apellido: apellido, departamento: departamento };
    let profesor = Profesor(newProfesor);

    profesor.save().then((doc) => console.log(chalk.green("Profesor creado: ") + doc));
    res.status(200);
    res.send("Profesor agregado con exito");
});
let User = mongoose.model('users', userSchema);

app.post('/api/users', (req, res) => {
    if (req.body.email == undefined) {
        res.status(400);
        res.send("Falta email");
        return;
    }
    if (req.body.pass == undefined) {
        res.status(400);
        res.send("Falta contraseña");
        return;
    }
    User.find({
        email: req.body.email
    }, function (err, docs) {
        if (docs.length != 0) {
            console.log('La cuenta ya existe!');
            console.log(docs);
            res.status(400);
            res.send('La cuenta ya existe!');
            return;
        }
        let hash = bcrypt.hashSync(req.body.pass, 10);
        req.body.email = req.body.email.toLowerCase();
        let email = req.body.email;
        let newUser = { email: email, pass: hash };
        let user = User(newUser);

        user.save().then((doc) =>
            console.log(chalk.green("Usuario creado: ") + doc)
        );
        res.status(200);
        res.send("Usuario agregado con exito");
    });
});


let Comment = mongoose.model('comments', commentSchema);
app.post('/api/postComment', (req, res) => {
    let token = req.get('x-user-token');
    if (req.body.calificacion == undefined) {
        res.status(400);
        res.send("Falta calificacion");
        return;
    }
    if (req.body.dificultad == undefined) {
        res.status(400);
        res.send("Falta dificultad");
        return;
    }
    if (req.body.retomar == undefined) {
        res.status(400);
        res.send("Falta retomar");
        return;
    }
    if (req.body.libros == undefined) {
        res.status(400);
        res.send("Falta libros");
        return;
    }
    if (req.body.asistencia == undefined) {
        res.status(400);
        res.send("Falta asistencia");
        return;
    }
    if (req.body.calificacionObtenida == undefined) {
        res.status(400);
        res.send("Falta calificacion obtenida");
        return;
    }
    if (req.body.tags == undefined) {
        res.status(400);
        res.send("Falta tags");
        return;
    }
    User.find({
        token: token
    }, function (err, docs) {
        if (docs.length != 0) {
            let uid = docs[0]._id
            Comment.find({
                uid: uid,
                pid: req.body.pid
            }, (errCom, docCom) => {
                if (errCom) {
                    console.log("Error: " + err);
                    res.send(err);
                }
                else {
                    var event = new Date();
                    if (docCom.length == 0) {
                        //var event = new Date();
                        let newComment = {
                            uid: uid,
                            pid: req.body.pid,
                            calificacion: req.body.calificacion,
                            dificultad: req.body.dificultad,
                            retomar: req.body.retomar,
                            libros: req.body.libros,
                            asistencia: req.body.asistencia,
                            calificacionObtenida: req.body.calificacionObtenida,
                            tags: req.body.tags,
                            comentario: req.body.comentario,
                            online: req.body.online,
                            cursos: req.body.cursos,
                            fecha: event.toLocaleDateString('es-ES')
                        };
                        let comment = Comment(newComment);
                        comment.save().then((doc) =>
                            console.log(chalk.green("Usuario creado: ") + doc)
                        );
                        res.status(200);
                        res.send("Comentario agregado con exito");
                        return;
                    }
                    else {
                        let objectToUpdate = {

                            uid: uid,
                            pid: req.body.pid,
                            calificacion: req.body.calificacion,
                            dificultad: req.body.dificultad,
                            retomar: req.body.retomar,
                            libros: req.body.libros,
                            asistencia: req.body.asistencia,
                            calificacionObtenida: req.body.calificacionObtenida,
                            tags: req.body.tags,
                            comentario: req.body.comentario,
                            online: req.body.online,
                            cursos: req.body.cursos,
                            fecha: event.toLocaleDateString('es-ES')

                        };
                        console.log(docCom[0]._id);
                        Comment.findByIdAndUpdate(docCom[0]._id, objectToUpdate, { new: true }, (errEdit, docEdit) => {
                            if (err) {
                                console.log("Error: " + errEdit);
                                res.send(errEdit);
                            }
                            else {
                                
                                res.status(200);
                                res.send('Usuario editado con exito');
                                return
                            }
                        });
                    }
                }

            });

            /* let newComment = {
                uid: uid,
                pid: req.body.pid,
                calificacion: req.body.calificacion,
                dificultad: req.body.dificultad,
                retomar: req.body.retomar,
                libros: req.body.libros,
                asistencia: req.body.asistencia,
                calificacionObtenida: req.body.calificacionObtenida,
                tags: req.body.tags,
                comentario: req.body.comentario
            };
            let comment = Comment(newComment);
            comment.save().then((doc) =>
                console.log(chalk.green("Usuario creado: ") + doc)
            );
            //console.log(docsResponse._uid);
            res.status(200);
            res.send("Comentario agregado con exito");
            return; */
        }
    });
});

app.post("/api/login", (req, res) => {
    if (!req.body.email) {
        res.status(400);
        res.send("Falta email");
        return;
    }
    if (!req.body.pass) {
        res.status(400);
        res.send("Falta contraseña");
        return;
    }
    User.find({
        email: req.body.email
    }, function (err, docs) {
        if (docs.length === 0) {
            res.status(401);
            res.send("Email incorrecto");
            return;
        }
        if (!bcrypt.compareSync(req.body.pass, docs[0].pass)) {
            res.status(401);
            res.send("Contraseña incorrecta");
            return;
        }
        let jObject = docs[0];
        if (jObject.token == undefined) {
            jObject.token = randomize('Aa0', '10') + "-" + jObject._id;
            let objectToUpdate = {
                _id: jObject._id,
                email: jObject.email,
                pass: jObject.pass,
                token: jObject.token
            }
            User.findByIdAndUpdate(jObject._id, objectToUpdate, { new: true }, (err, doc) => {
                if (err) {
                    console.log("Error: " + err);
                    res.send(err);
                }
                else {
                    console.log(chalk.green("Token creado:"))
                    console.log(doc);
                    res.status(200);
                    res.send(doc.token);
                    return
                }
            });

        }
        else {
            User.findById(jObject._id, (err, doc) => {
                if (err) {
                    console.log("Error: " + err);
                    res.send(err);
                }
                else {
                    console.log(chalk.green("El token ya existe"))
                    console.log(doc);
                    res.status(200);
                    res.send(doc.token);
                    return;
                }
            });
        }
    });
});


app.get("/api/comment", (req, res) => {
    Comment.find({
        pid: { $regex: req.query.pid }
    }, function (err, docs) {
        console.log(docs);
        res.status(200);
        res.send(docs);
    });

});
app.get("/api/professors", (req, res) => {
    if (req.query.pid) {
        Profesor.find({
            _id: req.query.pid,
        }, function (err, docs) {
            console.log(docs);
            res.status(200);
            res.send(docs);
            return;
        });
    }
    else {
        Profesor.find({
            nombre: { $regex: req.query.nombre },
        }, function (err, docs) {
            console.log(docs);
            res.status(200);
            res.send(docs);
            return;
        });
    }
});
app.get("/api/users", (req, res) => {
    User.find({
        email: { $regex: req.query.email },
    }, function (err, docs) {
        console.log(docs);
        res.status(200);
        res.send(docs);
    });

});

app.listen(port, () => {
    console.log("aplicacion de ejemplo corriendo en puerto " + port);
});