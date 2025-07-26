
# Business Card Builder

A complete business card builder application with React frontend and a fake JSON server for development.


## 🚀 Quick Start

1. **Install dependencies for both client and server:**
   ```bash
   npm run setup
   ```

2. **Start both client & server:**
   ```bash
   npm run dev
   ```


This will start:
- **Frontend**: [http://localhost:5173](http://localhost:5173) (React + Vite)
- **Backend**: [http://localhost:3001](http://localhost:3001) (JSON Server)


## 📁 Project Structure

```
business-card/
├── client/          # React frontend application
├── server/          # Fake JSON API server
├── package.json     # Root scripts for development
└── README.md        # This file
```


## 🔧 Available Scripts

| Command         | Description                                 |
|-----------------|---------------------------------------------|
| `npm run dev`   | Start both client and server concurrently   |
| `npm run setup` | Install dependencies for both client/server |
| `npm run client`| Start only the frontend (port 5173)         |
| `npm run server`| Start only the backend (port 3001)          |


## 🎯 Features

### 🖥️ Frontend (React + Vite)
- Authentication (Login/Register with real API calls)
- Dashboard for business card management
- Template Gallery with 5+ professional templates
- Card Editor (create and edit cards)
- Admin Panel with analytics
- User Management for admins
- System Monitoring dashboard
- Responsive Design (TailwindCSS)
- State Management (Zustand)
- Protected Routes (role-based access)

### 🔧 Backend (Fake JSON Server)
- RESTful API endpoints
- Authentication simulation (JWT-like tokens)
- User Management (admin/user roles)
- CRUD for cards and templates
- Admin Analytics with realistic data
- Search & Pagination for users
- CORS support
- Simulated network delays


## 🔐 Test Credentials

**Admin Access**
- Email: `admin@test.com`
- Password: `admin123`
- Features: Full admin dashboard, user management, analytics

**Regular User**
- Email: `john@test.com`
- Password: `user123`
- Features: Dashboard, card creation, templates


## 📊 Admin Dashboard Features

**Analytics Overview**
- Total users and cards metrics
- Active users (daily, weekly, monthly)
- User growth charts
- Card creation trends
- Popular templates analysis
- Recent activity feed

**User Management**
- User listing with search
- Status management (activate/deactivate)
- Role-based access control
- User details modal
- CSV export

**System Monitoring**
- Health indicators
- Error tracking/reporting
- Performance metrics
- Storage/bandwidth usage


## 🎨 UI Components

- Admin dashboard
- Interactive charts/analytics
- Responsive tables
- Search/filter
- Modal dialogs/forms
- Toast notifications
- Loading spinners
- Card gallery/previews


## 🔄 API Endpoints

**Authentication**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

**Cards & Templates**
- `GET /api/cards`
- `GET /api/templates`
- `POST /api/cards`

**Admin**
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/admin/system-metrics`


## 🛠️ Development Notes

**Frontend Stack**
- React 18 (hooks)
- Vite
- TailwindCSS
- Zustand
- React Router
- Axios
- Lucide React

**Backend Stack**
- json-server
- Custom middleware (auth)
- CORS
- Realistic data/relationships

**Key Benefits**
1. Full-stack dev without backend complexity
2. Realistic API responses for frontend testing
3. Role-based authentication simulation
4. Complete admin features
5. Modern React patterns
6. Production-ready UI


## 🚀 Next Steps for Production

1. Replace JSON Server with a real backend (Node.js, Python, etc.)
2. Add a database (PostgreSQL, MongoDB, etc.)
3. Implement file storage for card images
4. Add payment integration for premium features
5. Set up testing (unit, integration, E2E)
6. Deploy to cloud (AWS, Vercel, etc.)


## 📝 Notes

- The fake server persists data in `server/db.json`
- Authentication is simulated (JWT pattern)
- All UI components are responsive and accessible
- Admin features include real pagination and search
- Easy backend integration

---

**🎉 You now have a fully functional business card builder with admin dashboard!**

Start with `npm run dev` and visit [http://localhost:5173](http://localhost:5173) to explore all features!
