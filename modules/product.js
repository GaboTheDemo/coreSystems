// modules/product.js

const body = document.getElementById('app');
if (!body) console.error('No se encontró #app');

let categorias = [];
let megaMenuData = {};
let productos = [];

// =======================
// FUNCIÓN AUXILIAR PARA FORMATEAR PRECIOS
// =======================
function formatearPrecio(precioStr) {
  // Eliminar todo lo que no sea dígito (incluye $ y puntos)
  const soloNumeros = precioStr.replace(/[^0-9]/g, '');
  return parseInt(soloNumeros, 10);
}

function formatearMoneda(valor) {
  return valor.toLocaleString('es-CO') + " COP";
}

async function cargarDatos() {
  try {
    const respuesta = await fetch('../data/data.json');
    const datos = await respuesta.json();
    categorias = datos.categorias;
    megaMenuData = datos.megaMenuData;
    productos = datos.productos;
    construirPaginaProducto();
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

  const search = document.createElement("div");
  search.classList.add("search-bar");
  search.innerHTML = `
    <input type="text" placeholder="Buscar productos...">
    <button><i data-lucide="search"></i></button>
  `;

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

function agregarEventosHeader() {
  const heartBtn = document.getElementById("heartBtn");
  if (heartBtn) heartBtn.addEventListener("click", () => window.location.href = "favorites.html");
  const userBtn = document.getElementById("userBtn");
  if (userBtn) userBtn.addEventListener("click", () => window.location.href = "login.html");
  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) cartBtn.addEventListener("click", () => window.location.href = "cart.html");
}

function construirDetalleProducto() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id === null || !productos[id]) {
    const main = document.createElement("main");
    main.className = "product-not-found";
    main.innerHTML = `<h2>Producto no encontrado</h2><a href="index.html">Volver al inicio</a>`;
    return main;
  }
  const producto = productos[id];

  // Calcular precios correctamente
  const precioOriginalNumerico = formatearPrecio(producto.precio);
  const precioDescuentoNumerico = Math.round(precioOriginalNumerico * 0.8);
  const precioOriginalFormateado = producto.precio; // ya viene con $ y puntos
  const precioDescuentoFormateado = formatearMoneda(precioDescuentoNumerico);

  const main = document.createElement("main");
  main.className = "product-detail-main";

  const container = document.createElement("div");
  container.className = "product-detail-container";

  // Sección superior: imagen y precio
  const topSection = document.createElement("div");
  topSection.className = "product-detail-top";

  const imgContainer = document.createElement("div");
  imgContainer.className = "product-detail-image";
  const img = document.createElement("img");
  img.src = producto.imagen;
  img.alt = producto.nombre;
  imgContainer.appendChild(img);

  const priceContainer = document.createElement("div");
  priceContainer.className = "product-detail-price-box";
  priceContainer.innerHTML = `
    <h1>${producto.nombre}</h1>
    <div class="price-original">${precioOriginalFormateado}</div>
    <div class="price-discount">${precioDescuentoFormateado}</div>
    <div class="stock">En stock</div>
    <div class="quantity-selector">
      <button class="qty-btn">-</button>
      <span>1</span>
      <button class="qty-btn">+</button>
    </div>
    <button class="add-to-cart-btn">Agregar al carrito</button>
    <button class="buy-now-btn">Comprar</button>
  `;

  topSection.appendChild(imgContainer);
  topSection.appendChild(priceContainer);

  // Especificaciones (datos de ejemplo, se pueden mejorar)
  const specsSection = document.createElement("div");
  specsSection.className = "product-specs";
  specsSection.innerHTML = `
    <h3>Especificaciones</h3>
    <ul>
      <li><strong>Capacidad de almacenamiento:</strong> 512 GB</li>
      <li><strong>Tamaño de la pantalla:</strong> 6.9"</li>
      <li><strong>Cámara posterior:</strong> 48 MP</li>
      <li><strong>Cámara frontal:</strong> 18 MP</li>
      <li><strong>Sistema operativo:</strong> iOS 26</li>
      <li><strong>Memoria RAM:</strong> 12 GB</li>
    </ul>
  `;

  // Descripción
  const descSection = document.createElement("div");
  descSection.className = "product-description";
  descSection.innerHTML = `
    <h3>Descripción general</h3>
    <p>${producto.nombre} es un dispositivo de gama alta diseñado para ofrecer máximo rendimiento. Su potente procesador y avanzado sistema de cámaras permiten capturar fotos y videos con gran nivel de detalle, incluso en condiciones de poca luz. Ideal para usuarios exigentes.</p>
    <a href="#" class="read-more">Ver más</a>
  `;

  // Más productos (productos relacionados)
  const moreProducts = document.createElement("div");
  moreProducts.className = "more-products";
  moreProducts.innerHTML = `<h3>Más Productos</h3><div class="more-products-grid"></div>`;
  const otherProducts = productos.filter(p => p !== producto).slice(0, 3);
  const grid = moreProducts.querySelector(".more-products-grid");
  otherProducts.forEach(p => {
    const card = document.createElement("div");
    card.className = "more-product-card";
    card.innerHTML = `<img src="${p.imagen}" alt="${p.nombre}"><p>${p.nombre}</p>`;
    card.addEventListener("click", () => {
      const newIndex = productos.findIndex(prod => prod === p);
      window.location.href = `product.html?id=${newIndex}`;
    });
    grid.appendChild(card);
  });

  container.appendChild(topSection);
  container.appendChild(specsSection);
  container.appendChild(descSection);
  container.appendChild(moreProducts);
  main.appendChild(container);
  return main;
}

function construirFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<p>&copy; 2025 CoreSystems - Todos los derechos reservados</p>`;
  return footer;
}

async function construirPaginaProducto() {
  if (!body) return;
  body.innerHTML = "";
  const header = construirHeader();
  const main = construirDetalleProducto();
  const footer = construirFooter();
  body.appendChild(header);
  body.appendChild(main);
  body.appendChild(footer);
  agregarEventosHeader();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

cargarDatos();