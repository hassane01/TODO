# Full-Stack Todo Application

A robust and secure full-stack web application for managing tasks, built with the MERN stack (MongoDB, Express, React, Node.js). This project demonstrates modern web development practices, including secure authentication, RESTful API design, and efficient state management.

## 🚀 Features

-   **User Authentication:** Secure registration and login functionality using JWT (JSON Web Tokens) and bcrypt for password hashing.
-   **Task Management:** Create, Read, Update, and Delete (CRUD) personal todo items.
-   **Responsive UI:** A clean and responsive user interface built with React and styled components.
-   **Security:** Implemented Helmet for secure HTTP headers and Rate Limiting to prevent brute-force attacks.
-   **Error Handling:** Centralized error handling for both backend and frontend.

## 🛠️ Tech Stack & Libraries

### Backend (Node.js & Express)

-   **Runtime:** Node.js
-   **Framework:** [Express.js](https://expressjs.com/) - Fast, unopinionated web framework.
-   **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) ODM.
-   **Authentication:**
    -   `jsonwebtoken`: For generating and verifying access tokens.
    -   `bcryptjs`: For secure password hashing.
-   **Security:**
    -   `helmet`: Helps secure Express apps by setting various HTTP headers.
    -   `express-rate-limit`: Basic rate-limiting middleware for Express.
    -   `cors`: Middleware to enable Cross-Origin Resource Sharing.
-   **Utilities:**
    -   `dotenv`: Loads environment variables.
    -   `express-async-handler`: Simple middleware for handling exceptions inside of async express routes.

### Frontend (React & Vite)

-   **Framework:** [React 19](https://react.dev/) - The library for web and native user interfaces.
-   **Build Tool:** [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling.
-   **Routing:** [React Router v7](https://reactrouter.com/) - Client-side routing.
-   **HTTP Client:** [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js.
-   **Icons:** `react-icons` - Include popular icons in your React projects easily.
-   **State Management:** React Context API (`AuthContext`, `TodoContext`).
-   **Linting:** ESLint - Find and fix problems in your JavaScript code.

## 🧪 Testing

This project employs a comprehensive testing strategy using standard industry tools:

-   **Jest:** A delightful JavaScript Testing Framework with a focus on simplicity. Used for running test suites and assertions.
-   **Supertest:** A high-level abstraction for testing HTTP, allowing for easy integration testing of API endpoints.
-   **Cross-env:** Ensures environment variables (like `NODE_ENV=test`) are set correctly across different operating systems during test runs.

### Test Coverage includes:
-   **Unit Tests:** Testing individual utility functions and controllers.
-   **Integration Tests:** Testing API endpoints (routes) to ensure the database, server, and logic work together correctly.

## 📂 Project Structure

```
node_rest_api/
├── backend/            # Server-side logic
│   ├── config/         # Database configuration
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware (Auth, Error)
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API Route definitions
│   └── tests/          # Jest test suites
└── frontend/           # Client-side application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── context/    # Global state (Auth, Todos)
    │   ├── pages/      # Application views
    │   └── services/   # API service calls (Axios)
```
