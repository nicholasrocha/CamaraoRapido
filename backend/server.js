const express = require('express');

const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const path = require("path");

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

const routes = require('./routes');

app.use(routes);

app.listen(3000, () => {

  console.log("Servidor rodando em http://localhost:3000");

});

const db = require('./db');

db.query('SELECT NOW()')
  .then(() => console.log("Banco conectado!"))
  .catch(err => console.error("Erro no banco:", err));