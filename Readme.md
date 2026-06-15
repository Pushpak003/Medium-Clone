# 📝 Medium Clone

A full-stack, production-ready blogging platform inspired by Medium. Built using the **MERN stack**, this platform empowers users to write stories with a rich text editor, engage with content through likes and comments, track their performance via an analytics dashboard, and stay updated with an in-app notification system.

---

## 🚀 Features

### **Core Blogging Experience**
* **Rich Text Editor:** Seamless writing experience powered by `EditorJS` supporting headers, lists, code blocks, and image uploads.
* **Draft Management:** Save your progress and publish stories only when they are ready.
* **Interactions:** Engaged reading via an intuitive **Like** and **Nested Commenting System**.
* **Analytics Dashboard:** Track total views, likes, and comment metrics across all published blogs.
* **Search & Discovery:** Robust global search for both blogs (by title/tags) and user profiles.

### **User Experience & Security**
* **Dual Authentication:** Secure login using standard Email/Password or quick **Google OAuth** via Firebase.
* **User Profiles:** Customizable profiles showcasing user bios, social links, and authored blogs.
* **Notifications:** Real-time updates for interactions like comments, likes, and new followers.
* **Modern UI:** Responsive design featuring smooth switching between **Light** and **Dark Modes**, styled with Tailwind CSS and Chakra UI.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **State Management:** Redux Toolkit
* **Styling:** Tailwind CSS & Chakra UI
* **Editor:** EditorJS
* **Auth Provider:** Firebase Authentication (for Google OAuth)

### **Backend**
* **Runtime & Framework:** Node.js, Express.js
* **Database:** MongoDB & Mongoose (ODM)
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt
* **Media Storage:** Cloudinary (for blog images and profile avatars)

### **Security Features**
* **Password Hashing:** `bcrypt` for secure credential storage.
* **Security Headers:** `Helmet` to secure Express apps by setting various HTTP headers.
* **Rate Limiting:** `express-rate-limit` to prevent brute-force attacks.
* **Data Sanitization:** Prevention against MongoDB Query Injection.
* **Route Guarding:** Protected API endpoints and frontend React routes using JWT verification middleware.

---

## 📁 Project Structure

```text
Medium-Clone/
│
├── frontend/                  # React Vite Application
│   ├── src/
│   │   ├── components/       # Reusable UI elements (Navbar, Cards, etc.)
│   │   ├── pages/            # Page-level components (Home, Dashboard, Blog)
│   │   ├── redux/            # Global state slices & store configuration
│   │   ├── utils/            # Helper functions and API interceptors
│   │   └── common/           # Common layouts and styles
│
├── backend/                   # Node.js Express Server
│   ├── controllers/          # Business logic for routes
│   ├── routes/               # API endpoint definitions
│   ├── middleware/           # Auth and error handling middlewares
│   ├── Schema/               # Mongoose database models
│   ├── config/               # DB and third-party service connections
│   └── utils/                # Helper utilities (token generators)
│
└── README.md

```

⚙️ Environment Variables
To run this project locally, you will need to create .env files in both the frontend and backend directories.

Backend (backend/.env)
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```
Frontend (frontend/.env)
```
VITE_SERVER_DOMAIN=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
🔧 Installation & Setup
1. Clone the Repository
   
## Preview 
- Landing Page
![medium-ss (5)](https://github.com/harshxraj/medium-clone/assets/128404446/1dad2684-d1dc-4e61-a885-fbcb655134a7)

- Blog Page
![medium-ss (11)](https://github.com/harshxraj/medium-clone/assets/128404446/4222f9b2-c467-49a0-8c72-80a7a11f9c4a)

- Login Page
![medium-ss (6)](https://github.com/harshxraj/medium-clone/assets/128404446/ece0a12f-7ea3-4deb-a608-67d097595104)

- Blog Creation
  ![medium-ss (4)](https://github.com/harshxraj/medium-clone/assets/128404446/0d29f027-90ac-42a5-b939-c265d129475b)

- User Profile Page
  ![medium-ss (3)](https://github.com/harshxraj/medium-clone/assets/128404446/bfdd15d2-07cf-47da-ae7d-15f907b154df)

- Dashboard Page
 ![medium-ss (10)](https://github.com/harshxraj/medium-clone/assets/128404446/c94a2791-5ff1-481a-8338-eb18cdabe23f)
![medium-ss (9)](https://github.com/harshxraj/medium-clone/assets/128404446/2c661578-64a8-418d-8b88-a15a1b4fa70e)

- Profile Setting Page
![medium-ss (2)](https://github.com/harshxraj/medium-clone/assets/128404446/f68581f7-5f45-4e8b-a5c8-0bdc065910b5)

- Password Change Page
![medium-ss (1)](https://github.com/harshxraj/medium-clone/assets/128404446/1493513e-8e00-4188-9488-cc389094ae0a)

- Dark Mode
![medium-ss (7)](https://github.com/harshxraj/medium-clone/assets/128404446/d9658217-3c11-45ca-b8fa-6b389d77550f)

