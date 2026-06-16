const express = require("express");

const router = express.Router();

const pool = require("./db");


// CADASTRO

router.post('/cadastro', async (req, res) => {

  try{

    const {
      nome,
      email,
      cpf,
      celular,
      senha,
      tipo_usuario
    } = req.body;

    if(
  !nome ||
  !email ||
  !cpf ||
  !celular ||
  !senha
){

  return res.status(400).json({
    sucesso:false,
    erro:"Preencha todos os campos"
  });

}

  if(nome.length > 100){

  return res.status(400).json({
    erro:"Nome muito grande"
  });

}

if(email.length > 150){

  return res.status(400).json({
    erro:"Email muito grande"
  });

}

if(senha.length < 6){

  return res.status(400).json({
    erro:"Senha deve ter no mínimo 6 caracteres"
  });

}

if(senha.length > 50){

  return res.status(400).json({
    erro:"Senha muito grande"
  });

}

const cpfLimpo =
cpf.replace(/\D/g,'');

if(cpfLimpo.length !== 11){

  return res.status(400).json({
    erro:"CPF inválido"
  });

}

const celularLimpo =
celular.replace(/\D/g,'');

if(celularLimpo.length < 10){

  return res.status(400).json({
    erro:"Celular inválido"
  });

}

    const emailExistente =
await pool.query(

  `
  SELECT id
  FROM usuarios
  WHERE email = $1
  `,

  [email]

);

if(emailExistente.rows.length > 0){

  return res.status(400).json({
    sucesso:false,
    erro:"E-mail já cadastrado"
  });

}

const cpfExistente =
await pool.query(

  `
  SELECT id
  FROM usuarios
  WHERE cpf = $1
  `,

  [cpf]

);

if(cpfExistente.rows.length > 0){

  return res.status(400).json({
    sucesso:false,
    erro:"CPF já cadastrado"
  });



      const cpfExistente = await pool.query(
  `
  SELECT id
  FROM usuarios
  WHERE cpf = $1
  `,
  [cpf]
);

if(cpfExistente.rows.length > 0){

  return res.status(400).json({
    sucesso:false,
    erro:"CPF já cadastrado"
  });

}
    }

    await pool.query(

      `
      INSERT INTO usuarios
      (nome, email, cpf, celular, senha, tipo_usuario)

      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [nome, email, cpf, celular, senha, tipo_usuario]

    );

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      sucesso:false
    });

  }

});


// LOGIN

      router.post('/login', async (req, res) => {

  try{

    const { email, senha } = req.body;
    if(!email || !senha){

  return res.status(400).json({

    sucesso:false,

    erro:"Preencha email e senha"

  });

}

    // ADMIN

    if(
      email === "admin@camaraorapido.com" &&
      senha === "123456"
    ){

      return res.json({
        sucesso:true,
        admin:true
      });

    }

    // USUÁRIO NORMAL

    const result = await pool.query(

      `
      SELECT *
      FROM usuarios
      WHERE email=$1
      AND senha=$2
      `,
      [email, senha]

    );

    if(result.rows.length > 0){

      res.json({

        sucesso:true,

        usuario:result.rows[0]

      });

    }else{

      res.json({

        sucesso:false,

        erro:"Email ou senha inválidos"

      });

    }

  }catch(erro){

    console.log(erro);

    res.status(500).json({

      sucesso:false,

      erro:"Erro no servidor"

    });

  }

});


// LISTAR PRODUTOS

router.get('/produtos', async (req, res) => {

  try{

    const { gramatura, agua, tipo } = req.query;

    let query = 'SELECT * FROM produtos WHERE 1=1';

    let values = [];

    if (gramatura) {

      values.push(gramatura);

      query += ` AND gramatura = $${values.length}`;

    }

    if (agua) {

      values.push(agua);

      query += ` AND tipo_agua = $${values.length}`;

    }

    if (tipo) {

      values.push(tipo);

      query += ` AND tipo_produto = $${values.length}`;

    }

    const result = await pool.query(query, values);

    res.json(result.rows);

  }catch(erro){

    console.log(erro);

  }

});


// CADASTRAR PRODUTO

router.post('/produtos', async (req, res) => {

  try {

    const {
      gramatura,
      tipo_agua,
      tipo_produto,
      preco_kg,
      quantidade_disponivel,
      usuario_id
    } = req.body;

    if(Number(gramatura) > 60){

  return res.status(400).json({
    erro:"Gramatura máxima: 60g"
  });

}

if(Number(preco_kg) > 200){

  return res.status(400).json({
    erro:"Preço máximo: R$ 200/kg"
  });

}

if(Number(quantidade_disponivel) > 10000){

  return res.status(400).json({
    erro:"Quantidade máxima: 10.000kg"
  });

}

    const usuario = await pool.query(
      `
      SELECT *
      FROM usuarios
      WHERE id = $1
      `,
      [usuario_id]
    );

    if (
      usuario.rows.length === 0
    ) {

      return res.status(403).json({
        erro: "Usuário inválido"
      });

    }

    if (
      usuario.rows[0].tipo_usuario !==
      "produtor"
    ) {

      return res.status(403).json({
        erro:
          "Somente produtores podem cadastrar produtos"
      });

    }

    await pool.query(
  `
  INSERT INTO produtos
  (
    gramatura,
    tipo_agua,
    tipo_produto,
    preco_kg,
    quantidade_disponivel,
    usuario_id
  )
  VALUES
  ($1,$2,$3,$4,$5,$6)
  `,
  [
    gramatura,
    tipo_agua,
    tipo_produto,
    preco_kg,
    quantidade_disponivel,
    usuario_id
  ]
);

    res.json({
      sucesso: true
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro interno"
    });

  }

});


// MEUS PRODUTOS

router.get('/meus-produtos/:id', async (req,res)=>{

  try{

    const { id } = req.params;

    const result = await pool.query(

      `
      SELECT *
      FROM produtos
      WHERE usuario_id = $1
      ORDER BY id DESC
      `,
      [id]

    );

    res.json(result.rows);

  }catch(erro){

    console.log("Erro ao listar produtos:");

    console.log(erro);

    res.status(500).json({
      erro:"Erro no servidor"
    });

  }

});


// REMOVER PRODUTO

router.delete('/produtos/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const { usuario_id } = req.body;

    const produto = await pool.query(
      `
      SELECT *
      FROM produtos
      WHERE id = $1
      `,
      [id]
    );

    if (
      produto.rows.length === 0
    ) {

      return res.status(404).json({
        erro: "Produto não encontrado"
      });

    }

    if (
      produto.rows[0].usuario_id !=
      usuario_id
    ) {

      return res.status(403).json({
        erro:
          "Você não pode remover este produto"
      });

    }

    await pool.query(
      `
      DELETE FROM produtos
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      sucesso: true
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro interno"
    });

  }

});


