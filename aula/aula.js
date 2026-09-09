document.addEventListener('DOMContentLoaded', () => {

    const API_URL = "http://localhost:3000";

    let curso = null;
    let modulos = [];
    let aulas = [];
    let aulaAtual = null;

    //pega os dados da url
    const parametros = new URLSearchParams(window.location.search);

    const cursoId = Number(parametros.get("cursoId"));
    const aulaId = Number(parametros.get("aulaId"));

    console.log("Curso:", cursoId);
    console.log("Aula:", aulaId);

    //carrega os dados
    async function carregarDados() {

        try {

            //busca o curso
            const respostaCurso = await fetch(`${API_URL}/cursos/${cursoId}`);

            if (!respostaCurso.ok) {
                throw new Error("Curso não encontrado.");
            }

            curso = await respostaCurso.json();

            //busca os módulos
            const respostaModulos = await fetch(
                `${API_URL}/modulos?cursoId=${cursoId}`
            );

            modulos = await respostaModulos.json();

            //busca as aulas de cada módulo
            aulas = [];

            for (const modulo of modulos) {

                const respostaAulas = await fetch(
                    `${API_URL}/aulas?moduloId=${modulo.id}`
                );

                const aulasModulo = await respostaAulas.json();

                aulas.push(...aulasModulo);
            }

            //ordena as aulas
            aulas.sort((a, b) => {

                if (a.moduloId !== b.moduloId) {
                    return a.moduloId - b.moduloId;
                }

                return a.ordem - b.ordem;

            });

            //procura a aula atual
            aulaAtual = aulas.find(aula => {
                return Number(aula.id) === aulaId;
            });

            //se não foi informada uma aula, pega a primeira
            if (!aulaAtual) {
                aulaAtual = aulas[0];
            }

            console.log("Curso:", curso);
            console.log("Módulos:", modulos);
            console.log("Aulas:", aulas);
            console.log("Aula atual:", aulaAtual);

            mostrarCurso();
            mostrarModulos();
            mostrarAula();

        } catch (erro) {

            console.error("Erro ao carregar dados:", erro);

        }
    }

    //mostra o nome do curso
    function mostrarCurso() {

        console.log("Curso carregado:", curso.titulo);

        document.title = `CONSTrua - ${curso.titulo}`;
    }

    //mostra os módulos e aulas
    function mostrarModulos() {

        const listaModulos = document.querySelector(".lesson-list");

        if (!listaModulos) {
            return;
        }

        listaModulos.innerHTML = "";

        modulos.forEach(modulo => {

            const aulasModulo = aulas.filter(aula => {
                return Number(aula.moduloId) === Number(modulo.id);
            });

            const moduloAberto = aulasModulo.some(aula => {
                return Number(aula.id) === Number(aulaAtual.id);
            });

            //módulo
            listaModulos.innerHTML += `

                <div class="chapter ${moduloAberto ? "open" : ""}"
                     data-modulo="${modulo.id}">

                    <strong>
                        MÓDULO ${modulo.ordem}: ${modulo.titulo}
                    </strong>

                    <span>
                        ${moduloAberto ? "⌃" : "⌄"}
                    </span>

                </div>

            `;

            //aulas
            aulasModulo.forEach(aula => {

                const estaAtual = Number(aula.id) === Number(aulaAtual.id);

                listaModulos.innerHTML += `

                    <div class="lesson ${estaAtual ? "current" : ""}"
                         data-aula="${aula.id}"
                         data-modulo="${modulo.id}"
                         style="display: ${moduloAberto ? "flex" : "none"};">

                        <span class="lesson-icon">
                            ${estaAtual ? "▶" : "○"}
                        </span>

                        <div>

                            <strong>
                                ${String(aula.ordem).padStart(2, "0")}. ${aula.titulo}
                            </strong>

                            <small>
                                ${formatarDuracao(aula.duracaoSegundos)}
                            </small>

                        </div>

                    </div>

                `;
            });

        });

        adicionarEventosModulos();
        adicionarEventosAulas();
    }

    //mostra os dados da aula
    function mostrarAula() {

        const titulo = document.querySelector(".lesson-header h1");
        const modulo = document.querySelector(".lesson-header .module");
        const video = document.getElementById("video-aula");

        if (titulo) {
            titulo.textContent =
                `${String(aulaAtual.ordem).padStart(2, "0")}. ${aulaAtual.titulo}`;
        }

        if (modulo) {

            const moduloAtual = modulos.find(item => {
                return Number(item.id) === Number(aulaAtual.moduloId);
            });

            if (moduloAtual) {
                modulo.textContent =
                    `MÓDULO ${moduloAtual.ordem}: ${moduloAtual.titulo}`;
            }
        }

        if (video && aulaAtual.urlVideo) {

            const url = new URL(aulaAtual.urlVideo);

            const videoId = url.searchParams.get("v");

            video.src = `https://www.youtube.com/embed/${videoId}`;
        }

        console.log("Vídeo da aula:", aulaAtual.urlVideo);
    }

    //adiciona os eventos dos módulos
    function adicionarEventosModulos() {

        const modulosHTML = document.querySelectorAll(".chapter");

        modulosHTML.forEach(modulo => {

            modulo.addEventListener("click", () => {

                const numeroModulo = modulo.dataset.modulo;

                modulo.classList.toggle("open");

                const aulasDoModulo = document.querySelectorAll(
                    `.lesson[data-modulo="${numeroModulo}"]`
                );

                aulasDoModulo.forEach(aula => {

                    aula.style.display =
                        modulo.classList.contains("open")
                            ? "flex"
                            : "none";

                });

                const seta = modulo.querySelector("span");

                if (seta) {
                    seta.textContent =
                        modulo.classList.contains("open")
                            ? "⌃"
                            : "⌄";
                }

            });

        });

    }

    //adiciona os eventos das aulas
    function adicionarEventosAulas() {

        const aulasHTML = document.querySelectorAll(".lesson");

        aulasHTML.forEach(aula => {

            aula.addEventListener("click", () => {

                const id = Number(aula.dataset.aula);

                abrirAula(id);

            });

        });

    }

    //abre uma aula
    function abrirAula(id) {

        window.location.href =
            `aula.html?cursoId=${cursoId}&aulaId=${id}`;

    }

    //formata duração
    function formatarDuracao(segundos) {

        const minutos = Math.floor(segundos / 60);

        const segundosRestantes = segundos % 60;

        return `${String(minutos).padStart(2, "0")}:${String(segundosRestantes).padStart(2, "0")}`;

    }

    //botão anterior
    const btnAnterior = document.getElementById("btn-anterior");

    if (btnAnterior) {

        btnAnterior.addEventListener("click", () => {

            const indice = aulas.findIndex(aula => {
                return Number(aula.id) === Number(aulaAtual.id);
            });

            if (indice > 0) {

                const aulaAnterior = aulas[indice - 1];

                abrirAula(aulaAnterior.id);

            }

        });

    }

    //botão próxima
    const btnProxima = document.getElementById("btn-proxima");

    if (btnProxima) {

        btnProxima.addEventListener("click", () => {

            const indice = aulas.findIndex(aula => {
                return Number(aula.id) === Number(aulaAtual.id);
            });

            if (indice < aulas.length - 1) {

                const proximaAula = aulas[indice + 1];

                abrirAula(proximaAula.id);

            }

        });

    }

    //abas
    const abas = document.querySelectorAll(".tab");

    abas.forEach(aba => {

        aba.addEventListener("click", () => {

            abas.forEach(a => {
                a.classList.remove("active");
            });

            aba.classList.add("active");

            const tabSelecionada = aba.dataset.tab;

            console.log("Aba selecionada:", tabSelecionada);

        });

    });

    //carrega os dados
    carregarDados();

});