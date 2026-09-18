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

    botaoMenu.setAttribute("aria-expanded", menuAberto);
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

const temaSalvo =
    localStorage.getItem("tema") || "dark";

aplicarTema(temaSalvo);

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

        botoesFiltro.forEach(item => {
            item.classList.remove("filtroAtivo");
        });

        botao.classList.add("filtroAtivo");

        const filtro =
            botao.dataset.filtro;

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
// ANIMAÇÃO DE ENTRADA DAS SEÇÕES
// REPETE AO DESCER E AO SUBIR
// ==================================================

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entradas) => {

            entradas.forEach(entrada => {

                if (entrada.isIntersecting) {

                    // Entrou na tela
                    entrada.target.classList.add("visivel");

                } else {

                    // Saiu da tela
                    // Remove para poder animar novamente
                    entrada.target.classList.remove("visivel");

                }

            });

        },
        {
            threshold: 0.15
        }
    );


    elementosRevelar.forEach(elemento => {
        observer.observe(elemento);
    });

} else {

    elementosRevelar.forEach(elemento => {
        elemento.classList.add("visivel");
    });

}

// ==================================================
// ANIMAÇÃO DE SCROLL DO HERO
// ==================================================

const introScroll =
    document.querySelector(".introScroll");

const introMeu =
    document.querySelector(".introMeu");

const introPortfolio =
    document.querySelector(".introPortfolio");

const introCentro =
    document.querySelector(".introCentro");

const introIndicador =
    document.querySelector(".introIndicador");


function limitar(valor, minimo, maximo) {
    return Math.min(
        Math.max(valor, minimo),
        maximo
    );
}


function atualizarIntroScroll() {

    if (!introScroll) return;


    const rect =
        introScroll.getBoundingClientRect();


    const alturaAnimacao =
        introScroll.offsetHeight -
        window.innerHeight;


    if (alturaAnimacao <= 0) return;


    // 0 = começo
    // 1 = final da intro

    const progresso =
        limitar(
            -rect.top / alturaAnimacao,
            0,
            1
        );


    // Distância que as palavras vão percorrer

    const distanciaHorizontal =
        window.innerWidth < 700
            ? 60
            : 40;


    // --------------------------
    // MEU
    // --------------------------

    if (introMeu) {

        const movimentoMeu =
            -progresso *
            distanciaHorizontal;

        introMeu.style.transform =
            `translate3d(
                ${movimentoMeu}px,
                0,
                0
            )`;
    }


    // --------------------------
    // PORTFÓLIO
    // --------------------------

    if (introPortfolio) {

        const movimentoPortfolio =
            progresso *
            distanciaHorizontal;

        introPortfolio.style.transform =
            `translate3d(
                ${movimentoPortfolio}px,
                0,
                0
            )`;
    }


    // --------------------------
    // CENTRO
    // --------------------------

    if (introCentro) {

        const opacidade =
            limitar(
                1 - progresso * 1.4,
                0,
                1
            );


        introCentro.style.opacity =
            opacidade;


        introCentro.style.transform =
            `scale(
                ${1 + progresso * 0.15}
            )`;
    }


    // --------------------------
    // INDICADOR DE SCROLL
    // --------------------------

    if (introIndicador) {

        introIndicador.style.opacity =
            limitar(
                1 - progresso * 3,
                0,
                1
            );
    }


    introScroll.style.setProperty(
        "--progresso-scroll",
        progresso
    );
}

// ==================================================
// PARALLAX DOS PROJETOS
// ==================================================

function atualizarProjetosScroll() {

    projetos.forEach((projeto, index) => {

        if (
            projeto.classList.contains(
                "projetoEscondido"
            )
        ) {
            return;
        }

        const rect =
            projeto.getBoundingClientRect();

        const centroTela =
            window.innerHeight / 2;

        const centroProjeto =
            rect.top +
            rect.height / 2;

        const distancia =
            centroProjeto -
            centroTela;

        const progresso =
            limitar(
                distancia / window.innerHeight,
                -1,
                1
            );


        const deslocamento =
            progresso * -12;

        const rotacao =
            progresso *
            (index % 2 === 0 ? 0.6 : -0.6);


        projeto.style.setProperty(
            "--parallax-y",
            `${deslocamento}px`
        );

        projeto.style.setProperty(
            "--rotacao-scroll",
            `${rotacao}deg`
        );
    });
}


