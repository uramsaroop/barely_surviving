# Barely Surviving 🏃‍♂️

A mobile-first fitness tracking application with AI-powered nutrition features, designed with the **Daily Ritual** design system. Because we're all just barely surviving out here.

## 🎨 Design Philosophy

- **Clean & Minimal**: Lots of breathing room, calm aesthetic
- **Gamified**: Streaks, badges, progress visualization
- **Mobile-First**: Optimized for mobile, works beautifully on desktop
- **Habit-Focused**: Daily ritual approach to building healthy habits

## 🚀 Features

### Phase 1 (Current)
- ✅ **Workout Tracking**: Log cardio, strength, flexibility, sports activities
- ✅ **Nutrition Logging**: Track meals with calories and macros
- ✅ **Weight Progress**: Monitor weight loss journey with charts
- ✅ **Goal Setting**: Set and track weight loss goals
- ✅ **Dashboard**: Daily stats, streak tracking, recent activity feed
- ✅ **Data Persistence**: MongoDB backend with k3s deployment

### Phase 2 (Planned - AI Features)
- 🔮 **AI Meal Parsing**: "grilled chicken salad" → instant nutrition data
- 🔮 **AI Meal Planning**: Weekly meal plans based on your goals
- 🔮 **AI Nutrition Coaching**: Pattern analysis and recommendations
- 🔮 **Barcode Scanning**: Scan products for instant macro logging

### Phase 3 (Planned)
- 🔮 **Apple Watch Integration**: Auto-sync workouts and health data

### Phase 4 (Planned)
- 🔮 **Multi-User Support**: User accounts and authentication

## 📚 Technology Stack

**Frontend:**
- React 18 + Vite
- React Router
- Axios (API client)
- Recharts (data visualization)
- CSS-in-JS (Daily Ritual design system)

**Backend:**
- FastAPI (Python 3.11+)
- Motor + Beanie (Async MongoDB ODM)
- Pydantic (validation)
- Uvicorn (ASGI server)

**Database:**
- MongoDB 7.0

**Deployment:**
- Docker
- Kubernetes (k3s)
- NGINX Ingress Controller

## 📁 Project Structure

```
barely-surviving/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── models/      # MongoDB models (Workout, Meal, Weight, Goal)
│   │   ├── routes/      # API endpoints
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   ├── config.py    # Configuration management
│   │   ├── database.py  # MongoDB connection
│   │   └── main.py      # FastAPI application
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API client
│   │   ├── styles/      # Design system (Daily Ritual)
│   │   ├── context/     # React context for state
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile
│   └── .env.example
│
├── k8s/                 # Kubernetes manifests
│   ├── namespaces/     # Dev and Prod namespaces
│   ├── mongodb/        # MongoDB StatefulSet + PVC
│   ├── backend/        # Backend Deployment + Service
│   ├── frontend/       # Frontend Deployment + Service
│   └── ingress/        # Ingress controllers
│
├── scripts/            # Deployment scripts
├── docker-compose.yml  # Local development
└── README.md          # This file
```

## 🛠️ Local Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.11+ (for local backend development)

### Quick Start with Docker Compose

```bash
# Clone the repository
git clone https://github.com/yourusername/barely-surviving.git
cd barely-surviving

# Start all services
docker-compose up

# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# MongoDB: localhost:27017
```

### Manual Setup (Without Docker)

**Backend:**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your MongoDB connection string

# Run the backend
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your API URL

# Run the development server
npm run dev
```

**MongoDB (if not using Docker):**
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update MONGODB_URI in backend/.env
```

## 🚢 Production Deployment (k3s)

### Prerequisites
- k3s cluster running
- kubectl configured
- Docker for building images

### Build Images

```bash
# Build backend image
cd backend
docker build -t fitness-backend:latest .

# Build frontend image
cd ../frontend
npm run build
docker build -t fitness-frontend:latest .

# Import to k3s
docker save fitness-backend:latest | sudo k3s ctr images import -
docker save fitness-frontend:latest | sudo k3s ctr images import -
```

### Deploy to Development

```bash
# Create namespace
kubectl apply -f k8s/namespaces/dev-namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb/ -n fitness-dev

# Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n fitness-dev --timeout=120s

# Deploy Backend
kubectl apply -f k8s/backend/ -n fitness-dev

# Deploy Frontend
kubectl apply -f k8s/frontend/ -n fitness-dev

# Deploy Ingress
kubectl apply -f k8s/ingress/dev-ingress.yaml
```

### Deploy to Production

```bash
# Create namespace
kubectl apply -f k8s/namespaces/prod-namespace.yaml

# Deploy all components
kubectl apply -f k8s/mongodb/ -n fitness-prod
kubectl apply -f k8s/backend/ -n fitness-prod
kubectl apply -f k8s/frontend/ -n fitness-prod
kubectl apply -f k8s/ingress/prod-ingress.yaml
```

### Access the Application

**Development:**
- Add to `/etc/hosts`: `127.0.0.1 fitness-dev.local`
- Visit: `http://fitness-dev.local`

