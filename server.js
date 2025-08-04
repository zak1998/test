const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy for rate limiting (needed for Render)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for development)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Login rate limiting (stricter)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 login attempts per windowMs (increased for development)
  message: 'Too many login attempts, please try again later.'
});

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files except index.html (we'll serve it through protected routes)
app.use(express.static('public', {
  index: false // Disable automatic serving of index.html
}));

// Session configuration with fallback
let sessionStore;
try {
  sessionStore = new SQLiteStore({
    db: 'sessions.db',
    dir: './',
    table: 'sessions'
  });
  console.log('✅ SQLite session store initialized successfully');
} catch (error) {
  console.log('⚠️ SQLite session store failed, using MemoryStore as fallback');
  console.log('⚠️ Error details:', error.message);
  sessionStore = undefined;
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'mood-recipe-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: { 
    secure: NODE_ENV === 'production', // Now properly set based on environment
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax',
    domain: NODE_ENV === 'production' ? undefined : undefined // Let browser set domain
  },
  name: 'mood-recipe-session' // Custom session name
}));

// Add session debugging middleware (only in development)
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    // Only log non-static requests to reduce noise
    if (!req.url.startsWith('/api/') && !req.url.includes('.')) {
      console.log('🔍 Request:', req.method, req.url);
    }
    
    // Log session information for API requests
    if (req.url.startsWith('/api/')) {
      console.log('🔍 Session ID:', req.sessionID);
      console.log('🔍 Session data:', req.session);
    }
    
    next();
  });
}

// Database setup
const db = new sqlite3.Database('recipes.db');

