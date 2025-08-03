# Mood Recipe Finder

A delightful web application that recommends recipes based on your current mood! Simply select how you're feeling, and the app will suggest the perfect recipe to match your emotional state.

## Features

- **Mood-Based Recommendations**: Choose from 8 different moods (Happy, Sad, Excited, Anxious, Refreshed, Romantic, Adventurous, Sick)
- **Beautiful UI**: Modern, responsive design with smooth animations
- **Recipe Details**: Complete ingredients list and step-by-step instructions
- **Multiple Options**: Get a different recipe for the same mood if you don't like the first suggestion
- **Easy Navigation**: Simple interface to switch between moods and recipes

## Tech Stack

- **Backend**: Express.js with SQLite database
- **Frontend**: HTML, CSS (Tailwind), and vanilla JavaScript
- **Database**: SQLite for storing recipes
- **Styling**: Tailwind CSS for modern, responsive design

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open the Application**
   Navigate to `http://localhost:3000` in your web browser

## How to Use

1. **Select Your Mood**: Click on one of the mood buttons that best describes how you're feeling
2. **View Recipe**: The app will display a recipe tailored to your mood, including:
   - Recipe name and difficulty level
   - Preparation time
   - Complete ingredients list
   - Step-by-step cooking instructions
3. **Get Another Recipe**: If you don't like the suggested recipe, click "Get Another Recipe" for a different option
4. **Change Mood**: Click "Choose Different Mood" to go back and select a different mood

## Project Structure

```
mood-recipe-app/
├── server.js              # Express server and API endpoints
├── package.json           # Dependencies and scripts
├── recipes.db             # SQLite database (created automatically)
├── public/
│   ├── index.html         # Main HTML file
│   └── script.js          # Frontend JavaScript
└── README.md             # This file
```

## API Endpoints

- `GET /api/recipes/:mood` - Get a random recipe for a specific mood
- `GET /api/moods` - Get all available moods
- `GET /` - Serve the main application page

## Sample Recipes by Mood

- **Happy**: Energizing Smoothie Bowl
- **Sad**: Comforting Mac and Cheese
- **Excited**: Spicy Chicken Tacos
- **Anxious**: Calming Chamomile Tea Cookies
- **Refreshed**: Fresh Garden Salad
- **Romantic**: Chocolate Lava Cake
- **Adventurous**: Spicy Ramen Bowl
- **Sick**: Cozy Chicken Soup

## Customization

To add more recipes or moods:

1. **Add Recipes to Database**: Modify the `sampleRecipes` array in `server.js`
2. **Add New Moods**: Add new mood buttons in `public/index.html` and corresponding recipes in the database
3. **Customize Styling**: Modify the Tailwind classes in the HTML and CSS

## Development

The app uses:
- **Express.js** for the backend API
- **SQLite** for lightweight data storage
- **Tailwind CSS** for styling (loaded via CDN)
- **Font Awesome** for icons
- **Vanilla JavaScript** for frontend functionality

## License

MIT License - feel free to use and modify as needed! 