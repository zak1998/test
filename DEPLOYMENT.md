# 🚀 Deployment Guide - Free Hosting Options

## Option 1: Render (Recommended - Easiest)

### Step 1: Prepare Your Code
1. Make sure your code is in a Git repository
2. Ensure all files are committed

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `mood-recipe-app`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Environment Variables (Optional)
Add these in Render dashboard:
- `NODE_ENV`: `production`
- `SESSION_SECRET`: `your-secret-key-here`

### Step 4: Deploy
Click "Create Web Service" and wait for deployment.

**Your app will be available at**: `https://your-app-name.onrender.com`

---

## Option 2: Railway (Alternative)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it's a Node.js app

### Step 2: Configure
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Your app will be available at**: `https://your-app-name.railway.app`

---

## Option 3: Vercel (Alternative)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Deploy
```bash
vercel
```

Follow the prompts and your app will be deployed.

---

## Option 4: Heroku (Free Tier Discontinued, but Good to Know)

### Step 1: Install Heroku CLI
Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

### Step 2: Deploy
```bash
heroku create your-app-name
git push heroku main
```

---

## 🔧 Important Notes

### Database Considerations
- **SQLite**: Works for small apps, but data resets on free tiers
- **For Production**: Consider using a cloud database like:
  - **Supabase** (Free tier available)
  - **PlanetScale** (Free tier available)
  - **Railway Postgres** (Free tier available)

### Environment Variables
Set these in your hosting platform:
```
NODE_ENV=production
SESSION_SECRET=your-secure-secret-key
PORT=3000
```

### Custom Domain (Optional)
Most platforms allow you to add a custom domain:
- Render: Free custom domains
- Railway: Free custom domains
- Vercel: Free custom domains

---

## 🎯 Recommended Approach

1. **Start with Render** - Easiest setup
2. **Use SQLite for now** - Simple to deploy
3. **Upgrade to cloud database later** - When you have users

---

## 📊 Free Tier Limits

### Render
- ✅ 750 hours/month free
- ✅ Automatic deployments
- ✅ Custom domains
- ❌ Sleeps after 15 minutes of inactivity

### Railway
- ✅ $5 credit/month (usually enough for small apps)
- ✅ No sleep
- ✅ Automatic deployments
- ❌ Credit system

### Vercel
- ✅ Unlimited deployments
- ✅ Great performance
- ✅ Custom domains
- ❌ Serverless functions only

---

## 🚀 Quick Start Commands

```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main

# Then deploy using one of the platforms above
```

---

## 🔍 Troubleshooting

### Common Issues:
1. **Port Issues**: Make sure you use `process.env.PORT`
2. **Database Path**: Use absolute paths for SQLite
3. **Environment Variables**: Set them in your hosting platform
4. **Build Errors**: Check your `package.json` scripts

### Debug Commands:
```bash
# Check if app runs locally
npm start

# Check for missing dependencies
npm install

# Test the build
npm run build
```

---

## 📈 Next Steps After Deployment

1. **Test Your App**: Make sure everything works
2. **Add Analytics**: Google Analytics or similar
3. **Monitor Performance**: Check your hosting platform's dashboard
4. **Scale Up**: When you have users, consider paid plans
5. **Add Features**: User management, payment processing, etc.

---

## 💡 Pro Tips

- **Use Environment Variables**: Never hardcode secrets
- **Monitor Logs**: Check your hosting platform's logs
- **Backup Data**: Export your database regularly
- **Test Locally**: Always test before deploying
- **Use HTTPS**: Most platforms provide this automatically

---

## 🎉 You're Ready to Deploy!

Choose Render for the easiest experience, or try Railway for better performance. Both are excellent free options to get your app online quickly! 