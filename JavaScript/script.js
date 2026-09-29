// Menu Mobile
        const menuBtn = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

        // Carrossel
        let currentItem = 0;
        const items = document.querySelectorAll('.carousel-item');
        function showItem(index) {
            items.forEach(i => i.classList.remove('active'));
            if (index >= items.length) currentItem = 0;
            else if (index < 0) currentItem = items.length - 1;
            else currentItem = index;
            items[currentItem].classList.add('active');
        }
        function moveCarousel(step) { showItem(currentItem + step); }
        setInterval(() => moveCarousel(1), 5000);

        // Funções Ver Mais (Listas e Seções)
        function toggleList(listId, btn) {
            const list = document.getElementById(listId);
            const extra = list.querySelectorAll('.extra-member');
            const isHidden = extra[0].style.display === 'none' || extra[0].style.display === '';
            extra.forEach(item => item.style.display = isHidden ? 'block' : 'none');
            btn.innerText = isHidden ? 'VER MENOS' : 'VER MAIS';
        }

        function toggleSection(className, btn) {
            const elements = document.querySelectorAll('.' + className);
            const isHidden = elements[0].style.display === 'none' || elements[0].style.display === '';
            elements.forEach(el => el.style.display = isHidden ? (className.includes('event') ? 'flex' : 'block') : 'none');
            btn.innerText = isHidden ? 'Ver Menos' : 'Ver mais ' + (className.includes('pub') ? 'Publicações' : 'Eventos');
        }

        // Imagens da galeria
    const galleryImages = [
        {
            src: "Imagens/Laboratorio4.png",
            alt: "Laboratório de Neuroquímica e Biologia Celular"
        },
        {
            src: "Imagens/Laboratorio2.png",
            alt: "Atividades realizadas no laboratório"
        },
        {
            src: "Imagens/Laboratorio3.png",
            alt: "Pesquisadores do laboratório"
        }
    ];

    let currentGalleryImage = 0;

    // Elementos
    const mainGalleryImage =
        document.getElementById("main-gallery-image");

    const lightbox =
        document.getElementById("lightbox");

    const lightboxImage =
        document.getElementById("lightbox-image");

    const lightboxCounter =
        document.getElementById("lightbox-counter");

    const thumbnails =
        document.querySelectorAll(".gallery-thumbnail");


    // Atualizar imagem
    function updateGallery() {

        const image = galleryImages[currentGalleryImage];

        mainGalleryImage.src = image.src;
        mainGalleryImage.alt = image.alt;

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;

        lightboxCounter.textContent =
            `${currentGalleryImage + 1} / ${galleryImages.length}`;

        // Atualiza miniatura ativa
        thumbnails.forEach((thumbnail, index) => {

            if (index === currentGalleryImage) {
                thumbnail.classList.remove("border-transparent");
                thumbnail.classList.add("border-blue-600");
            } else {
                thumbnail.classList.remove("border-blue-600");
                thumbnail.classList.add("border-transparent");
            }

        });
    }


    // Selecionar imagem
    function selectImage(index) {

        currentGalleryImage = index;

        updateGallery();
    }


    // Próxima imagem
    function nextImage() {

        currentGalleryImage++;

        if (currentGalleryImage >= galleryImages.length) {
            currentGalleryImage = 0;
        }

        updateGallery();
    }


    // Imagem anterior
    function previousImage() {

        currentGalleryImage--;

        if (currentGalleryImage < 0) {
            currentGalleryImage = galleryImages.length - 1;
        }

        updateGallery();
    }


    // Abrir lightbox
    function openLightbox() {

        updateGallery();

        lightbox.classList.remove("hidden");
        lightbox.classList.add("flex");

        // Impede o scroll da página
        document.body.style.overflow = "hidden";
    }


    // Fechar lightbox
    function closeLightbox() {

        lightbox.classList.add("hidden");
        lightbox.classList.remove("flex");

        // Libera o scroll
        document.body.style.overflow = "";
    }


    // Teclado
    document.addEventListener("keydown", function(event) {

        // Só executa quando o lightbox estiver aberto
        if (lightbox.classList.contains("hidden")) {
            return;
        }

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

    });


    // Inicialização
    updateGallery();

    // ============================================================
    // CARREGAR MEMBROS DO LABNQ
    // ============================================================

    async function carregarMembros() {

        try {

            const resposta = await fetch("dados/membros.json");

            if (!resposta.ok) {
                throw new Error("Erro ao carregar membros.json");
            }

            const dados = await resposta.json();

            preencherLista(
                "list-pesquisadores",
                dados.pesquisadores
            );

            preencherLista(
                "list-estudantes",
                dados.estudantes
            );

            preencherLista(
                "list-tecnicos",
                dados.tecnicos
            );

        } catch (erro) {

            console.error(
                "Erro ao carregar os membros:",
                erro
            );

        }
    }


    // ============================================================
    // PREENCHER LISTA
    // ============================================================

    function preencherLista(id, membros) {

        const lista = document.getElementById(id);

        if (!lista) {
            return;
        }

        lista.innerHTML = "";

        if (!membros || membros.length === 0) {

            const item = document.createElement("li");

            item.textContent = "Nenhum membro encontrado.";

            lista.appendChild(item);

            return;
        }


        membros.forEach((membro, index) => {

            const item = document.createElement("li");

            item.textContent = membro.nome;

            /*
             * Os primeiros 5 membros ficam visíveis.
             * Os demais recebem a classe extra-member.
             */
            if (index >= 5) {

                item.classList.add("extra-member");

                item.style.display = "none";

            }

            lista.appendChild(item);

        });
    }


    // ============================================================
    // VER MAIS / VER MENOS
    // ============================================================

    function toggleList(listId, button) {

        const lista = document.getElementById(listId);

        if (!lista) {
            return;
        }

        const extras =
        lista.querySelectorAll(".extra-member");

        if (extras.length === 0) {

            return;

        }


        const estaVisivel =
        extras[0].style.display === "list-item";


        extras.forEach(item => {

            item.style.display =
            estaVisivel
            ? "none"
            : "list-item";

        });


        button.textContent =
        estaVisivel
        ? "VER MAIS"
        : "VER MENOS";
    }


    // ============================================================
    // INICIALIZAÇÃO
    // ============================================================

    document.addEventListener(
        "DOMContentLoaded",
        carregarMembros
    );

    function preencherLista(id, membros) {

        const lista = document.getElementById(id);

        if (!lista) {
            return;
        }

        lista.innerHTML = "";

        membros.forEach((membro, index) => {

            const item = document.createElement("li");

            item.className = "py-2";

            if (index >= 5) {
                item.classList.add("extra-member");
                item.style.display = "none";
            }

            item.innerHTML = `
            <div>
            <p class="font-semibold text-gray-800">
            ${membro.nome}
            </p>

            <p class="text-xs text-gray-500">
            ${membro.titulacao || "Titulação não informada"}
            </p>

            <p class="text-xs text-gray-500">
            Inclusão: ${membro.data_inclusao || "Período não informado"}
            </p>

            ${
                membro.lattes
                ? `
                <a
                href="${membro.lattes}"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1
                mt-1 text-xs text-blue-600
                hover:text-blue-800"
                >
                <i class="fas fa-external-link-alt"></i>
                Currículo Lattes
                </a>
                `
                : ""
            }
            </div>
            `;

            lista.appendChild(item);
        });
    }
