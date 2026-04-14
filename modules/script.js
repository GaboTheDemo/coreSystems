import { textosHero, categorias, productos } from "../data/products.js";
 
const body = document.body;
 
// =======================
// MEGAMENU DATA
// =======================
 
const megaMenuData = {
  "Smartphones": {
    columns: [
      {
        title: "Brands",
        items: ["iPhone", "Samsung", "Xiaomi", "Motorola", "vivo", "Oppo", "Realme", "ZTE", "TCL", "Kalley", "Huawei", "Honor", "Tecno", "Infinix", "Poco"]
      },
      {
        title: "Storage capacity",
        items: ["64 GB", "128 GB", "256 GB", "512 GB", "1T", "2T"]
      },
      {
        title: "RAM memory",
        items: ["2 GB", "3 GB", "4 GB", "6 GB", "8 GB", "12 GB"]
      }
    ],
    accessories: {
      title: "Mobile & Tablet Accessories",
      items: ["Cases and Covers", "Headphones and Hands-Free", "Micro SD Memory Cards", "External Power Bank Batteries", "Cables, Chargers, Adapters", "Bases and Stands"]
    },
    more: {
      title: "Discover More",
      items: ["Free Insurance", "Trade-In Plan", "Cheap Phones", "Mobile Phone Launches", "SIM Cards"]
    }
  },
  "Laptops": {
    columns: [
      {
        title: "Brands",
        items: ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Razer", "Samsung", "LG"]
      },
      {
        title: "RAM",
        items: ["8 GB", "16 GB", "32 GB", "64 GB"]
      },
      {
        title: "Storage",
        items: ["256 GB SSD", "512 GB SSD", "1 TB SSD", "2 TB SSD", "1 TB HDD"]
      }
    ],
    accessories: {
      title: "Laptop Accessories",
      items: ["Laptop Bags", "Cooling Pads", "External Monitors", "USB Hubs", "Keyboards & Mice", "Docking Stations"]
    },
    more: {
      title: "Discover More",
      items: ["Gaming Laptops", "Business Laptops", "Ultrabooks", "Budget Picks", "Student Deals"]
    }
  },
  "Tablets": {
    columns: [
      {
        title: "Brands",
        items: ["Apple iPad", "Samsung", "Lenovo", "Huawei", "Amazon Fire", "Microsoft Surface"]
      },
      {
        title: "Screen Size",
        items: ["7\"", "8\"", "10\"", "11\"", "12.9\"", "13\""]
      },
      {
        title: "Storage",
        items: ["32 GB", "64 GB", "128 GB", "256 GB", "512 GB"]
      }
    ],
    accessories: {
      title: "Tablet Accessories",
      items: ["Tablet Cases", "Stylus Pens", "Keyboard Covers", "Screen Protectors", "Tablet Stands", "Chargers"]
    },
    more: {
      title: "Discover More",
      items: ["Kids Tablets", "Drawing Tablets", "E-Readers", "Budget Tablets", "Pro Models"]
    }
  },
  "Consoles": {
    columns: [
      {
        title: "Brands",
        items: ["PlayStation 5", "Xbox Series X", "Nintendo Switch", "PlayStation 4", "Xbox One", "Retro Consoles"]
      },
      {
        title: "Type",
        items: ["Home Consoles", "Portable Consoles", "Handheld", "Retro/Classic", "PC Gaming"]
      }
    ],
    accessories: {
      title: "Console Accessories",
      items: ["Controllers", "Headsets", "Charging Docks", "Memory Cards", "Gaming Chairs", "Capture Cards"]
    },
    more: {
      title: "Discover More",
      items: ["New Releases", "Pre-Orders", "Bundle Deals", "Gaming Subscriptions", "Game Gift Cards"]
    }
  },
  "Televisions": {
    columns: [
      {
        title: "Brands",
        items: ["Samsung", "LG", "Sony", "TCL", "Hisense", "Philips", "Panasonic", "Sharp"]
      },
      {
        title: "Screen Size",
        items: ["32\"", "43\"", "50\"", "55\"", "65\"", "75\"", "85\""]
      },
      {
        title: "Technology",
        items: ["OLED", "QLED", "LED", "4K UHD", "8K", "Smart TV", "Android TV"]
      }
    ],
    accessories: {
      title: "TV Accessories",
      items: ["TV Mounts", "Soundbars", "HDMI Cables", "Streaming Devices", "Remote Controls", "Antennas"]
    },
    more: {
      title: "Discover More",
      items: ["Gaming TVs", "Home Theater", "Projectors", "Smart Home", "TV Deals"]
    }
  },
  "Smartwatches": {
    columns: [
      {
        title: "Brands",
        items: ["Apple Watch", "Samsung Galaxy Watch", "Garmin", "Fitbit", "Huawei", "Xiaomi", "Fossil", "Amazfit"]
      },
      {
        title: "Features",
        items: ["GPS", "Heart Rate Monitor", "Sleep Tracking", "NFC Payments", "Water Resistant", "ECG"]
      }
    ],
    accessories: {
      title: "Watch Accessories",
      items: ["Watch Bands", "Charging Cables", "Screen Protectors", "Watch Cases", "Docking Stations"]
    },
    more: {
      title: "Discover More",
      items: ["Sports Watches", "Kids Smartwatches", "Luxury Watches", "Budget Picks", "New Arrivals"]
    }
  }
};
 
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
ul.classList.add("nav-categories");
 
