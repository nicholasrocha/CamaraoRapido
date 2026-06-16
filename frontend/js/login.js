const form = document.getElementById("formLogin");

form.addEventListener("submit", async (e)=>{

  e.preventDefault();

  const email = document.getElementById("email").value;

  const senha = document.getElementById("senha").value;

  if(!email || !senha){
  alert(
    "Preencha email e senha."
  );
  return;
}

  const resposta = await fetch(

    "http://localhost:3000/login",

    {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        email,
        senha
      })

    }

  );

  const dados = await resposta.json();

  if(dados.sucesso){
        if(dados.admin){

      localStorage.setItem(
        "admin",
        "true"
      );

      window.location.href =
        "admin.html";

      return;
    }
    localStorage.setItem(

      "usuario",

      JSON.stringify(dados.usuario)

    );

    alert("Login realizado!");

    window.location.href = "index.html";

  }else{

    alert(dados.erro);

  }

});