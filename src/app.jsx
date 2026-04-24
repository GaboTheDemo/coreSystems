import React from "react";
import { useState, useEffect, useRef } from "react";


const data = {
  textosHero: [
    "The best tech in one place!",
    "Find the best gadgets at the best price!",
    "Upgrade your setup today!",
  ],
  categorias: ["Smartphones", "Laptops", "Tablets", "Consoles", "Televisions", "Smartwatches"],
  productos: [
    { imagen: "../product-image/galaxy-s23-ultra.png",  nombre: "Samsung Galaxy S26 Ultra", precio: "$8.699.900" },
    { imagen: "../product-image/iphone-14-pro-max.png", nombre: "Iphone 14 Pro Max",        precio: "$2.799.900" },
    { imagen: "../product-image/macbook-pro-16.png",    nombre: 'Macbook Pro 16"',           precio: "$3.399.600" },
    { imagen: "../product-image/dell-xps-13.png",       nombre: "Dell XPS 13",              precio: "$2.429.849" },
    { imagen: "../product-image/reloj.png",             nombre: "Apple Watch 11",            precio: "$3.900.000" },
    { imagen: "../product-image/tablet.png",            nombre: 'Tablet Android 10"',        precio: "$800.000"   },
    { imagen: "../product-image/Televisor.png",         nombre: 'Smart TV 55" 4K',           precio: "$1.299.900" },
    { imagen: "../product-image/control.png",           nombre: "Control Xbox rojo",         precio: "$600.900"   },
  ],
  megaMenuData: {
    Smartphones: {
      columns: [
        { title: "Brands",           items: ["iPhone","Samsung","Xiaomi","Motorola","vivo","Oppo","Realme","ZTE","TCL","Kalley","Huawei","Honor","Tecno","Infinix","Poco"] },
        { title: "Storage capacity", items: ["64 GB","128 GB","256 GB","512 GB","1T","2T"] },
        { title: "RAM memory",       items: ["2 GB","3 GB","4 GB","6 GB","8 GB","12 GB"] },
      ],
      accessories: { title: "Mobile & Tablet Accessories", items: ["Cases and Covers","Headphones and Hands-Free","Micro SD Memory Cards","External Power Bank Batteries","Cables, Chargers, Adapters","Bases and Stands"] },
      more:        { title: "Discover More",                items: ["Free Insurance","Trade-In Plan","Cheap Phones","Mobile Phone Launches","SIM Cards"] },
    },
    Laptops: {
      columns: [
        { title: "Brands",   items: ["Apple","Dell","HP","Lenovo","Asus","Acer","MSI","Razer","Samsung","LG"] },
        { title: "RAM",      items: ["8 GB","16 GB","32 GB","64 GB"] },
        { title: "Storage",  items: ["256 GB SSD","512 GB SSD","1 TB SSD","2 TB SSD","1 TB HDD"] },
      ],
      accessories: { title: "Laptop Accessories", items: ["Laptop Bags","Cooling Pads","External Monitors","USB Hubs","Keyboards & Mice","Docking Stations"] },
      more:        { title: "Discover More",       items: ["Gaming Laptops","Business Laptops","Ultrabooks","Budget Picks","Student Deals"] },
    },
    Tablets: {
      columns: [
        { title: "Brands",      items: ["Apple iPad","Samsung","Lenovo","Huawei","Amazon Fire","Microsoft Surface"] },
        { title: "Screen Size", items: ['7"','8"','10"','11"','12.9"','13"'] },
        { title: "Storage",     items: ["32 GB","64 GB","128 GB","256 GB","512 GB"] },
      ],
      accessories: { title: "Tablet Accessories", items: ["Tablet Cases","Stylus Pens","Keyboard Covers","Screen Protectors","Tablet Stands","Chargers"] },
      more:        { title: "Discover More",       items: ["Kids Tablets","Drawing Tablets","E-Readers","Budget Tablets","Pro Models"] },
    },
    Consoles: {
      columns: [
        { title: "Brands", items: ["PlayStation 5","Xbox Series X","Nintendo Switch","PlayStation 4","Xbox One","Retro Consoles"] },
        { title: "Type",   items: ["Home Consoles","Portable Consoles","Handheld","Retro/Classic","PC Gaming"] },
      ],
      accessories: { title: "Console Accessories", items: ["Controllers","Headsets","Charging Docks","Memory Cards","Gaming Chairs","Capture Cards"] },
      more:        { title: "Discover More",        items: ["New Releases","Pre-Orders","Bundle Deals","Gaming Subscriptions","Game Gift Cards"] },
    },
    Televisions: {
      columns: [
        { title: "Brands",      items: ["Samsung","LG","Sony","TCL","Hisense","Philips","Panasonic","Sharp"] },
        { title: "Screen Size", items: ['32"','43"','50"','55"','65"','75"','85"'] },
        { title: "Technology",  items: ["OLED","QLED","LED","4K UHD","8K","Smart TV","Android TV"] },
      ],
      accessories: { title: "TV Accessories", items: ["TV Mounts","Soundbars","HDMI Cables","Streaming Devices","Remote Controls","Antennas"] },
      more:        { title: "Discover More",  items: ["Gaming TVs","Home Theater","Projectors","Smart Home","TV Deals"] },
    },
    Smartwatches: {
      columns: [
        { title: "Brands",   items: ["Apple Watch","Samsung Galaxy Watch","Garmin","Fitbit","Huawei","Xiaomi","Fossil","Amazfit"] },
        { title: "Features", items: ["GPS","Heart Rate Monitor","Sleep Tracking","NFC Payments","Water Resistant","ECG"] },
      ],
      accessories: { title: "Watch Accessories", items: ["Watch Bands","Charging Cables","Screen Protectors","Watch Cases","Docking Stations"] },
      more:        { title: "Discover More",      items: ["Sports Watches","Kids Smartwatches","Luxury Watches","Budget Picks","New Arrivals"] },
    },
  },
};

