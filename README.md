# 🍎 EdTech Learning Task Manager

This is a full-stack application built using the MERN stack (MongoDB, Express, React, Node.js) designed to manage learning tasks within an educational environment. The core challenge solved here is implementing strict **Role-Based Access Control (RBAC)** to govern how **Students** and **Teachers** interact with task data.

## ✨ Key Features

* **Secure Authentication** 🛡️: Uses JWT for session management and `bcrypt` for secure password hashing during login and signup.
* **Role-Based Access** 🔑: Clearly distinguishes permissions for Students and Teachers.
* **Full CRUD Management** ✅: Allows for creating, reading, updating, and deleting tasks.
* **Teacher Oversight** 🧑‍🏫: Teachers can seamlessly view *all* tasks created by their assigned students.
* **Strict Ownership** ✋: Regardless of role, you can only update or delete the tasks you personally created.
* **Smart Filtering (Bonus!)** 📅: The dashboard includes advanced filtering on the backend API to show tasks **"Due This Week"** and **"Overdue"**.

***

## 🛠️ Project Setup

The project is structured into a standard monorepo with `client/` (React) and `server/` (Node/Express) directories.

### Prerequisites

You'll need Node.js and a running MongoDB instance.

### 1. Backend Setup (`server/`)

1. **Get into the server folder:**
    ```bash
    cd server
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up your `.env`:** Create a file named **`.env`** in the `server/` directory.
    ```env
    # MongoDB Connection String
    MONGO_URI=mongodb://localhost:27017/learning_task_manager

    # Secret key for JSON Web Tokens (JWT)
    JWT_SECRET=your_jwt_secret_key

    # Port for the Express server
    PORT=5000

    # Frontend URL for CORS configuration (Update this!)
    CLIENT_ORIGIN=http://localhost:3000
    ```
4. **Start the API:**
    ```bash
    npm start
    # or node server.js
    ```
    The API should be running at `http://localhost:5000`.

### 2. Frontend Setup (`client/`)

1. **Move to the client folder:**
    ```bash
    cd ../client
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up your `.env`:** Create a file named **`.env`** in the `client/` directory.
    ```env
    # Note: React needs the prefix 'REACT_APP_' for env variables.
    # Set the API URL to match your backend's running address (Update this!)
    REACT_APP_API_URL=http://localhost:5000
    ```
4. **Launch the app:**
    ```bash
    npm start
    ```
    The React application will open in your browser.

***

## 🔐 Authorization Logic (Teacher Task-View Explanation)

The most crucial part of this project is the authorization logic, primarily handled in `server/controllers/taskController.js`.

### Teacher-Student Linking

* **Teachers** have their MongoDB `_id` serve as their shareable Teacher ID.
* **Students** **must** provide this `teacherId` during signup to establish the link.

### Teacher Task-View Query (`GET /tasks`)

When a teacher requests tasks, the server performs a complex query:
1. **Find Associated Students:** It first looks up all students whose `teacherId` matches the logged-in teacher's `userId`.
2. **Combine Tasks:** It then uses a MongoDB `$or` operation to return tasks created by **(a)** the teacher themselves, **OR (b)** one of their assigned students.

### Modification Restrictions

* **Task Modification (`PUT`, `DELETE`):** The logic explicitly checks if `task.userId` matches `req.user.userId`. This means teachers can **view** student tasks, but they cannot edit or delete them; only the task owner (the student or the teacher who created it) can.

***

## ⚠️ Notes & Future Improvements

### Current Limitations
* The rule is strict: Teachers can **only view** student tasks. They can't modify them.

### Potential Enhancements
* **Pagination:** Adding pagination (Bonus Feature #2) to the task lists would greatly improve performance for teachers with many students.
* **Display Teacher Name:** The student dashboard currently shows the `teacherId`. It could be enhanced to fetch and display the assigned teacher's name or email for a better user experience.

***

## 🤖 AI Assistance Disclosure

AI tools were leveraged to accelerate boilerplate creation and structure the files.

* **AI helped with:** Initializing the file structure, providing basic syntax for Mongoose and Joi schemas, and drafting basic CSS.
* **I implemented or fixed:** The entire **Role-Based Query Logic** (`buildTaskQuery`), all explicit **Authorization Checks** for `PUT`/`DELETE`, and the **Date Filtering logic**.
