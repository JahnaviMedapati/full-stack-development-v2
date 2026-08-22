CREATE DATABASE task_manager;

-- Connect to the task_manager database before running this:

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);