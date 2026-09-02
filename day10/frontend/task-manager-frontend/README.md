# 🐰 Tuduu — Full-Stack Task Manager

> A modern full-stack task management application built with React, FastAPI, PostgreSQL, and SQLAlchemy.

Tuduu is a productivity-focused task manager designed to make organizing daily tasks simple and intuitive.

The application supports user authentication, task management, important-task tracking, task history, soft deletion, permanent deletion, and persistent database storage.

---

## ✨ Features

### 🔐 Authentication

* User signup
* User login
* Authenticated API requests
* User-specific task data
* Protected task and profile endpoints

### ✅ Task Management

* Create tasks
* Complete and uncomplete tasks
* Edit existing tasks
* Delete tasks
* Mark tasks as ⭐ Important
* Remove tasks from Important

### 🗑️ Task History

Tuduu uses **soft deletion** for normal task deletion.

When a task is deleted from the dashboard:

```text
Dashboard
   ↓
Delete Task
   ↓
deleted_at is set
   ↓
Task disappears from Dashboard
   ↓
Task remains in Profile History
```

Users can then permanently remove deleted tasks from their profile.

### 👤 Profile & Productivity History

The profile section provides a history of the user's tasks.

Tasks can be filtered by:

* All
* Active
* Completed
* ⭐ Important

Task history also includes timestamps such as:

* Created
* Updated
* Completed
* Deleted

### 💾 Persistent Storage

All important application data is stored in PostgreSQL rather than relying on browser-only storage.

This allows task data to remain available across sessions and devices once the application is deployed.

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* HTML
* CSS

## Backend

* Python
* FastAPI
* SQLAlchemy
* Pydantic
* JWT Authentication
* Uvicorn

## Database

* PostgreSQL
* Alembic

## Development Tools

* Git
* GitHub
* VS Code
* Postman / Swagger UI

---

# 🏗️ Architecture

Tuduu follows a layered backend architecture to keep the application organized and maintainable.

```text
                    React Frontend
                         │
                         │ HTTP / JSON
                         ▼
                  FastAPI API Layer
                         │
                         ▼
                   Service Layer
                         │
                         ▼
                 Repository Layer
                         │
                         ▼
                    SQLAlchemy
                         │
                         ▼
                    PostgreSQL
```

### Backend Structure

```text
backend/
│
├── app/
│   ├── api/
│   │   ├── auth.py
│   │   ├── profile.py
│   │   └── tasks.py
│   │
│   ├── models/
│   │   ├── base.py
│   │   ├── task.py
│   │   └── user.py
│   │
│   ├── repositories/
│   │   └── task_repository.py
│   │
│   ├── schemas/
│   │   └── task.py
│   │
│   ├── services/
│   │   └── task_service.py
│   │
│   ├── dependencies.py
│   ├── database.py
│   └── main.py
│
├── alembic/
│   └── versions/
│
├── .env
├── alembic.ini
└── requirements.txt
```

---

# 🔌 API Endpoints

## Authentication

| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | `/auth/signup` | Create a new user   |
| POST   | `/auth/login`  | Authenticate a user |

## Tasks

| Method | Endpoint                     | Description             |
| ------ | ---------------------------- | ----------------------- |
| GET    | `/tasks/`                    | Get active tasks        |
| POST   | `/tasks/`                    | Create a task           |
| PUT    | `/tasks/{task_id}`           | Update a task           |
| PATCH  | `/tasks/{task_id}/important` | Update important status |
| DELETE | `/tasks/{task_id}`           | Soft-delete a task      |

## Profile

| Method | Endpoint                             | Description               |
| ------ | ------------------------------------ | ------------------------- |
| GET    | `/profile/tasks`                     | Get task history          |
| DELETE | `/profile/tasks/{task_id}/permanent` | Permanently delete a task |

All protected endpoints require authentication.

---

# 🗄️ Database Design

The main task entity contains lifecycle information that allows Tuduu to maintain task history.

