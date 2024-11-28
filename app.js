const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

// Clave secreta para firmar tokens (cámbiala en producción)
const SECRET_KEY = 'claveSecreta';

app.use(express.json());

// Funciones para leer y escribir el archivo JSON
const readTeam = () => {
    const data = fs.readFileSync('./integrantes.json', 'utf-8');
    return JSON.parse(data);
};

const writeTeam = (data) => {
    fs.writeFileSync('./integrantes.json', JSON.stringify(data, null, 2));
};

// Middleware para verificar tokens
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Formato esperado: "Bearer <token>"
    if (!token) {
        return res.status(403).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido o expirado' });
        }
        req.user = decoded; // Almacena los datos del token decodificado
        next();
    });
};

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡La API funciona correctamente!');
});

// Ruta de login para generar un token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    //  Autenticación 
    if (username === 'admin' && password === '1234') {
        const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ message: 'Autenticación exitosa', token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});

// obtener integrantes (requiere token)
app.get('/integrantes', verifyToken, (req, res) => {
    const integrantes = readTeam();
    res.json(integrantes);
});

// buscar un integrante por DNI (requiere token)
app.get('/integrantes/:dni', verifyToken, (req, res) => {
    const { dni } = req.params;
    const integrantes = readTeam();
    const integrante = integrantes.find((i) => i.dni === dni);

    res.status(integrante ? 200 : 404).json(integrante || { error: 'No existe el integrante que buscó con ese DNI' });
});

// agregar un integrante (sin token)
app.post('/integrantes/agregar', (req, res) => {
    const { nombre, apellido, dni, email } = req.body;
    const integrantes = readTeam();
    if (!nombre || !apellido || !dni || !email) {
        return res.status(400).json({ error: 'Faltan datos a ingresar' });
    }
    integrantes.push({ nombre, apellido, dni, email });
    writeTeam(integrantes);
    res.status(201).json(integrantes);
});

// actualizar un integrante (requiere token)
app.put('/integrantes/:email', verifyToken, (req, res) => {
    const { email } = req.params;
    const { apellido } = req.body;
    const integrantes = readTeam();
    const integrante = integrantes.find((i) => i.email === email);

    if (integrante) {
        integrante.apellido = apellido;
        writeTeam(integrantes);
        res.json({ message: 'Apellido actualizado', integrante });
    } else {
        res.status(404).json({ error: 'No se encontró al integrante con ese email' });
    }
});

// eliminar un integrante (requiere token)
app.delete('/integrantes/:dni', verifyToken, (req, res) => {
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

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
