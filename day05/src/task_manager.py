from src.task import Task


class TaskManager:
    def __init__(self):
        self.tasks = []
        self.next_id = 1

    def add_task(self, title: str):
        task = Task(self.next_id, title)
        self.tasks.append(task)
        self.next_id += 1
        return task

    def list_tasks(self):
        return self.tasks

    def get_task(self, task_id: int):
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None

    def update_task(self, task_id: int, title: str, completed: bool):
        task = self.get_task(task_id)

        if task is None:
            return None

        task.title = title
        task.completed = completed

        return task

    def delete_task(self, task_id: int):
        task = self.get_task(task_id)

        if task is None:
            return False

        self.tasks.remove(task)
        return True
