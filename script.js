var texts = [
  "Search for products... Like a gaming laptop or a new phone!",
  "Search for products... Like a new TV for your living room!",
  "Search for products... That phone charger of yours might need changing!",
  "Search for products... Like a new pair of earbuds for your favorite music!",
  "Search for products... Like a new tablet for your work or school needs!",
];

document.getElementById('randomText').value = texts[Math.floor(Math.random()*texts.length)];