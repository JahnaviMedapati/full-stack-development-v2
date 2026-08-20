from task_manager import TaskManager

manager = TaskManager()

while True:
    print("\n ===== Task Manager ======")
    print("1.add tasks")
    print("2.List tasks")
    print("3.complete task")
    print("4.Delete task")
    print("5.Exit")

    choice = input("Choose an option : ")

    if choice == "1":
        title = input("Enter task title : ")
        manager.add_task(title)
    elif choice == "2":
        manager.list_tasks()
    elif choice == "3":
        task_number = int(input("Enter task number : "))
        manager.complete_task(task_number)

    elif choice == "4":
        task_number = int(input("Enter task number : "))
        manager.delete_task(task_number)

    elif choice == "5":
        print("GOODBYE!!!")
        break
    else:
        print("Invalid option.")
