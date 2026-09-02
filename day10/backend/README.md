# Task Manager API

A Task Manager REST API built with **Python, FastAPI, SQLAlchemy, and PostgreSQL**.

This project is a refactored version of the Day 6 Task Manager. The application is organized into separate layers so that each part of the backend has a clear responsibility.

## Features

* Create a task
* List all tasks
* Get a task by ID
* Update a task
* Delete a task
* PostgreSQL database persistence
* SQLAlchemy ORM
* Pydantic request validation
* HTTP 404 error handling
* Interactive Swagger API documentation
* CORS support for the React frontend
* Layered backend architecture

## Architecture

The application follows this flow:

```text
Client
   ↓
API / Router
   ↓
Service
   ↓
Repository
   ↓
Database
   ↓
PostgreSQL
```

### Project Structure

```text
day07/
│
├── app/
│   ├── api/
│   │   └── tasks.py
│   │
│   ├── database/
│   │   └── database.py
│   │
│   ├── models/
│   │   └── tasks.py
│   │
│   ├── repositories/
│   │   └── task_repository.py
│   │
│   ├── schemas/
│   │   └── tasks.py
│   │
│   ├── services/
│   │   └── task_service.py
│   │
│   └── main.py
│
├── .env
├── requirements.txt
└── README.md
```

## Technologies Used

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* Pydantic
* Uvicorn
* CORS Middleware

## API Endpoints

| Method | Endpoint      | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/tasks`      | Get all tasks           |
| GET    | `/tasks/{id}` | Get a task by ID        |
| POST   | `/tasks`      | Create a new task       |
| PUT    | `/tasks/{id}` | Update an existing task |
| DELETE | `/tasks/{id}` | Delete a task           |

## Running the Backend

Create and activate a virtual environment:

```bash
python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Make sure PostgreSQL is running and your database configuration is available through the environment variables used by the application.

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

## API Documentation

FastAPI automatically provides interactive API documentation through Swagger UI.

Open:

```text
http://127.0.0.1:8000/docs
```

You can use Swagger UI to test all Task Manager endpoints without needing a separate API client.

## CORS Configuration

The backend allows requests from the React development server:

```text
http://localhost:5173
```

This allows the React frontend to communicate with the FastAPI backend during development.

## Database

The application uses **PostgreSQL** for persistent task storage.

SQLAlchemy is used as the ORM layer between the FastAPI application and PostgreSQL.

Unlike the earlier in-memory implementation, tasks remain stored in the database instead of being lost when the server restarts.

## Error Handling

The API handles common errors such as requesting a task that does not exist.

For example:

```text
GET /tasks/999
```

returns an appropriate HTTP `404 Not Found` response when the task does not exist.

## Learning Objectives

This project demonstrates:

* Building REST APIs with FastAPI
* Working with HTTP methods and status codes
* Using Pydantic for request validation
* Connecting FastAPI to PostgreSQL
* Using SQLAlchemy for database operations
* Separating API, service, repository, and database responsibilities
* Handling API errors
* Testing APIs using Swagger UI
* Configuring CORS for frontend-backend communication
* Preparing a backend for integration with a React frontend

## Day 7 Outcome

The Day 7 Task Manager evolved from a simple in-memory API into a structured backend application with:

**FastAPI + SQLAlchemy + PostgreSQL + Layered Architecture**

The backend is also configured to communicate with the React frontend developed in Day 8.
