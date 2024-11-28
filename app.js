const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'claveSecreta123';

app.use(express.json());


const readTeam = () => {
    const data = fs.readFileSync('./integrantes.json', 'utf-8');
    return JSON.parse(data);
};

const writeTeam = (data) => {
    fs.writeFileSync('./integrantes.json', JSON.stringify(data, null, 2));
};


app.get('/', (req, res) => {
    res.send('¡La API funciona correctamente!');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

app.get('/integrantes', (req, res) => {
    const integrantes = readTeam();
    res.json(integrantes);
});


app.get('/integrantes/:dni', (req, res) => {
    const { dni } = req.params;
    const integrantes = readTeam();
    const integrante = integrantes.find((i) => i.dni === dni);

    res.status(integrante ? 200 : 404).json(integrante || { error: 'No existe el integrante que buscó con ese nombre' });

});


app.post('/integrantes/agregar', (req, res) => {
    const { nombre, apellido, dni, email } = req.body;
	const integrantes = readTeam();
    !nombre || !apellido || !dni || !email
        ? res.status(400).json({ error: 'Faltan datos a ingresar' })
        : (integrantes.push({ nombre, apellido, dni, email }), writeTeam(integrantes), res.status(201).json(integrantes));
});



app.put('/integrantes/:email', (req, res) => {
    const { email } = req.params;
    const { apellido } = req.body;
    const integrantes = readTeam();
    const integrante = integrantes.find((i) => i.email === email);

    integrante 
    ? (integrante.apellido = apellido, writeTeam(integrantes), res.json({ message: 'Apellido actualizado', integrante }))
    : res.status(404).json({ error: 'No se encontró al integrante que responda a esos datos' });

});


app.delete('/integrantes/:dni', (req, res) => {
    const { dni } = req.params;
    let integrantes = readTeam();
    const integrante = integrantes.find((i) => i.dni === dni);

    if (integrante) {
        integrantes = integrantes.filter((i) => i.dni !== dni);
        writeTeam(integrantes);
        res.json(integrantes);
    } else {
        res.status(404).json({ error: 'No se ha encontrado al integrante' });
    }
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