// ==================================================
// ANIMAÇÃO DOS CARDS EM SEQUÊNCIA
// ==================================================

const gruposAnimados = [
    ".gridSkills .skillCard",
    ".gridProjetos .projeto",
    ".gridCertificados .certificado",
    ".roadmap .roadmapItem"
];


gruposAnimados.forEach(seletor => {

    const elementos =
        document.querySelectorAll(seletor);

    elementos.forEach(
        (elemento, index) => {

            elemento.style.setProperty(
                "--delay-item",
                `${index * 80}ms`
            );
        }
    );
});


// ==================================================
// OTIMIZAÇÃO DO SCROLL
// ==================================================

let aguardandoFrame = false;


function atualizarScroll() {

    atualizarIntroScroll();
    atualizarProjetosScroll();

    aguardandoFrame = false;
}


window.addEventListener(
    "scroll",
    () => {

        if (!aguardandoFrame) {

            requestAnimationFrame(
                atualizarScroll
            );

            aguardandoFrame = true;
        }
    },
    {
        passive: true
    }
);


window.addEventListener(
    "resize",
    atualizarScroll
);


atualizarScroll();


// ==================================================
// EFEITOS THREE.JS
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

        const temaClaro =
            document.body.classList.contains("lightMode");

        return temaClaro
            ? CORES_TEMA.claro
            : CORES_TEMA.escuro;
    }


    // ==============================================
    // ATUALIZAR CORES QUANDO TROCAR O TEMA
    // ==============================================

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
    // FUNDO DE PARTÍCULAS
    // ==============================================

    function iniciarFundoThree() {

        const container =
            document.querySelector("#three-bg");

        if (!container) return;


        const largura = window.innerWidth;
        const altura = window.innerHeight;


        const scene = new THREE.Scene();


        const camera =
            new THREE.PerspectiveCamera(
                60,
                largura / altura,
                10,
                2000
            );

        camera.position.z = 500;


        const renderer =
            new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );

        renderer.setSize(
            largura,
            altura
        );


        container.appendChild(
            renderer.domElement
        );


        const QUANTIDADE =
            largura < 700 ? 70 : 150;

        const LIMITE_X = 550;
        const LIMITE_Y = 550;
        const LIMITE_Z = 250;

        const DISTANCIA_LINHA = 130;


        const posicoes =
            new Float32Array(
                QUANTIDADE * 3
            );

        const velocidades = [];


        for (
            let i = 0;
            i < QUANTIDADE;
            i++
        ) {

            posicoes[i * 3] =
                (Math.random() - 0.5) *
                2 *
                LIMITE_X;


            posicoes[i * 3 + 1] =
                (Math.random() - 0.5) *
                2 *
                LIMITE_Y;


            posicoes[i * 3 + 2] =
                (Math.random() - 0.5) *
                2 *
                LIMITE_Z;


            velocidades.push({
                x:
                    (Math.random() - 0.5) *
                    0.25,

                y:
                    (Math.random() - 0.5) *
                    0.25,

                z:
                    (Math.random() - 0.5) *
                    0.25
            });
        }


        // ==========================================
        // PONTOS
        // ==========================================

        const geometriaPontos =
            new THREE.BufferGeometry();


        geometriaPontos.setAttribute(
            "position",

            new THREE.BufferAttribute(
                posicoes,
                3
            )
        );


        const materialPontos =
            new THREE.PointsMaterial({

                color: corAtualTema(),

                size: 3,

                transparent: true,

                opacity: 0.6,

                sizeAttenuation: true
            });


        const pontos =
            new THREE.Points(
                geometriaPontos,
                materialPontos
            );


        scene.add(pontos);


        // ==========================================
        // LINHAS ENTRE OS PONTOS
        // ==========================================

        const geometriaLinhas =
            new THREE.BufferGeometry();


        const materialLinhas =
            new THREE.LineBasicMaterial({

                color: corAtualTema(),

                transparent: true,

                opacity: 0.12
            });


        const linhas =
            new THREE.LineSegments(
                geometriaLinhas,
                materialLinhas
            );


        scene.add(linhas);


        function atualizarLinhas() {

            const pos =
                geometriaPontos
                    .attributes
                    .position
                    .array;


            const pontosLinha = [];


            for (
                let a = 0;
                a < QUANTIDADE;
                a++
            ) {

                for (
                    let b = a + 1;
                    b < QUANTIDADE;
                    b++
                ) {

                    const dx =
                        pos[a * 3] -
                        pos[b * 3];


                    const dy =
                        pos[a * 3 + 1] -
                        pos[b * 3 + 1];


                    const dz =
                        pos[a * 3 + 2] -
                        pos[b * 3 + 2];


                    const distancia =
                        Math.sqrt(
                            dx * dx +
                            dy * dy +
                            dz * dz
                        );


                    if (
                        distancia <
                        DISTANCIA_LINHA
                    ) {

                        pontosLinha.push(
                            pos[a * 3],
                            pos[a * 3 + 1],
                            pos[a * 3 + 2]
                        );


                        pontosLinha.push(
                            pos[b * 3],
                            pos[b * 3 + 1],
                            pos[b * 3 + 2]
                        );
                    }
                }
            }


            geometriaLinhas.setAttribute(
                "position",

                new THREE.BufferAttribute(
                    new Float32Array(
                        pontosLinha
                    ),

                    3
                )
            );
        }


        // ==========================================
        // MOVIMENTO COM MOUSE
        // ==========================================

        let mouseX = 0;
        let mouseY = 0;


        window.addEventListener(
            "mousemove",
            evento => {

                mouseX =
                    (
                        evento.clientX /
                        window.innerWidth -
                        0.05
                    ) * 2;


                mouseY =
                    (
                        evento.clientY /
                        window.innerHeight -
                        0.05
                    ) * 2;
            }
        );


        // ==========================================
        // RESPONSIVIDADE
        // ==========================================

        window.addEventListener(
            "resize",
            () => {

                const w =
                    window.innerWidth;

                const h =
                    window.innerHeight;


                camera.aspect =
                    w / h;


                camera.updateProjectionMatrix();


                renderer.setSize(
                    w,
                    h
                );
            }
        );


        // ==========================================
        // TROCA DE TEMA
        // ==========================================

        aoTrocarTema(cor => {

            materialPontos
                .color
                .setHex(cor);


            materialLinhas
                .color
                .setHex(cor);
        });


        // ==========================================
        // LOOP
        // ==========================================

        let quadro = 0;


        function animar() {

            requestAnimationFrame(
                animar
            );


            quadro++;


            const pos =
                geometriaPontos
                    .attributes
                    .position
                    .array;


            for (
                let i = 0;
                i < QUANTIDADE;
                i++
            ) {

                pos[i * 3] +=
                    velocidades[i].x;


                pos[i * 3 + 1] +=
                    velocidades[i].y;


                pos[i * 3 + 2] +=
                    velocidades[i].z;


                if (
                    Math.abs(
                        pos[i * 3]
                    ) > LIMITE_X
                ) {
                    velocidades[i].x *= -1;
                }


                if (
                    Math.abs(
                        pos[i * 3 + 1]
                    ) > LIMITE_Y
                ) {
                    velocidades[i].y *= -1;
                }


                if (
                    Math.abs(
                        pos[i * 3 + 2]
                    ) > LIMITE_Z
                ) {
                    velocidades[i].z *= -1;
                }
            }


            geometriaPontos
                .attributes
                .position
                .needsUpdate = true;


            if (quadro % 4 === 0) {
                atualizarLinhas();
            }


            camera.position.x +=
                (
                    mouseX * 70 -
                    camera.position.x
                ) * 0.02;


            camera.position.y +=
                (
                    -mouseY * 70 -
                    camera.position.y
                ) * 0.02;


            camera.lookAt(
                scene.position
            );


            renderer.render(
                scene,
                camera
            );
        }


        if (
            !prefereMovimentoReduzido
        ) {

            animar();

        } else {

            renderer.render(
                scene,
                camera
            );
        }
    }


    // ==============================================
    // ICOSAEDRO 3D DO HERO
    // ==============================================

    function iniciarIconeHeroThree() {

        const container =
            document.querySelector(
                "#hero3d"
            );

        if (!container) return;


        const largura =
            container.clientWidth ||
            220;

        const altura =
            container.clientHeight ||
            220;


        const scene =
            new THREE.Scene();


        const camera =
            new THREE.PerspectiveCamera(
                45,
                largura / altura,
                0.1,
                100
            );


        camera.position.z = 5;


        const renderer =
            new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        renderer.setSize(
            largura,
            altura
        );


        container.appendChild(
            renderer.domElement
        );


        // ==========================================
        // FORMA PRINCIPAL
        // ==========================================

        const geometria =
            new THREE.IcosahedronGeometry(
                1.7,
                1
            );


        const material =
            new THREE.MeshBasicMaterial({

                color: corAtualTema(),

                wireframe: true,

                transparent: true,

                opacity: 0.85
            });


        const forma =
            new THREE.Mesh(
                geometria,
                material
            );


        scene.add(forma);


        // ==========================================
        // CAMADA INTERNA
        // ==========================================

        const geometriaInterna =
            new THREE.IcosahedronGeometry(
                1.68,
                1
            );


        const materialInterno =
            new THREE.MeshBasicMaterial({

                color: corAtualTema(),

                transparent: true,

                opacity: 0.06
            });


        scene.add(
            new THREE.Mesh(
                geometriaInterna,
                materialInterno
            )
        );


        // ==========================================
        // TEMA
        // ==========================================

        aoTrocarTema(cor => {

            material
                .color
                .setHex(cor);


            materialInterno
                .color
                .setHex(cor);
        });


        // ==========================================
        // MOUSE
        // ==========================================

        let alvoRotacaoX = 0;
        let alvoRotacaoY = 0;


        container.addEventListener(
            "mousemove",
            evento => {

                const retangulo =
                    container
                        .getBoundingClientRect();


                const x =
                    (
                        evento.clientX -
                        retangulo.left
                    ) /
                    retangulo.width -
                    2.5;


                const y =
                    (
                        evento.clientY -
                        retangulo.top
                    ) /
                    retangulo.height -
                    0.5;


                alvoRotacaoY =
                    x * 1.1;


                alvoRotacaoX =
                    y * 1.1;
            }
        );


        container.addEventListener(
            "mouseleave",
            () => {

                alvoRotacaoX = 0;
                alvoRotacaoY = 0;
            }
        );


        // ==========================================
        // RESIZE
        // ==========================================

        window.addEventListener(
            "resize",
            () => {

                const w =
                    container.clientWidth ||
                    220;


                const h =
                    container.clientHeight ||
                    220;


                camera.aspect =
                    w / h;


                camera.updateProjectionMatrix();


                renderer.setSize(
                    w,
                    h
                );
            }
        );


        // ==========================================
        // LOOP DO ICOSAEDRO
        // ==========================================

        function animar() {

            requestAnimationFrame(
                animar
            );


            forma.rotation.y += 0.05;
            forma.rotation.x += 0.05;


            forma.rotation.y +=
                (
                    alvoRotacaoY -
                    forma.rotation.y
                ) * 0.03;


            forma.rotation.x +=
                (
                    alvoRotacaoX -
                    forma.rotation.x
                ) * 0.03;


            renderer.render(
                scene,
                camera
            );
        }


        if (
            !prefereMovimentoReduzido
        ) {

            animar();

        } else {

            renderer.render(
                scene,
                camera
            );
        }
    }


    // ==============================================
    // INICIAR
    // ==============================================

    iniciarFundoThree();
    iniciarIconeHeroThree();
}