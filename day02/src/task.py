class Task:
    def __init__(self, title: str):
        self.title = title
        self.completed = False

    # Task should be able to complete
    def mark_completed(self):
        self.completed = True
