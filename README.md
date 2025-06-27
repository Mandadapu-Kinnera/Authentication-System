# Full-Stack Authentication System

A comprehensive authentication system built with Node.js, Express, TypeScript, React, and MySQL.

## 🚀 Features

### Backend Features
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Role-Based Authorization**: User and admin roles with different permissions
- **Password Reset**: Email-based password reset functionality
- **Input Validation**: Comprehensive validation using Zod schemas
- **Rate Limiting**: Protection against brute force attacks
- **Error Handling**: Centralized error handling with consistent responses
- **Database Security**: MySQL with proper indexing and constraints

### Frontend Features
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with persistent storage
- **Form Validation**: Real-time password strength validation
- **Protected Routes**: Route-based authentication and authorization
- **Admin Panel**: User management for administrators
- **Loading States**: Smooth loading indicators and error handling

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **Context API** - State management

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Database Setup
1. Start your MySQL server
2. Run the SQL commands from `DATABASE_SETUP.sql` in your MySQL command line:
```sql
mysql -u root -p < DATABASE_SETUP.sql
```

### Environment Setup
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=auth_system
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
```

### Installation
1. Install dependencies:
```bash
npm install
```

2. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend server on `http://localhost:5173`

## 🔐 API Endpoints

### Public Routes
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/reset-password` - Password reset request

### Protected Routes
- `GET /api/auth/me` - Get current user info

### Admin Routes
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/users/role` - Update user role
- `DELETE /api/auth/users/:userId` - Delete user

## 👥 Default Users

The system comes with two default users:

### Admin User
- **Email**: admin@example.com
- **Password**: Admin123!
- **Role**: admin

### Regular User
- **Email**: user@example.com
- **Password**: User123!
- **Role**: user

**⚠️ Important**: Change these default passwords in production!

## 🛡 Security Features

- **Password Requirements**: Minimum 8 characters with uppercase, lowercase, number, and special character
- **JWT Tokens**: Secure token-based authentication with expiration
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **SQL Injection Protection**: Parameterized queries with Sequelize
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers for Express
- **Input Validation**: Comprehensive validation with Zod
- **Password Hashing**: bcrypt with salt rounds

## 🎨 UI Features

- **Responsive Design**: Works on all screen sizes
- **Dark/Light Theme**: Toggle with persistent storage
- **Loading States**: Smooth animations and feedback
- **Form Validation**: Real-time validation with visual feedback
- **Error Handling**: Graceful error display
- **Modern Design**: Glass morphism and gradient effects

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
├── contexts/            # React contexts (Auth, Theme)
├── pages/              # Page components
├── types/              # TypeScript type definitions
├── controllers/        # Express route controllers
├── middleware/         # Express middleware
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
├── validation/         # Input validation schemas
└── config/             # Configuration files
```

## 🚀 Deployment

### Backend Deployment
1. Build the server:
```bash
npm run build:server
```

2. Start the production server:
```bash
npm run start:server
```

### Frontend Deployment
1. Build the frontend:
```bash
npm run build
```

2. Serve the built files using a web server like nginx or Apache.

## 🔧 Configuration

### Environment Variables
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret (minimum 32 characters)
- `JWT_EXPIRES_IN` - Token expiration time
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set and minimum 32 characters
   - Check token expiration settings

3. **CORS Issues**
   - Verify FRONTEND_URL in `.env` matches your frontend URL
   - Check CORS configuration in `app.ts`

4. **Password Validation**
   - Ensure passwords meet requirements (8+ chars, uppercase, lowercase, number, special char)

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.