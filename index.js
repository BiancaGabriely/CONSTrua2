const API_URL = "http://localhost:3000/cursos";
let cursos = [];

document.addEventListener("DOMContentLoaded", () => {
    carregarCursos();
});

// Carrega os cursos cadastrados na API
async function carregarCursos() {
    try {
        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os cursos.");
        }

        cursos = await resposta.json();

        mostrarCursos(cursos);
        mostrarCategorias(cursos);

        // Caso deseje renderizar a seção de continuar aprendendo dinamicamente no futuro:
        if (document.getElementById("continuar-aprendendo")) {
            mostrarContinuarAprendendo(cursos);
        }

    } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);
        mostrarMensagemErro();
    }
}

// Renderiza a lista de cards de cursos
function mostrarCursos(listaParaExibir) {
    const listaCursos = document.getElementById("lista-cursos");

    if (!listaCursos) {
        console.error("Elemento com id 'lista-cursos' não encontrado.");
        return;
    }

    listaCursos.innerHTML = "";

    if (listaParaExibir.length === 0) {
        listaCursos.innerHTML = `
            <div class="col-12 text-center my-4">
                <p class="text-muted fs-5">Nenhum curso encontrado.</p>
            </div>
        `;
        return;
    }

    listaParaExibir.forEach(curso => {
        listaCursos.innerHTML += `
            <div class="col-12 col-md-6 col-lg-3">
                <div class="card card-destaque h-100 rounded-3 overflow-hidden shadow-sm"
                     onclick="abrirCurso('${curso.id}')"
                     style="cursor: pointer;">

                    <img src="${curso.imagem || 'https://via.placeholder.com/300x180'}" 
                         class="card-img-top capa-curso" 
                         alt="${curso.titulo}">

                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="badge bg-primary-subtle text-primary badge-categoria fw-bold">
                                ${curso.categoria || 'Geral'}
                            </span>
                            <span class="small text-warning fw-bold">
                                <i class="bi bi-star-fill me-1"></i>
                                ${curso.avaliacao || '0.0'}
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
                                Prof. ${curso.professor || 'Instrutor'}
                            </span>
                            <span class="badge bg-success-subtle text-success fw-bold px-2 py-1">
                                ${curso.preco || 'Gratuito'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

// Redireciona para a página de detalhes com o ID do curso
function abrirCurso(id) {
    // Certifique-se de que o caminho abaixo corresponda ao local relativo do seu arquivo de detalhes
    window.location.href = `./detalhes_curso/detalhes_cursos.html?id=${id}`; 
}

// Renderiza os botões/cards de categorias
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
                <div class="card categoria-card h-100 shadow-sm border-0"
                     onclick="filtrarPorCategoria('${categoria}')"
                     style="cursor: pointer;">
                    <div class="card-body text-center p-4">
                        <div class="categoria-icone mb-3">
                            <i class="bi bi-book fs-3 text-primary"></i>
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

// Filtra os cursos exibidos por categoria
function filtrarPorCategoria(categoria) {
    const cursosFiltrados = cursos.filter(curso => curso.categoria === categoria);
    mostrarCursos(cursosFiltrados);
}

// Pesquisa no campo de busca (se houver um input id="campo-pesquisa")
function pesquisarCursos() {
    const campoPesquisa = document.getElementById("campo-pesquisa");

    if (!campoPesquisa) {
        console.error("Elemento com id 'campo-pesquisa' não encontrado.");
        return;
    }

    const pesquisa = campoPesquisa.value.toLowerCase().trim();

    const cursosFiltrados = cursos.filter(curso => {
        return (
            (curso.titulo && curso.titulo.toLowerCase().includes(pesquisa)) ||
            (curso.descricao && curso.descricao.toLowerCase().includes(pesquisa)) ||
            (curso.categoria && curso.categoria.toLowerCase().includes(pesquisa)) ||
            (curso.professor && curso.professor.toLowerCase().includes(pesquisa))
        );
    });

    mostrarCursos(cursosFiltrados);
}

// Exibe novamente todos os cursos sem filtros
function mostrarTodosCursos() {
    mostrarCursos(cursos);
}

// Exibe mensagem de erro na tela se a API não estiver conectada
function mostrarMensagemErro() {
    const listaCursos = document.getElementById("lista-cursos");
    if (listaCursos) {
        listaCursos.innerHTML = `
            <div class="col-12 text-center my-4">
                <p class="text-danger fw-bold">Não foi possível carregar os cursos. Certifique-se de que o JSON Server está rodando.</p>
            </div>
        `;
    }
}