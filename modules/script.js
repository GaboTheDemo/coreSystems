import { textosHero, categorias, productos } from "../data/products.js";

const body = document.body;

// =======================
// HEADER
// =======================

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

// SEARCH
const search = document.createElement("div");
search.classList.add("search-bar");

search.innerHTML = `
  <input type="text" id="searchInput" placeholder="Gaming Laptop">
  <button id="searchBtn"><i data-lucide="search"></i></button>
`;

// 🔥 IMPORTANTE: definir input DESPUÉS de crearlo
const input = search.querySelector("#searchInput");

// ICONS
const icons = document.createElement("div");
icons.classList.add("icons");

icons.innerHTML = `
  <button><i data-lucide="heart"></i></button>
  <button><i data-lucide="user"></i></button>
  <button><i data-lucide="shopping-cart"></i></button>
`;

topBar.appendChild(search);
topBar.appendChild(icons);

// =======================
// NAVBAR
// =======================

const nav = document.createElement("nav");
nav.classList.add("navbar");

const ul = document.createElement("ul");

categorias.forEach(cat => {
  const li = document.createElement("li");
  li.textContent = cat;
  ul.appendChild(li);
});

nav.innerHTML = `
  <button class="menu-btn">
    <i data-lucide="menu"></i> All Categories
  </button>
`;

nav.appendChild(ul);

// =======================
// HERO
// =======================

const hero = document.createElement("section");
hero.classList.add("hero");

hero.innerHTML = `
  <h2>${textosHero[Math.floor(Math.random() * textosHero.length)]}</h2>
  <p>For the best price too!</p>
  <div class="hero-buttons">
    <button class="primary">View Sales</button>
    <button class="secondary">Explore Categories</button>
  </div>
`;

// =======================
// FEATURES
// =======================

const features = document.createElement("section");
features.classList.add("features");

features.innerHTML = `
  <h2>Check some of these things out!</h2>
  <div class="features-grid">
    <div class="card">
      <i data-lucide="box" class="feature-icon"></i>
      <h3>Enter your Location</h3>
      <p>So we know where to send your products.</p>
    </div>

    <div class="card">
      <i data-lucide="user" class="feature-icon"></i>
      <h3>Make an Account</h3>
      <p>Access all shopping features.</p>
    </div>

    <div class="card">
      <i data-lucide="clock" class="feature-icon"></i>
      <h3>Free Delivery</h3>
      <p>Check eligible products.</p>
    </div>

    <div class="card">
      <i data-lucide="zap" class="feature-icon"></i>
      <h3>Most Popular</h3>
      <p>See what everyone is buying.</p>
    </div>
  </div>
`;

// =======================
// PRODUCTS
// =======================

const productsSection = document.createElement("section");
productsSection.classList.add("products");

productsSection.innerHTML = `<h2>Today's items on sale</h2>`;

const grid = document.createElement("div");
grid.classList.add("products-grid");

productos.forEach(p => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
    <p>${p.precio}</p>
  `;

  grid.appendChild(card);
});

productsSection.appendChild(grid);

// =======================
// APPEND
// =======================

header.appendChild(topBar);
header.appendChild(nav);

body.appendChild(header);
body.appendChild(hero);
body.appendChild(features);
body.appendChild(productsSection);

// =======================
// DROPDOWN CATEGORÍAS
// =======================

const menuBtn = nav.querySelector(".menu-btn");
const menuList = nav.querySelector("ul");

menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  menuList.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!nav.contains(e.target)) {
    menuList.classList.remove("active");
  }
});

// =======================
// SEARCH PANEL PRO
// =======================

const searchContainer = document.createElement("div");
searchContainer.classList.add("search-dropdown");
search.appendChild(searchContainer);

function showSuggestions(text) {
  searchContainer.innerHTML = "";

  const panel = document.createElement("div");
  panel.classList.add("search-panel");

  // LEFT
  const left = document.createElement("div");
  left.classList.add("search-left");

  left.innerHTML = `
    <h4>Most searched</h4>
    <div class="tags">
      ${categorias.map(c => `<span>${c}</span>`).join("")}
    </div>
  `;

  // RIGHT
  const right = document.createElement("div");
  right.classList.add("search-right");

  let resultados = productos;

  if (text) {
    resultados = productos.filter(p =>
      p.nombre.toLowerCase().includes(text.toLowerCase())
    );
  }

  right.innerHTML = `
    <h4>Recommended products</h4>
    ${resultados.slice(0, 4).map(p => `
      <div class="search-product">
        <img src="${p.imagen}">
        <div>
          <p>${p.nombre}</p>
          <strong>${p.precio}</strong>
        </div>
      </div>
    `).join("")}
  `;

  panel.appendChild(left);
  panel.appendChild(right);

  searchContainer.appendChild(panel);
  searchContainer.style.display = "block";
}

// EVENTOS 🔥
input.addEventListener("focus", () => showSuggestions(input.value));
input.addEventListener("input", (e) => showSuggestions(e.target.value));

document.addEventListener("click", (e) => {
  if (!search.contains(e.target)) {
    searchContainer.style.display = "none";
  }
});

// =======================
// PLACEHOLDER RANDOM
// =======================

const textosInput = [
  "Search for a gaming laptop...",
  "Search for a new phone...",
  "Search for a smart TV...",
];

input.placeholder = textosInput[Math.floor(Math.random() * textosInput.length)];

// =======================
// ICONOS
// =======================

lucide.createIcons();