**Production:**
- Add to `/etc/hosts`: `127.0.0.1 fitness.local`
- Visit: `http://fitness.local`

**Or use port forwarding:**
```bash
kubectl port-forward svc/frontend 8080:80 -n fitness-dev
# Visit: http://localhost:8080
```

## 🔧 Configuration

### Backend Environment Variables

```bash
# MongoDB
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=fitness_tracker

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:5173,http://fitness.local

# API
API_V1_PREFIX=/api/v1

# Anthropic (Phase 2 - Optional)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Logging
LOG_LEVEL=INFO
```

### Frontend Environment Variables

```bash
# API URL
VITE_API_URL=http://localhost:8000/api/v1
```

## 📊 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Key Endpoints

**Workouts:**
- `POST /api/v1/workouts` - Log workout
- `GET /api/v1/workouts` - List workouts
- `DELETE /api/v1/workouts/{id}` - Delete workout

**Meals:**
- `POST /api/v1/meals` - Log meal
- `GET /api/v1/meals` - List meals
- `GET /api/v1/meals/daily-summary` - Get daily totals

**Weight:**
- `POST /api/v1/weight` - Log weight
- `GET /api/v1/weight/trend` - Get weight trend

**Goals:**
- `POST /api/v1/goals` - Set goals
- `GET /api/v1/goals/progress` - Get progress

**Dashboard:**
- `GET /api/v1/dashboard/stats` - Get daily stats
- `GET /api/v1/dashboard/streak` - Calculate streak
- `GET /api/v1/dashboard/recent-activity` - Get activity feed

## 🎨 Design System (Daily Ritual)

### Colors
```css
--pine: #1B4D3E      /* Primary dark green */
--sage: #5B8A72      /* Mid green */
--moss: #81A684      /* Light green */
--cream: #FBF9F1     /* Background */
--sand: #F3EED9      /* Light accent */
--clay: #C8B8A6      /* Muted text */
--ink: #2A2A2A       /* Primary text */
```

### Typography
- **Display/Headings**: Lora (serif)
- **Body/UI**: Inter (sans-serif)

## 🧪 Testing

```bash
# Backend tests (when implemented)
cd backend
pytest

# Frontend tests (when implemented)
cd frontend
npm test
```

## 📈 Monitoring

### Health Checks

```bash
# Backend health
curl http://localhost:8000/health

# Kubernetes health checks
kubectl get pods -n fitness-dev
kubectl logs -f <pod-name> -n fitness-dev
```

## 🔒 Security

- CORS configured for specific origins only
- Input validation via Pydantic
- MongoDB injection prevention via ODM
- HTTPS ready (configure via Ingress + cert-manager)
- API keys stored in Kubernetes Secrets

## 📝 Adding a Custom Domain

1. **Get a domain** (e.g., from Namecheap, GoDaddy)

2. **Update Ingress:**
```bash
# Edit k8s/ingress/prod-ingress.yaml
# Change: fitness.local → your-domain.com
```

3. **Configure DNS:**
```
A record: your-domain.com → <your-k3s-node-ip>
```

4. **Add TLS (Optional):**
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Update ingress with TLS configuration
# Uncomment TLS sections in ingress.yaml
```

## 🤝 Contributing

This is a private repository. For collaborators:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Private project - All rights reserved

## 🗺️ Roadmap

- [x] Phase 1: Core Features (Workouts, Meals, Weight, Goals)
- [ ] Phase 2: AI Nutrition Features
  - [ ] AI meal parsing
  - [ ] AI meal planning
  - [ ] AI nutrition coaching
  - [ ] Barcode scanning
- [ ] Phase 3: Apple Watch Integration
- [ ] Phase 4: Multi-user & Authentication

## 💡 Tips

**Development:**
- Use `docker-compose logs -f` to view all service logs
- MongoDB data is persisted in Docker volumes
- Frontend hot-reload works with `npm run dev`

**Deployment:**
- Always test in `fitness-dev` namespace first
- Use `kubectl get events -n fitness-dev` for debugging
- Scale deployments: `kubectl scale deployment backend --replicas=3 -n fitness-prod`

**Backup:**
```bash
# Backup MongoDB
kubectl exec -it mongodb-0 -n fitness-prod -- mongodump --out=/tmp/backup
kubectl cp fitness-prod/mongodb-0:/tmp/backup ./backup
```

## 🆘 Troubleshooting

**Backend won't start:**
- Check MongoDB connection: `kubectl logs <backend-pod> -n fitness-dev`
- Verify MongoDB is running: `kubectl get pods -n fitness-dev`

**Frontend can't reach backend:**
- Check CORS settings in backend `.env`
- Verify API_URL in frontend `.env`
- Check service endpoints: `kubectl get endpoints -n fitness-dev`

**Database connection issues:**
- Verify MongoDB service: `kubectl get svc mongodb -n fitness-dev`
- Check MongoDB logs: `kubectl logs mongodb-0 -n fitness-dev`

## 📞 Support

For issues, questions, or feature requests, please create an issue in the repository.

---

**Built with ❤️ using the Daily Ritual design system**
