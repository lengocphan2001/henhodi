# Henhodi Admin Panel

A comprehensive admin panel for managing users, girls, and reviews in the Henhodi application.

## Features

### 🏠 Admin Dashboard (`/admin`)
- Overview statistics (total users, girls, reviews)
- Recent users and girls lists
- Quick navigation to all admin sections
- Real-time data display

### 👥 User Management (`/admin/users`)
- **View all users** with pagination
- **Search users** by username or email
- **Create new users** with role assignment
- **Edit user details** (username, email, role, profile)
- **Delete users** with confirmation
- **Toggle user status** (active/inactive)
- **Role management** (user/admin)

### 💃 Girl Management (`/admin/girls`)
- **View all girls** with pagination
- **Search girls** by name
- **Filter by area**
- **Create new girls** with full profile information
- **Edit girl details** (name, area, price, rating, contact info)
- **Delete girls** with confirmation
- **Toggle girl status** (active/inactive)
- **Image management** support

### ⭐ Review Management (`/admin/reviews`)
- **View all reviews** with pagination
- **Search reviews** by comment content
- **Filter by girl ID**
- **Delete reviews** with confirmation
- **Star rating display**
- **User information** for each review

## Technical Implementation

### Frontend (React + TypeScript)
- **Modern UI** with dark theme
- **Responsive design** for all screen sizes
- **Real-time updates** after operations
- **Form validation** and error handling
- **Loading states** and user feedback
- **Confirmation dialogs** for destructive actions

### Backend (Node.js + Express)
- **RESTful API** design
- **JWT authentication** for secure access
- **Role-based access control** (RBAC)
- **Input validation** and sanitization
- **Error handling** with proper HTTP status codes
- **Database optimization** with indexes
- **Automatic database initialization**

### Database (MySQL)
- **Automatic schema creation** on server startup
- **Normalized schema** for data integrity
- **Foreign key constraints** for referential integrity
- **JSON fields** for flexible data storage
- **Indexes** for optimal query performance
- **Timestamps** for audit trails

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get current user profile

### User Management (Admin Only)
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-status` - Toggle user status

### Girl Management
- `GET /api/girls` - Get all girls (public)
- `GET /api/girls/:id` - Get girl by ID (public)
- `POST /api/girls` - Create new girl (admin only)
- `PUT /api/girls/:id` - Update girl (admin only)
- `DELETE /api/girls/:id` - Delete girl (admin only)
- `PATCH /api/girls/:id/toggle-status` - Toggle girl status (admin only)

### Review Management
- `GET /api/reviews` - Get all reviews (public)
- `POST /api/reviews` - Create review (authenticated users)
- `DELETE /api/reviews/:id` - Delete review (admin only)

### Dashboard
- `GET /api/users/dashboard/stats` - Get dashboard statistics (admin only)

### Health Check
- `GET /api/health` - API health status

## Security Features

- **JWT token authentication** for all protected routes
- **Role-based middleware** to restrict access
- **Password hashing** using bcrypt
- **Input validation** to prevent injection attacks
- **CORS configuration** for cross-origin requests
- **Environment variables** for sensitive configuration

## Setup Instructions

### 1. Database Setup (Automatic)
The database will be automatically initialized when you start the server. No manual SQL execution needed!

**Prerequisites:**
- MySQL server running
- Database created (e.g., `henhodi`)
- User with appropriate permissions

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your database configuration
cp .env.example .env
# Edit .env with your database credentials

# Start the server (database will be auto-initialized)
npm run dev

# Or run database setup separately if needed
npm run setup-db
```

### 3. Frontend Setup
```bash
npm install
npm start
```

### 4. Environment Variables
Create a `.env` file in the backend directory:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=henhodi
JWT_SECRET=your_jwt_secret_key
```

## Automatic Database Initialization

When you start the server, it will automatically:

1. **Test database connection**
2. **Create tables** if they don't exist:
   - `users` table with indexes
   - `girls` table with indexes  
   - `reviews` table with indexes
3. **Create default admin user** if not exists
4. **Set up foreign key constraints**
5. **Create performance indexes**

**Console output example:**
```
🚀 Starting Henhodi API Server...
🔗 Database connection successful
🔄 Initializing database...
📋 Database tables created successfully
📊 Database indexes created successfully
👤 Default admin user created
   Username: admin
   Email: admin@henhodi.com
   Password: admin123
✅ Database initialized successfully!
✅ Server running on port 5000
🌐 API available at http://localhost:5000/api
🔍 Health check: http://localhost:5000/api/health
👤 Admin panel: http://localhost:3000/admin
```

## Default Admin Account
- **Username**: admin
- **Email**: admin@henhodi.com
- **Password**: admin123
- **Role**: admin

## Usage Guide

### Accessing the Admin Panel
1. Navigate to `/admin` in your browser
2. Login with admin credentials
3. Use the navigation cards to access different sections

### Managing Users
1. Go to `/admin/users`
2. Use search to find specific users
3. Click "Add New User" to create users
4. Use action buttons to edit, delete, or toggle status

### Managing Girls
1. Go to `/admin/girls`
2. Use search and area filters
3. Click "Add New Girl" to create entries
4. Use action buttons for management operations

### Managing Reviews
1. Go to `/admin/reviews`
2. Use search and girl ID filters
3. Delete inappropriate reviews as needed

## File Structure

```
src/
├── pages/
│   ├── AdminDashboard.tsx    # Main dashboard
│   ├── AdminUsers.tsx        # User management
│   ├── AdminGirls.tsx        # Girl management
│   └── AdminReviews.tsx      # Review management
├── services/
│   └── api.ts               # API service layer
└── components/              # Reusable components

backend/
├── src/
│   ├── controllers/         # Route handlers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── db.js              # Database connection & initialization
│   └── app.js             # Main server file
├── setup-database.js      # Standalone database setup script
└── package.json           # Dependencies and scripts
```

## Troubleshooting

### Database Connection Issues
1. **Check MySQL is running**: `sudo systemctl status mysql`
2. **Verify database exists**: `CREATE DATABASE IF NOT EXISTS henhodi;`
3. **Check user permissions**: Grant appropriate permissions to your database user
4. **Verify .env configuration**: Ensure all database variables are correct

### Manual Database Setup
If automatic setup fails, you can run it manually:
```bash
cd backend
npm run setup-db
```

### Reset Database
To reset the database completely:
```sql
DROP DATABASE henhodi;
CREATE DATABASE henhodi;
```
Then restart the server - it will recreate everything automatically.

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include input validation
4. Test all CRUD operations
5. Update documentation as needed

## Support

For issues or questions about the admin panel, please check:
1. Database connection and configuration
2. Environment variables setup
3. JWT token validity
4. User role permissions
5. Server logs for detailed error messages 