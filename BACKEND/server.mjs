import chalk from 'chalk';
import express from 'express';
import * as fs from 'node:fs';
import cors from 'cors';
import randomize from 'randomatic';
//[{"nombre":"MIGUEL","apellidos":"HERNANDEZ","email":"miguel.hernandez@iteso.mx","password":"Labr3des00!","sexo":"H","fecha":"2022-02-22","imagen":"https://randomuser.me/api/portraits/men/43.jpg","uid":1,"token":"Hw16CUowhA-1"}]
//[{"nombre":"PEDRO","apellidos":"PEREZ","email":"pedro.perez@iteso.mx","sexo":"M","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/women/48.jpg","uid":1,"token":"rIiU9IsFmU-1"},{"nombre":"JAVIER","apellidos":"PEREZ","email":"javier.perez@iteso.mx","sexo":"H","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/men/8.jpg","uid":2,"token":"DKs4Of2g8M-2"},{"nombre":"HILDA","apellidos":"PEREZ","email":"hilda.perez@iteso.mx","sexo":"M","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/women/12.jpg","uid":3,"token":"xKXlEJ90vy-3"},{"nombre":"JEN","apellidos":"PEREZ","email":"jen.perez@iteso.mx","sexo":"M","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/women/25.jpg","uid":4},{"nombre":"SARAH","apellidos":"PEREZ","email":"sarah.perez@iteso.mx","sexo":"M","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/women/54.jpg","uid":5,"token":"2aeXFuEgaK-5"},{"nombre":"MANUEL","apellidos":"PEREZ","email":"manuel.perez@iteso.mx","sexo":"H","password":"pass","fecha":"2021","imagen":"https://randomuser.me/api/portraits/men/56.jpg","uid":6}]

function getRandomInt() {
    return Math.floor(Math.random() * 99);
};

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}));

app.post('/api/users', (req, res) => {
    if (req.body.nombre == undefined) {
        res.status(400);
        res.send("Falta nombre");
        return;
    }
    if (req.body.apellidos == undefined) {
        res.status(400);
        res.send("Falta apellido");
        return;
    }
    if (req.body.email == undefined) {
        res.status(400);
        res.send("Falta email");
        return;
    }
    if (req.body.password == undefined) {
        res.status(400);
        res.send("Falta contraseña");
        return;
    }
    if (req.body.fecha == undefined) {
        res.status(400);
        res.send("Falta fecha");
        return;
    }
    if ((req.body.sexo != "H" && req.body.sexo != "M") || req.body.sexo == undefined) {
        res.status(400);
        res.send("Sexo incorrecto");
        return;
    }
    if (req.body.imagen == undefined || req.body.imagen == "") {
        if (req.body.sexo == "H") {
            req.body.imagen = "https://randomuser.me/api/portraits/men/" + getRandomInt() + ".jpg";
        }
        else {
            req.body.imagen = "https://randomuser.me/api/portraits/women/" + getRandomInt() + ".jpg";
        }
    }
    fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
        console.log(req.body.apellidos)
        if (error) {
            console.log(error);
        }
        let data_json = JSON.parse(data);
        if ((data_json.find(item => item.nombre == req.body.nombre) && (data_json.find(item => item.apellidos == req.body.apellidos)) || data_json.find(item => item.email == req.body.email))) {
            res.status(400);
            res.send("El Usuario ya existe");
            return;
        }
        req.body.email = req.body.email.toLowerCase();
        req.body.nombre = req.body.nombre.toUpperCase();
        req.body.apellidos = req.body.apellidos.toUpperCase();
        if (!data_json.length) req.body.uid = 1;
        else req.body.uid = data_json[data_json.length - 1].uid + 1;
        data_json.push(req.body);
        fs.writeFile("../DATABASE/users.json", JSON.stringify(data_json), "utf8", (error) => {
            if (error)
                console.log(error);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("../DATABASE/users.json", "utf8"));

            }
        });
        res.status(201);
        res.send("Usuario creado con exito!");
        return
    });
});

app.post("/api/login", (req, res) => {
    if (!req.body.email) {
        res.status(400);
        res.send("Falta email");
        return;
    }
    if (!req.body.password) {
        res.status(400);
        res.send("Falta contraseña");
        return;
    }

    fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        let data_json = [];
        data_json = JSON.parse(data);
        let jObject = data_json.find(item => item.email == req.body.email)
        if (!(data_json.find(item => item.email == req.body.email) && (data_json.find(item => item.password == req.body.password)))) {
            res.status(401);
            res.send("Contraseña o email incorrectos");
            return;
        }
        if (!jObject["token"]) {
            jObject["token"] = randomize('Aa0', '10') + "-" + jObject.uid;

            fs.writeFile("../DATABASE/users.json", JSON.stringify(data_json), "utf8", (error) => {
                if (error)
                    console.log(error);
                else {
                    console.log("File written successfully\n");
                    console.log("The written has the following contents:");
                    console.log(fs.readFileSync("../DATABASE/users.json", "utf8"));
                }
            });


            data_json.push(req.body);
            res.status(201);
            res.send(jObject.token);
            return;//jObject["x-user-token"];
        }
        else {
            res.status(200);
            res.send(jObject.token);
            return;// jObject.token;
        }
    });
});

