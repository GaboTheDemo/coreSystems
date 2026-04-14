var texts = [
  "Search for products... Like a gaming laptop or a new phone!",
  "Search for products... Like a new TV for your living room!",
  "Search for products... That phone charger of yours might need changing!",
  "Search for products... Like a new pair of earbuds for your favorite music!",
  "Search for products... Like a new tablet for your work or school needs!",
];


document.getElementById('randomText').value =
  texts[Math.floor(Math.random() * texts.length)];


const links = document.querySelectorAll(".nav-list li a");
const menus = document.querySelectorAll(".mega-content");


const categorias = [
  "smartphones",
  "laptops",
  "tablets",
  "consoles",
  "televisions",
  "smartwatches"
];

links.forEach(link => {
  link.addEventListener("mouseenter", () => {

    
    menus.forEach(menu => menu.classList.remove("active"));

    const text = link.textContent.toLowerCase().trim();

    
    if (categorias.includes(text)) {
      document.getElementById(text).classList.add("active");
    }

  });
});


document.addEventListener("mousemove", (e) => {
  if (!e.target.closest(".mega-menu") && !e.target.closest(".nav-list")) {
    menus.forEach(menu => menu.classList.remove("active"));
  }
});

const thumbs = document.querySelectorAll(".thumb");
const mainImage = document.getElementById("mainProductImage");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    thumbs.forEach(t => t.classList.remove("active"));
    thumb.classList.add("active");

    mainImage.src = thumb.src;
  });
});

let quantity = 1;
const quantityText = document.getElementById("quantity");

document.getElementById("plus").addEventListener("click", () => {
  quantity++;
  quantityText.textContent = quantity;
});

document.getElementById("minus").addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityText.textContent = quantity;
  }
});

document.querySelector(".add-cart").addEventListener("click", () => {
  alert("Producto agregado al carrito 🛒");
});

document.querySelector(".buy-now").addEventListener("click", () => {
  alert("Redirigiendo a compra ⚡");
});

const toggleBtn = document.getElementById("toggleDescription");
const extraDesc = document.getElementById("extraDescription");

toggleBtn.addEventListener("click", () => {
  extraDesc.classList.toggle("hidden");

  if (extraDesc.classList.contains("hidden")) {
    toggleBtn.textContent = "Ver más";
  } else {
    toggleBtn.textContent = "Ver menos";
  }
});