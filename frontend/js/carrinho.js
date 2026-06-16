const API = "";

// =========================
// USUÁRIO
// =========================

const usuario = JSON.parse(
  localStorage.getItem("usuario")
);

if(!usuario){

  window.location.href = "login.html";

}

// =========================
// CARREGAR CARRINHO
// =========================

async function carregarCarrinho(){

  const lista = document.getElementById(
    "listaCarrinho"
  );

  // PEGAR CARRINHO LOCAL

  const carrinho = JSON.parse(
    localStorage.getItem("carrinho") || "[]"
  );

  // CARRINHO VAZIO

  if(carrinho.length <= 0){

    lista.innerHTML = `

      <div class="card">

        <div class="card-body">

          <h2>
            Seu carrinho está vazio
          </h2>

        </div>

      </div>

    `;

    return;

  }

  // BUSCAR PRODUTOS

  const res = await fetch(
    API + "/produtos"
  );

  const produtos = await res.json();

  let totalFinal = 0;

  let html = "";

  // MONTAR ITENS

  carrinho.forEach((item,index)=>{

    const produto = produtos.find(
      p => Number(p.id) === Number(item.id)
    );

    if(!produto) return;

    const valorTotal =
      Number(produto.preco_kg) *
      Number(item.quantidade);

    totalFinal += valorTotal;

    html += `

      <div class="card">

        <div class="card-body">

          <h3>
            ${produto.gramatura}g
          </h3>

          <p class="infoProduto">

            ${produto.tipo_agua}
            •
            ${produto.tipo_produto}

          </p>

          <p>

            Quantidade:
            ${item.quantidade}kg

          </p>

          <div class="preco">

            R$ ${valorTotal.toFixed(2)}

          </div>

          <button
            class="btnRemover"
            onclick="removerItem(${index})"
          >

            Remover

          </button>

        </div>

      </div>

    `;

  });

  // TOTAL

  html += `

    <div class="card">

      <div class="card-body">

        <h2>

          Total:
          R$ ${totalFinal.toFixed(2)}

        </h2>

        <button onclick="finalizarCompra()">

          Finalizar Compra

        </button>

      </div>

    </div>

  `;

  lista.innerHTML = html;

}

// =========================
// REMOVER ITEM
// =========================

function removerItem(index){

  let carrinho = JSON.parse(
    localStorage.getItem("carrinho") || "[]"
  );

  carrinho.splice(index,1);

  localStorage.setItem(
    "carrinho",
    JSON.stringify(carrinho)
  );

  carregarCarrinho();

}

// =========================
// FINALIZAR
// =========================

async function finalizarCompra(){

  try{

    const carrinho = JSON.parse(
      localStorage.getItem("carrinho") || "[]"
    );

    await fetch(
      API + "/finalizar-compra",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          itens:carrinho
        })
      }
    );

    alert(
      "Compra realizada com sucesso!"
    );

    localStorage.removeItem(
      "carrinho"
    );

    carregarCarrinho();

  }catch(erro){

    console.log(erro);

    alert(
      "Erro ao finalizar compra"
    );

  }

}

// =========================
// AUTO LOAD
// =========================

carregarCarrinho();