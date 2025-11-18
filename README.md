# 🍎 EdTech Learning Task Manager

This is a full-stack application built using the MERN stack (MongoDB, Express, React, Node.js) designed to manage learning tasks within an educational environment. The core challenge solved here is implementing strict **Role-Based Access Control (RBAC)** to govern how **Students** and **Teachers** interact with task data.

## ✨ Key Features

* **Secure Authentication** 🛡️: Uses JWT for session management and `bcrypt` for secure password hashing during login and signup[cite: 199, 202].
* [cite_start]**Role-Based Access** 🔑: Clearly distinguishes permissions for Students and Teachers[cite: 195].
* [cite_start]**Full CRUD Management** ✅: Allows for creating, reading, updating, and deleting tasks[cite: 222].
* [cite_start]**Teacher Oversight** 🧑‍🏫: Teachers can seamlessly view *all* tasks created by their assigned students[cite: 196, 205].
* [cite_start]**Strict Ownership** ✋: Regardless of role, you can only update or delete the tasks you personally created[cite: 204, 205, 222].
* [cite_start]**Smart Filtering (Bonus!)** 📅: The dashboard includes advanced filtering on the backend API to show tasks **"Due This Week"** and **"Overdue"**[cite: 244].

***

## 🛠️ Project Setup

[cite_start]The project is structured into a standard monorepo with `client/` (React) and `server/` (Node/Express) directories[cite: 257, 258].

### Prerequisites

You'll need Node.js and a running MongoDB instance.

### 1. Backend Setup (`server/`)

1.  **Get into the server folder:**
    ```bash
    cd server
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your `.env`:** Create a file named **`.env`** in the `server/` directory. Remember to update the `CLIENT_ORIGIN` if your React app isn't running on the default IP/port.
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
4.  **Start the API:**
    ```bash
    npm start
    # or node server.js
    ```
    [cite_start]The API should be running at `http://localhost:5000`[cite: 369].

### 2. Frontend Setup (`client/`)

1.  **Move to the client folder:**
    ```bash
    cd ../client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your `.env`:** Create a file named **`.env`** in the `client/` directory. This needs to match the backend's address.
    ```env
    # Note: React needs the prefix 'REACT_APP_' for env variables.
    # Set the API URL to match your backend's running address (Update this!)
    REACT_APP_API_URL=http://localhost:5000
    ```
4.  **Launch the app:**
    ```bash
    npm start
    ```
    The React application will open in your browser.

***

## 🔐 Authorization Logic (Teacher Task-View Explanation)

[cite_start]The most crucial part of this project is the authorization logic, primarily handled in `server/controllers/taskController.js`[cite: 318].

### Teacher-Student Linking

* [cite_start]**Teachers** have their MongoDB `_id` serve as their shareable Teacher ID[cite: 291].
* [cite_start]**Students** **must** provide this `teacherId` during signup to establish the link[cite: 215, 279].

### Teacher Task-View Query (`GET /tasks`)

[cite_start]When a teacher requests tasks, the server performs a complex query[cite: 318]:
1. [cite_start]**Find Associated Students:** It first looks up all students whose `teacherId` matches the logged-in teacher's `userId`[cite: 321, 322].
2. [cite_start]**Combine Tasks:** It then uses a MongoDB `$or` operation to return tasks created by **(a)** the teacher themselves, **OR (b)** one of their assigned students[cite: 322].

### Modification Restrictions

* **Task Modification (`PUT`, `DELETE`):** The logic explicitly checks if `task.userId` matches `req.user.userId`. [cite_start]This means teachers can **view** student tasks, but they cannot edit or delete them; only the task owner (the student) can[cite: 343, 344, 351].

***

## ⚠️ Notes & Future Improvements

### Current Limitations
* The rule is strict: Teachers can **only view** student tasks. [cite_start]They can't modify them[cite: 343].

### Potential Enhancements
* [cite_start]**Pagination:** Adding pagination (Bonus Feature #2) to the task lists would greatly improve performance for teachers with many students[cite: 245].
* **Display Teacher Name:** The student dashboard currently shows the `teacherId`. [cite_start]It could be enhanced to fetch and display the assigned teacher's name or email for a better user experience[cite: 238].

***

## 🤖 AI Assistance Disclosure

AI tools were leveraged to accelerate boilerplate creation and structure the files.

* [cite_start]**AI helped with:** Initializing the file structure [cite: 301][cite_start], providing basic syntax for Mongoose and Joi schemas [cite: 312][cite_start], and drafting basic CSS[cite: 303].
* [cite_start]**I implemented or fixed:** The entire **Role-Based Query Logic** (`buildTaskQuery`) [cite: 319, 322, 331][cite_start], all explicit **Authorization Checks** for `PUT`/`DELETE` [cite: 344, 351][cite_start], and the **Date Filtering logic**[cite: 125, 323].
