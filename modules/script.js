// =======================
// NO USAR IMPORT - TODO CON FETCH
// =======================

const body = document.body;

// Variables globales que se llenarán con fetch
let textosHero = [];
let categorias = [];
let productos = [];
let megaMenuData = {};

// Variables para el carrusel de grid
let productosActuales = [];      // Lista de productos a mostrar (pueden ser filtrados)
let paginaActual = 0;
let productosPorPagina = 4;
let totalPaginas = 0;

// Referencias a elementos del carrusel
let productsGrid;                // grid contenedor
let productsSection;             // sección de productos
let prevBtn, nextBtn, dotsContainer;

// =======================
// FUNCIÓN PRINCIPAL: OBTENER DATOS Y CONSTRUIR PÁGINA
// =======================
async function iniciarPagina() {
  try {
    // Ajusta la ruta según tu estructura
    const respuesta = await fetch('../data/data.json');
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();

    textosHero = datos.textosHero;
    categorias = datos.categorias;
    productos = datos.productos;
    megaMenuData = datos.megaMenuData;

    construirHeader();
    construirHero();
    construirFeatures();
    construirProductos();   // esto construye el grid carrusel

    configurarEventos();

    if (typeof lucide !== 'undefined') lucide.createIcons();
  } catch (error) {
    console.error('Error al cargar data.json:', error);
    body.innerHTML = '<p style="color:red; text-align:center; margin-top:50px;">❌ Error al cargar los datos. Verifica la ruta del archivo data/data.json</p>';
  }
}

// =======================
// CONSTRUIR HEADER (igual que antes)
// =======================
function construirHeader() {
  const header = document.createElement("header");

  const topBar = document.createElement("div");
  topBar.classList.add("header-top");
  topBar.innerHTML = `
    <div class="logo-area">
      <img src="../icons/coreSystems-logo.png" class="logo-img">
      <h1>CoreSystems</h1>
    </div>
  `;

  const search = document.createElement("div");
  search.classList.add("search-bar");
  search.innerHTML = `
    <input type="text" id="searchInput" placeholder="Gaming Laptop">
    <button id="searchBtn"><i data-lucide="search"></i></button>
  `;
  const input = search.querySelector("#searchInput");
  const textosInput = ["Search for a gaming laptop...", "Search for a new phone...", "Search for a smart TV..."];
  input.placeholder = textosInput[Math.floor(Math.random() * textosInput.length)];

  const icons = document.createElement("div");
  icons.classList.add("icons");
  icons.innerHTML = `
    <button><i data-lucide="heart"></i></button>
    <button><i data-lucide="user"></i></button>
    <button><i data-lucide="shopping-cart"></i></button>
  `;
  topBar.appendChild(search);
  topBar.appendChild(icons);

  const nav = document.createElement("nav");
  nav.classList.add("navbar");

  const ul = document.createElement("ul");
  ul.classList.add("nav-categories");

  categorias.forEach(cat => {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.textContent = cat;

    if (megaMenuData[cat]) {
      const data = megaMenuData[cat];
      const panel = document.createElement("div");
      panel.classList.add("mega-panel");

      const left = document.createElement("div");
      left.classList.add("mega-left");
      data.columns.forEach(col => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("mega-col");
        colDiv.innerHTML = `<h4>${col.title}</h4>`;
        const p = document.createElement("p");
        p.textContent = col.items.join(" | ");
        colDiv.appendChild(p);
        left.appendChild(colDiv);
      });

      const mid = document.createElement("div");
      mid.classList.add("mega-mid");
      mid.innerHTML = `
        <h4><span class="mega-icon">&#9633;</span> Accessories</h4>
        <p class="mega-subtitle">${data.accessories.title}</p>
        ${data.accessories.items.map(i => `<a href="#">${i}</a>`).join("")}
      `;

      const right = document.createElement("div");
      right.classList.add("mega-right");
      right.innerHTML = `
        <h4><span class="mega-icon">&#9675;</span> More</h4>
        <p class="mega-subtitle">${data.more.title}</p>
        ${data.more.items.map(i => `<a href="#">${i}</a>`).join("")}
      `;

      panel.appendChild(left);
      panel.appendChild(mid);
      panel.appendChild(right);
      li.appendChild(panel);
    }
    ul.appendChild(li);
  });

  nav.innerHTML = `<button class="menu-btn"><i data-lucide="menu"></i> All Categories</button>`;
  const allCatPanel = document.createElement("div");
  allCatPanel.classList.add("all-cat-panel");
  const allCatInner = document.createElement("div");
  allCatInner.classList.add("all-cat-inner");

  Object.keys(megaMenuData).forEach(cat => {
    const catItem = document.createElement("div");
    catItem.classList.add("all-cat-item");
    catItem.innerHTML = `
      <span class="all-cat-name">${cat}</span>
      <i data-lucide="chevron-right" class="all-cat-arrow"></i>
    `;
    const subPanel = document.createElement("div");
    subPanel.classList.add("all-cat-sub");
    const data = megaMenuData[cat];

    data.columns.forEach(col => {
      const colDiv = document.createElement("div");
      colDiv.classList.add("all-cat-sub-col");
      colDiv.innerHTML = `<h4>${col.title}</h4><p>${col.items.join(" | ")}</p>`;
      subPanel.appendChild(colDiv);
    });
    const accDiv = document.createElement("div");
    accDiv.classList.add("all-cat-sub-col");
    accDiv.innerHTML = `<h4>${data.accessories.title}</h4>${data.accessories.items.map(i => `<a href="#">${i}</a>`).join("<br>")}`;
    subPanel.appendChild(accDiv);
    const moreDiv = document.createElement("div");
    moreDiv.classList.add("all-cat-sub-col");
    moreDiv.innerHTML = `<h4>${data.more.title}</h4>${data.more.items.map(i => `<a href="#">${i}</a>`).join("<br>")}`;
    subPanel.appendChild(moreDiv);

    catItem.appendChild(subPanel);
    allCatInner.appendChild(catItem);
  });
  allCatPanel.appendChild(allCatInner);
  nav.appendChild(ul);
  nav.appendChild(allCatPanel);

  const menuBtn = nav.querySelector(".menu-btn");
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    allCatPanel.classList.toggle("active");
  });
  document.addEventListener("click", (e) => {
    if (!nav.contains(e.target)) allCatPanel.classList.remove("active");
  });

  header.appendChild(topBar);
  header.appendChild(nav);
  body.appendChild(header);
}

