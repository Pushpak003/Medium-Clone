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

## ⚙️ Environment Variables
To run this project locally, you will need to create .env files in both the frontend and backend directories.

### Backend (backend/.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=client_email
FIREBASE_PRIVATE_KEY=your_projects_private_key
```
### Frontend (frontend/.env)
```env
VITE_SERVER_DOMAIN=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```
## 🔧 Installation & Setup
1. Clone the Repository
   ```bash
   git clone <repository-url>
   cd Medium-Clone
   ```
2. Backend Setup
   ```bash
   cd backend
   npm install
   # Start development server
   npm run dev
   ```
3. Frontend Setup
    ```bash
    cd ../frontend
   npm install
   # Start development server
   npm run dev
    ```   
## 🖼️ Screenshots
- Landing Page
<img width="1920" height="1080" alt="mm" src="https://github.com/user-attachments/assets/0aa623e2-bd03-46d5-90de-7a7ce3ae6c6d" />

- Blog Page
<img width="1920" height="1080" alt="blog" src="https://github.com/user-attachments/assets/09cbeee4-f5a1-4297-a655-7a6bf660886b" />

- Login Page
<img width="1920" height="1080" alt="login" src="https://github.com/user-attachments/assets/05064bbc-31c8-431c-b3e0-750c88ce887c" />

- Blog Creation
<img width="1920" height="1080" alt="blogcreate" src="https://github.com/user-attachments/assets/0753f3ac-35b8-4e85-a0e5-9852c1e34f48" />

- User Profile Page
  <img width="1920" height="1080" alt="profilepage" src="https://github.com/user-attachments/assets/50caf474-3c28-4307-81be-83e8fc301992" />

- Dashboard Page<img width="1920" height="1080" alt="dashboard" src="https://github.com/user-attachments/assets/9aa3fb18-90bc-4eb7-8f05-b349773415cb" />
<img width="1920" height="1080" alt="dd" src="https://github.com/user-attachments/assets/54eaedfa-a837-4718-8e6f-937e20c2489d" />

- Profile Setting Page
<img width="1920" height="1080" alt="psett" src="https://github.com/user-attachments/assets/4bbb6193-c247-4340-a5e0-3ab21702803d" />
- Password Change Page
<img width="1920" height="1080" alt="passchange" src="https://github.com/user-attachments/assets/06243106-36b8-4044-b177-0442b9f5f74f" />

- Dark Mode
<img width="1920" height="1080" alt="dark" src="https://github.com/user-attachments/assets/f80257af-1d81-4c2f-9d7a-929323c65bf2" />

## 🔮 Future Improvements

⚡ Redis Caching: Cache popular blogs to reduce MongoDB read load.

🐳 Docker Support: Containerize both backend and frontend for seamless deployment.

🧪 Automated Testing: Implement unit and integration tests using Jest and Supertest.

🔄 CI/CD Pipeline: Automate testing and deployment via GitHub Actions.

🔔 Real-Time Notifications: Integrate Socket.io for instant interaction alerts.

🔖 Bookmark System: Allow readers to save stories to a reading list.

👥 Social Graph: Implement a Follow/Unfollow author ecosystem.

## 🤝Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Feel free to fork the repository, open issues, or submit Pull Requests to improve the platform!

### Steps to Contribute:
1. Fork the Project.
2. Create your Feature Branch (git checkout -b feature/AmazingFeature).
3. Commit your Changes (git commit -m 'Add some AmazingFeature').
4. Push to the Branch (git push origin feature/AmazingFeature).
5. Open a Pull Request.

## 📄License
Distributed under the MIT License. See LICENSE for more information.
## 👨‍💻Author
### Pushpak Pathe