// Multilingual recipe translations
const recipeTranslations = {
  fr: {
    // SAD MOOD RECIPES
    "Comforting Mac and Cheese": {
      name: "Macaroni au Fromage Réconfortant",
      ingredients: "Macaroni, fromage cheddar, lait, beurre, farine, chapelure",
      instructions: "1. Cuire les macaronis\n2. Préparer la sauce au fromage avec beurre, farine, lait et fromage\n3. Combiner et saupoudrer de chapelure\n4. Cuire jusqu'à doré"
    },
    "Warm Chocolate Chip Cookies": {
      name: "Cookies aux Pépites de Chocolat Chauds",
      ingredients: "Farine, beurre, sucre roux, sucre blanc, œufs, vanille, pépites de chocolat, sel",
      instructions: "1. Crémer le beurre et les sucres\n2. Ajouter les œufs et la vanille\n3. Mélanger les ingrédients secs\n4. Incorporer les pépites de chocolat\n5. Cuire à 190°C pendant 10-12 minutes"
    },
    "Creamy Mashed Potatoes": {
      name: "Purée de Pommes de Terre Crémeuse",
      ingredients: "Pommes de terre, beurre, lait, sel, poivre, ail en poudre",
      instructions: "1. Faire bouillir les pommes de terre jusqu'à tendreté\n2. Égoutter et écraser\n3. Ajouter beurre, lait et assaisonnements\n4. Fouetter jusqu'à crémeux"
    },
    "Grilled Cheese with Tomato Soup": {
      name: "Sandwich au Fromage avec Soupe à la Tomate",
      ingredients: "Pain, fromage cheddar, beurre, tomates, crème, basilic, ail",
      instructions: "1. Préparer le sandwich au fromage avec beurre et fromage\n2. Mixer tomates, crème et assaisonnements pour la soupe\n3. Chauffer la soupe et servir ensemble"
    },

    // HAPPY MOOD RECIPES
    "Energizing Smoothie Bowl": {
      name: "Bol Smoothie Énergisant",
      ingredients: "Banane, baies, yaourt, granola, miel, graines de chia",
      instructions: "1. Mixer banane, baies et yaourt\n2. Verser dans un bol\n3. Garnir de granola, miel et graines de chia"
    },
    "Rainbow Fruit Salad": {
      name: "Salade de Fruits Arc-en-Ciel",
      ingredients: "Fraises, oranges, ananas, kiwi, raisins, menthe, miel",
      instructions: "1. Laver et couper tous les fruits\n2. Combiner dans un grand bol\n3. Arroser de miel\n4. Garnir de menthe fraîche"
    },
    "Colorful Buddha Bowl": {
      name: "Bol Buddha Coloré",
      ingredients: "Quinoa, patate douce, avocat, pois chiches, kale, tahini, citron",
      instructions: "1. Cuire le quinoa\n2. Rôtir la patate douce et les pois chiches\n3. Masser le kale avec du citron\n4. Arranger dans le bol avec la vinaigrette tahini"
    },
    "Sunny Side Up Toast": {
      name: "Toast Œuf au Plat",
      ingredients: "Pain au levain, œufs, avocat, tomates cerises, micro-pousses, huile d'olive",
      instructions: "1. Griller le pain\n2. Faire frire les œufs au plat\n3. Écraser l'avocat sur le toast\n4. Garnir d'œufs, tomates et pousses"
    },

    // EXCITED MOOD RECIPES
    "Spicy Chicken Tacos": {
      name: "Tacos de Poulet Épicés",
      ingredients: "Blanc de poulet, tortillas, sauce piquante, oignons, coriandre, citron vert",
      instructions: "1. Assaisonner et cuire le poulet avec des épices\n2. Réchauffer les tortillas\n3. Assembler les tacos avec les garnitures\n4. Servir avec des quartiers de citron vert"
    },
    "Dragon Breath Ramen": {
      name: "Ramen Souffle de Dragon",
      ingredients: "Nouilles ramen, bouillon de poulet, piments fantômes, ail, gingembre, sauce soja, oignons verts",
      instructions: "1. Faire mijoter le bouillon avec les piments et les aromates\n2. Cuire les nouilles\n3. Ajouter la sauce piquante au goût\n4. Garnir d'oignons verts"
    },
    "Volcano Wings": {
      name: "Ailes de Poulet Volcan",
      ingredients: "Ailes de poulet, sauce piquante, beurre, ail, poivre de Cayenne, sauce au fromage bleu",
      instructions: "1. Frire ou cuire les ailes jusqu'à croustillant\n2. Préparer le mélange de sauce piquante\n3. Enrober les ailes de sauce\n4. Servir avec la sauce au fromage bleu"
    },
    "Firecracker Shrimp": {
      name: "Crevettes Pétard",
      ingredients: "Crevettes, farine, œufs, sauce piquante, miel, ail, oignons verts",
      instructions: "1. Paner les crevettes dans la farine et les œufs\n2. Frire jusqu'à doré\n3. Enrober de sauce épicée\n4. Garnir d'oignons verts"
    },

    // ANXIOUS MOOD RECIPES
    "Calming Chamomile Tea Cookies": {
      name: "Cookies au Thé à la Camomille Apaisants",
      ingredients: "Farine, beurre, sucre, thé à la camomille, vanille, œuf",
      instructions: "1. Mélanger les ingrédients secs avec la camomille moulue\n2. Crémer le beurre et le sucre\n3. Combiner et façonner les cookies\n4. Cuire jusqu'à doré"
    },
    "Lavender Honey Toast": {
      name: "Toast au Miel de Lavande",
      ingredients: "Pain au levain, miel, boutons de lavande, beurre, sel de mer",
      instructions: "1. Griller le pain jusqu'à doré\n2. Tartiner de beurre\n3. Arroser de miel à la lavande\n4. Saupoudrer de sel de mer"
    },
    "Mindful Matcha Latte": {
      name: "Latte Matcha Conscient",
      ingredients: "Poudre de matcha, lait d'amande, miel, vanille, eau chaude",
      instructions: "1. Fouetter le matcha avec l'eau chaude\n2. Chauffer le lait d'amande\n3. Combiner avec miel et vanille\n4. Remuer doucement et servir"
    },
    "Soothing Oatmeal with Berries": {
      name: "Flocons d'Avoine Apaisants aux Baies",
      ingredients: "Flocons d'avoine, lait d'amande, baies, miel, cannelle, noix",
      instructions: "1. Cuire les flocons d'avoine dans le lait d'amande\n2. Ajouter les baies et le miel\n3. Saupoudrer de cannelle\n4. Garnir de noix"
    },

    // SICK MOOD RECIPES
    "Cozy Chicken Soup": {
      name: "Soupe de Poulet Réconfortante",
      ingredients: "Poulet, légumes, bouillon, herbes, nouilles",
      instructions: "1. Faire mijoter le poulet avec les légumes et les herbes\n2. Ajouter les nouilles\n3. Cuire jusqu'à ce que les nouilles soient tendres"
    },
    "Ginger Lemon Tea": {
      name: "Thé au Gingembre et Citron",
      ingredients: "Gingembre frais, citron, miel, eau chaude, curcuma",
      instructions: "1. Couper le gingembre et le citron\n2. Faire bouillir l'eau avec le gingembre\n3. Ajouter le citron et le miel\n4. Filtrer et servir chaud"
    },
    "Gentle Rice Porridge": {
      name: "Porridge de Riz Doux",
      ingredients: "Riz blanc, bouillon de poulet, gingembre, oignons verts, sauce soja",
      instructions: "1. Cuire le riz dans le bouillon jusqu'à très tendre\n2. Ajouter le gingembre et les oignons verts\n3. Assaisonner avec la sauce soja\n4. Servir chaud"
    },
    "Honey Toast with Cinnamon": {
      name: "Toast au Miel et Cannelle",
      ingredients: "Pain blanc, miel, cannelle, beurre, lait chaud",
      instructions: "1. Griller légèrement le pain\n2. Tartiner de beurre et miel\n3. Saupoudrer de cannelle\n4. Servir avec du lait chaud"
    },

    // ROMANTIC MOOD RECIPES
    "Chocolate Lava Cake": {
      name: "Gâteau au Chocolat Coulant",
      ingredients: "Chocolat noir, beurre, œufs, sucre, farine, vanille",
      instructions: "1. Faire fondre le chocolat et le beurre\n2. Mélanger avec les autres ingrédients\n3. Cuire dans des ramequins\n4. Servir chaud avec de la glace"
    },
    "Strawberry Champagne Sorbet": {
      name: "Sorbet Fraise Champagne",
      ingredients: "Fraises, champagne, sucre, jus de citron, menthe",
      instructions: "1. Réduire en purée les fraises avec le champagne\n2. Ajouter le sucre et le citron\n3. Congeler dans une sorbetière\n4. Garnir de menthe"
    },
    "Truffle Pasta": {
      name: "Pâtes aux Truffes",
      ingredients: "Fettuccine, huile de truffe, parmesan, beurre, ail, persil",
      instructions: "1. Cuire les pâtes al dente\n2. Faire revenir l'ail dans le beurre\n3. Mélanger avec l'huile de truffe et le parmesan\n4. Garnir de persil"
    },
    "Dark Chocolate Covered Strawberries": {
      name: "Fraises au Chocolat Noir",
      ingredients: "Fraises fraîches, chocolat noir, chocolat blanc, huile de coco",
      instructions: "1. Faire fondre le chocolat noir\n2. Tremper les fraises\n3. Décorer avec le chocolat blanc\n4. Réfrigérer jusqu'à prise"
    },

    // REFRESHED MOOD RECIPES
    "Fresh Garden Salad": {
      name: "Salade de Jardin Fraîche",
      ingredients: "Mélange de salades, tomates, concombre, avocat, noix, vinaigrette",
      instructions: "1. Laver et couper les légumes\n2. Combiner dans un bol\n3. Ajouter les noix et la vinaigrette\n4. Mélanger délicatement"
    },
    "Cucumber Mint Water": {
      name: "Eau Concombre Menthe",
      ingredients: "Concombre, menthe fraîche, citron, eau, glace",
      instructions: "1. Couper le concombre et le citron\n2. Ajouter les feuilles de menthe\n3. Remplir d'eau froide\n4. Laisser infuser 30 minutes"
    },
    "Green Goddess Bowl": {
      name: "Bol Déesse Verte",
      ingredients: "Kale, épinards, avocat, edamame, quinoa, tahini, citron",
      instructions: "1. Masser le kale avec le citron\n2. Cuire le quinoa\n3. Arranger avec avocat et edamame\n4. Arroser de sauce tahini"
    },
    "Citrus Fruit Platter": {
      name: "Plateau de Fruits Agrumes",
      ingredients: "Oranges, pamplemousse, kiwi, menthe, miel, flocons de noix de coco",
      instructions: "1. Peler et segmenter les agrumes\n2. Arranger sur un plateau\n3. Arroser de miel\n4. Garnir de menthe et noix de coco"
    },

    // ADVENTUROUS MOOD RECIPES
    "Spicy Ramen Bowl": {
      name: "Bol Ramen Épicé",
      ingredients: "Nouilles ramen, bouillon, œufs, légumes, sauce piquante, oignons verts",
      instructions: "1. Cuire les nouilles\n2. Préparer le bouillon épicé\n3. Ajouter les garnitures\n4. Servir chaud"
    },
    "Korean BBQ Tacos": {
      name: "Tacos BBQ Coréen",
      ingredients: "Travers de bœuf, tortillas, kimchi, gochujang, oignons verts, graines de sésame",
      instructions: "1. Mariner le bœuf dans la sauce BBQ coréenne\n2. Griller jusqu'à carbonisé\n3. Assembler avec le kimchi\n4. Garnir de graines de sésame"
    },
    "Thai Green Curry": {
      name: "Curry Vert Thaï",
      ingredients: "Lait de coco, pâte de curry vert, légumes, tofu, sauce de poisson, basilic",
      instructions: "1. Faire revenir la pâte de curry dans le lait de coco\n2. Ajouter les légumes et le tofu\n3. Faire mijoter jusqu'à tendreté\n4. Garnir de basilic"
    },
    "Moroccan Couscous": {
      name: "Couscous Marocain",
      ingredients: "Couscous, pois chiches, abricots, amandes, cannelle, curcuma, menthe",
      instructions: "1. Cuire le couscous avec les épices\n2. Ajouter les pois chiches et les abricots\n3. Faire griller les amandes\n4. Garnir de menthe fraîche"
    }
  }
};

