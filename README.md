# ProU - Employee Task Tracker

Hi! 👋 This is **ProU**, a task management app I built using the MERN stack. It's designed to help Managers and Employees work together smoothly. The main idea was to create a system where Managers can assign work and Employees can track their progress without getting overwhelmed.

## 🌟 What It Does

I focused on making the app secure and easy to use. Here are the main features:

### 🔐 Secure & Safe
*   **Login/Signup**: You can create a Manager account to get started.
*   **Safe Data**: I used JWT (JSON Web Tokens) and HTTP-only cookies so user sessions are secure.
*   **Passwords**: Everyone's password is encrypted. New employees get a default password (`123456`) which they can change later.

### 👨‍💼 For Managers
*   **Full Control**: You can add new employees and manage their profiles.
*   **Task Management**: Create tasks, set deadlines, and assign them to your team.
*   **Kanban Board**: A visual board to see what's Pending, In Progress, or Completed.
*   **Moderation**: You can delete any task or comment if needed.

### 👷 For Employees
*   **Focused View**: Employees only see the tasks assigned to them, so they can focus on their work.
*   **Updates**: They can move tasks to "In Progress" or "Completed" as they work.
*   **Collaboration**: There's a comment section on every task to ask questions or give updates.

---

## 🛠️ How It's Built

I used modern tools to make the app fast and responsive:

*   **Frontend**: React with Vite (it's super fast!), Tailwind CSS for the dark-themed UI.
*   **Backend**: Node.js and Express.
*   **Database**: MongoDB to store all the data.
*   **Security**: `bcryptjs` for hashing passwords and `cookie-parser` for handling sessions.

---

## 📂 Project Structure

I organized the code into two main folders to keep things clean:

```
ProU/
├── frontend/          # All the React code lives here
│   ├── src/
│   │   ├── components/  # Reusable parts like the Navbar
│   │   ├── pages/       # The main screens (Dashboard, Login, etc.)
│   │   └── ...
├── backend/           # The server-side logic
│   ├── app/
│   │   ├── controllers/ # Logic for handling requests
│   │   ├── models/      # Database schemas
│   │   └── routes/      # API endpoints
│   └── index.js         # Where the server starts
└── README.md
```

---

## 🚀 How to Run It

Follow these steps to get the app running on your machine:

### 1. Get the Backend Running
Open a terminal and go to the backend folder:

```bash
cd backend
npm install
```

You'll need a `.env` file in the `backend` folder with your database details:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=some_secret_key
NODE_ENV=development
```

Then start the server:

```bash
npm run dev
```

### 2. Start the Frontend
Open a **new terminal window**, go to the frontend folder, and start the UI:

```bash
cd frontend
npm install
npm run dev
```

That's it! Open the link shown in the terminal (usually `http://localhost:5173`) to use the app.

---

## 📝 Notes for Testing

*   **Default Password**: When you add a new employee as a Manager, their password will be `123456`.
*   **Roles**:
    *   Sign up first to create a **Manager** account.
    *   Use that account to add **Employees**.
    *   Log out and log back in as an Employee to see their restricted view.

Enjoy exploring the app! 🚀
