// modules/login.js

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
    construirPaginaLogin();
  } catch (error) {
    console.error('Error cargando data.json:', error);
    body.innerHTML = '<p style="color:red; text-align:center; margin-top:50px;">Error al cargar los datos. Verifica la ruta.</p>';
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

function construirFormularioModerno() {
  const main = document.createElement("main");
  main.className = "profile-main";

  const container = document.createElement("div");
  container.className = "login-modern-container";

  const card = document.createElement("div");
  card.className = "login-modern-card";

  // --- Título con ícono de usuario ---
  const titleWrapper = document.createElement("div");
  titleWrapper.className = "login-title-wrapper";
  titleWrapper.style.display = "flex";
  titleWrapper.style.alignItems = "center";
  titleWrapper.style.justifyContent = "center";
  titleWrapper.style.gap = "10px";
  titleWrapper.style.marginBottom = "24px";

  const userIcon = document.createElement("i");
  userIcon.setAttribute("data-lucide", "user");
  userIcon.style.width = "28px";
  userIcon.style.height = "28px";
  userIcon.style.color = "#3dd6c6";

  const title = document.createElement("h2");
  title.textContent = "Sign in / Register";
  title.className = "login-title";
  title.style.margin = "0";

  titleWrapper.appendChild(userIcon);
  titleWrapper.appendChild(title);

  // Campo email/phone
  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group-modern";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Email or Phone number";
  input.required = true;
  inputGroup.appendChild(input);

  // Botón Continue
  const continueBtn = document.createElement("button");
  continueBtn.textContent = "Continue";
  continueBtn.className = "continue-btn";

  // Separador "Or"
  const separator = document.createElement("div");
  separator.className = "separator";
  separator.innerHTML = '<span>Or</span>';

  // Botones sociales con SVGs
  const socialButtons = document.createElement("div");
  socialButtons.className = "social-buttons";

  // Google (mismo SVG)
  const googleBtn = document.createElement("button");
  googleBtn.className = "social-btn google";
  googleBtn.innerHTML = `
    <svg class="social-svg" viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
    Continue with Google
  `;

  // Facebook (mismo SVG)
  const facebookBtn = document.createElement("button");
  facebookBtn.className = "social-btn facebook";
  facebookBtn.innerHTML = `
    <svg class="social-svg" viewBox="0 0 24 24" width="20" height="20">
      <path fill="#1877F2" d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.68 4.53-4.68 1.31 0 2.68.23 2.68.23v2.96h-1.51c-1.49 0-1.95.92-1.95 1.87v2.25h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07z" />
    </svg>
    Continue with Facebook
  `;

 // Apple - SVG CORRECTO (logo de la manzana normal)
const appleBtn = document.createElement("button");
appleBtn.className = "social-btn apple";
appleBtn.innerHTML = `
  <svg class="social-svg" viewBox="0 0 384 512" width="20" height="20" fill="#000000">
  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.9-20.7-75.6-20.7-55.5 1.4-101.1 35.5-112.9 84.8-22.9 89.5 15.2 197.6 71.9 249.3 18.2 17.3 38.8 25.4 59.7 25.4 21.6 0 37.4-14.8 58.6-14.8 21.5 0 36.4 14.9 58.8 14.9 23.1 0 43.5-12.1 60.8-28.9 23.3-23.5 32.5-54.8 36.6-80.3-44.6-19.5-69.7-52.8-69.9-97.2zM253.7 81.5c16.5-21.2 26.7-47.6 24.7-75.6-28.3 1.9-58.3 19.4-76.9 41.7-17 20.4-27.4 46-24.3 73.9 27.5 2.2 54.7-16.8 76.5-40z"/>
</svg>
  Continue with Apple
`;

  socialButtons.appendChild(googleBtn);
  socialButtons.appendChild(facebookBtn);
  socialButtons.appendChild(appleBtn);

  // Enlace "Trouble to signing in?"
  const helpLink = document.createElement("a");
  helpLink.href = "#";
  helpLink.textContent = "Trouble to signing in?";
  helpLink.className = "help-link";

  // Términos
  const terms = document.createElement("p");
  terms.className = "terms-text";
  terms.innerHTML = `By continuing, you agree to our <a href="#">Terms of Use</a> and authorize the processing of your personal data in accordance with <a href="#">Privacy Policy</a>. For further details on the purposes and methods of data processing, your rights, and how to exercise them, visit our <a href="#">Privacy Policy</a>.`;

  card.appendChild(titleWrapper);
  card.appendChild(inputGroup);
  card.appendChild(continueBtn);
  card.appendChild(separator);
  card.appendChild(socialButtons);
  card.appendChild(helpLink);
  card.appendChild(terms);

  container.appendChild(card);
  main.appendChild(container);

  // Eventos demo
  continueBtn.addEventListener("click", () => alert("🔐 Funcionalidad de inicio de sesión en desarrollo."));
  googleBtn.addEventListener("click", () => alert("Inicio con Google (demo)"));
  facebookBtn.addEventListener("click", () => alert("Inicio con Facebook (demo)"));
  appleBtn.addEventListener("click", () => alert("Inicio con Apple (demo)"));
  helpLink.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Próximamente podrás recuperar tu contraseña.");
  });

  return main;
}

function construirFooter() {
  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `<p>&copy; 2025 CoreSystems - Todos los derechos reservados</p>`;
  return footer;
}

async function construirPaginaLogin() {
  if (!body) return;
  body.innerHTML = "";

  const header = construirHeader();
  const main = construirFormularioModerno();
  const footer = construirFooter();

  body.appendChild(header);
  body.appendChild(main);
  body.appendChild(footer);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

cargarDatos();