categorias.forEach(cat => {
  const li = document.createElement("li");
  li.classList.add("nav-item");
  li.textContent = cat;
 
  // Megamenú por categoría
  if (megaMenuData[cat]) {
    const data = megaMenuData[cat];
    const panel = document.createElement("div");
    panel.classList.add("mega-panel");
 
    // Sección izquierda: columnas
    const left = document.createElement("div");
    left.classList.add("mega-left");
 
    data.columns.forEach(col => {
      const colDiv = document.createElement("div");
      colDiv.classList.add("mega-col");
      colDiv.innerHTML = `<h4>${col.title}</h4>`;
      const itemsText = col.items.join(" | ");
      const p = document.createElement("p");
      p.textContent = itemsText;
      colDiv.appendChild(p);
      left.appendChild(colDiv);
    });
 
    // Sección media: accesorios
    const mid = document.createElement("div");
    mid.classList.add("mega-mid");
    mid.innerHTML = `
      <h4><span class="mega-icon">&#9633;</span> Accessories</h4>
      <p class="mega-subtitle">${data.accessories.title}</p>
      ${data.accessories.items.map(i => `<a href="#">${i}</a>`).join("")}
    `;
 
    // Sección derecha: más
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
 
nav.innerHTML = `
  <button class="menu-btn">
    <i data-lucide="menu"></i> All Categories
  </button>
`;
 
// ALL CATEGORIES megamenú
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
 
const menuBtnWrapper = document.createElement("div");
menuBtnWrapper.classList.add("menu-btn-wrapper");
 
nav.appendChild(ul);
nav.appendChild(menuBtnWrapper);
nav.appendChild(allCatPanel);
 
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
// DROPDOWN ALL CATEGORIES
// =======================
 
const menuBtn = nav.querySelector(".menu-btn");
 
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  allCatPanel.classList.toggle("active");
});
 
document.addEventListener("click", (e) => {
  if (!nav.contains(e.target)) {
    allCatPanel.classList.remove("active");
  }
});
 
// =======================
// SEARCH PANEL
// =======================
 
const searchContainer = document.createElement("div");
searchContainer.classList.add("search-dropdown");
search.appendChild(searchContainer);
 
function showSuggestions(text) {
  searchContainer.innerHTML = "";
 
  const panel = document.createElement("div");
  panel.classList.add("search-panel");
 
  const left = document.createElement("div");
  left.classList.add("search-left");
  left.innerHTML = `
    <h4>Most searched</h4>
    <div class="tags">
      ${categorias.map(c => `<span>${c}</span>`).join("")}
    </div>
  `;
 
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