```text
Task
│
├── id
├── title
├── completed
├── important
├── created_at
├── updated_at
├── completed_at
├── deleted_at
└── user_id
```

The `user_id` connects each task to its owner.

### Task Lifecycle

```text
             ┌──────────────┐
             │    Created   │
             └──────┬───────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
       Active             Completed
          │                   │
          └─────────┬─────────┘
                    │
                    ▼
                 Deleted
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
      Restored*          Permanently
                         Deleted
```

`*` Task restoration can be added as a future enhancement.

---

# 🔄 Frontend ↔ Backend Communication

The React frontend communicates with the FastAPI backend through HTTP requests.

Example flow:

```text
User clicks "Add Task"
        ↓
React sends POST request
        ↓
FastAPI receives JSON
        ↓
Authentication identifies the user
        ↓
Service layer processes request
        ↓
Repository interacts with database
        ↓
PostgreSQL stores the task
        ↓
FastAPI returns JSON response
        ↓
React updates the UI
```

---

# 🔒 Authentication & Authorization

Tuduu uses token-based authentication.

After login:

```text
User Login
    ↓
FastAPI validates credentials
    ↓
Access Token
    ↓
Frontend stores token
    ↓
Token included in API requests
    ↓
FastAPI identifies current user
    ↓
User accesses their own data
```

Tasks are associated with the authenticated user's ID, preventing users from simply accessing another user's task data through the normal API flow.

---

# 🕒 Timezone-Aware Timestamps

Tuduu stores task timestamps using UTC-aware datetime values.

The application tracks:

```text
created_at
updated_at
completed_at
deleted_at
```

The frontend converts timestamps to the user's local timezone when displaying them.

This prevents problems where a task created at one local time could incorrectly appear several hours earlier or later.

---

# 🧱 Database Migrations

Alembic is used to manage database schema changes.

Example:

```bash
alembic upgrade head
```

This allows database changes to be tracked through migration files rather than manually modifying the database.

---

# 🚀 Running Tuduu Locally

## 1. Clone the repository

```bash
git clone <your-repository-url>
cd Tuduu
```

---

## 2. Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

## 3. Configure Environment Variables

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=postgresql+psycopg://username:password@localhost:5432/tuduu
SECRET_KEY=your-secret-key
```

Do not commit your `.env` file to GitHub.

---

## 4. Run Database Migrations

```bash
alembic upgrade head
```

---

## 5. Start the FastAPI Backend

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

---

# 🧪 Testing

The backend APIs can be tested using:

* Swagger UI
* Postman
* Browser Developer Tools
* React frontend

Important functionality to test includes:

* User registration
* User login
* Creating tasks
* Editing tasks
* Completing tasks
* Important status
* Soft deletion
* Profile history
* Permanent deletion
* User-specific task access

---

# 📁 Project Structure

A simplified project structure:

```text
Tuduu/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── Profile.jsx
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   ├── dependencies.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── alembic.ini
│
├── .gitignore
└── README.md
```

---

# 🎯 Project Goals

Tuduu was built to practice and demonstrate practical full-stack development concepts, including:

* Frontend development with React
* REST API development
* Backend architecture
* Authentication
* Database design
* PostgreSQL persistence
* ORM usage with SQLAlchemy
* Database migrations
* API integration
* State management
* CRUD operations
* Soft deletion
* Error handling
* Client-server communication

---

# 🔮 Future Improvements

Potential future enhancements include:

* Task restoration from history
* Due dates
* Task categories
* Search
* Sorting
* Pagination
* Dashboard productivity statistics
* Responsive/mobile improvements
* Production deployment
* Automated tests
* CI/CD

---

# 👩‍💻 Author

**Jahnavi Laxmi Sai Keerthi Medapati**

Computer Science & Engineering — AI/ML

Built as a full-stack development project using React, FastAPI, PostgreSQL, and SQLAlchemy.

---

## ⭐ If you like Tuduu

Feel free to explore the project, raise issues, or suggest improvements.
