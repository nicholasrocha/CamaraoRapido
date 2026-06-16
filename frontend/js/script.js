const API = "";

let produtoEditando = null;

// =========================
// USUÁRIO
// =========================

const usuario = JSON.parse(
  localStorage.getItem("usuario")
);

// =========================
// PROTEÇÃO ÁREA PRODUTOR
// =========================

if (
  window.location.pathname.includes("produtor.html")
) {

  if (!usuario) {

    alert("Faça login primeiro.");

    window.location.href = "login.html";

  } else if (
    usuario.tipo_usuario !== "produtor"
  ) {

    alert(
      "Você está cadastrado como comprador e não pode acessar esta área."
    );

    window.location.href = "index.html";

  }

}

// =========================
// NAVBAR
// =========================

const nav = document.querySelector("nav");

const btnCadastroHero =
  document.getElementById("btnCadastroHero");

const linkLogin =
  document.querySelector('a[href="login.html"]');

const linkCadastro =
  document.querySelector('a[href="cadastro.html"]');

const linkProdutor =
  document.getElementById("linkProdutor");

const linkCarrinho =
  document.querySelector('a[href="carrinho.html"]');

// =========================
// MENU
// =========================

if(nav){

  if(usuario){

    if(btnCadastroHero){
      btnCadastroHero.style.display = "none";
    }

    if(linkLogin){
      linkLogin.style.display = "none";
    }

    if(linkCadastro){
      linkCadastro.style.display = "none";
    }

    // PRODUTOR

    if(usuario.tipo_usuario === "produtor"){

      if(linkCarrinho){
        linkCarrinho.style.display = "none";
      }

    }

    // COMPRADOR

    else{

      if(linkProdutor){
        linkProdutor.style.display = "none";
      }

    }

    // BOTÃO SAIR

    const btnSair = document.createElement("a");

    btnSair.href = "#";

    btnSair.innerText = "Sair";

    btnSair.onclick = logout;

    nav.appendChild(btnSair);

  }else{

    if(linkProdutor){
      linkProdutor.style.display = "none";
    }

    if(linkCarrinho){
      linkCarrinho.style.display = "none";
    }

  }

}

// =========================
// LOGOUT
// =========================

function logout(e){

  e.preventDefault();

  localStorage.removeItem("usuario");

  window.location.href = "login.html";

}

// =========================
// CARREGAR PRODUTOS
// =========================

async function carregarProdutos(filtros = {}) {

  let url = API + "/produtos?";

  if(filtros.gramatura){
    url += `gramatura=${filtros.gramatura}&`;
  }

  if(filtros.agua){
    url += `agua=${filtros.agua}&`;
  }

  if(filtros.tipo){
    url += `tipo=${filtros.tipo}&`;
  }

  let produtos = [];

  try{

    const res = await fetch(url);

    produtos = await res.json();

  }catch(erro){

    console.log(erro);

    return;

  }

  const lista = document.getElementById("lista");

  if(!lista) return;

  lista.innerHTML = produtos.map(p => {

    const valorTotal = (
      p.preco_kg *
      p.quantidade_disponivel
    ).toFixed(2);

    let botao = "";

    // PRODUTOR

    if(
      usuario &&
      usuario.tipo_usuario === "produtor"
    ){

      if(p.usuario_id === usuario.id){

        botao = `
          <button onclick="window.location.href='produtor.html'">
            Ver meu produto
          </button>
        `;

      }

    }

    // COMPRADOR

    else if(
      usuario &&
      usuario.tipo_usuario === "comprador"
    ){

      botao = `

        <div class="areaCarrinho">

          <input
            type="number"
            min="1"
            max="${p.quantidade_disponivel}"
            placeholder="Kg"
            id="qtd-${p.id}"
            class="inputQtd"
          >

          <button
            type="button"
            onclick="addCarrinho(${p.id}, event)"
          >

            Adicionar

          </button>

        </div>

      `;

    }

    // NÃO LOGADO

    else{

      botao = `

        <a href="login.html">

          <button>

            Faça login para comprar

          </button>

        </a>

      `;

    }

    return `

      <div class="card">

        <div class="card-body">

          <h3>${p.gramatura}g</h3>

          <p class="infoProduto">

            ${p.tipo_agua} • ${p.tipo_produto}

          </p>

          <p class="quantidade">

            ${p.quantidade_disponivel}kg disponíveis

          </p>

          <div class="preco">

            R$ ${p.preco_kg}/kg

          </div>

          <p class="valorTotal">

            Valor total:
            R$ ${valorTotal}

          </p>

          ${botao}

        </div>

      </div>

    `;

  }).join("");

}

// =========================
// FILTRAR
// =========================

function filtrar(){

  const filtroGramatura =
    document.getElementById("filtroGramatura");

  const filtroAgua =
    document.getElementById("filtroAgua");

  const filtroTipo =
    document.getElementById("filtroTipo");

  carregarProdutos({

    gramatura: filtroGramatura.value,

    agua: filtroAgua.value,

    tipo: filtroTipo.value

  });

}