// =======================
// HERO
// =======================
function construirHero() {
  const hero = document.createElement("section");
  hero.classList.add("hero");
  const textoAleatorio = textosHero[Math.floor(Math.random() * textosHero.length)];
  hero.innerHTML = `
    <h2>${textoAleatorio}</h2>
    <p>For the best price too!</p>
    <div class="hero-buttons">
      <button class="primary">View Sales</button>
      <button class="secondary">Explore Categories</button>
    </div>
  `;
  body.appendChild(hero);
}

// =======================
// FEATURES
// =======================
function construirFeatures() {
  const features = document.createElement("section");
  features.classList.add("features");
  features.innerHTML = `
    <h2>Check some of these things out!</h2>
    <div class="features-grid">
      <div class="card"><i data-lucide="box" class="feature-icon"></i><h3>Enter your Location</h3><p>So we know where to send your products.</p></div>
      <div class="card"><i data-lucide="user" class="feature-icon"></i><h3>Make an Account</h3><p>Access all shopping features.</p></div>
      <div class="card"><i data-lucide="clock" class="feature-icon"></i><h3>Free Delivery</h3><p>Check eligible products.</p></div>
      <div class="card"><i data-lucide="zap" class="feature-icon"></i><h3>Most Popular</h3><p>See what everyone is buying.</p></div>
    </div>
  `;
  body.appendChild(features);
}

// =======================
// CONSTRUIR CARRUSEL DE GRID (4 productos por página)
// =======================
function construirProductos() {
  productsSection = document.createElement("section");
  productsSection.classList.add("products");
  productsSection.innerHTML = `<h2>Today's items on sale</h2>`;

  // Contenedor del carrusel (envoltura)
  const carouselWrapper = document.createElement("div");
  carouselWrapper.classList.add("carousel-grid-wrapper");

  // Grid de productos (se muestra con CSS Grid, 4 columnas)
  productsGrid = document.createElement("div");
  productsGrid.classList.add("products-grid");
  carouselWrapper.appendChild(productsGrid);

  // Botones de navegación
  const navButtons = document.createElement("div");
  navButtons.classList.add("carousel-nav-buttons");
  prevBtn = document.createElement("button");
  prevBtn.classList.add("carousel-btn-grid", "prev");
  prevBtn.innerHTML = "❮";
  nextBtn = document.createElement("button");
  nextBtn.classList.add("carousel-btn-grid", "next");
  nextBtn.innerHTML = "❯";
  navButtons.appendChild(prevBtn);
  navButtons.appendChild(nextBtn);
  carouselWrapper.appendChild(navButtons);

  // Contenedor de puntos (indicadores de página)
  dotsContainer = document.createElement("div");
  dotsContainer.classList.add("carousel-dots");
  carouselWrapper.appendChild(dotsContainer);

  productsSection.appendChild(carouselWrapper);
  body.appendChild(productsSection);

  // Establecer los productos actuales (todos al inicio)
  productosActuales = [...productos];
  totalPaginas = Math.ceil(productosActuales.length / productosPorPagina);
  paginaActual = 0;
  actualizarGrid();

  // Eventos de los botones
  prevBtn.addEventListener("click", () => {
    if (totalPaginas === 0) return;
    paginaActual = (paginaActual - 1 + totalPaginas) % totalPaginas;
    actualizarGrid();
  });
  nextBtn.addEventListener("click", () => {
    if (totalPaginas === 0) return;
    paginaActual = (paginaActual + 1) % totalPaginas;
    actualizarGrid();
  });
}