const ITEMS_POR_PAGINA = 4;
const PLACEHOLDERS = ["Search for a gaming laptop...", "Search for a new phone...", "Search for a smart TV..."];


const IconSearch       = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconHeart        = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const IconUser         = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconCart         = () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const IconMenu         = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconChevronRight = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const IconBox          = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
const IconClock        = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconZap          = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconUserCard     = () => <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;


function MegaPanel({ catData }) {
  return (
    <div className="mega-panel">
      <div className="mega-left">
        {catData.columns.map((col) => (
          <div className="mega-col" key={col.title}>
            <h4>{col.title}</h4>
            <div className="mega-items">
              {col.items.map((item) => (
                <span className="mega-item" key={item}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mega-mid">
        <h4><span className="mega-icon">&#9633;</span> Accessories</h4>
        <p className="mega-subtitle">{catData.accessories.title}</p>
        {catData.accessories.items.map((i) => (
          <a href="#" key={i} className="simulate-link" onClick={(e) => { e.preventDefault(); alert(`🔗 Funcionalidad en desarrollo: ${i}`); }}>{i}</a>
        ))}
      </div>
      <div className="mega-right">
        <h4><span className="mega-icon">&#9675;</span> More</h4>
        <p className="mega-subtitle">{catData.more.title}</p>
        {catData.more.items.map((i) => (
          <a href="#" key={i} className="simulate-link" onClick={(e) => { e.preventDefault(); alert(`🔗 Funcionalidad en desarrollo: ${i}`); }}>{i}</a>
        ))}
      </div>
    </div>
  );
}


function AllCatPanel({ open }) {
  return (
    <div className={`all-cat-panel${open ? " active" : ""}`}>
      <div className="all-cat-inner">
        {Object.entries(data.megaMenuData).map(([cat, catData]) => (
          <div className="all-cat-item" key={cat}>
            <span className="all-cat-name" onClick={() => alert(`📂 Categoría "${cat}" - Próximamente.`)}>{cat}</span>
            <IconChevronRight />
            <div className="all-cat-sub">
              {catData.columns.map((col) => (
                <div className="all-cat-sub-col" key={col.title}>
                  <h4>{col.title}</h4>
                  <p>{col.items.join(" | ")}</p>
                </div>
              ))}
              <div className="all-cat-sub-col">
                <h4>{catData.accessories.title}</h4>
                {catData.accessories.items.map((i) => (
                  <a href="#" key={i} onClick={(e) => { e.preventDefault(); alert(`🔗 Funcionalidad en desarrollo: ${i}`); }}>{i}</a>
                ))}
              </div>
              <div className="all-cat-sub-col">
                <h4>{catData.more.title}</h4>
                {catData.more.items.map((i) => (
                  <a href="#" key={i} onClick={(e) => { e.preventDefault(); alert(`🔗 Funcionalidad en desarrollo: ${i}`); }}>{i}</a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function SearchDropdown({ query, visible }) {
  const resultados = query
    ? data.productos.filter((p) => p.nombre.toLowerCase().includes(query.toLowerCase()))
    : data.productos;

  if (!visible) return null;

  return (
    <div className="search-dropdown" style={{ display: "block" }}>
      <div className="search-panel">
        <div className="search-left">
          <h4>Most searched</h4>
          <div className="tags">
            {data.categorias.map((c) => <span key={c}>{c}</span>)}
          </div>
        </div>
        <div className="search-right">
          <h4>Recommended products</h4>
          {resultados.length === 0
            ? <p className="no-results">No results found</p>
            : resultados.slice(0, 4).map((p, i) => (
              <div
                className="search-product"
                key={i}
                onClick={() => { window.location.href = `product.html?id=${data.productos.findIndex(x => x.nombre === p.nombre)}`; }}
              >
                <img src={p.imagen} alt={p.nombre} />
                <div><p>{p.nombre}</p><strong>{p.precio}</strong></div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}


function Header({ onSearch }) {
  const placeholder = PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)];
  const [query, setQuery]           = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [allCatOpen, setAllCat]     = useState(false);
  const searchRef = useRef(null);
  const navRef    = useRef(null);

  
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setDropdown(false);
      if (navRef.current && !navRef.current.contains(e.target))    setAllCat(false);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleSearch = () => {
    onSearch(query.trim());
    setDropdown(false);
  };

  return (
    <header>
      {/* TOP BAR */}
      <div className="header-top">
        <div className="logo-area">
          <img src="../icons/coreSystems-logo.png" className="logo-img" alt="CoreSystems" />
          <h1>CoreSystems</h1>
        </div>

        {/* SEARCH */}
        <div className="search-bar" ref={searchRef}>
          <input
            type="text"
            id="searchInput"
            placeholder={placeholder}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setDropdown(true); }}
            onFocus={() => setDropdown(true)}
          />
          <button id="searchBtn" onClick={handleSearch}><IconSearch /></button>
          <SearchDropdown query={query} visible={dropdownOpen} />
        </div>

        {/* ICONS */}
        <div className="icons">
          <button id="heartBtn" onClick={() => window.location.href = "favorites.html"}><IconHeart /></button>
          <button id="userBtn"  onClick={() => window.location.href = "login.html"}><IconUser /></button>
          <button id="cartBtn"  onClick={() => window.location.href = "cart.html"}><IconCart /></button>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar" ref={navRef}>
        <button className="menu-btn" onClick={(e) => { e.stopPropagation(); setAllCat((v) => !v); }}>
          <IconMenu /> All Categories
        </button>
        <AllCatPanel open={allCatOpen} />

        <ul className="nav-categories">
          {data.categorias.map((cat) => (
            <li className="nav-item" key={cat}>
              {cat}
              {data.megaMenuData[cat] && <MegaPanel catData={data.megaMenuData[cat]} />}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}


function Hero() {
  const texto = data.textosHero[Math.floor(Math.random() * data.textosHero.length)];
  return (
    <section className="hero">
      <h2>{texto}</h2>
      <p>For the best price too!</p>
      <div className="hero-buttons">
        <button className="primary"   id="viewSalesBtn">View Sales</button>
        <button className="secondary" id="exploreCategoriesBtn">Explore Categories</button>
      </div>
    </section>
  );
}


function Features() {
  return (
    <section className="features">
      <h2>Check some of these things out!</h2>
      <div className="features-grid">
        <div className="card"><IconBox /><h3>Enter your Location</h3><p>So we know where to send your products.</p></div>
        <div className="card" id="make-account-card" onClick={() => window.location.href = "login.html"} style={{cursor:"pointer"}}>
          <IconUserCard /><h3>Make an Account</h3><p>Access all shopping features.</p>
        </div>
        <div className="card"><IconClock /><h3>Free Delivery</h3><p>Check eligible products.</p></div>
        <div className="card"><IconZap /><h3>Most Popular</h3><p>See what everyone is buying.</p></div>
      </div>
    </section>
  );
}


function ProductCarousel({ lista }) {
  const [start, setStart] = useState(0);
  const total = lista.length;

  const prev = () => {
    setStart((s) => {
      const n = s - ITEMS_POR_PAGINA;
      return n < 0 ? Math.max(0, total - ITEMS_POR_PAGINA) : n;
    });
  };
  const next = () => {
    setStart((s) => {
      const n = s + ITEMS_POR_PAGINA;
      return n >= total ? 0 : n;
    });
  };

  const visibles = lista.slice(start, start + ITEMS_POR_PAGINA);

  return (
    <section className="products">
      <h2>Today's items on sale</h2>
      <div className="carousel-grid-wrapper">
        <div className="products-grid">
          {visibles.length === 0
            ? <p>No hay productos disponibles</p>
            : visibles.map((p, i) => {
              const idx = data.productos.findIndex(x => x.nombre === p.nombre);
              return (
                <div
                  className="product-card"
                  key={i}
                  data-index={idx}
                  onClick={() => window.location.href = `product.html?id=${idx}`}
                  style={{ cursor: "pointer" }}
                >
                  <img src={p.imagen} alt={p.nombre} />
                  <h3>{p.nombre}</h3>
                  <p>{p.precio}</p>
                </div>
              );
            })
          }
        </div>

        {total > ITEMS_POR_PAGINA && (
          <div className="carousel-nav-buttons">
            <button className="carousel-btn-grid prev" onClick={prev}>❮</button>
            <button className="carousel-btn-grid next" onClick={next}>❯</button>
          </div>
        )}
      </div>
    </section>
  );
}


export default function App() {
  const [listaProductos, setLista] = useState(data.productos);

  const handleSearch = (query) => {
    if (!query) {
      setLista(data.productos);
    } else {
      setLista(data.productos.filter((p) =>
        p.nombre.toLowerCase().includes(query.toLowerCase())
      ));
    }
  };

  return (
    <>
      <Header onSearch={handleSearch} />
      <Hero />
      <Features />
      <ProductCarousel lista={listaProductos} />
    </>
  );
}