// =========================
// GRAMATURAS
// =========================

async function carregarGramaturas(){

  const res = await fetch(
    API + "/gramaturas"
  );

  const gramaturas = await res.json();

  const select =
    document.getElementById("filtroGramatura");

  if(!select) return;

  select.innerHTML =
    '<option value="">Gramatura</option>';

  gramaturas.forEach(g => {

    select.innerHTML += `

      <option value="${g.gramatura}">

        ${g.gramatura}g

      </option>

    `;

  });

}

// =========================
// CARRINHO
// =========================

async function addCarrinho(id, event){

  try{

    const botao = event.target;

    const input = document.getElementById(
      "qtd-" + id
    );

    if(!input){

      mostrarToast(
        "Campo não encontrado!"
      );

      return;

    }

    const quantidade =
      Number(input.value);

    // VALIDAR QUANTIDADE

    if(!quantidade || quantidade <= 0){

      mostrarToast(
        "Digite uma quantidade válida!"
      );

      return;

    }

    // BUSCAR PRODUTOS

    const res = await fetch(
      API + "/produtos"
    );

    const produtos = await res.json();

    const produto = produtos.find(
      p => Number(p.id) === Number(id)
    );

    // VALIDAR PRODUTO

    if(!produto){

      mostrarToast(
        "Produto não encontrado!"
      );

      return;

    }

    // VALIDAR ESTOQUE

    if(
      quantidade >
      Number(produto.quantidade_disponivel)
    ){

      mostrarToast(
        `Só existem ${produto.quantidade_disponivel}kg disponíveis`
      );

      return;

    }

    // PEGAR CARRINHO

    let carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    // VERIFICAR EXISTENTE

    const itemExistente = carrinho.find(
      item => item.id === produto.id
    );

    if(itemExistente){

      itemExistente.quantidade += quantidade;

    }else{

      carrinho.push({

        id: produto.id,

        quantidade: quantidade

      });

    }

    localStorage.setItem(

      "carrinho",

      JSON.stringify(carrinho)

    );
    // TOAST

    mostrarToast(
      "Produto adicionado ao carrinho!"
    );

    // ANIMAÇÃO

    animarCarrinho(botao);

    // LIMPAR INPUT

    input.value = "";

    console.log(carrinho);

  }catch(erro){

    console.log(erro);

    mostrarToast(
      "Erro ao adicionar ao carrinho!"
    );

  }

}
async function salvarProduto(){

  try{

    const gramatura =
      document.getElementById("gramatura").value;

    const tipo_agua =
      document.getElementById("tipo_agua").value;

    const tipo_produto =
      document.getElementById("tipo_produto").value;

    const preco = Number(
    document.getElementById("preco").value
    );

    const quantidade = Number(
    document.getElementById("quantidade").value
    );

    if(
    !gramatura ||
    !preco ||
    !quantidade
    ){
    alert("Preencha todos os campos.");
    return;
    }

    if(preco <= 0){
      alert("Preço inválido.");
      return;
    }

    if(quantidade <= 0){
      alert("Quantidade inválida.");
      return;
    }

    if(gramatura > 60){

  alert(
    "A gramatura máxima permitida é 60g."
  );

  return;

}

if(preco > 200){

  alert(
    "O preço máximo permitido é R$ 200/kg."
  );

  return;

}

if(quantidade > 10000){

  alert(
    "A quantidade máxima permitida é 10.000kg."
  );

  return;

}

    const dados = {

      gramatura,

      tipo_agua,

      tipo_produto,

      preco_kg: preco,

      quantidade_disponivel: quantidade,

      usuario_id: usuario.id

    };

    // EDITAR

    if(produtoEditando){

      await fetch(

        API + "/produtos/" + produtoEditando,

        {

          method:"PUT",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify(dados)

        }

      );

      alert(
        "Produto atualizado com sucesso!"
      );

      produtoEditando = null;

      const btnSalvar =
        document.getElementById("btnSalvar");

      if(btnSalvar){

        btnSalvar.innerText =
          "Cadastrar Produto";

      }

    }

    // NOVO PRODUTO

    else{

      await fetch(

        API + "/produtos",

        {

          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify(dados)

        }

      );

      alert(
        "Produto cadastrado com sucesso!"
      );

    }

    limparFormulario();

    carregarProdutos();

    carregarGramaturas();

    if(
      typeof carregarMeusProdutos ===
      "function"
    ){

      carregarMeusProdutos();

    }

  }catch(erro){

    console.log(erro);

    alert(
      "Erro ao salvar produto."
    );

  }

}
async function carregarMeusProdutos(){

  if(!usuario) return;

  try{

    const resposta = await fetch(
      API + "/meus-produtos/" + usuario.id
    );

    const produtos = await resposta.json();

    const div = document.getElementById(
      "meusProdutos"
    );

    if(!div) return;

    div.innerHTML = produtos.map(p => `

  <div class="card">

    <div class="card-body">

      <h3>${p.gramatura}g</h3>

      <p>${p.tipo_agua}</p>

      <p>${p.tipo_produto}</p>

      <p>R$ ${p.preco_kg}/kg</p>

      <p>${p.quantidade_disponivel}kg</p>

      <div class="acoes">

        <button
          class="btnEditar"
          onclick="editarProduto(${p.id})"
        >
          Editar
        </button>

        <button
          class="btnRemover"
          onclick="excluirProduto(${p.id})"
        >
          Excluir
        </button>

      </div>

    </div>

  </div>

`).join("");

  }catch(erro){

    console.log(erro);

  }

}

