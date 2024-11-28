const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');

// Clave secreta para firmar tokens (cámbiala en producción)
const SECRET_KEY = 'claveSecreta';

// URI para conectarse con la bd
const MONGO_URI = "mongodb+srv://lucas96aj:456123@cluster0.9wgyg.mongodb.net/TPFinalDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {})
.then(() => console.log('Conexión exitosa a MongoDB Atlas'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

//Modelado de datos
const integranteSchema = new mongoose.Schema({
    nombre: String,
    apellido: String,
    dni: String,
    email: String,
});

const Integrante = mongoose.model('integrante', integranteSchema);

app.use(express.json());


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
app.get('/integrantes', verifyToken, async (req, res) => {
    const integrantes = await Integrante.find();
    res.json(integrantes);
});

// buscar un integrante por DNI (requiere token)
app.get('/integrantes/:dni', verifyToken, async (req, res) => {
    const integrante = await Integrante.findOne({ dni: req.params.dni });
    integrante
        ? res.json(integrante)
        : res.status(404).json({ error: 'No existe el integrante con ese DNI' });
});

// agregar un integrante (sin token)
app.post('/integrantes/agregar', async (req, res) => {
    const { nombre, apellido, dni, email } = req.body;
    if (!nombre || !apellido || !dni || !email) {
        return res.status(400).json({ error: 'Faltan datos a ingresar' });
    }
    const nuevoIntegrante = new Integrante({ nombre, apellido, dni, email });
    await nuevoIntegrante.save();
    res.status(201).json(nuevoIntegrante);
});

// actualizar un integrante (requiere token)
app.put('/integrantes/:email', verifyToken, async (req, res) => {
    const { apellido } = req.body;
    const integrante = await Integrante.findOneAndUpdate(
        { email: req.params.email },
        { apellido },
        { new: true }
    );
    integrante
        ? res.json({ message: 'Apellido actualizado', integrante })
        : res.status(404).json({ error: 'No se encontró al integrante con ese email' });
});
// eliminar un integrante (requiere token)
app.delete('/integrantes/:dni', verifyToken, async (req, res) => {
    const integrante = await Integrante.findOneAndDelete({ dni: req.params.dni });
    integrante
        ? res.json({ message: 'Integrante eliminado', integrante })
        : res.status(404).json({ error: 'No se encontró al integrante con ese DNI' });
});

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
