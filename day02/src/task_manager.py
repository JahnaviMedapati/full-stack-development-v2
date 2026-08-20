from task import Task


class TaskManager:
    def __init__(self):
        self.tasks = []

    def add_task(self, title: str):
        task = Task(title)
        self.tasks.append(task)

    def list_tasks(self):
        if not self.tasks:
            print("No tasks available.")
            return

        for index, task in enumerate(self.tasks, start=1):
            status = "✓" if task.completed else " "
            print(f"{index}. [{status}] {task.title}")

    def complete_task(self, task_number: int):
        if task_number < 1 or task_number > len(self.tasks):
            print("Invalid task number.")
            return

        task = self.tasks[task_number - 1]
        task.mark_completed()

    def delete_task(self, task_number: int):
        if task_number < 1 or task_number > len(self.tasks):
            print("Invalid task number.")
            return

        self.tasks.pop(task_number - 1)
