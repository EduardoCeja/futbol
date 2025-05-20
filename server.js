// server.js
import express from "express";
import path from "path";

const app = express();
const port = process.env.PORT || 5000;

// Sirve todos los archivos estáticos (index.html, CSS, JS, imágenes)
app.use(express.static(path.resolve("./")));

// En cualquier otra ruta, devuelve index.html (para que funcione tu SPA)
app.get("*", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
