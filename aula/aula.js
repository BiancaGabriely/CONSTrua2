document.addEventListener('DOMContentLoaded', () => {
    const btnPlay = document.getElementById('btn-play');

    if(btnPlay) {
        btnPlay.addEventListener('click', () => {
            btnPlay.textContent = '⏸';
            console.log('Vídeo iniciado');
        });
    }

    const btnAnterior = document.getElementById('btn-anterior');
    const btnProxima = document.getElementById('btn-proxima');

    if(btnAnterior){
        btnAnterior.addEventListener('click', () => {
            console.log('Indo para a aula anterior...')
        })
    }

    if(btnProxima) {
        btnProxima.addEventListener('click', () => {
            console.log('Indo para a próxima aula...')
        })
    }

    const abas = document.querySelectorAll('.tab');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            abas.forEach(a => a.classList.remove('active'));
            aba.classList.add('active');
        })

        const tabSelecionada = aba.dataset.tab;
        console.log('Aba Selecionada:', tabSelecionada);
    })

    const modulos = document.querySelectorAll('.chapter');
    modulos.forEach(modulo => {
        modulo.addEventListener('click', () => {
            const numeroModulo = modulo.dataset.modulo;

            modulo.classList.toggle('open');

            const aulasDoModulo = document.querySelectorAll(`.lesson[data-modulo="${numeroModulo}"]`)

            aulasDoModulo.forEach(aula => {
                aula.computedStyleMap.display = modulo.classList.contains('open') ? 'flex' : 'none';
            });
        });
    });

    const aulas = document.querySelectorAll('.leson');
    aulas.forEach(aula => {
        aula.addEventListener('click', () => {
            aulas.forEach(a => a.classList.remove('current'));
            aulas.classList.add('current');

            const tituloAula = aula.querySelector('strong').textContent;
            console.log('Aula selecionada:', tituloAula);
        })
    })

    const contadorProgresso = document.getElementById('contador-progresso');
    const barraProgresso = document.getElementById('barra-progresso');

    if(contadorProgresso && barraProgresso){
        const texto = contadorProgresso.textContent;
        const numeros = texto.match(/\d+/g);

        if(numeros){
            const concluidas = Number(numeros[0]);
            const total = Number(numeros[1]);
            const porcentagem = (concluidas / total) * 100;

            barraProgresso.style.width = porcentagem + '%';
        }
    }
});