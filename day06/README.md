# Task Manager API

A Task Manager REST API built using Python, FastAPI, SQLAlchemy, and PostgreSQL.

This project is an upgraded version of the Day 5 Task Manager API. In Day 5, tasks were stored in memory using Python objects. In Day 6, PostgreSQL is used to persist task data so that tasks are not lost when the FastAPI application is restarted.

## Objective

The objective of this project is to understand how application data can be persisted using a relational database and how a FastAPI application can communicate with PostgreSQL.

The application provides complete CRUD functionality:

- Create a task
- Retrieve all tasks
- Retrieve one task
- Update a task
- Delete a task

Unlike the previous in-memory implementation, restarting the application does not delete the stored tasks.

---

# Technologies Used

- Python 3.13.7
- FastAPI
- PostgreSQL
- SQLAlchemy
- Psycopg
- Pydantic
- Uvicorn
- pgAdmin 4

---

# Concepts Learned

## 1. Database

A database is a system used to store, organize, and retrieve data.

In this project, PostgreSQL is used as the database.

The database created for this project is:

```text
task_manager