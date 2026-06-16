const form = document.getElementById("formCadastro");

form.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const nome = document.getElementById("nome").value;

  const email = document.getElementById("email").value;

  const cpf = document.getElementById("cpf").value;

  const celular = document.getElementById("celular").value;

  const senha = document.getElementById("senha").value;

  const tipo_usuario = document.querySelector(
  'input[name="tipo"]:checked'
).value;

      if(nome.length < 3){
      alert("Nome deve possuir pelo menos 3 caracteres.");
      return;
    }

    if(nome.length > 100){
      alert("Nome muito grande.");
      return;
    }

    if(email.length > 150){
      alert("Email muito grande.");
      return;
    }

    if(cpf.length < 11){
      alert("CPF inválido.");
      return;
    }

    if(celular.length < 10){
      alert("Celular inválido.");
      return;
    }

    if(senha.length < 6){
      alert(
        "A senha deve possuir no mínimo 6 caracteres."
      );
      return;
    }

  const resposta = await fetch(

    "",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({

        nome,
        email,
        cpf,
        celular,
        senha,
        tipo_usuario

      })

    }

  );

  const dados = await resposta.json();

  if(dados.sucesso){

    alert("Conta criada com sucesso!");

    window.location.href = "login.html";

  }else{

    alert(
  dados.erro ||
  "Erro ao cadastrar"
);    

  }

});