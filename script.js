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