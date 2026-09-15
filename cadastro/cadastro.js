ALUNOS_URL = "http://localhost:3000/alunos"

const matheus = {
    nome: "matheus",
    email: "matheus@gmail.com",
    senha: "Matheus123",
    telefone: "84999296124"
}

async function getAlunos(){
    try{
        const response = await fetch(ALUNOS_URL)

        if(!response.ok){
            throw new Error("Erro ao buscar alunos")
        }

        alunos =  await response.json()
    }catch(e){
        alert("Erro ao buscar alunos")
    }
}

async function testePostAluno(){
    try{
        response = fetch(`${ALUNOS_URL}`,
            {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify(matheus)
            }
        )

        if(!response.ok)
            throw new Error("Erro ao cadastrar aluno")        
    }catch(e){
        alert("Erro ao cadastrar aluno")
    }
}

async function postAluno(novoAluno){
    try{
        response = fetch(`${ALUNOS_URL}`,
            {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify(novoAluno)
            }
        )

        if(!response.ok)
            throw new Error("Erro ao cadastrar aluno")        
    }catch(e){
        alert("Erro ao cadastrar aluno")
    }
}

function cadastrarAluno(){
    const nome = document.querySelector('input#nome').value
    const email = document.querySelector('input#email').value
    const senha = document.querySelector('input#senha').value
    const telefone = document.querySelector('input#tel').value

    const conf_senha = document.querySelector('input#conf_senha')

    if(senha === conf_senha){
        let novoAluno = {
            nome: nome,
            email: email,
            senha: senha,
            telefone: telefone
        }

        postAluno(novoAluno)
    }else{
        alert("As senhas não são iguais")
    }

}
