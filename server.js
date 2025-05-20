// server.js (CommonJS)
const express = require("express");
const path    = require("path");

const app = express();
const port = process.env.PORT || 5000;

// Sirve todos los archivos estáticos (index.html, CSS, JS, imágenes)
app.use(express.static(path.resolve(__dirname, "./")));

// Para cualquier otra ruta, devuelve index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
