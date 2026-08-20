class Task:
    def __init__(self, task_id: int, title: str):
        self.id = task_id
        self.title = title
        self.completed = False

    # Task should be able to complete

    def mark_completed(self):
        self.completed = True
