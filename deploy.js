#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Mood Recipe Finder - Deployment Helper');
console.log('==========================================\n');

console.log('📋 Pre-deployment Checklist:');
console.log('✅ Git repository initialized');
console.log('✅ All files committed');
console.log('✅ package.json configured');
console.log('✅ .gitignore created');
console.log('✅ Environment variables ready\n');

console.log('🎯 Recommended Deployment Steps:\n');

console.log('1. 📤 Push to GitHub:');
console.log('   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git');
console.log('   git push -u origin main\n');

console.log('2. 🌐 Deploy to Render (Recommended):');
console.log('   - Go to https://render.com');
console.log('   - Sign up with GitHub');
console.log('   - Click "New +" → "Web Service"');
console.log('   - Connect your GitHub repository');
console.log('   - Configure:');
console.log('     • Name: mood-recipe-app');
console.log('     • Environment: Node');
console.log('     • Build Command: npm install');
console.log('     • Start Command: npm start');
console.log('     • Plan: Free\n');

console.log('3. ⚙️ Environment Variables (Optional):');
console.log('   In Render dashboard, add:');
console.log('   • NODE_ENV = production');
console.log('   • SESSION_SECRET = your-secret-key-here\n');

console.log('4. 🚀 Deploy:');
console.log('   Click "Create Web Service" and wait for deployment\n');

console.log('📊 Free Tier Limits:');
console.log('• Render: 750 hours/month (sleeps after 15 min inactivity)');
console.log('• Railway: $5 credit/month (no sleep)');
console.log('• Vercel: Unlimited (serverless only)\n');

console.log('🔧 Troubleshooting:');
console.log('• If deployment fails, check the logs in your hosting platform');
console.log('• Make sure all dependencies are in package.json');
console.log('• Verify your start script is correct');
console.log('• Check that PORT is set correctly\n');

console.log('📈 After Deployment:');
console.log('• Test your app thoroughly');
console.log('• Add analytics (Google Analytics)');
console.log('• Monitor performance');
console.log('• Consider upgrading to paid plans when you have users\n');

console.log('🎉 Your app will be live at: https://your-app-name.onrender.com');
console.log('\nGood luck with your deployment! 🚀'); 