function actualizarGrid() {
  if (!productsGrid) return;

  // Calcular índices de inicio y fin
  const start = paginaActual * productosPorPagina;
  const end = start + productosPorPagina;
  const productosPagina = productosActuales.slice(start, end);

  // Limpiar grid
  productsGrid.innerHTML = "";

  // Si no hay productos, mostrar mensaje
  if (productosPagina.length === 0) {
    productsGrid.innerHTML = "<p>No hay productos disponibles</p>";
  } else {
    productosPagina.forEach(p => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p>${p.precio}</p>
      `;
      productsGrid.appendChild(card);
    });
  }

  // Actualizar puntos indicadores
  actualizarPuntos();
}

function actualizarPuntos() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = "";
  if (totalPaginas <= 1) {
    dotsContainer.style.display = "none";
    return;
  }
  dotsContainer.style.display = "flex";
  for (let i = 0; i < totalPaginas; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === paginaActual) dot.classList.add("active");
    dot.addEventListener("click", () => {
      paginaActual = i;
      actualizarGrid();
    });
    dotsContainer.appendChild(dot);
  }
}

// =======================
// CONFIGURAR EVENTOS (búsqueda y panel de sugerencias)
// =======================
function configurarEventos() {
  const searchDiv = document.querySelector(".search-bar");
  if (!searchDiv) return;
  const input = searchDiv.querySelector("#searchInput");
  const searchBtn = searchDiv.querySelector("#searchBtn");

  const searchContainer = document.createElement("div");
  searchContainer.classList.add("search-dropdown");
  searchDiv.appendChild(searchContainer);

  function showSuggestions(text) {
    searchContainer.innerHTML = "";
    const panel = document.createElement("div");
    panel.classList.add("search-panel");

    const left = document.createElement("div");
    left.classList.add("search-left");
    left.innerHTML = `<h4>Most searched</h4><div class="tags">${categorias.map(c => `<span>${c}</span>`).join("")}</div>`;

    const right = document.createElement("div");
    right.classList.add("search-right");
    let resultados = productos;
    if (text) {
      resultados = productos.filter(p => p.nombre.toLowerCase().includes(text.toLowerCase()));
    }
    right.innerHTML = `
      <h4>Recommended products</h4>
      ${resultados.slice(0, 4).map(p => `
        <div class="search-product">
          <img src="${p.imagen}">
          <div><p>${p.nombre}</p><strong>${p.precio}</strong></div>
        </div>
      `).join("")}
    `;
    panel.appendChild(left);
    panel.appendChild(right);
    searchContainer.appendChild(panel);
    searchContainer.style.display = "block";
  }

  input.addEventListener("focus", () => showSuggestions(input.value));
  input.addEventListener("input", (e) => showSuggestions(e.target.value));
  document.addEventListener("click", (e) => {
    if (!searchDiv.contains(e.target)) searchContainer.style.display = "none";
  });

  // Búsqueda: filtrar productos y reiniciar carrusel
  searchBtn.addEventListener("click", () => {
    const query = input.value.trim();
    if (query === "") {
      productosActuales = [...productos];
    } else {
      productosActuales = productos.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase())
      );
    }
    totalPaginas = Math.ceil(productosActuales.length / productosPorPagina);
    paginaActual = 0;
    if (totalPaginas === 0) {
      // No hay resultados, mostrar grid vacío
      productsGrid.innerHTML = "<p>No se encontraron productos</p>";
      dotsContainer.innerHTML = "";
      dotsContainer.style.display = "none";
    } else {
      actualizarGrid();
    }
    searchContainer.style.display = "none";
  });
}

// =======================
// INICIAR
// =======================
document.addEventListener("DOMContentLoaded", iniciarPagina);