# ProU - Employee Task Tracker

## 🔗 Live Demo
*   **Application**: [prou.narusudarshan.com](https://prou.narusudarshan.com)
    *   Deployed on **Vercel** -> [prou-assignment.vercel.app](https://prou-assignment.vercel.app).
    *   Mapped via **CNAME record** to custom domain.
*   **Backend API**: [prou-assignment-bobw.onrender.com](https://prou-assignment-bobw.onrender.com/)
    *   Deployed on **Render**.

Hi! 👋 This is **ProU**, a simple MERN stack app for task management. It helps Managers assign work and Employees track their progress efficiently.

## 🌟 Key Features

### 🔐 Secure
*   **Safe Login**: Uses JWT and HTTP-only cookies.
*   **Encrypted Passwords**: All passwords are hashed for security.

### 👨‍💼 Manager Role
*   **Manage Team**: Add and update employee profiles.
*   **Task Control**: Create, assign, and delete tasks.
*   **Overview**: View all tasks on a visual board.

### 👷 Employee Role
*   **My Tasks**: View only assigned tasks.
*   **Updates**: Change task status (Pending → Completed).
*   **Chat**: Comment on tasks to collaborate.

---

## 📸 Application Walkthrough

Here is a visual tour of how the application works:

### 1. Authentication
Secure login and signup pages.
> **Note**: Employees cannot sign up themselves. They must be added by a Manager first. Once added, they can log in using their email and the default password (`123456`), which they should change immediately.

| Sign In | Sign Up |
| :---: | :---: |
| ![Sign In Page](screenshots/signin%20page.png) | ![Sign Up Page](screenshots/signup%20page.png) |

### 2. Manager Dashboard & Employees
Managers can view the dashboard and manage their team.

| Manager Dashboard | Employee List |
| :---: | :---: |
| ![Manager Dashboard](screenshots/manager%20dashboard.png) | ![Navigating Employees](screenshots/navigating%20empoloyee.png) |

**Adding a New Employee:**
![Creating Employee](screenshots/creating%20employee.png)

### 3. Task Management
Managers can create tasks and assign them to employees.

| Creating a Task | Task List |
| :---: | :---: |
| ![Creating Task](screenshots/creating%20a%20task.png) | ![Task List](screenshots/navigating%20tasks%20manager.png) |

### 4. Collaboration
Users can comment on tasks to discuss details.

| Task Details | Comments |
| :---: | :---: |
| ![Task Details](screenshots/task%20page%20with%20comments.png) | ![Multiple Comments](screenshots/task%20with%20multiple%20comments.png) |

### 5. Employee View
Employees have a focused view of only their assigned tasks, can collaborate via comments, and manage their security.

| Task Dashboard | Security Management |
| :---: | :---: |
| ![Employee Task Screen](screenshots/employee%20task%20screen.png) | ![Change Password](screenshots/change%20password.png) |

**Task Collaboration:**
Employees can discuss details and provide updates on every task.
![Task Collaboration](screenshots/task%20page%20with%20comments.png)

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

### 🧪 Demo Credentials

If you want to test the app quickly without creating accounts, you can use these:

**Manager Account:**
*   **Email**: `luffy@mail.com`
*   **Password**: `luffy`

**Employee Account:**
*   **Email**: `zoro@mail.com`
*   **Password**: `zoro`

Enjoy exploring the app! 🚀
