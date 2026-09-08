const API_URL = "http://localhost:3000/cursos";

let cursos = [];


//carrega os cursos cadastrados
async function carregarCursos() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os cursos.");
        }

        cursos = await resposta.json();

        mostrarCursos(cursos);
        carregarCategorias(cursos);

    } catch (erro) {

        console.error("Erro ao carregar cursos:", erro);

    }
}


//mostra os cursos cadastrados
function mostrarCursos(cursosFiltrados) {

    const listaCursos = document.getElementById("lista-cursos");
    const nenhumCurso = document.getElementById("nenhum-curso");
    const quantidadeCursos = document.getElementById("quantidade-cursos");

    if (!listaCursos) {
        console.error("Elemento com id 'lista-cursos' não encontrado.");
        return;
    }

    listaCursos.innerHTML = "";


    //quantidade de cursos
    quantidadeCursos.textContent = cursosFiltrados.length === 1
        ? "1 curso"
        : `${cursosFiltrados.length} cursos`;


    //verifica se encontrou cursos
    if (cursosFiltrados.length === 0) {

        nenhumCurso.classList.remove("d-none");

        return;
    }

    nenhumCurso.classList.add("d-none");


    //cria os cards
    cursosFiltrados.forEach(curso => {

        listaCursos.innerHTML += `

            <div class="col-12 col-md-6 col-lg-4">

                <div
                    class="card-curso"
                    onclick="abrirCurso(${curso.id})"
                >

                    <img
                        src="${curso.imagem}"
                        class="capa-curso"
                        alt="${curso.titulo}"
                    >


                    <div class="conteudo-curso">

                        <span class="categoria-curso">
                            ${curso.categoria}
                        </span>


                        <h3 class="titulo-curso">
                            ${curso.titulo}
                        </h3>


                        <p class="descricao-curso">
                            ${curso.descricao}
                        </p>


                        <div class="info-curso">

                            <span class="professor-curso">
                                <i class="bi bi-person me-1"></i>
                                Prof. ${curso.professor}
                            </span>


                            <span class="avaliacao-curso">
                                <i class="bi bi-star-fill me-1"></i>
                                ${curso.avaliacao}
                            </span>

                        </div>


                        <span class="preco-curso">
                            ${curso.preco}
                        </span>

                    </div>

                </div>

            </div>

        `;

    });
}


//carrega as categorias
function carregarCategorias(cursos) {

    const filtroCategoria = document.getElementById("filtro-categoria");

    if (!filtroCategoria) {
        console.error("Elemento com id 'filtro-categoria' não encontrado.");
        return;
    }


    //pega as categorias sem repetir
    const categorias = [...new Set(
        cursos.map(curso => curso.categoria)
    )];


    categorias.forEach(categoria => {

        filtroCategoria.innerHTML += `
            <option value="${categoria}">
                ${categoria}
            </option>
        `;

    });

}


//pesquisar
function pesquisarCursos() {

    const campoPesquisa = document.getElementById("campo-pesquisa");

    if (!campoPesquisa) {
        console.error("Elemento com id 'campo-pesquisa' não encontrado.");
        return;
    }

    const pesquisa = campoPesquisa.value.toLowerCase().trim();


    const cursosFiltrados = cursos.filter(curso => {

        return (
            curso.titulo.toLowerCase().includes(pesquisa) ||
            curso.descricao.toLowerCase().includes(pesquisa) ||
            curso.categoria.toLowerCase().includes(pesquisa) ||
            curso.professor.toLowerCase().includes(pesquisa)
        );

    });


    mostrarCursos(cursosFiltrados);

}


//filtrar por categoria
function filtrarCategoria() {

    const filtroCategoria = document.getElementById("filtro-categoria");

    const categoria = filtroCategoria.value;


    if (categoria === "todos") {

        mostrarCursos(cursos);

        return;
    }


    const cursosFiltrados = cursos.filter(curso => {

        return curso.categoria === categoria;

    });


    mostrarCursos(cursosFiltrados);

}


//mostrar todos os cursos
function mostrarTodosCursos() {

    document.getElementById("campo-pesquisa").value = "";
    document.getElementById("filtro-categoria").value = "todos";

    mostrarCursos(cursos);

}


//abrir página do curso desejado
function abrirCurso(id) {

    window.location.href = `../detalhes_curso/detalhes_curso.html?id=${id}`;

}


//inicia
carregarCursos();