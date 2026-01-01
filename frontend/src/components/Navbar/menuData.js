export const menuData = {
  marbleware: {
    label: "Marbleware",
    path: "/marbleware",
    headings: [
      { title: "Kitchenware", sub: ["Storage Jars", "Mixing Bowls", "Utensil Holders", "Masala & Pestle", "Rolling Pin & Board", "Kitchen Trays"] },
      { title: "Bathware", sub: ["Soap Dispensers", "Soap Dispenser Combo", "Soap Trays", "Bathroom Combo Sets", "Dispenser Trays", "Tissue Holders"] },
      { title: "Devotional Collection", sub: ["All Gods' Idols"] },
      { title: "Designer Collection", sub: ["Designer Vases", "Designer Bowls", "Designer pattis", "Designer Plates", "Designer Mandalas"] },
      { title: "Home Decors", sub: ["Vases", "Lamps", "Sculptures", "Candle Holders", "Table Centrepieces", "Decorative Animals"] },
      { title: "Pooja Collection", sub: ["Pooja Thali", "Devi Foot prints", "Diyas", "Agarbatti Stand", "Kalash","Stools"] },
      ],
  },

  ceramicware: {
    label: "Ceramicware",
    path: "/ceramicware",
    headings: [
      { title: "Bathware", sub: ["Soap Dispensers", "Toothbrush Holders", "Soap Dishes", "Bathroom Tumblers", "Bathroom Trays"] },
      { title: "Drinkware", sub: ["Mugs", "Cups", "Bottles", "Jugs / Pitchers", "Tea Sets", "Coffee Sets"] },
      { title: "Home Decor", sub: ["Vases", "Planters", "Sculptures", "Candle Holders", "Lamps"] },
      { title: "Kitchenware", sub: ["Mixing Bowls", "Storage Jars", "Spice Jars", "Utensil Holders", "Oil Bottles"] },
      { title: "Serveware", sub: ["Serving Bowls", "Kettles & Cups", "Serving Plates", "Serving Trays", "Snack Bowls", "Dessert Bowls"] },
      { title: "Tableware", sub: ["Plates", "Bowls", "Dinner Sets", "Breakfast Sets", "Cup & Saucer Sets"] },
    ],
  },
};

export const slugify = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/\//g, "-or-")
    .replace(/[\s\W-]+/g, "-");

