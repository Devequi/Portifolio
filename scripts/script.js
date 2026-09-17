// ==================================================
// ELEMENTOS
// ==================================================

const botaoMenu = document.querySelector("#botaoMenu");
const navLinks = document.querySelector(".navLinks");
const linksMenu = document.querySelectorAll(".navLinks a");

const botaoTema = document.querySelector("#botaoTema");

const botoesFiltro = document.querySelectorAll(".filtro");
const projetos = document.querySelectorAll(".projeto");

const elementosRevelar = document.querySelectorAll(".revelar");


// ==================================================
// MENU MOBILE
// ==================================================

function atualizarMenu() {

    const menuAberto = navLinks.classList.contains("menuAberto");

    botaoMenu.innerHTML = menuAberto
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

    botaoMenu.setAttribute(
        "aria-expanded",
        menuAberto
    );
}


botaoMenu.addEventListener("click", () => {

    navLinks.classList.toggle("menuAberto");

    atualizarMenu();

});


linksMenu.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("menuAberto");

        atualizarMenu();

    });

});


// ==================================================
// DARK / LIGHT MODE
// ==================================================

function aplicarTema(tema) {

    const temaClaro = tema === "light";

    document.body.classList.toggle(
        "lightMode",
        temaClaro
    );


    if (temaClaro) {

        botaoTema.innerHTML =
            '<i class="fa-solid fa-moon"></i>';

        botaoTema.title =
            "Usar tema escuro";

    } else {

        botaoTema.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

        botaoTema.title =
            "Usar tema claro";

    }

}


// TEMA SALVO

const temaSalvo =
    localStorage.getItem("tema") || "dark";

aplicarTema(temaSalvo);


// TROCAR TEMA

botaoTema.addEventListener("click", () => {

    const estaClaro =
        document.body.classList.contains("lightMode");


    const novoTema =
        estaClaro
            ? "dark"
            : "light";


    aplicarTema(novoTema);


    localStorage.setItem(
        "tema",
        novoTema
    );

});


// ==================================================
// FILTRO DOS PROJETOS
// ==================================================

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        // Remove o ativo de todos

        botoesFiltro.forEach(item => {

            item.classList.remove("filtroAtivo");

        });


        // Ativa o botão clicado

        botao.classList.add("filtroAtivo");


        const filtro =
            botao.dataset.filtro;


        // Verifica cada projeto

        projetos.forEach(projeto => {

            const tecnologias =
                projeto.dataset.tecnologias.split(" ");


            const deveMostrar =
                filtro === "todos" ||
                tecnologias.includes(filtro);


            projeto.classList.toggle(
                "projetoEscondido",
                !deveMostrar
            );

        });

    });

});


// ==================================================
// ANIMAÇÃO AO SCROLL
// ==================================================

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(

        (entradas, observador) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    entrada.target.classList.add(
                        "visivel"
                    );


                    // Depois que apareceu,
                    // não precisa observar novamente

                    observador.unobserve(
                        entrada.target
                    );

                }

            });

        },

        {
            threshold: 0.50
        }

    );


    elementosRevelar.forEach(elemento => {

        observer.observe(elemento);

    });

} else {

    // Fallback para navegadores antigos

    elementosRevelar.forEach(elemento => {

        elemento.classList.add("visivel");

    });

}


// ==================================================
// EFEITOS THREE.JS
//
// Fundo animado de partículas (constelação) e um
// ícone 3D interativo no hero. Ambos acompanham o
// tema (claro/escuro) trocado acima e respeitam o
// "movimento reduzido" do sistema operacional.
// ==================================================

