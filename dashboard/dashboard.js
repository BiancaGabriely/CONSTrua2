console.log("carregarCursos foi executada");

document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000/cursos';
    const MATRICULAS_URL = 'http://localhost:3000/matriculas';

    let cursos = [];
    let matriculas = [];
    let cursosAluno = [];

    const ctx = document.getElementById('grafico');

    const grafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'XP Ganho',
                data: [120, 190, 80, 240, 160, 300, 210],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const dadosPorPeriodo = {
        semana: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            valores: [120, 190, 80, 240, 160, 300, 210]
        },

        mes: {
            labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
            valores: [820, 950, 700, 1100]
        },

        ano: {
            labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
            valores: [3200, 4100, 3900, 4700, 5200, 4800]
        }
    };

    const seletorPeriodo = document.getElementById('seletor-periodo');

    seletorPeriodo.addEventListener('change', (evento) => {

        const opcaoTexto = evento.target.value;

        let chave = 'semana';

        if (opcaoTexto.includes('Mês')) {
            chave = 'mes';
        }

        if (opcaoTexto.includes('Ano')) {
            chave = 'ano';
        }

        const novoDados = dadosPorPeriodo[chave];

        grafico.data.labels = novoDados.labels;
        grafico.data.datasets[0].data = novoDados.valores;

        grafico.update();
    });

    const btnGrid = document.getElementById('btn-visualizacao-grid');
    const btnLista = document.getElementById('btn-visualizacao-lista');

    btnGrid.addEventListener('click', () => {

        const cartoesCursos = document.querySelectorAll('#lista-cursos > div');

        cartoesCursos.forEach(coluna => {
            coluna.classList.remove('col-12');
            coluna.classList.add('col-md-4');
        });

        btnGrid.classList.add('ativo');
        btnLista.classList.remove('ativo');
    });

    btnLista.addEventListener('click', () => {

        const cartoesCursos = document.querySelectorAll('#lista-cursos > div');

        cartoesCursos.forEach(coluna => {
            coluna.classList.remove('col-md-4');
            coluna.classList.add('col-12');
        });

        btnLista.classList.add('ativo');
        btnGrid.classList.remove('ativo');
    });

    async function carregarCursos() {

        console.log("carregarCursos foi executada");

        try {

            const respostaCursos = await fetch(API_URL);
            const respostaMatriculas = await fetch(MATRICULAS_URL);

            if (!respostaCursos.ok || !respostaMatriculas.ok) {
                throw new Error('Erro ao carregar os cursos');
            }

            cursos = await respostaCursos.json();
            matriculas = await respostaMatriculas.json();

            const alunoID = 1;

            console.log("Cursos:", cursos);
            console.log("Matrículas:", matriculas);

            const matriculasAluno = matriculas.filter(matricula => {
                return Number(matricula.alunoId) === Number(alunoID);
            });

            cursosAluno = cursos.filter(curso => {
                return matriculasAluno.some(matricula => {
                    return Number(matricula.cursoId) === Number(curso.id);
                });
            });

            mostrarCursos(cursosAluno);

        } catch (erro) {

            console.error(erro);

        }
    }

    //mostra os cursos cadastrados
    function mostrarCursos(cursos) {

        const listaCursos = document.getElementById("lista-cursos");

        if (!listaCursos) {
            return;
        }

        listaCursos.innerHTML = "";

        cursos.forEach(curso => {

            const matriculaCurso = matriculas.find(item => {
                return Number(item.cursoId) === Number(curso.id);
            });

            const progresso = matriculaCurso
                ? Number(matriculaCurso.progresso)
                : 0;

            listaCursos.innerHTML += `

            <div class="col-12 col-md-4">

                <div
                    class="card curso-card h-100"
                    onclick="abrirCurso(${curso.id})"
                    style="cursor: pointer;"
                >

                    <div class="capa-container">

                        <img
                            src="${curso.imagem}"
                            alt="${curso.titulo}"
                        >

                        <span class="badge-curso">
                            ${curso.categoria}
                        </span>

                    </div>

                    <div class="card-body">

                        <h5>
                            ${curso.titulo}
                        </h5>

                        <p class="modulo">
                            <i class="bi bi-book me-1"></i>
                            Curso em andamento
                        </p>

                        <div class="progresso-info">

                            <span>Progresso</span>

                            <strong>${progresso}%</strong>

                        </div>

                        <div class="progress">

                            <div
                                class="progress-bar"
                                style="width: ${progresso}%;"
                            >
                            </div>

                        </div>

                        <small class="texto-progresso">
                            ${progresso}% concluído
                        </small>

                    </div>

                </div>

            </div>

            `;
        });
    }

    function abrirCurso(cursoId) {
        window.location.href = `../detalhes_curso/detalhes_curso.html?id=${cursoId}`;
    }

    carregarCursos();

});