function auth(req, res, next) {
    let token = req.get("x-user-token");
    if (token) {
        fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
            if (error) {
                console.log(error);
            }
            let users = JSON.parse(data);
            if (users.find(item => item["token"] == token)) {
                req.id = users.find(item => item["token"] == token).uid;
                next();
            }
            else
                return res.status(401).send("Usuario no autenticado");

        });
    }
    else {
        return res.status(401).send("Usuario no autenticado");
    }
}

app.use("", auth);

app.get("/api/users", (req, res) => {
    function findUsers(nombre, email, sexo, fecha, uid) {
        let filter = [];
        fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
            if (error) {
                console.log(error);
            }
            let users = JSON.parse(data);
            for (let i = 0; i < users.length; i++) {
                if (findName(users, nombre, i) && findEmail(users, email, i) && findSexo(users, sexo, i) && findYear(users, fecha, i) && findUid(users, uid, i)) {
                    filter.push(users[i]);
                }
            }
            res.status(200);
            res.send(filter);
            return filter;
        });
    }
    findUsers(req.query.nombre, req.query.email, req.query.sexo, req.query.fecha, req.query.uid);

});

function findName(users, nombre, i) {
    if (nombre == undefined) {
        return true;
    }
    else {
        return (users[i].nombre.includes(nombre.toUpperCase()) || users[i].apellidos.includes(nombre.toUpperCase()));
    }
}
function findUid(users, uid, i) {
    if (uid == undefined) {
        return true;
    }
    else {
        return (users[i].uid == uid);
    }
}
function findEmail(users, email, i) {
    if (email == undefined) {
        return true;
    }
    else {
        return (users[i].email.includes(email));
    }
}
function findSexo(users, sexo, i) {
    if (sexo == undefined) {
        return true;
    }
    else {
        return (users[i].sexo.includes(sexo.toUpperCase()));
    }
}
function findYear(users, year, i) {
    if (year == undefined) {
        return true;
    }
    else {
        return (users[i].fecha.includes(year));
    }
}

app.get("/api/users/:email", (req, res) => {
    fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        let users = JSON.parse(data);
        let jObject = users.find(item => item.email == req.params.email);
        res.status(200);
        res.send(jObject);
    });
});

app.put('/api/users/:uid', (req, res) => {
    fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        let users = JSON.parse(data);
        let jObject = users.find(item => item.uid == req.params.uid);
        if (!jObject) {
            res.status(404);
            res.send("El usuario no existe");
            return
        }
        if (req.body.nombre == undefined) {
            res.status(400);
            res.send("Falta nombre");
            return;
        }
        if (req.body.apellidos == undefined) {
            res.status(400);
            res.send("Falta apellido");
            return;
        }
        if (req.body.email == undefined) {
            res.status(400);
            res.send("Falta email");
            return;
        }
        if (req.body.password == undefined) {
            res.status(400);
            res.send("Falta contraseña");
            return;
        }
        if (req.body.fecha == undefined) {
            res.status(400);
            res.send("Falta fecha");
            return;
        }
        if ((req.body.sexo != "H" && req.body.sexo != "M") || req.body.sexo == undefined) {
            res.status(400);
            res.send("Sexo incorrecto");
            return;
        }
        /* if (req.body.imagen == undefined || req.body.imagen == "") {
            if (req.body.sexo == "H") {
                req.body.imagen = "https://randomuser.me/api/portraits/men/" + getRandomInt() + ".jpg";
            }
            else {
                req.body.imagen = "https://randomuser.me/api/portraits/women/" + getRandomInt() + ".jpg";
            }
        } */

        req.body.nombre = req.body.nombre.toUpperCase();
        req.body.apellidos = req.body.apellidos.toUpperCase();
        jObject.nombre = req.body.nombre;
        jObject.apellidos = req.body.apellidos;
        jObject.email = req.body.email;
        jObject.sexo = req.body.sexo;
        jObject.password = req.body.password;
        jObject.fecha = req.body.fecha;
        if (req.body.imagen) {
            jObject.imagen = req.body.imagen;
        }
        else {
            jObject.imagen = users.find(item => item.uid == jObject.uid).imagen;
        }
        users[jObject.uid - 1] = jObject;
        fs.writeFile("../DATABASE/users.json", JSON.stringify(users), "utf8", (error) => {
            if (error)
                console.log(error);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync("../DATABASE/users.json", "utf8"));
            }
        });
        res.status(200);
        res.send('El usuario fue modificado con exito');
        return;
    });
});

app.delete("/api/users/:uid", (req, res) => {

    fs.readFile("../DATABASE/users.json", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        let users = JSON.parse(data);
        let index = users.findIndex(item => item.uid == req.params.uid);
        if (index != -1) {
            users.splice(index, 1);
            res.status(200);
            res.send('Usuario eliminado');
            fs.writeFile("../DATABASE/users.json", JSON.stringify(users), "utf8", (error) => {
                if (error)
                    console.log(error);
                else {
                    console.log("File written successfully\n");
                    console.log("The written has the following contents:");
                    console.log(fs.readFileSync("../DATABASE/users.json", "utf8"));
                }
            });
            return;
        }
        res.status(404);
        res.send("El usuario no existe");
    });
});

app.listen(port, () => {
    console.log("aplicacion de ejemplo corriendo en puerto " + port);
});