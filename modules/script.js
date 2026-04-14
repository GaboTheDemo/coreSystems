// =======================
// NO USAR IMPORT - TODO CON FETCH
// =======================

const body = document.body;

// Variables globales que se llenarán con fetch
let textosHero = [];
let categorias = [];
let productos = [];
let megaMenuData = {};

// Referencias a elementos dinámicos
let productsGrid;      // div con clase "products-grid"
let productsSection;   // sección de productos

// =======================
// FUNCIÓN PRINCIPAL: OBTENER DATOS Y CONSTRUIR PÁGINA
// =======================
async function iniciarPagina() {
  try {
    // --- Ajusta esta ruta según la ubicación real de tu data.json ---
    // Si tu script está en la raíz, usa "data/data.json"
    // Si está dentro de una carpeta "js", usa "../data/data.json"
    const respuesta = await fetch('../data/data.json');  // <--- CAMBIA SI ES NECESARIO
    if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
    const datos = await respuesta.json();

    // Asignar a las variables globales
    textosHero = datos.textosHero;
    categorias = datos.categorias;
    productos = datos.productos;
    megaMenuData = datos.megaMenuData;

    // Construir toda la interfaz
    construirHeader();
    construirHero();
    construirFeatures();
    construirProductos();

    // Configurar eventos (búsqueda, etc.)
    configurarEventos();

    // Inicializar iconos de Lucide (si está disponible)
    if (typeof lucide !== 'undefined') lucide.createIcons();
  } catch (error) {
    console.error('Error al cargar data.json:', error);
    body.innerHTML = '<p style="color:red; text-align:center; margin-top:50px;">❌ Error al cargar los datos. Verifica la ruta del archivo data/data.json</p>';
  }
}

// =======================
// CONSTRUIR HEADER (top bar + navbar + megamenús)
// =======================
function construirHeader() {
  const header = document.createElement("header");

  // TOP BAR
  const topBar = document.createElement("div");
  topBar.classList.add("header-top");
  topBar.innerHTML = `
    <div class="logo-area">
      <img src="../icons/coreSystems-logo.png" class="logo-img">
      <h1>CoreSystems</h1>
    </div>
  `;

  // SEARCH (input + botón)
  const search = document.createElement("div");
  search.classList.add("search-bar");
  search.innerHTML = `
    <input type="text" id="searchInput" placeholder="Gaming Laptop">
    <button id="searchBtn"><i data-lucide="search"></i></button>
  `;
  const input = search.querySelector("#searchInput");
  const textosInput = ["Search for a gaming laptop...", "Search for a new phone...", "Search for a smart TV..."];
  input.placeholder = textosInput[Math.floor(Math.random() * textosInput.length)];

  // Iconos
  const icons = document.createElement("div");
  icons.classList.add("icons");
  icons.innerHTML = `
    <button><i data-lucide="heart"></i></button>
    <button><i data-lucide="user"></i></button>
    <button><i data-lucide="shopping-cart"></i></button>
  `;
  topBar.appendChild(search);
  topBar.appendChild(icons);

  // NAVBAR
  const nav = document.createElement("nav");
  nav.classList.add("navbar");

  const ul = document.createElement("ul");
  ul.classList.add("nav-categories");

  // Crear items de categoría con megamenú
  categorias.forEach(cat => {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.textContent = cat;

    if (megaMenuData[cat]) {
      const data = megaMenuData[cat];
      const panel = document.createElement("div");
      panel.classList.add("mega-panel");

      // Columnas izquierdas
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

      // Accesorios
      const mid = document.createElement("div");
      mid.classList.add("mega-mid");
      mid.innerHTML = `
        <h4><span class="mega-icon">&#9633;</span> Accessories</h4>
        <p class="mega-subtitle">${data.accessories.title}</p>
        ${data.accessories.items.map(i => `<a href="#">${i}</a>`).join("")}
      `;

      // Más
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

  // Botón "All Categories"
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

  // Evento para mostrar/ocultar "All Categories"
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
// PRODUCTOS (grid)
// =======================
function construirProductos() {
  productsSection = document.createElement("section");
  productsSection.classList.add("products");
  productsSection.innerHTML = `<h2>Today's items on sale</h2>`;
  productsGrid = document.createElement("div");
  productsGrid.classList.add("products-grid");
  productsSection.appendChild(productsGrid);
  body.appendChild(productsSection);

  // Mostrar todos los productos
  actualizarGridProductos(productos);
}

function actualizarGridProductos(listaProductos) {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  listaProductos.forEach(p => {
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

// =======================
// CONFIGURAR EVENTOS (búsqueda y panel de sugerencias)
// =======================
function configurarEventos() {
  const searchDiv = document.querySelector(".search-bar");
  if (!searchDiv) return;
  const input = searchDiv.querySelector("#searchInput");
  const searchBtn = searchDiv.querySelector("#searchBtn");

  // Panel de sugerencias
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

  // =======================
  // BOTÓN DE BÚSQUEDA: FILTRA EL GRID PRINCIPAL
  // =======================
  searchBtn.addEventListener("click", () => {
    const query = input.value.trim();
    if (query === "") {
      actualizarGridProductos(productos);      // Mostrar todos
    } else {
      const filtrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(query.toLowerCase())
      );
      actualizarGridProductos(filtrados);
    }
    searchContainer.style.display = "none";
  });
}

// =======================
// INICIAR CUANDO EL DOM ESTÉ LISTO
// =======================
document.addEventListener("DOMContentLoaded", iniciarPagina);