async function excluirProduto(id){

  if(!confirm("Excluir produto?")){
    return;
  }

  try{

    await fetch(
  API + "/produtos/" + id,
  {
    method:"DELETE",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify({
      usuario_id: usuario.id
    })
  }
);

    carregarMeusProdutos();

    carregarProdutos();

  }catch(erro){

    console.log(erro);

  }

}
async function editarProduto(id){

  try{

    const resposta = await fetch(
      API + "/meus-produtos/" + usuario.id
    );

    const produtos = await resposta.json();

    const produto = produtos.find(
      p => Number(p.id) === Number(id)
    );

    if(!produto){
      return;
    }

    document.getElementById("gramatura").value =
      produto.gramatura;

    document.getElementById("tipo_agua").value =
      produto.tipo_agua;

    document.getElementById("tipo_produto").value =
      produto.tipo_produto;

    document.getElementById("preco").value =
      produto.preco_kg;

    document.getElementById("quantidade").value =
      produto.quantidade_disponivel;

    produtoEditando = produto.id;

    document.getElementById("btnSalvar")
      .innerText = "Salvar Alterações";

    window.scrollTo({
      top:0,
      behavior:"smooth"
    });

  }catch(erro){

    console.log(erro);

  }

}

function limparFormulario(){

  const gramatura =
    document.getElementById("gramatura");

  const preco =
    document.getElementById("preco");

  const quantidade =
    document.getElementById("quantidade");

  if(gramatura){
    gramatura.value = "";
  }

  if(preco){
    preco.value = "";
  }

  if(quantidade){
    quantidade.value = "";
  }

}
// =========================
// TOAST
// =========================

function mostrarToast(texto){

  const toast =
    document.getElementById("toast");

  if(!toast) return;

  toast.innerText = texto;

  toast.classList.add("show");

  setTimeout(()=>{

    toast.classList.remove("show");

  },2500);

}

// =========================
// ANIMAÇÃO
// =========================

function animarCarrinho(botao){

  const carrinho =
    document.getElementById("iconeCarrinho");

  if(!carrinho) return;

  const item =
    document.createElement("div");

  item.classList.add("produtoVoando");

  item.innerHTML = `

    <img src="img/camarao.png">

  `;

  document.body.appendChild(item);

  const inicio =
    botao.getBoundingClientRect();

  const fim =
    carrinho.getBoundingClientRect();

  item.style.left =
    inicio.left + "px";

  item.style.top =
    inicio.top + "px";

  setTimeout(()=>{

    item.style.left =
      fim.left + "px";

    item.style.top =
      fim.top + "px";

    item.style.transform =
      "scale(0.2) rotate(720deg)";

    item.style.opacity = "0";

  },50);

  setTimeout(()=>{

    item.remove();

  },1000);

}

// =========================
// SLIDES
// =========================

const slides =
  document.querySelectorAll(".slide");

let slideAtual = 0;

function trocarSlide(){

  if(slides.length <= 0) return;

  slides[slideAtual]
    .classList.remove("active");

  slideAtual++;

  if(slideAtual >= slides.length){

    slideAtual = 0;

  }

  slides[slideAtual]
    .classList.add("active");

}

if(slides.length > 0){

  setInterval(trocarSlide, 5000);

}

function acessarAreaProdutor(event){

  event.preventDefault();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  if(!usuario){

    alert(
      "Faça login como produtor."
    );

    return;
  }

  if(
    usuario.tipo_usuario !== "produtor"
  ){

    alert(
      "Você está cadastrado como comprador e não pode acessar esta área."
    );

    return;
  }

  window.location.href =
    "produtor.html";

}

function acessarOfertas(event){

  event.preventDefault();

  const usuario = JSON.parse(
    localStorage.getItem("usuario")
  );

  if(
    usuario &&
    usuario.tipo_usuario === "produtor"
  ){

    alert(
      "Você está cadastrado como produtor e não pode comprar produtos."
    );

    return;
  }

  document
    .getElementById("ofertas")
    ?.scrollIntoView({
      behavior:"smooth"
    });

}
// =========================
// AUTO LOAD
// =========================

carregarProdutos();
carregarGramaturas();

if(
  window.location.pathname.includes(
    "produtor.html"
  )
){

  if(
    typeof carregarMeusProdutos ===
    "function"
  ){

    carregarMeusProdutos();

  }

}