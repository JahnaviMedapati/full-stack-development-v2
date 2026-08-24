# Task Manager API

A simple Task Manager REST API built with Python, FastAPI, SQLAlchemy, and PostgreSQL.

This project is a refactored version of the Day 6 Task Manager. The application is organized into separate layers so that each part of the application has a clear responsibility.

## Features

- Create a task
- List all tasks
- Get a task by ID
- Update a task
- Delete a task
- PostgreSQL persistence
- Pydantic request validation
- HTTP 404 error handling
- Interactive Swagger API documentation
- Layered backend architecture

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