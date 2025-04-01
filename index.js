const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 🌍 Middleware para permitir peticiones desde cualquier origen
app.use(cors());

// 🏠 Ruta principal
app.get('/', (req, res) => {
  res.send('🔥 API ISMERELY funcionando. Usa /productos o /buscar?q=palabra para acceder a los datos.');
});

// 📦 Ruta para acceder a toda la base de datos completa
app.get('/productos', (req, res) => {
  fs.readFile(path.join(__dirname, 'output.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });

    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (error) {
      res.status(500).json({ error: 'Error al parsear el archivo JSON' });
    }
  });
});

// 🔍 Ruta para buscar por enfermedad, ingrediente o beneficio
app.get('/buscar', (req, res) => {
  const query = req.query.q?.toLowerCase();

  fs.readFile(path.join(__dirname, 'output.json'), 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'No se pudo leer el archivo' });

    try {
      const productos = JSON.parse(data);
      const resultados = productos.filter((p) => {
        return JSON.stringify(p).toLowerCase().includes(query);
      });

      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'Error al parsear el archivo JSON' });
    }
  });
});

// 📄 Ruta para servir el OpenAPI JSON
app.get('/openapi.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'openapi.json'));
});

// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`✅ API ISMERELY corriendo en http://localhost:${port}`);
});
