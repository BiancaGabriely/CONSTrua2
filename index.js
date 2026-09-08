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
        
        mostrarCategorias(cursos);

    } catch (erro) {

        console.error("Erro ao carregar cursos:", erro);

    }
}

//mostra os cursos cadastrados
function mostrarCursos(cursos) {

    const listaCursos = document.getElementById("lista-cursos");

    if (!listaCursos) {
        console.error("Elemento com id 'lista-cursos' não encontrado.");
        return;
    }

    listaCursos.innerHTML = "";

    cursos.forEach(curso => {

        listaCursos.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">

                <div class="card card-destaque h-100 rounded-3 overflow-hidden shadow-sm"
                onclick="abrirCurso(${curso.id})"
                style="cursor: pointer;"
                >

                    <img 
                        src="${curso.imagem}" 
                        class="card-img-top capa-curso" 
                        alt="${curso.titulo}"
                    >

                    <div class="card-body d-flex flex-column">

                        <div class="d-flex justify-content-between align-items-center mb-2">

                            <span class="badge bg-primary-subtle text-primary badge-categoria fw-bold">
                                ${curso.categoria}
                            </span>

                            <span class="small text-warning fw-bold">
                                <i class="bi bi-star-fill me-1"></i>
                                ${curso.avaliacao}
                            </span>

                        </div>

                        <h5 class="card-title fs-6 fw-bold mb-2">
                            ${curso.titulo}
                        </h5>

                        <p class="card-text text-muted small flex-grow-1">
                            ${curso.descricao}
                        </p>

                        <hr class="my-3 opacity-25">

                        <div class="d-flex align-items-center justify-content-between">

                            <span class="small text-secondary fw-medium">
                                Prof. ${curso.professor}
                            </span>

                            <span class="badge bg-success-subtle text-success fw-bold px-2 py-1">
                                ${curso.preco}
                            </span>

                        </div>

                    </div>

                </div>

            </div>
        `;
    });
}

//abrir página do curso desejado
function abrirCurso(id) {

    window.location.href = `detalhes_curso/detalhes_curso.html?id=${id}`;
}

//continuar aprendendo
function mostrarContinuarAprendendo(cursos) {

    const container = document.getElementById("continuar-aprendendo");

    if (!container) {
        console.error("Elemento com id 'continuar-aprendendo' não encontrado.");
        return;
    }

    container.innerHTML = "";

    const cursosContinuar = cursos.slice(0, 4);

    cursosContinuar.forEach(curso => {

        container.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">

                <div 
                    class="card h-100 shadow-sm"
                    onclick="abrirCurso(${curso.id})"
                    style="cursor: pointer;"
                >

                    <div class="row g-0">

                        <div class="col-4">

                            <img
                                src="${curso.imagem}"
                                class="img-fluid rounded-start h-100"
                                alt="${curso.titulo}"
                                style="object-fit: cover;"
                            >

                        </div>

                        <div class="col-8">

                            <div class="card-body">

                                <h5 class="card-title">
                                    ${curso.titulo}
                                </h5>

                                <p class="card-text text-muted small">
                                    ${curso.categoria}
                                </p>

                                <div class="progress">

                                    <div
                                        class="progress-bar"
                                        role="progressbar"
                                        style="width: 40%;"
                                    >
                                        40%
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        `;
    });
}

//mostrar categorias
function mostrarCategorias(cursos) {

    const listaCategorias = document.getElementById("lista-categorias");

    if (!listaCategorias) {
        console.error("Elemento com id 'lista-categorias' não encontrado.");
        return;
    }

    listaCategorias.innerHTML = "";

    const categorias = [...new Set(cursos.map(curso => curso.categoria))];

    categorias.forEach(categoria => {

        listaCategorias.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">

                <div 
                    class="card categoria-card h-100 shadow-sm border-0"
                    onclick="filtrarPorCategoria('${categoria}')"
                    style="cursor: pointer;"
                >

                    <div class="card-body text-center p-4">

                        <div class="categoria-icone mb-3">
                            <i class="bi bi-book"></i>
                        </div>

                        <h5 class="card-title fw-bold mb-2">
                            ${categoria}
                        </h5>

                        <p class="text-muted small mb-0">
                            Explorar cursos
                        </p>

                    </div>

                </div>

            </div>
        `;
    });
}

//filtrar por categoria
function filtrarPorCategoria(categoria) {
    const cursosFiltrados = cursos.filter(curso => curso.categoria === categoria);  
    mostrarCursos(cursosFiltrados);
}
//pesquisar
function pesquisarCursos() {
    const campoPesquisa = document.getElementById("campo-pesquisa");

    if(!campoPesquisa) {
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
//mostrar todos os cursos
function mostrarTodosCursos() {
    mostrarCursos(cursos);
}
//inicia
carregarCursos();