// EDITAR PRODUTO

router.put('/produtos/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const {
      gramatura,
      tipo_agua,
      tipo_produto,
      preco_kg,
      quantidade_disponivel,
      usuario_id
    } = req.body;

    if(Number(gramatura) > 60){

  return res.status(400).json({
    erro:"Gramatura máxima: 60g"
  });

}

if(Number(preco_kg) > 200){

  return res.status(400).json({
    erro:"Preço máximo: R$ 200/kg"
  });

}

if(Number(quantidade_disponivel) > 10000){

  return res.status(400).json({
    erro:"Quantidade máxima: 10.000kg"
  });

}

    const produto = await pool.query(
      `
      SELECT *
      FROM produtos
      WHERE id = $1
      `,
      [id]
    );

    if (
      produto.rows.length === 0
    ) {

      return res.status(404).json({
        erro: "Produto não encontrado"
      });

    }

    if (
      produto.rows[0].usuario_id !=
      usuario_id
    ) {

      return res.status(403).json({
        erro:
          "Você não pode editar este produto"
      });

    }

    await pool.query(
      `
      UPDATE produtos
      SET
      gramatura=$1,
      tipo_agua=$2,
      tipo_produto=$3,
      preco_kg=$4,
      quantidade_disponivel=$5
      WHERE id=$6
      `,
      [
        gramatura,
        tipo_agua,
        tipo_produto,
        preco_kg,
        quantidade_disponivel,
        id
      ]
    );

    res.json({
      sucesso: true
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro interno"
    });

  }

});


// LISTAR GRAMATURAS

router.get('/gramaturas', async (req, res) => {

  try{

    const result = await pool.query(

      `
      SELECT DISTINCT gramatura
      FROM produtos
      ORDER BY gramatura
      `

    );

    res.json(result.rows);

  }catch(erro){

    console.log(erro);

  }

});

// =========================
// ADICIONAR AO CARRINHO
// =========================

router.post('/carrinho', async (req, res) => {

  try{

    const {
      usuario_id,
      produto_id,
      quantidade_disponivel,
      valor_total
    } = req.body;

    await pool.query(

      `
      INSERT INTO pedidos
      (
        usuario_id,
        produto_id,
        quantidade_disponivel,
        valor_total
      )

      VALUES ($1,$2,$3,$4)
      `,

      [
        usuario_id,
        produto_id,
        quantidade_disponivel,
        valor_total
      ]

    );

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      sucesso:false
    });

  }

});

// =========================
// LISTAR CARRINHO
// =========================

router.get('/carrinho/:id', async (req, res) => {

  try{

    const { id } = req.params;

    const result = await pool.query(

      `
      SELECT

      pedidos.id,
      pedidos.quantidade_disponivel,
      pedidos.valor_total,
      pedidos.status,

      produtos.gramatura,
      produtos.tipo_agua,
      produtos.tipo_produto,
      produtos.preco_kg

      FROM pedidos

      JOIN produtos
      ON produtos.id = pedidos.produto_id

      WHERE pedidos.usuario_id = $1

      ORDER BY pedidos.id DESC
      `,

      [id]

    );

    res.json(result.rows);

  }catch(erro){

    console.log(erro);

  }

});

// =========================
// REMOVER ITEM
// =========================

