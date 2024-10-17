// index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();

// Middleware para parsear el cuerpo de las peticiones
app.use(express.json());

// Configuracion CORS para permitir el acceso desde tu frontend
app.use(cors({
    origin: 'http://localhost:4200', // Permitir acceso solo desde este origen del frontend
    methods: ['GET', 'POST'], // Métodos permitidos
    credentials: true // Permitir cookies, si es necesario
}));

// Ruta de registro de usuario
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // Aqui se puede insertar el usuario en la base de datos sin encriptar la contraseña
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).send('El nombre de usuario ya existe');
            }
            console.error(err);
            return res.status(500).send('Error al registrar el usuario');
        }

        res.status(201).send('Usuario registrado con éxito');
    });
});

// Ruta de inicio de sesión
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // Buscar el usuario en la base de datos
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) return res.status(500).send('Error al buscar el usuario');
        if (results.length === 0) return res.status(400).send('Usuario o contraseña incorrecta');

        const user = results[0];

        // Aqui se Verifica si la contraseña coincide (en texto plano)
        if (password !== user.password) {
            return res.status(400).send('Usuario o contraseña incorrecta');
        }

        // Generar un token JWT temporal si la contraseña es correcta
        const token = jwt.sign({ userId: user.id }, 'secreto', { expiresIn: '1h' });
        res.json({ token });
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
