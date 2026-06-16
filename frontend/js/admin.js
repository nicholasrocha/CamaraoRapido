const API =
"http://localhost:3000";

if(
  localStorage.getItem("admin")
  !== "true"
){

  window.location.href =
  "login.html";

}

async function carregarDashboard(){

  const res =
  await fetch(
    API +
    "/admin/dashboard"
  );

  const dados =
  await res.json();

  document
  .getElementById("conteudo")
  .innerHTML = `

    <div class="card">

      <h2>
      Dashboard
      </h2>

      <p>
      Usuários:
      ${dados.usuarios}
      </p>

      <p>
      Produtos:
      ${dados.produtos}
      </p>

      <p>
      Kg disponíveis:
      ${dados.kg}
      </p>

    </div>

  `;

}

async function carregarUsuarios(){

  const res =
  await fetch(
    API +
    "/admin/usuarios"
  );

  const usuarios =
  await res.json();

  document
    .getElementById("conteudo")
    .innerHTML = `

    <div class="produtos">

    ${usuarios.map(
  u=>`

  <div class="card">

    <h3>
    ${u.nome}
    </h3>

    <p>
    ${u.email}
    </p>

    <p>
    ${u.cpf}
    </p>

    <p>
    ${u.celular}
    </p>

    <div class="acoes">

      <button
      class="btnEditar"
      onclick="
      editarUsuario(${u.id})
      ">
        Editar
      </button>

      <button
      class="btnRemover"
      onclick="
      excluirUsuario(${u.id})
      ">
        Excluir
      </button>

    </div>

  </div>

  `
  ).join("")}

  </div>
  `;

}

async function excluirUsuario(id){

  if(
    !confirm(
      "Excluir usuário?"
    )
  ) return;

  await fetch(

    API +
    "/admin/usuarios/" +
    id,

    {
      method:"DELETE"
    }

  );

  carregarUsuarios();

}

async function carregarProdutos(){

  const res =
  await fetch(
    API +
    "/admin/produtos"
  );

  const produtos =
  await res.json();

  document
    .getElementById("conteudo")
    .innerHTML = `

    <div class="produtos">

    ${produtos.map(
  p=>`

  <div class="card">

    <h3>
    ${p.gramatura}g
    </h3>

    <p>
    ${p.tipo_produto}
    </p>

    <p>
    ${p.tipo_agua}
    </p>

    <p>
    R$
    ${p.preco_kg}
    </p>

    <p>
    ${p.quantidade_disponivel}kg
    </p>

    <div class="acoes">

      <button
      class="btnEditar"
      onclick="
      editarProdutoAdmin(${p.id})
      ">
        Editar
      </button>

      <button
      class="btnRemover"
      onclick="
      excluirProduto(${p.id})
      ">
        Excluir
      </button>

    </div>

  </div>

  `
    ).join("")}

  </div>
  `;

}

async function excluirProduto(id){

  if(
    !confirm(
      "Excluir produto?"
    )
  ) return;

  await fetch(

    API +
    "/admin/produtos/" +
    id,

    {
      method:"DELETE"
    }

  );

  carregarProdutos();

}

async function editarProdutoAdmin(id){

  const res = await fetch(
    API + "/admin/produtos"
  );

  const produtos = await res.json();

  const produto = produtos.find(
    p => p.id == id
  );

  if(!produto){
    return;
  }

  document.getElementById(
    "conteudo"
  ).innerHTML = `

    <div class="card">

      <h2>
        Editar Produto
      </h2>

      <input
        id="editGramatura"
        value="${produto.gramatura}"
      >

      <input
        id="editTipoProduto"
        value="${produto.tipo_produto}"
      >

      <input
        id="editTipoAgua"
        value="${produto.tipo_agua}"
      >

      <input
        id="editPreco"
        type="number"
        value="${produto.preco_kg}"
      >

      <input
        id="editQuantidade"
        type="number"
        value="${produto.quantidade_disponivel}"
      >

      <div class="acoes">

        <button
          class="btnEditar"
          onclick="
          salvarEdicaoProduto(${id})
          "
        >
          Salvar
        </button>

        <button
          class="btnRemover"
          onclick="
          carregarProdutos()
          "
        >
          Cancelar
        </button>

      </div>

    </div>

  `;
}

function logoutAdmin(){

  localStorage.removeItem(
    "admin"
  );

  window.location.href =
  "login.html";

}

async function editarUsuario(id){

  const res = await fetch(
    API + "/usuarios"
  );

  const usuarios = await res.json();

  const usuario = usuarios.find(
    u => Number(u.id) === Number(id)
  );

  if(!usuario){
    return;
  }

  document.getElementById(
    "editarUsuarioId"
  ).value = usuario.id;

  document.getElementById(
    "editarNome"
  ).value = usuario.nome;

  document.getElementById(
    "editarEmail"
  ).value = usuario.email;

  document.getElementById(
    "editarCpf"
  ).value = usuario.cpf || "";

  document.getElementById(
    "editarCelular"
  ).value = usuario.celular || "";

  document.getElementById(
    "editarTipo"
  ).value = usuario.tipo_usuario;

  document.getElementById(
    "modalUsuario"
  ).style.display = "flex";

}

function fecharModalUsuario(){

  document.getElementById(
    "modalUsuario"
  ).style.display = "none";

}

async function salvarUsuario(){

  const id =
    document.getElementById(
      "editarUsuarioId"
    ).value;

  await fetch(

    API + "/usuarios/" + id,

    {

      method:"PUT",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        nome:
        document.getElementById(
          "editarNome"
        ).value,

        email:
        document.getElementById(
          "editarEmail"
        ).value,

        cpf:
        document.getElementById(
          "editarCpf"
        ).value,

        celular:
        document.getElementById(
          "editarCelular"
        ).value,

        tipo_usuario:
        document.getElementById(
          "editarTipo"
        ).value

      })

    }

  );

  fecharModalUsuario();

  carregarUsuarios();

}
async function salvarEdicaoProduto(id){

  const gramatura =
    document.getElementById(
      "editGramatura"
    ).value;

  const tipo_produto =
    document.getElementById(
      "editTipoProduto"
    ).value;

  const tipo_agua =
    document.getElementById(
      "editTipoAgua"
    ).value;

  const preco_kg =
    document.getElementById(
      "editPreco"
    ).value;

  const quantidade_disponivel =
    document.getElementById(
      "editQuantidade"
    ).value;

  const resposta = await fetch(

    API +
    "/admin/produtos/" +
    id,

    {

      method:"PUT",

      headers:{
        "Content-Type":
        "application/json"
      },

      body:JSON.stringify({

        gramatura,
        tipo_produto,
        tipo_agua,
        preco_kg,
        quantidade_disponivel

      })

    }

  );

  const dados =
    await resposta.json();

  if(dados.sucesso){

    alert(
      "Produto atualizado!"
    );

    carregarProdutos();

  }else{

    alert(
      "Erro ao atualizar produto."
    );

  }

}

carregarDashboard();