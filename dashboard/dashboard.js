document.addEventListener('DOMContentLoaded', () =>{
    const ctx = document.getElementById('grafico');

    const grafico = new Chart(ctx, {
        type: 'bar',
        data:{
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'XP Ganho',
                data: [120, 190, 80, 240, 160, 300, 210],
                borderRadius: 6
            }]
        },
        options:{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {display: false}
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
        if(opcaoTexto.includes('Mês')) chave = 'mes';
        if(opcaoTexto.includes('Ano')) chave = 'ano';

        const novoDados = dadosPorPeriodo[chave];

        grafico.data.labels = novoDados.labels;
        grafico.data.datasets[0].data = novoDados.valores;
        grafico.update();
    });

    const btnGrid = document.getElementById('btn-visualizacao-grid');
    const btnLista = document.getElementById('btn-visualizacao-lista');
    const cartoesCursos = document.querySelectorAll('#lista-cursos > div');

    btnGrid.addEventListener('click', () =>{
        cartoesCursos.forEach(coluna => {
            coluna.classList.remove('col-12');
            coluna.classList.add('col-md-4');
        });
    });

    btnLista.addEventListener('click', () => {
        cartoesCursos.forEach(coluna =>{
            coluna.classList.remove('col-md-4');
            coluna.classList.add('col-12');
        });
    });

    const btnContinuar = document.getElementById('btn-continuar');
    btnContinuar.addEventListener('click', () => {
        window.location.href = 'aula.html';
    });
    
})
