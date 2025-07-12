# ReWear - Community Clothing Exchange Platform

A modern, sustainable fashion platform built with the MERN stack that allows users to exchange or donate clothes via direct swap or point system.

## 🌟 Features

### Frontend (React + Tailwind CSS)
- **Responsive Design**: Mobile-first approach with beautiful UI
- **Modern Components**: Reusable components with smooth animations
- **Authentication**: Login/Signup with form validation
- **Item Management**: Add, edit, and manage clothing items
- **Browse & Search**: Advanced filtering and search functionality
- **User Dashboard**: Personal dashboard with stats and item management
- **Image Upload**: Drag-and-drop image upload with preview

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based authentication system
- **File Upload**: Image upload and management
- **Database**: MongoDB with Mongoose ODM
- **Security**: Input validation, rate limiting, and security headers

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd odoohackathon
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd re_wear
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../re_wear_server
   npm install
   ```

4. **Setup Environment Variables**
   ```bash
   # In re_wear_server directory
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

5. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Run the Application**

   **Terminal 1 - Backend:**
   ```bash
   cd re_wear_server
   npm run dev
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd re_wear
   npm start
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
odoohackathon/
├── re_wear/                 # Frontend React App
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   └── App.js          # Main app component
│   ├── public/             # Static files
│   └── package.json        # Frontend dependencies
├── re_wear_server/         # Backend Node.js App
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
└── README.md              # This file
```

## 🎨 Design System

### Colors
- **Primary**: Green (#22c55e) - Eco-friendly theme
- **Earth**: Neutral tones (#78716c, #57534e)
- **Background**: Clean whites and light grays

### Typography
- **Fonts**: Inter and Poppins
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Buttons**: Primary, Secondary, Outline variants
- **Cards**: Hover effects with shadows
- **Forms**: Clean input fields with validation
- **Navigation**: Responsive navbar with mobile menu

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Items
- `GET /api/items` - Get all items (with filters)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create new item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/swap-request` - Request swap

## 🛠️ Technologies Used

### Frontend
- **React 19** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **React Dropzone** - File upload
- **Framer Motion** - Animations
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation

## 📱 Pages & Features

### Landing Page
- Hero section with "Swap. Save. Sustain." message
- Featured items carousel
- How it works section
- Statistics showcase

### Authentication
- Login page with email/password
- Signup page with form validation
- Google OAuth integration (ready for implementation)

### User Dashboard
- Sidebar navigation
- User statistics
- Item management
- Swap requests
- Points balance

### Browse Items
- Advanced filtering (category, size, condition)
- Search functionality
- Responsive grid layout
- Sort options

### Add Item
- Multi-image upload with drag-and-drop
- Form validation
- Tag system
- Preview functionality

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- CORS protection
- Security headers with Helmet

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd re_wear
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd re_wear_server
# Set environment variables
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Unsplash for beautiful clothing images
- Tailwind CSS for the amazing utility framework
- Lucide for the icon library
- The sustainable fashion community for inspiration

---

**ReWear** - Making sustainable fashion accessible to everyone! 🌱👕 