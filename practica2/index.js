const express = require('express');
const app = express();

const db = require('./db');

app.use(express.json());

/* ===================================
   PREGUNTA 1
   POST /categorias
   Registrar una nueva categoría
=================================== */

app.post('/categorias', (req, res) => {

    const { nombre, descripcion } = req.body;

    const sql =
        'INSERT INTO categorias(nombre, descripcion) VALUES (?, ?)';

    db.query(sql, [nombre, descripcion], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.status(201).json({
            mensaje: 'Categoría creada',
            id: result.insertId
        });

    });

});

/* ===================================
   PREGUNTA 2
   GET /categorias
   Mostrar todas las categorías
=================================== */

app.get('/categorias', (req, res) => {

    const sql = 'SELECT * FROM categorias';

    db.query(sql, (err, rows) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);

    });

});

/* ===================================
   PREGUNTA 3
   GET /categorias/:id
   Mostrar una categoría y sus productos
=================================== */

app.get('/categorias/:id', (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            c.id,
            c.nombre,
            c.descripcion,
            p.id AS productoId,
            p.nombre AS producto,
            p.precio
        FROM categorias c
        LEFT JOIN productos p
        ON c.id = p.categoriaId
        WHERE c.id = ?
    `;

    db.query(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(rows);

    });

});

/* ===================================
   PREGUNTA 4
   PATCH /categorias/:id
   Actualizar una categoría
=================================== */

app.patch('/categorias/:id', (req, res) => {

    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const sql = `
        UPDATE categorias
        SET nombre = ?,
            descripcion = ?,
            updatedAt = NOW()
        WHERE id = ?
    `;

    db.query(sql, [nombre, descripcion, id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            mensaje: 'Categoría actualizada'
        });

    });

});

/* ===================================
   PREGUNTA 5
   DELETE /categorias/:id
   Eliminar categoría y sus productos
=================================== */

app.delete('/categorias/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM categorias WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            mensaje: 'Categoría eliminada'
        });

    });

});

app.listen(3000, () => {
    console.log('Servidor ejecutándose en puerto 3000');
});