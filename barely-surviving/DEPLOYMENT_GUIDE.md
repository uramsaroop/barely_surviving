# Barely Surviving - Complete Deployment Guide

## 🎉 What's Complete

### ✅ Backend (100%)
- FastAPI application with all routes
- MongoDB models and schemas
- Dashboard stats, streak calculation
- CRUD operations for workouts, meals, weight, goals
- Docker configuration
- Health checks

### ✅ K8s Manifests (100%)
- Namespaces (dev + prod)
- MongoDB StatefulSet with 10Gi PVC
- Backend Deployment + Service
- Frontend Deployment + Service
- Ingress (dev + prod)
- ConfigMaps

### ✅ Deployment Scripts (100%)
- `build-images.sh` - Build and import Docker images
- `deploy-dev.sh` - Deploy to dev namespace
- `deploy-prod.sh` - Deploy to prod namespace

### ⏳ Frontend (80%)
- ✅ React setup with Vite
- ✅ Daily Ritual theme system
- ✅ API service
- ✅ AppContext
- ✅ Header & BottomNav components
- ⏳ Dashboard page (template provided in COMPLETE_FRONTEND_CODE.md)
- ⏳ Other pages (simple placeholders needed)

## 🚀 Quick Start - Option 1: Docker Compose

```bash
# 1. Clone and enter directory
cd barely-surviving

# 2. Start everything
docker-compose up

# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## 🚀 Quick Start - Option 2: k3s Deployment

```bash
# 1. Build images
./scripts/build-images.sh

# 2. Deploy to dev
./scripts/deploy-dev.sh

# 3. Access
# Add to /etc/hosts: 127.0.0.1 barely-surviving-dev.local
# Visit: http://barely-surviving-dev.local

# Or port forward:
kubectl port-forward svc/frontend 8080:80 -n barely-surviving-dev
# Visit: http://localhost:8080
```

## 📝 Complete the Frontend

The backend is fully functional. To complete the frontend:

### Option A: Use the Template

Copy the Dashboard code from `COMPLETE_FRONTEND_CODE.md`:

```bash
cd frontend/src/pages
# Create Dashboard.jsx with the template code
```

### Option B: Create Simple Placeholders

For each remaining page (`src/pages/`), create:

```jsx
import React from 'react';
import { colors, fonts } from '../styles/theme';

const PageName = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: fonts.display, color: colors.pine }}>
        Page Title
      </h2>
      <p style={{ color: colors.sage }}>Coming soon!</p>
    </div>
  );
};

export default PageName;
```

Create for:
- `Workouts.jsx`
- `Nutrition.jsx`
- `Progress.jsx`
- `Goals.jsx`

### Then Test

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## 🎨 Daily Ritual Design Reference

All styling uses the theme from `src/styles/theme.js`:

```javascript
import { colors, fonts, borderRadius, shadows } from '../styles/theme';

const styles = {
  card: {
    background: colors.white,
    borderRadius: borderRadius.lg,
    padding: '20px',
    boxShadow: shadows.md,
  },
  title: {
    fontFamily: fonts.display,
    color: colors.pine,
  },
};
```

## 📦 GitHub Setup

The project is ready for GitHub:

```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit - Barely Surviving"

# Add remote
git remote add origin https://github.com/yourusername/barely-surviving.git
git branch -M main
git push -u origin main
```

The `.gitignore` is configured to exclude:
- `.env` files (only `.env.example` is committed)
- `node_modules/`
- Python `venv/` and `__pycache__/`
- Build artifacts

## 🔧 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=barely_surviving
CORS_ORIGINS=http://localhost:5173,http://barely-surviving.local
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## 📊 Testing the Backend

The backend is fully functional. Test it:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Start MongoDB (Docker)
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Start backend
uvicorn app.main:app --reload

# Visit API docs
# http://localhost:8000/docs
```

Try the endpoints:
- POST /api/v1/workouts - Log a workout
- GET /api/v1/dashboard/stats - Get today's stats
- POST /api/v1/goals - Set your goals

## 🎯 Next Steps

1. **Complete Frontend Pages** - Use templates from COMPLETE_FRONTEND_CODE.md
2. **Test Locally** - `docker-compose up`
3. **Deploy to k3s** - `./scripts/deploy-dev.sh`
4. **Add Your Domain** - Update ingress files
5. **Push to GitHub** - `git push origin main`

## 📚 Phase 2: AI Features (Future)

When ready to add AI nutrition features:

1. Get Anthropic API key
2. Add to backend/.env: `ANTHROPIC_API_KEY=sk-ant-...`
3. Implement AI routes (meal parsing, planning, coaching)
4. Add barcode scanning to frontend

## 🆘 Troubleshooting

**Backend won't connect to MongoDB:**
```bash
# Check MongoDB is running
kubectl get pods -n barely-surviving-dev
kubectl logs mongodb-0 -n barely-surviving-dev
```

**Frontend can't reach backend:**
```bash
# Check backend logs
kubectl logs deployment/backend -n barely-surviving-dev

# Verify service endpoints
kubectl get endpoints -n barely-surviving-dev
```

**Port forward not working:**
```bash
# Check service
kubectl get svc -n barely-surviving-dev

# Try different port
kubectl port-forward svc/frontend 3000:80 -n barely-surviving-dev
```

## 🎉 Success!

You now have:
- ✅ Complete FastAPI backend
- ✅ MongoDB database
- ✅ Docker setup
- ✅ K8s manifests  
- ✅ Deployment scripts
- ✅ Daily Ritual design system
- ⏩ Frontend foundation (needs pages)

**The app is 90% complete and ready to deploy!**

Just finish the frontend pages using the templates, and you're live! 🚀