if (typeof THREE !== "undefined") {

    const prefereMovimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const CORES_TEMA = {
        escuro: 0x8b7cc7,
        claro: 0x0038c4 
    };


    function corAtualTema() {

        const temaClaro = document.body.classList.contains("lightMode");

        return temaClaro
            ? CORES_TEMA.claro
            : CORES_TEMA.escuro;

    }


    // Callbacks avisados sempre que o tema mudar,
    // para atualizar as cores dos materiais 3D

    const callbacksDeTema = [];

    function aoTrocarTema(callback) {

        callbacksDeTema.push(callback);

    }


    const observadorTema = new MutationObserver(() => {

        const cor = corAtualTema();

        callbacksDeTema.forEach(callback => {

            callback(cor);

        });

    });


    observadorTema.observe(document.body, {
        attributes: true,
        attributeFilter: ["class"]
    });


    // ==============================================
    // FUNDO DE PARTÍCULAS / CONSTELAÇÃO
    // ==============================================

    function iniciarFundoThree() {

        const container = document.querySelector("#three-bg");
        if (!container) return;


        const largura = window.innerWidth;
        const altura = window.innerHeight;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            60,
            largura / altura,
            10,
            2000
        );
        camera.position.z = 500;


        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(largura, altura);

        container.appendChild(renderer.domElement);


        const QUANTIDADE = largura < 700 ? 70 : 150;
        const LIMITE_X = 550;
        const LIMITE_Y = 550;
        const LIMITE_Z = 250;
        const DISTANCIA_LINHA = 130;

        const posicoes = new Float32Array(QUANTIDADE * 3);
        const velocidades = [];


        for (let i = 0; i < QUANTIDADE; i++) {

            posicoes[i * 3] = (Math.random() - 0.5) * 2 * LIMITE_X;
            posicoes[i * 3 + 1] = (Math.random() - 0.5) * 2 * LIMITE_Y;
            posicoes[i * 3 + 2] = (Math.random() - 0.5) * 2 * LIMITE_Z;

            velocidades.push({
                x: (Math.random() - 0.5) * 0.25,
                y: (Math.random() - 0.5) * 0.25,
                z: (Math.random() - 0.5) * 0.25
            });

        }


        const geometriaPontos = new THREE.BufferGeometry();
        geometriaPontos.setAttribute(
            "position",
            new THREE.BufferAttribute(posicoes, 3)
        );

        const materialPontos = new THREE.PointsMaterial({
            color: corAtualTema(),
            size: 3,
            transparent: true,
            opacity: 0.6,
            sizeAttenuation: true
        });

        const pontos = new THREE.Points(geometriaPontos, materialPontos);
        scene.add(pontos);


        const geometriaLinhas = new THREE.BufferGeometry();
        const materialLinhas = new THREE.LineBasicMaterial({
            color: corAtualTema(),
            transparent: true,
            opacity: 0.12
        });

        const linhas = new THREE.LineSegments(geometriaLinhas, materialLinhas);
        scene.add(linhas);


        function atualizarLinhas() {

            const pos = geometriaPontos.attributes.position.array;
            const pontosLinha = [];

            for (let a = 0; a < QUANTIDADE; a++) {

                for (let b = a + 1; b < QUANTIDADE; b++) {

                    const dx = pos[a * 3] - pos[b * 3];
                    const dy = pos[a * 3 + 1] - pos[b * 3 + 1];
                    const dz = pos[a * 3 + 2] - pos[b * 3 + 2];

                    const distancia = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (distancia < DISTANCIA_LINHA) {

                        pontosLinha.push(pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]);
                        pontosLinha.push(pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]);

                    }

                }

            }

            geometriaLinhas.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array(pontosLinha), 3)
            );

        }


        // Leve efeito de paralaxe seguindo o mouse

        let mouseX = 0;
        let mouseY = 0;

        window.addEventListener("mousemove", evento => {

            mouseX = (evento.clientX / window.innerWidth - 0.05) * 2;
            mouseY = (evento.clientY / window.innerHeight - 0.05) * 2;

        });


        window.addEventListener("resize", () => {

            const w = window.innerWidth;
            const h = window.innerHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);

        });


        aoTrocarTema(cor => {

            materialPontos.color.setHex(cor);
            materialLinhas.color.setHex(cor);

        });


        let quadro = 0;

        function animar() {

            requestAnimationFrame(animar);
            quadro++;

            const pos = geometriaPontos.attributes.position.array;

            for (let i = 0; i < QUANTIDADE; i++) {

                pos[i * 3] += velocidades[i].x;
                pos[i * 3 + 1] += velocidades[i].y;
                pos[i * 3 + 2] += velocidades[i].z;

                if (Math.abs(pos[i * 3]) > LIMITE_X) velocidades[i].x *= -1;
                if (Math.abs(pos[i * 3 + 1]) > LIMITE_Y) velocidades[i].y *= -1;
                if (Math.abs(pos[i * 3 + 2]) > LIMITE_Z) velocidades[i].z *= -1;

            }

            geometriaPontos.attributes.position.needsUpdate = true;


            // Recalcula as linhas a cada poucos quadros (desempenho)

            if (quadro % 4 === 0) atualizarLinhas();


            camera.position.x += (mouseX * 70 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 70 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);

        }


        if (!prefereMovimentoReduzido) {

            animar();

        } else {

            renderer.render(scene, camera);

        }

    }


    // ==============================================
    // ÍCONE 3D INTERATIVO (ICOSAEDRO) NO HERO
    // ==============================================

    function iniciarIconeHeroThree() {

        const container = document.querySelector("#hero3d");
        if (!container) return;


        const largura = container.clientWidth || 220;
        const altura = container.clientHeight || 220;

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, largura / altura, 0.1, 100);
        camera.position.z = 5;


        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(largura, altura);

        container.appendChild(renderer.domElement);


        const geometria = new THREE.IcosahedronGeometry(1.7, 1);
        const material = new THREE.MeshBasicMaterial({
            color: corAtualTema(),
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });

        const forma = new THREE.Mesh(geometria, material);
        scene.add(forma);


        // Camada interna, sutil, para dar sensação de profundidade

        const geometriaInterna = new THREE.IcosahedronGeometry(1.68, 1);
        const materialInterno = new THREE.MeshBasicMaterial({
            color: corAtualTema(),
            transparent: true,
            opacity: 0.06
        });

        scene.add(new THREE.Mesh(geometriaInterna, materialInterno));


        aoTrocarTema(cor => {

            material.color.setHex(cor);
            materialInterno.color.setHex(cor);

        });


        let alvoRotacaoX = 0;
        let alvoRotacaoY = 0;

        container.addEventListener("mousemove", evento => {

            const retangulo = container.getBoundingClientRect();

            const x = (evento.clientX - retangulo.left) / retangulo.width - 2.5;
            const y = (evento.clientY - retangulo.top) / retangulo.height - 0.5;

            alvoRotacaoY = x * 1.1;
            alvoRotacaoX = y * 1.1;

        });


        container.addEventListener("mouseleave", () => {

            alvoRotacaoX = 0;
            alvoRotacaoY = 0;

        });


        window.addEventListener("resize", () => {

            const w = container.clientWidth || 220;
            const h = container.clientHeight || 220;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);

        });


        function animar() {

            requestAnimationFrame(animar);

            forma.rotation.y += 0.05;
            forma.rotation.x += 0.05;

            forma.rotation.y += (alvoRotacaoY - forma.rotation.y) * 0.03;
            forma.rotation.x += (alvoRotacaoX - forma.rotation.x) * 0.03;

            renderer.render(scene, camera);

        }


        if (!prefereMovimentoReduzido) {

            animar();

        } else {

            renderer.render(scene, camera);

        }

    }


    iniciarFundoThree();
    iniciarIconeHeroThree();

}