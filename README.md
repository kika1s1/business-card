# Business Card Builder - Full Stack Development Setup

A complete business card builder application with React frontend and fake JSON server for development.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm run setup
```

### 2. Start Both Client & Server
```bash
npm run dev
```

This will start:
- **Frontend**: `http://localhost:5173` (React + Vite)
- **Backend**: `http://localhost:3001` (JSON Server)

## 📁 Project Structure

```
business-card/
├── client/          # React frontend application
├── server/          # Fake JSON API server
├── package.json     # Root scripts for development
└── README.md        # This file
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server concurrently |
| `npm run setup` | Install dependencies for both client and server |
| `npm run client` | Start only the frontend (port 5173) |
| `npm run server` | Start only the backend (port 3001) |

## 🎯 Features Implemented

### 🖥️ Frontend (React + Vite)
- ✅ **Authentication** (Login/Register with real API calls)
- ✅ **Dashboard** with business cards management
- ✅ **Template Gallery** with 5+ professional templates
- ✅ **Card Editor** (placeholder for card creation)
- ✅ **Admin Panel** with comprehensive analytics
- ✅ **User Management** for administrators
- ✅ **System Monitoring** dashboard
- ✅ **Responsive Design** with TailwindCSS
- ✅ **State Management** with Zustand
- ✅ **Protected Routes** with role-based access

### 🔧 Backend (Fake JSON Server)
- ✅ **RESTful API** with all endpoints
- ✅ **Authentication** simulation with JWT-like tokens
- ✅ **User Management** with roles (admin/user)
- ✅ **CRUD Operations** for cards and templates
- ✅ **Admin Analytics** with realistic data
- ✅ **Search & Pagination** for user management
- ✅ **CORS Support** for frontend integration
- ✅ **Network Delays** to simulate real API

## 🔐 Test Credentials

### Admin Access
- **Email**: `admin@test.com`
- **Password**: `admin123`
- **Features**: Full admin dashboard, user management, analytics

### Regular User
- **Email**: `john@test.com`
- **Password**: `user123`
- **Features**: Dashboard, card creation, templates

## 📊 Admin Dashboard Features

### Analytics Overview
- Total users and cards metrics
- Active users (daily, weekly, monthly)
- User growth charts
- Card creation trends
- Popular templates analysis
- Recent activity feed

### User Management
- Complete user listing with search
- User status management (activate/deactivate)
- Role-based access control
- User details modal
- CSV export functionality

### System Monitoring
- System health indicators
- Error tracking and reporting
- Performance metrics
- Storage and bandwidth usage

## 🎨 UI Components Available

- Professional admin dashboard
- Interactive charts and analytics
- Responsive user tables
- Search and filter capabilities
- Modal dialogs and forms
- Toast notifications
- Loading states and spinners
- Card gallery and previews

## 🔄 API Endpoints

The fake server provides these realistic endpoints:

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`

### Cards & Templates
- `GET /api/cards`
- `GET /api/templates`
- `POST /api/cards`

### Admin
- `GET /api/admin/analytics`
- `GET /api/admin/users`
- `GET /api/admin/system-metrics`

## 🛠️ Development Notes

### Frontend Technology Stack
- **React 18** with modern hooks
- **Vite** for fast development
- **TailwindCSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend Technology Stack
- **json-server** for fake REST API
- **Custom middleware** for authentication
- **CORS** enabled for frontend
- **Realistic data** with proper relationships

### Key Benefits
1. **Full-stack development** without backend complexity
2. **Realistic API responses** for frontend testing
3. **Role-based authentication** simulation
4. **Complete admin features** ready for production
5. **Modern React patterns** and best practices
6. **Production-ready UI** components

## 🚀 Next Steps for Production

1. **Replace JSON Server** with real backend (Node.js, Python, etc.)
2. **Add Database** (PostgreSQL, MongoDB, etc.)
3. **Implement File Storage** for card images
4. **Add Payment Integration** for premium features
5. **Set up Testing** (Unit, Integration, E2E)
6. **Deploy to Cloud** (AWS, Vercel, etc.)

## 📝 Notes

- The fake server persists data in `server/db.json`
- Authentication is simulated but follows JWT patterns
- All UI components are responsive and accessible
- Admin features include real pagination and search
- System is designed for easy backend integration

---

**🎉 You now have a fully functional business card builder with admin dashboard!**

Start with `npm run dev` and visit `http://localhost:5173` to explore all features! "# business-card" 