// Function to translate recipe based on user's language preference
function translateRecipe(recipe, userLanguage = 'en') {
  if (userLanguage === 'fr' && recipeTranslations.fr[recipe.name]) {
    const translation = recipeTranslations.fr[recipe.name];
    return {
      ...recipe,
      name: translation.name,
      ingredients: translation.ingredients,
      instructions: translation.instructions
    };
  }
  return recipe;
}

// Initialize database with tables and sample data
db.serialize(() => {
  // Create users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Create recipes table
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    mood TEXT NOT NULL,
    prep_time INTEGER,
    difficulty TEXT
  )`);

  // Insert sample recipes for different moods
  const sampleRecipes = [
    // SAD MOOD RECIPES
    {
      name: "Comforting Mac and Cheese",
      ingredients: "Macaroni, cheddar cheese, milk, butter, flour, breadcrumbs",
      instructions: "1. Cook macaroni\n2. Make cheese sauce with butter, flour, milk, and cheese\n3. Combine and top with breadcrumbs\n4. Bake until golden",
      mood: "sad",
      prep_time: 30,
      difficulty: "easy"
    },
    {
      name: "Warm Chocolate Chip Cookies",
      ingredients: "Flour, butter, brown sugar, white sugar, eggs, vanilla, chocolate chips, salt",
      instructions: "1. Cream butter and sugars\n2. Add eggs and vanilla\n3. Mix in dry ingredients\n4. Fold in chocolate chips\n5. Bake at 375°F for 10-12 minutes",
      mood: "sad",
      prep_time: 25,
      difficulty: "easy"
    },
    {
      name: "Creamy Mashed Potatoes",
      ingredients: "Potatoes, butter, milk, salt, pepper, garlic powder",
      instructions: "1. Boil potatoes until tender\n2. Drain and mash\n3. Add butter, milk, and seasonings\n4. Whip until creamy",
      mood: "sad",
      prep_time: 35,
      difficulty: "easy"
    },
    {
      name: "Grilled Cheese with Tomato Soup",
      ingredients: "Bread, cheddar cheese, butter, tomatoes, cream, basil, garlic",
      instructions: "1. Make grilled cheese with butter and cheese\n2. Blend tomatoes, cream, and seasonings for soup\n3. Heat soup and serve together",
      mood: "sad",
      prep_time: 20,
      difficulty: "easy"
    },

    // HAPPY MOOD RECIPES
    {
      name: "Energizing Smoothie Bowl",
      ingredients: "Banana, berries, yogurt, granola, honey, chia seeds",
      instructions: "1. Blend banana, berries, and yogurt\n2. Pour into bowl\n3. Top with granola, honey, and chia seeds",
      mood: "happy",
      prep_time: 10,
      difficulty: "easy"
    },
    {
      name: "Rainbow Fruit Salad",
      ingredients: "Strawberries, oranges, pineapple, kiwi, grapes, mint, honey",
      instructions: "1. Wash and cut all fruits\n2. Combine in large bowl\n3. Drizzle with honey\n4. Garnish with fresh mint",
      mood: "happy",
      prep_time: 15,
      difficulty: "easy"
    },
    {
      name: "Colorful Buddha Bowl",
      ingredients: "Quinoa, sweet potato, avocado, chickpeas, kale, tahini, lemon",
      instructions: "1. Cook quinoa\n2. Roast sweet potato and chickpeas\n3. Massage kale with lemon\n4. Arrange in bowl with tahini dressing",
      mood: "happy",
      prep_time: 30,
      difficulty: "medium"
    },
    {
      name: "Sunny Side Up Toast",
      ingredients: "Sourdough bread, eggs, avocado, cherry tomatoes, microgreens, olive oil",
      instructions: "1. Toast bread\n2. Fry eggs sunny side up\n3. Mash avocado on toast\n4. Top with eggs, tomatoes, and greens",
      mood: "happy",
      prep_time: 12,
      difficulty: "easy"
    },

    // EXCITED MOOD RECIPES
    {
      name: "Spicy Chicken Tacos",
      ingredients: "Chicken breast, tortillas, hot sauce, onions, cilantro, lime",
      instructions: "1. Season and cook chicken with spices\n2. Warm tortillas\n3. Assemble tacos with toppings\n4. Serve with lime wedges",
      mood: "excited",
      prep_time: 25,
      difficulty: "medium"
    },
    {
      name: "Dragon Breath Ramen",
      ingredients: "Ramen noodles, chicken broth, ghost peppers, garlic, ginger, soy sauce, green onions",
      instructions: "1. Simmer broth with peppers and aromatics\n2. Cook noodles\n3. Add hot sauce to taste\n4. Garnish with green onions",
      mood: "excited",
      prep_time: 20,
      difficulty: "medium"
    },
    {
      name: "Volcano Wings",
      ingredients: "Chicken wings, hot sauce, butter, garlic, cayenne pepper, blue cheese dip",
      instructions: "1. Fry or bake wings until crispy\n2. Make hot sauce mixture\n3. Toss wings in sauce\n4. Serve with blue cheese dip",
      mood: "excited",
      prep_time: 40,
      difficulty: "medium"
    },
    {
      name: "Firecracker Shrimp",
      ingredients: "Shrimp, flour, eggs, hot sauce, honey, garlic, green onions",
      instructions: "1. Bread shrimp in flour and eggs\n2. Fry until golden\n3. Toss in spicy sauce\n4. Garnish with green onions",
      mood: "excited",
      prep_time: 25,
      difficulty: "medium"
    },

    // ANXIOUS MOOD RECIPES
    {
      name: "Calming Chamomile Tea Cookies",
      ingredients: "Flour, butter, sugar, chamomile tea, vanilla, egg",
      instructions: "1. Mix dry ingredients with ground chamomile\n2. Cream butter and sugar\n3. Combine and shape cookies\n4. Bake until golden",
      mood: "anxious",
      prep_time: 45,
      difficulty: "medium"
    },
    {
      name: "Lavender Honey Toast",
      ingredients: "Sourdough bread, honey, lavender buds, butter, sea salt",
      instructions: "1. Toast bread until golden\n2. Spread with butter\n3. Drizzle with lavender honey\n4. Sprinkle with sea salt",
      mood: "anxious",
      prep_time: 8,
      difficulty: "easy"
    },
    {
      name: "Mindful Matcha Latte",
      ingredients: "Matcha powder, almond milk, honey, vanilla, hot water",
      instructions: "1. Whisk matcha with hot water\n2. Heat almond milk\n3. Combine with honey and vanilla\n4. Stir gently and serve",
      mood: "anxious",
      prep_time: 10,
      difficulty: "easy"
    },
    {
      name: "Soothing Oatmeal with Berries",
      ingredients: "Steel-cut oats, almond milk, berries, honey, cinnamon, nuts",
      instructions: "1. Cook oats with almond milk\n2. Add cinnamon and honey\n3. Top with fresh berries and nuts\n4. Let sit for 5 minutes",
      mood: "anxious",
      prep_time: 20,
      difficulty: "easy"
    },

    // SICK MOOD RECIPES
    {
      name: "Cozy Chicken Soup",
      ingredients: "Chicken, vegetables, broth, herbs, noodles",
      instructions: "1. Simmer chicken with vegetables and herbs\n2. Add noodles\n3. Cook until noodles are tender",
      mood: "sick",
      prep_time: 60,
      difficulty: "easy"
    },
    {
      name: "Ginger Lemon Tea",
      ingredients: "Fresh ginger, lemon, honey, hot water, turmeric",
      instructions: "1. Slice ginger and lemon\n2. Boil water with ginger\n3. Add lemon and honey\n4. Strain and serve hot",
      mood: "sick",
      prep_time: 15,
      difficulty: "easy"
    },
    {
      name: "Gentle Rice Porridge",
      ingredients: "White rice, chicken broth, ginger, green onions, soy sauce",
      instructions: "1. Cook rice in broth until very soft\n2. Add ginger and green onions\n3. Season with soy sauce\n4. Serve warm",
      mood: "sick",
      prep_time: 30,
      difficulty: "easy"
    },
    {
      name: "Honey Toast with Cinnamon",
      ingredients: "White bread, honey, cinnamon, butter, warm milk",
      instructions: "1. Toast bread lightly\n2. Spread with butter and honey\n3. Sprinkle with cinnamon\n4. Serve with warm milk",
      mood: "sick",
      prep_time: 10,
      difficulty: "easy"
    },

    // ROMANTIC MOOD RECIPES
    {
      name: "Chocolate Lava Cake",
      ingredients: "Dark chocolate, butter, eggs, sugar, flour, vanilla",
      instructions: "1. Melt chocolate and butter\n2. Mix with other ingredients\n3. Bake in ramekins\n4. Serve warm with ice cream",
      mood: "romantic",
      prep_time: 35,
      difficulty: "medium"
    },
    {
      name: "Strawberry Champagne Sorbet",
      ingredients: "Strawberries, champagne, sugar, lemon juice, mint",
      instructions: "1. Puree strawberries with champagne\n2. Add sugar and lemon\n3. Freeze in ice cream maker\n4. Garnish with mint",
      mood: "romantic",
      prep_time: 45,
      difficulty: "medium"
    },
    {
      name: "Truffle Pasta",
      ingredients: "Fettuccine, truffle oil, parmesan, butter, garlic, parsley",
      instructions: "1. Cook pasta al dente\n2. Sauté garlic in butter\n3. Toss with truffle oil and parmesan\n4. Garnish with parsley",
      mood: "romantic",
      prep_time: 25,
      difficulty: "medium"
    },
    {
      name: "Dark Chocolate Covered Strawberries",
      ingredients: "Fresh strawberries, dark chocolate, white chocolate, coconut oil",
      instructions: "1. Melt dark chocolate\n2. Dip strawberries\n3. Drizzle with white chocolate\n4. Chill until set",
      mood: "romantic",
      prep_time: 30,
      difficulty: "easy"
    },

    // REFRESHED MOOD RECIPES
    {
      name: "Fresh Garden Salad",
      ingredients: "Mixed greens, tomatoes, cucumber, avocado, nuts, vinaigrette",
      instructions: "1. Wash and chop vegetables\n2. Combine in bowl\n3. Add nuts and dressing\n4. Toss gently",
      mood: "refreshed",
      prep_time: 15,
      difficulty: "easy"
    },
    {
      name: "Cucumber Mint Water",
      ingredients: "Cucumber, fresh mint, lemon, water, ice",
      instructions: "1. Slice cucumber and lemon\n2. Add mint leaves\n3. Fill with cold water\n4. Let infuse for 30 minutes",
      mood: "refreshed",
      prep_time: 5,
      difficulty: "easy"
    },
    {
      name: "Green Goddess Bowl",
      ingredients: "Kale, spinach, avocado, edamame, quinoa, tahini, lemon",
      instructions: "1. Massage kale with lemon\n2. Cook quinoa\n3. Arrange with avocado and edamame\n4. Drizzle with tahini sauce",
      mood: "refreshed",
      prep_time: 25,
      difficulty: "medium"
    },
    {
      name: "Citrus Fruit Platter",
      ingredients: "Oranges, grapefruit, kiwi, mint, honey, coconut flakes",
      instructions: "1. Peel and segment citrus\n2. Arrange on platter\n3. Drizzle with honey\n4. Garnish with mint and coconut",
      mood: "refreshed",
      prep_time: 20,
      difficulty: "easy"
    },

    // ADVENTUROUS MOOD RECIPES
    {
      name: "Spicy Ramen Bowl",
      ingredients: "Ramen noodles, broth, eggs, vegetables, hot sauce, green onions",
      instructions: "1. Cook noodles\n2. Prepare spicy broth\n3. Add toppings\n4. Serve hot",
      mood: "adventurous",
      prep_time: 20,
      difficulty: "medium"
    },
    {
      name: "Korean BBQ Tacos",
      ingredients: "Beef short ribs, tortillas, kimchi, gochujang, green onions, sesame seeds",
      instructions: "1. Marinate beef in Korean BBQ sauce\n2. Grill until charred\n3. Assemble with kimchi\n4. Top with sesame seeds",
      mood: "adventurous",
      prep_time: 40,
      difficulty: "hard"
    },
    {
      name: "Thai Green Curry",
      ingredients: "Coconut milk, green curry paste, vegetables, tofu, fish sauce, basil",
      instructions: "1. Sauté curry paste in coconut milk\n2. Add vegetables and tofu\n3. Simmer until tender\n4. Garnish with basil",
      mood: "adventurous",
      prep_time: 35,
      difficulty: "medium"
    },
    {
      name: "Moroccan Couscous",
      ingredients: "Couscous, chickpeas, apricots, almonds, cinnamon, turmeric, mint",
      instructions: "1. Cook couscous with spices\n2. Add chickpeas and apricots\n3. Toast almonds\n4. Garnish with fresh mint",
      mood: "adventurous",
      prep_time: 25,
      difficulty: "medium"
    }
  ];

  // Check if recipes table is empty before inserting
  db.get("SELECT COUNT(*) as count FROM recipes", (err, row) => {
    if (row.count === 0) {
      const stmt = db.prepare(`INSERT INTO recipes (name, ingredients, instructions, mood, prep_time, difficulty) 
                               VALUES (?, ?, ?, ?, ?, ?)`);
      
      sampleRecipes.forEach(recipe => {
        stmt.run(recipe.name, recipe.ingredients, recipe.instructions, recipe.mood, recipe.prep_time, recipe.difficulty);
      });
      
      stmt.finalize();
      console.log('Sample recipes inserted successfully');
    }
  });

  // Create a default test user if no users exist
  db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
    if (row.count === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
        ['testuser', 'test@example.com', hashedPassword], function(err) {
        if (err) {
          console.error('Error creating test user:', err);
        } else {
          console.log('Test user created successfully');
          console.log('Username: testuser');
          console.log('Password: password123');
        }
      });
    }
  });
});

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session.userId) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    res.redirect('/');
  } else {
    next();
  }
}

// Authentication Routes
app.post('/api/register', loginLimiter, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Input sanitization
    const sanitizedUsername = username ? username.trim().replace(/[<>]/g, '') : '';
    const sanitizedEmail = email ? email.trim().toLowerCase() : '';

    // Validation
    if (!sanitizedUsername || !sanitizedEmail || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    // Check if user already exists
    db.get("SELECT id FROM users WHERE username = ? OR email = ?", [sanitizedUsername, sanitizedEmail], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
        [sanitizedUsername, sanitizedEmail, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Set session
        req.session.userId = this.lastID;
        req.session.username = sanitizedUsername;

        res.json({ 
          success: true, 
          message: 'Registration successful',
          user: { id: this.lastID, username: sanitizedUsername, email: sanitizedEmail }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input sanitization
    const sanitizedUsername = username ? username.trim() : '';

    // Validation
    if (!sanitizedUsername || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    db.get("SELECT * FROM users WHERE username = ? OR email = ?", [sanitizedUsername, sanitizedUsername], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Set session
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.languagePreference = 'en'; // Set default language

      // Force session save
      req.session.save((err) => {
        if (err) {
          console.error('❌ Error saving session during login:', err);
          return res.status(500).json({ error: 'Failed to create session' });
        }
        
        console.log('✅ Session created successfully for user:', user.username);
        console.log('✅ Session data:', req.session);
        
        res.json({ 
          success: true, 
          message: 'Login successful',
          user: { id: user.id, username: user.username, email: user.email }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true, message: 'Logout successful' });
  });
});

app.get('/api/user', (req, res) => {
  if (req.session.userId) {
    db.get("SELECT id, username, email, created_at FROM users WHERE id = ?", [req.session.userId], (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ 
        user,
        languagePreference: req.session.languagePreference || 'en'
      });
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// API to update user's language preference
app.post('/api/language', requireAuth, (req, res) => {
  const { language } = req.body;
  
  if (!language || !['en', 'fr'].includes(language)) {
    return res.status(400).json({ error: 'Invalid language. Must be "en" or "fr"' });
  }
  
  req.session.languagePreference = language;
  
  // Force session save
  req.session.save((err) => {
    if (err) {
      console.error('❌ Error saving session:', err);
      return res.status(500).json({ error: 'Failed to save language preference' });
    }
    
    console.log('✅ Language preference saved to session:', language);
    res.json({ 
      success: true, 
      message: 'Language preference updated',
      language: language
    });
  });
});

// API Routes (protected)
app.get('/api/recipes/:mood', requireAuth, (req, res) => {
  const mood = req.params.mood;
  
  db.all("SELECT * FROM recipes WHERE mood = ? ORDER BY RANDOM() LIMIT 1", [mood], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (rows.length === 0) {
      res.status(404).json({ error: 'No recipes found for this mood' });
      return;
    }
    
    const recipe = rows[0];
    const userLanguage = req.session.languagePreference || 'en';
    const translatedRecipe = translateRecipe(recipe, userLanguage);
    res.json(translatedRecipe);
  });
});

app.get('/api/moods', requireAuth, (req, res) => {
  db.all("SELECT DISTINCT mood FROM recipes", (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const moods = rows.map(row => row.mood);
    res.json(moods);
  });
});



// Test route for language switcher
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Page Routes
app.get('/', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/login', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.redirect('/');
});

// Block direct access to index.html
app.get('/index.html', (req, res) => {
  if (req.session.userId) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login');
  }
});

// Explicit route for translations.js to ensure it's served correctly
app.get('/translations.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'translations.js'), (err) => {
    if (err) {
      console.error('❌ Error serving translations.js:', err);
      res.status(404).send('Translations file not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 