router.delete('/carrinho/:id', async (req, res) => {

  try{

    const { id } = req.params;

    await pool.query(

      'DELETE FROM pedidos WHERE id = $1',

      [id]

    );

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

  }

});

router.post("/finalizar-compra", async (req,res)=>{

  try{

    const { itens } = req.body;

    for(const item of itens){

      await pool.query(
        `
        UPDATE produtos
        SET quantidade_disponivel =
        quantidade_disponivel - $1
        WHERE id = $2
        `,
        [
          item.quantidade,
          item.id
        ]
      );

    }

    await pool.query(`
      DELETE FROM produtos
      WHERE quantidade_disponivel <= 0
    `);

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      erro:"Erro interno"
    });

  }

});

router.get("/admin/dashboard", async(req,res)=>{

  try{

    const usuarios =
      await pool.query(
        "SELECT COUNT(*) FROM usuarios"
      );

    const produtos =
      await pool.query(
        "SELECT COUNT(*) FROM produtos"
      );

    const kg =
      await pool.query(
        `
        SELECT
        COALESCE(
        SUM(quantidade_disponivel),
        0
        ) as total
        FROM produtos
        `
      );

    res.json({

      usuarios:
      usuarios.rows[0].count,

      produtos:
      produtos.rows[0].count,

      kg:
      kg.rows[0].total

    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      erro:true
    });

  }

});

router.get(
  "/admin/usuarios",
  async(req,res)=>{

    const result =
    await pool.query(
      `
      SELECT *
      FROM usuarios
      ORDER BY id DESC
      `
    );

    res.json(result.rows);

  }
);

router.get(
  "/admin/produtos",
  async(req,res)=>{

    const result =
    await pool.query(
      `
      SELECT *
      FROM produtos
      ORDER BY id DESC
      `
    );

    res.json(result.rows);

  }
);

router.delete(
  "/admin/usuarios/:id",
  async(req,res)=>{

    const { id } =
    req.params;

    await pool.query(
      `
      DELETE FROM usuarios
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      sucesso:true
    });

  }
);

router.delete(
  "/admin/produtos/:id",
  async(req,res)=>{

    const { id } =
    req.params;

    await pool.query(
      `
      DELETE FROM produtos
      WHERE id=$1
      `,
      [id]
    );

    res.json({
      sucesso:true
    });

  }
);

router.put(
"/admin/produtos/:id",
async(req,res)=>{

  try{

    const {
      gramatura,
      preco_kg,
      quantidade_disponivel
    } = req.body;

    await pool.query(

      `
      UPDATE produtos
      SET

      gramatura = $1,
      preco_kg = $2,
      quantidade_disponivel = $3

      WHERE id = $4
      `,

      [

        gramatura,
        preco_kg,
        quantidade_disponivel,
        req.params.id

      ]

    );

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      erro:"Erro interno"
    });

  }

});

router.put(
"/admin/usuarios/:id",
async(req,res)=>{

  try{

    const {
      nome,
      email,
      celular
    } = req.body;

    await pool.query(

      `
      UPDATE usuarios
      SET

      nome = $1,
      email = $2,
      celular = $3

      WHERE id = $4
      `,

      [
        nome,
        email,
        celular,
        req.params.id
      ]

    );

    res.json({
      sucesso:true
    });

  }catch(erro){

    console.log(erro);

    res.status(500).json({
      erro:"Erro interno"
    });

  }

});

router.put(
  "/usuarios/:id",
  async (req,res)=>{

    const { id } = req.params;

    const {

      nome,
      email,
      cpf,
      celular,
      tipo_usuario

    } = req.body;

    await pool.query(

      `
      UPDATE usuarios
      SET

      nome=$1,
      email=$2,
      cpf=$3,
      celular=$4,
      tipo_usuario=$5

      WHERE id=$6
      `,

      [

        nome,
        email,
        cpf,
        celular,
        tipo_usuario,
        id

      ]

    );

    res.json({
      sucesso:true
    });

  }
);

router.get(
  "/usuarios",
  async (req,res)=>{

    try{

      const resultado =
        await pool.query(
          `
          SELECT *
          FROM usuarios
          ORDER BY id
          `
        );

      res.json(
        resultado.rows
      );

    }catch(erro){

      console.log(erro);

      res.status(500).json({
        erro:"Erro ao buscar usuários"
      });

    }

  }
);

router.put(
  "/produtos/:id",
  async (req,res)=>{

    const { id } = req.params;

    const {

      gramatura,
      tipo_agua,
      tipo_produto,
      preco_kg,
      quantidade_disponivel

    } = req.body;

    await pool.query(

      `
      UPDATE produtos
      SET

      gramatura = $1,
      tipo_agua = $2,
      tipo_produto = $3,
      preco_kg = $4,
      quantidade_disponivel = $5

      WHERE id = $6
      `,

      [

        gramatura,
        tipo_agua,
        tipo_produto,
        preco_kg,
        quantidade_disponivel,
        id

      ]

    );

    res.json({
      sucesso:true
    });

  }
);

module.exports = router;