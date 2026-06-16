const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  express.static(
    path.join(__dirname, "../frontend")
  )
);

const routes = require("./routes");

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Servidor rodando na porta ${PORT}`
  );

});

const db = require("./db");

db.query("SELECT NOW()")
  .then(() => console.log("Banco conectado!"))
  .catch(err =>
    console.error(
      "Erro no banco:",
      err
    )
  );