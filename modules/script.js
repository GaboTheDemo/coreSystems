// =======================
// DATA
// =======================

const textosHero = [
  "The best tech in one place!",
  "Find the best gadgets at the best price!",
  "Upgrade your setup today!",
];

const categorias = [
  "Smartphones",
  "Laptops",
  "Tablets",
  "Consoles",
  "Televisions",
  "Smartwatches"
];

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
  <button><i data-lucide="search"></i></button>
`;

// ICONS HEADER
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

nav.innerHTML = `<button class="menu-btn"><i data-lucide="menu"></i> All Categories</button>`;
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
// PRODUCTS (IMÁGENES LOCALES)
// =======================

const productos = [
  ["../product-image/galaxy-s23-ultra.png", "Samsung Galaxy S26 Ultra", "$8.699.900"],
  ["../product-image/iphone-14-pro-max.png", "Iphone 14 Pro", "$2.799.900"],
  ["../product-image/macbook-pro-16.png", "Macbook Pro 16\"", "$3.399.600"],
  ["../product-image/dell-xps-13.png", "Dell XPS 13", "$2.429.849"]
];

const productsSection = document.createElement("section");
productsSection.classList.add("products");

productsSection.innerHTML = `<h2>Today's items on sale</h2>`;

const grid = document.createElement("div");
grid.classList.add("products-grid");

productos.forEach(p => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <img src="${p[0]}" alt="${p[1]}">
    <h3>${p[1]}</h3>
    <p>${p[2]}</p>
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
// RANDOM PLACEHOLDER
// =======================

const input = document.getElementById("searchInput");

const textosInput = [
  "Search for a gaming laptop...",
  "Search for a new phone...",
  "Search for a smart TV...",
];

if (input) {
  input.placeholder = textosInput[Math.floor(Math.random() * textosInput.length)];
}

// =======================
// ACTIVAR ICONOS
// =======================

lucide.createIcons();