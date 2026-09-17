const ALUNOS_URL = "http://localhost:3000/alunos"

let alunos = []

const formulario = document.querySelector('form')

async function validarAluno(){
    const email = document.querySelector('input#email').value
    const senha = document.querySelector('input#senha').value

    await getAlunos()

    alunos.forEach(aluno => {
        if(aluno.email === email && aluno.senha === senha){
            aluno.logado = true
            editAluno(aluno)
            window.location.href = `../dashboard/dashboard.html`;
            return true
        }
    })

}

async function editAluno(aluno){
    try{
        const response  = await fetch(`${ALUNOS_URL}/${aluno.id}`,
            {
                method: "PUT",
                headers: {"content-type":"application/json"},
                body: JSON.stringify(aluno)
            }
        )

        if(!response.ok)
            throw new Error("Erro ao processar usuário")
    }catch(e){
        alert("Erro ao processar usuário")
    }
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

formulario.addEventListener('click', async event => {
    event.preventDefault()
    console.log(event.target.id)
    if(event.target.id == 'submit'){
        await validarAluno()
    }
})