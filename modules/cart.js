// modules/cart.js

const body = document.getElementById('app');
if (!body) console.error('No se encontró #app');

let categorias = [];
let megaMenuData = {};

async function cargarDatos() {
  try {
    const respuesta = await fetch('../data/data.json');
    const datos = await respuesta.json();
    categorias = datos.categorias;
    megaMenuData = datos.megaMenuData;
    construirPaginaCarrito();
  } catch (error) {
    console.error('Error cargando data.json:', error);
    body.innerHTML = '<p style="color:red; text-align:center; margin-top:50px;">Error al cargar los datos.</p>';
  }
}

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

  // Barra de búsqueda con placeholder "Gaming Laptop" como en la imagen
  const search = document.createElement("div");
  search.classList.add("search-bar");
  search.innerHTML = `
    <input type="text" placeholder="Gaming Laptop">
    <button><i data-lucide="search"></i></button>
  `;

  // Añadimos IDs a los botones de iconos
  const icons = document.createElement("div");
  icons.classList.add("icons");
  icons.innerHTML = `
    <button id="heartBtn"><i data-lucide="heart"></i></button>
    <button id="userBtn"><i data-lucide="user"></i></button>
    <button id="cartBtn"><i data-lucide="shopping-cart"></i></button>
  `;
  topBar.appendChild(search);
  topBar.appendChild(icons);

  const nav = document.createElement("nav");
  nav.classList.add("navbar");

  const ul = document.createElement("ul");
  ul.classList.add("nav-categories");

  // Categorías originales
  categorias.forEach(cat => {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.textContent = cat;

    if (megaMenuData && megaMenuData[cat]) {
      const data = megaMenuData[cat];
      const panel = document.createElement("div");
      panel.classList.add("mega-panel");

      const left = document.createElement("div");
      left.classList.add("mega-left");
      data.columns.forEach(col => {
        const colDiv = document.createElement("div");
        colDiv.classList.add("mega-col");
        colDiv.innerHTML = `<h4>${col.title}</h4>`;
        const itemsContainer = document.createElement("div");
        itemsContainer.classList.add("mega-items");
        col.items.forEach(item => {
          const span = document.createElement("span");
          span.classList.add("mega-item");
          span.textContent = item;
          itemsContainer.appendChild(span);
        });
        colDiv.appendChild(itemsContainer);
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

  // Añadir "Trending" y "On Sale" como en la imagen
  const trendingLi = document.createElement("li");
  trendingLi.classList.add("nav-item");
  trendingLi.textContent = "Trending";
  ul.appendChild(trendingLi);

  const onSaleLi = document.createElement("li");
  onSaleLi.classList.add("nav-item");
  onSaleLi.textContent = "On Sale";
  ul.appendChild(onSaleLi);

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
  return header;
}

// =======================
// AGREGAR EVENTOS A LOS ICONOS DEL HEADER
// =======================
function agregarEventosHeader() {
  // Botón de corazón (favoritos) -> redirige a favorites.html
  const heartBtn = document.getElementById("heartBtn");
  if (heartBtn) {
    heartBtn.addEventListener("click", () => {
      window.location.href = "favorites.html";
    });
  }
  // Botón de usuario (perfil) -> redirige a login.html
  const userBtn = document.getElementById("userBtn");
  if (userBtn) {
    userBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
  // Botón de carrito: en la página de carrito no hacemos nada (opcional, podrías recargar o no)
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      // Ya estamos en carrito, quizás recargar o no hacer nada
      // window.location.href = "cart.html"; // si quieres recargar
    });
  }
}

function construirContenidoCarrito() {
  const main = document.createElement("main");
  main.className = "cart-empty-main";

  const container = document.createElement("div");
  container.className = "cart-empty-container";

  const cartIcon = document.createElement("i");
  cartIcon.setAttribute("data-lucide", "shopping-cart");
  cartIcon.style.width = "80px";
  cartIcon.style.height = "80px";
  cartIcon.style.color = "#ccc";
  cartIcon.style.marginBottom = "20px";

  const title = document.createElement("h2");
  title.textContent = "Tu carrito está vacío";
  title.className = "cart-empty-title";

  const message = document.createElement("p");
  message.textContent = "Descubre nuestros productos y encuentra lo que buscas";
  message.className = "cart-empty-message";

  const exploreBtn = document.createElement("button");
  exploreBtn.textContent = "Explorar productos";
  exploreBtn.className = "cart-empty-btn";
  exploreBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  container.appendChild(cartIcon);
  container.appendChild(title);
  container.appendChild(message);
  container.appendChild(exploreBtn);
  main.appendChild(container);
  return main;
}

function construirFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<p>&copy; 2025 CoreSystems - Todos los derechos reservados</p>`;
  return footer;
}

async function construirPaginaCarrito() {
  if (!body) return;
  body.innerHTML = "";
  const header = construirHeader();
  const main = construirContenidoCarrito();
  const footer = construirFooter();
  body.appendChild(header);
  body.appendChild(main);
  body.appendChild(footer);
  
  // Agregar eventos a los iconos del header
  agregarEventosHeader();
  
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

cargarDatos();