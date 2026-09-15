const ALUNOS_URL = "http://localhost:3000/alunos"

let alunos = []

const formulario = document.querySelector('form')

function validarAluno(){
    const email = document.querySelector('input#email').value
    const senha = document.querySelector('input#senha').value

    getAlunos()
    let check = false

    alunos.forEach(aluno => {
        if(aluno.email === email && aluno.senha === senha){
            check = true
        }
    })

    if(check === true){
        console.log("passou")
    }else{
        console.log("deu red")
    }

    console.log(alunos)

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

formulario.addEventListener('onclick', event => {
    event.preventDefault()
    validarAluno()
})