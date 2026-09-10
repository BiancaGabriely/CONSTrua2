const API_URL = 'http://localhost:3000'

const IMAGEM_PADRAO_THUMB = 'https://via.placeholder.com/600x400?text=Curso+CONSTrua'
const IMAGEM_PADRAO_FOTO = 'https://via.placeholder.com/100?text=Instrutor'

document.addEventListener("DOMContentLoaded", () => {
  const parametros = new URLSearchParams(window.location.search)
  // Pega o id da URL (ex: detalhes.html?id=1) ou usa 1 como padrão
  const idCurso = parametros.get('id') || '1'

  carregarDetalhesDoCurso(idCurso)
});

async function carregarDetalhesDoCurso(id) {
  try {
    // Busca os dados do curso
    const respCurso = await fetch(`${API_URL}/cursos/${id}`)
    if (!respCurso.ok) {
      throw new Error(`Curso com ID "${id}" não foi encontrado na API.`)
    }
    const curso = await respCurso.json()

    // Busca os módulos vinculados ao curso
    const respModulos = await fetch(`${API_URL}/modulos?cursoId=${id}`)
    const modulos = await respModulos.json()

    // Busca as aulas para agrupar por módulo
    const respAulas = await fetch(`${API_URL}/aulas`)
    const aulas = await respAulas.json()

    // Junta as aulas dentro de seus respectivos módulos
    const modulosComAulas = modulos.map(mod => {
      return {
        ...mod,
        aulasList: aulas.filter(aula => aula.moduloId === mod.id)
      }
    })

    renderizarCurso(curso, modulosComAulas)
  } catch (erro) {
    console.error('Erro na requisição:', erro)
    mostrarMensagemErro()
  }
}

function renderizarCurso(curso, modulos) {
  // Título da Aba
  setElementText('pagina-titulo', `${curso.titulo} - CONSTrua`)

  // Informações Principais
  setElementText('curso-categoria', curso.categoria || 'Geral')
  setElementText('curso-avaliacao', curso.avaliacao ? `${curso.avaliacao} (Avaliações)` : '0.0')
  setElementText('curso-titulo', curso.titulo || 'Curso sem título')
  setElementText('cursoDescricao', curso.descricao || 'Sem descrição disponível.')

  // Instrutor / Professor
  setElementText('instrutorNome', curso.professor || 'Instrutor Não Informado')
  setElementText('instrutorCargo', curso.cargo || 'Especialista na área')
  setElementSrc('instrutorFoto', curso.foto || IMAGEM_PADRAO_FOTO)

  // Card Lateral
  setElementText('cursoPreco', curso.preco || 'Gratuito')
  setElementSrc('curso-thumb', curso.imagem || IMAGEM_PADRAO_THUMB)

  // Quantidade de modulos
  const totalAulas = modulos.reduce((acc, mod) => acc + (mod.aulasList ? mod.aulasList.length : 0), 0)
  setElementText('curso-resumo-modulos', `${modulos.length} Módulos • ${totalAulas} Aulas`)

  // Accordion de Módulos
  const elAccordion = document.getElementById('curriculoAccordion')
  if (elAccordion && Array.isArray(modulos)) {
    if (modulos.length === 0) {
      elAccordion.innerHTML = '<p class="text-muted p-3">Nenhum módulo cadastrado para este curso.</p>'
      return
    }

    elAccordion.innerHTML = modulos.map((mod, index) => `
      <div class="accordion-item">
        <h2 class="accordion-header">
          <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#mod${mod.id}">
            ${mod.titulo}
          </button>
        </h2>
        <div id="mod${mod.id}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#curriculoAccordion">
          <div class="accordion-body p-0">
            <ul class="list-group list-group-flush small">
              ${mod.aulasList && mod.aulasList.length > 0 
                ? mod.aulasList.map(aula => `
                  <li class="list-group-item d-flex align-items-center justify-content-between py-3 px-4">
                    <span class="d-flex align-items-center gap-2">
                      <i class="bi bi-play-circle-fill text-primary fs-6"></i> ${aula.titulo}
                    </span>
                    ${aula.gratuita ? '<span class="badge bg-success-subtle text-success">Gratuita</span>' : ''}
                  </li>
                `).join('')
                : '<li class="list-group-item text-muted p-3">Nenhuma aula neste módulo.</li>'
              }
            </ul>
          </div>
        </div>
      </div>
    `).join('')
  }
}

// Funções Auxiliares Seguras
function setElementText(id, valor) {
  const el = document.getElementById(id)
  if (el && valor !== undefined) el.innerText = valor
}

function setElementSrc(id, url) {
  const el = document.getElementById(id)
  if (el && url) {
    el.src = url;
    el.onerror = () => { el.src = IMAGEM_PADRAO_THUMB; }
  }
}

function mostrarMensagemErro() {
  const container = document.querySelector('main')
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger text-center my-5 p-5 rounded-4 shadow-sm" role="alert">
        <i class="bi bi-exclamation-triangle fs-1 text-danger d-block mb-3"></i>
        <h4 class="fw-bold">Erro ao carregar o curso</h4>
        <p class="text-muted mb-0">Certifique-se de que o JSON Server esteja ativo executando <code>npx json-server db.json --port 3000</code> no terminal.</p>
      </div>
    `
  }
}