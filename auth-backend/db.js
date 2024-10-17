const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Configuración de la conexión
const connection = mysql.createConnection({
    host: 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com',
    port: '3333',
    user: 'darkigames', 
    password: 'Jioska1290', 
    database: 'db_johnnyomar_001ed',
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(path.resolve(__dirname, 'singlestore_bundle.pem')), // Asegúrate de tener bundle.pem este archivo
    },
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a SingleStore');
});

module.exports = connection;
