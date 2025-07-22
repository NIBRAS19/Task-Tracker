# 🚀 Task Tracker

> A beautiful, modern full-stack task management application with real-time updates and glassmorphism UI

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Pusher](https://img.shields.io/badge/Pusher-Real--time-300D4F?style=for-the-badge&logo=pusher&logoColor=white)](https://pusher.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [👥 Default Users](#-default-users)
- [🧪 Testing Guide](#-testing-guide)
- [🐛 Troubleshooting](#-troubleshooting)
- [📈 Verified Features](#-verified-features)
- [🎓 Learning Outcomes](#-learning-outcomes)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT Authentication** - Secure user registration and login
- **Role-based Access Control** - Admin and User roles with different permissions
- **Protected Routes** - Both frontend and API endpoint protection
- **Token Persistence** - Auto-login functionality with localStorage

### 📋 Task Management
- **Full CRUD Operations** - Create, read, update, and delete tasks
- **Status Management** - Todo, In Progress, and Done states
- **Advanced Filtering** - Filter by status and search functionality
- **User Ownership** - Users can only manage their own tasks

### ⚡ Real-time Features
- **Live Updates** - WebSocket-powered real-time task synchronization
- **Private Channels** - User-specific notification channels
- **Toast Notifications** - Instant feedback for all actions
- **Auto-refresh** - Automatic task list updates

### ⏰ Background Processing
- **Email Notifications** - Queued email system for new tasks
- **Background Jobs** - Laravel queue system integration
- **Job Monitoring** - Comprehensive logging and error handling

### 🎨 Modern UI/UX
- **Glassmorphism Design** - Beautiful frosted glass effects
- **Dark Theme** - Eye-friendly dark mode interface
- **Responsive Layout** - Mobile-first responsive design
- **Smooth Animations** - Micro-interactions and hover effects
- **Floating Actions** - Intuitive floating action buttons

---

## 🛠️ Tech Stack

<table>
<tr>
<td width="50%">

### 🔧 Backend (Laravel)
- **Framework:** Laravel 12
- **Database:** SQLite
- **Authentication:** Laravel Sanctum
- **Real-time:** Pusher Broadcasting
- **Queue System:** Laravel Queues
- **API:** RESTful JSON API

</td>
<td width="50%">

### ⚛️ Frontend (React)
- **Framework:** React 18 (Hooks)
- **Styling:** shadcn/ui + Tailwind CSS
- **Real-time:** Pusher JavaScript SDK
- **HTTP Client:** Axios
- **Icons:** Font Awesome
- **Typography:** Inter Font

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ and npm
- **PHP** 8.1+ and Composer
- **SQLite** (comes with PHP)

### 1. 📥 Clone the Repository

```bash
git clone <your-repo-url>
cd task-tracker
```

### 2. 🔧 Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database setup
touch database/database.sqlite
php artisan migrate:fresh --seed

# Install Pusher
composer require pusher/pusher-php-server

# Start Laravel server
php artisan serve
```

### 3. ⚛️ Frontend Setup (React)

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Start development server
npm run dev
```

### 4. 🔄 Start Queue Worker

```bash
# New terminal - this is IMPORTANT for background jobs
cd backend
php artisan queue:work
```

### 5. 🌐 Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api

---

## ⚙️ Configuration

### 🔑 Environment Variables

#### Backend (.env)
```bash
# Database
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

# Broadcasting
BROADCAST_DRIVER=pusher

# Pusher Configuration
PUSHER_APP_ID=your-app-id
PUSHER_APP_KEY=your-app-key
PUSHER_APP_SECRET=your-app-secret
PUSHER_APP_CLUSTER=mt1

# Queue Configuration
QUEUE_CONNECTION=database

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

#### Frontend (.env)
```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Pusher Configuration
VITE_PUSHER_APP_KEY=your-pusher-app-key
VITE_PUSHER_APP_CLUSTER=mt1
```

### 🔗 Getting Pusher Credentials

1. Visit [pusher.com](https://pusher.com) and create a free account
2. Create a new app with these settings:
   - **Name:** task-tracker
   - **Cluster:** mt1 (or your preferred region)
   - **Frontend:** React
   - **Backend:** Laravel
3. Copy credentials from "App Keys" tab
4. Update both `.env` files with your credentials

---

## 👥 Default Users

After running `php artisan migrate:fresh --seed`:

| Role | Email | Password |
|------|-------|----------|
| **User** | `user@example.com` | `password123` |
| **Admin** | `admin@example.com` | `password123` |

---

## 🧪 Testing Guide

### 🔐 Authentication Flow
1. **Register:** Create a new account at `/register`
2. **Login:** Sign in with credentials
3. **Token Check:** Verify token in browser localStorage
4. **Logout:** Click user avatar to logout

### 📋 Task Management
1. **Create:** Click "+" floating button or "New Task"
2. **View:** Tasks display in responsive card grid
3. **Edit:** Click edit icon on task cards
4. **Delete:** Click delete icon (with confirmation)
5. **Filter:** Use sidebar filters for status/search

### ⚡ Real-time Updates Test
1. Open two browser tabs with the application
2. Login as the same user in both tabs
3. Edit a task in tab 1
4. Watch tab 2 for toast notification and auto-refresh
5. Check Pusher dashboard for connection activity

### 👑 Admin Features
1. Login as admin (`admin@example.com`)
2. Check header for "ADMIN" badge
3. Use sidebar "View Mode" to switch between "My Tasks" and "All Tasks"
4. View all users' tasks in admin mode

### 🔄 Background Jobs
1. Create a new task
2. Check Laravel logs: `tail -f storage/logs/laravel.log`
3. Look for: "Task Notification Email Sent" log entry
4. Verify queue worker is processing jobs

---

## 🐛 Troubleshooting

<details>
<summary><strong>🔄 Real-time Updates Not Working</strong></summary>

**Symptoms:** Tasks don't update in real-time across tabs

**Solutions:**
```bash
# Check Pusher credentials
grep PUSHER .env

# Verify broadcasting driver
grep BROADCAST_DRIVER .env  # Should be 'pusher'

# Test manual broadcast
php artisan tinker
>>> $task = App\Models\Task::first();
>>> event(new App\Events\TaskUpdated($task));
>>> exit
```
</details>

<details>
<summary><strong>⏳ Queue Jobs Not Processing</strong></summary>

**Symptoms:** No email notifications in logs when creating tasks

**Solutions:**
```bash
# Ensure queue worker is running
php artisan queue:work

# Check failed jobs
php artisan queue:failed

# Restart queue worker
php artisan queue:restart
php artisan queue:work
```
</details>

<details>
<summary><strong>🚫 CORS Issues</strong></summary>

**Symptoms:** API requests blocked by browser

**Solutions:**
```bash
# Check SANCTUM_STATEFUL_DOMAINS in Laravel .env
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000

# Clear Laravel config cache
php artisan config:clear

# Restart Laravel server
php artisan serve
```
</details>

<details>
<summary><strong>🗄️ SQLite Database Issues</strong></summary>

**Symptoms:** Database connection errors

**Solutions:**
```bash
# Check database file exists
ls -la database/database.sqlite

# Create if missing
touch database/database.sqlite

# Run migrations
php artisan migrate:fresh --seed

# Check permissions
chmod 664 database/database.sqlite
```
</details>

<details>
<summary><strong>⚛️ Frontend Build Issues</strong></summary>

**Symptoms:** React app won't start or build

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be 16+
```
</details>

---

## 📈 Verified Features

### ✅ Backend (Laravel)
- ✅ User Authentication (Sanctum)
- ✅ Task CRUD Operations
- ✅ User Authorization
- ✅ Admin Functionality
- ✅ Real-time Broadcasting (Pusher)
- ✅ Background Jobs & Email Notifications
- ✅ Database Relationships
- ✅ API Validation & Error Handling
- ✅ CORS Configuration
- ✅ Task Filtering & Search

### ✅ Frontend (React)
- ✅ Modern Glassmorphism UI
- ✅ Authentication Flow
- ✅ Task Management Interface
- ✅ Real-time Updates with Toast Notifications
- ✅ Responsive Design
- ✅ Admin Panel
- ✅ Search & Filtering
- ✅ Loading States
- ✅ Error Handling
- ✅ User Experience Enhancements

### ✅ Integration
- ✅ API Communication
- ✅ JWT Token Management
- ✅ Real-time Synchronization
- ✅ Background Job Processing
- ✅ Cross-origin Request Handling
- ✅ Error Propagation

---

## 🎓 Learning Outcomes

### 🔧 Technical Challenges Solved

#### 📡 Real-time Broadcasting Setup
**Challenge:** Getting Pusher WebSocket connections to work properly  
**Solution:** Configured proper channel authorization, private channels, and CORS headers  
**Key Learning:** Broadcasting requires careful setup of both server-side events and client-side subscriptions

#### ⏳ Queue System Configuration
**Challenge:** Background jobs weren't processing automatically  
**Solution:** Database-based queue driver with dedicated worker process  
**Key Learning:** Queue workers must run continuously with proper error handling

#### 🔐 Authentication Flow
**Challenge:** Managing JWT tokens between frontend and backend  
**Solution:** Sanctum implementation with token persistence and lifecycle management  
**Key Learning:** Token-based auth requires careful handling of the complete token lifecycle

#### 🌐 CORS Configuration
**Challenge:** Browser blocking API requests from React to Laravel  
**Solution:** Proper SANCTUM_STATEFUL_DOMAINS and middleware configuration  
**Key Learning:** CORS setup is crucial for seamless frontend-backend communication

#### 🗄️ Database Relationships & Models
**Challenge:** Ensuring proper data relationships and constraints  
**Solution:** Eloquent relationships with proper foreign keys and cascading deletes  
**Key Learning:** Database design directly affects both performance and feature implementation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using Laravel, React, and modern web technologies
- Special thanks to the open-source community
- UI inspiration from modern design trends

---

<div align="center">

**[⬆ Back to Top](#-task-tracker)**

Made with ❤️ by NIBRAS19

</div>
