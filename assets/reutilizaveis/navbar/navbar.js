fetch("../assets/reutilizaveis/navbar/navbar.html")
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error("Erro ao carregar navbar.html");
        }

        return resposta.text();
    })
    .then(html => {
        document.getElementById("navbar-container").innerHTML = html;
    })
    .catch(erro => {
        console.error("Erro ao carregar a navbar:", erro);
    });