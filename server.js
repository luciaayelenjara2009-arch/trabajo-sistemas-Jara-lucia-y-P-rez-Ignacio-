const express = require('express');
const sqlite3 = require('sqlite3').verbose(); 
const path = require('path');

const app = express();
const PORT = 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));


const db = new sqlite3.Database('./escuela.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a SQLite mediante el conector.');
    
        db.run(`CREATE TABLE IF NOT EXISTS cuotas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            alumno TEXT NOT NULL,
            mes TEXT NOT NULL,
            monto REAL NOT NULL
        )`);
    }
});


app.post('/pagos', (req, res) => {
    const { alumno, mes, monto } = req.body;
    const sql = `INSERT INTO cuotas (alumno, mes, monto) VALUES (?, ?, ?)`;
    

    db.run(sql, [alumno, mes, monto], function(err) {
        if (err) {
            return res.status(500).send("Hubo un error al guardar en la base de datos.");
        }
        
        res.send(`
            <h2 style="font-family: Arial; text-align: center; margin-top: 50px;">
                ¡Pago de $${monto} correspondiente a ${mes} registrado exitosamente para ${alumno}!
            </h2>
            <div style="text-align: center;">
                <a href="/" style="text-decoration: none; color: blue;">Volver al formulario</a> | 
                <a href="/ver-pagos" style="text-decoration: none; color: green;">Ver todos los pagos (Extraer info)</a>
            </div>
        `);
    });
});


app.get('/ver-pagos', (req, res) => {
    const sql = `SELECT * FROM cuotas`;
    
    
    db.all(sql, [], (err, filas) => {
        if (err) {
            return res.status(500).send("Error al consultar la base de datos.");
        }
        
        res.json(filas);
    });
});


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});