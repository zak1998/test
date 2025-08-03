const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'mood-recipe-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({
    db: 'sessions.db',
    dir: './'
  }),
  cookie: { 
    secure: NODE_ENV === 'production', // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Database setup
const db = new sqlite3.Database('recipes.db');

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
    res.redirect('/dashboard');
  } else {
    next();
  }
}

// Authentication Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    db.get("SELECT id FROM users WHERE username = ? OR email = ?", [username, email], async (err, row) => {
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
        [username, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create user' });
        }

        // Set session
        req.session.userId = this.lastID;
        req.session.username = username;

        res.json({ 
          success: true, 
          message: 'Registration successful',
          user: { id: this.lastID, username, email }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    db.get("SELECT * FROM users WHERE username = ? OR email = ?", [username, username], async (err, user) => {
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

      res.json({ 
        success: true, 
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email }
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
      res.json({ user });
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
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
    
    res.json(rows[0]);
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

// Page Routes
app.get('/', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 