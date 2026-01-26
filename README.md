# **CLI-based ToDo List**

A simple **CLI ToDo application** written in **Node.js + TypeScript**.  
Perfect for quickly managing your tasks directly from the terminal while coding.  

---

## **🏗 Project Structure**

CLI-ToDo/
├─ src/                # Source files (TypeScript)
│  ├─ controllers/     # Command logic and task handling
│  ├─ models/          # Task interfaces and types
│  ├─ utils/           # Helper functions
│  └─ index.ts         # Entry point
├─ dist/               # Compiled JavaScript files
├─ node_modules/
├─ .gitignore
├─ package.json
├─ tsconfig.json
└─ README.md
Note: Always run the compiled code from the dist/ folder.

# **Installation**
Clone the repository:

git clone https://github.com/papapapsky/CLI-based-ToDo-list.git
cd CLI-based-ToDo-list
Install dependencies:

npm install
Build the project:

npm run build
Run the application:

cd dist/
node index.js
🖥 Optional: Make a global command on Linux
Open /usr/bin and create a new file:

sudo nano todo
Add the following content:

#!/bin/bash/env node
node /path/to/your/dist/index.js
Make it executable:

chmod +x /usr/bin/todo
Now you can run the app from anywhere using:
"todo"

🎮 Usage
After starting the application, you will see the start menu:

1) Check tasks
2) Add task
To add a task, type 2.

To check your tasks, type 1.

Each task contains:

Name

Content

Priority (low, medium, high)

In the task menu, you can select a task by its index, then:

Delete task

Finish task

⚙ Commands and Flags
Commands:

add — add a new task

list — list all tasks

Flags:

--title — task title

--content — task content

--priority — task priority (low, medium, high)

Examples:

todo add --title "Do homework" --content "Physics, math, and Russian language" --priority "low"
You can also create a task with only a title:

todo add --title "Do homework"
Content and priority will be skipped.

This application is especially useful in mini IDE/VSCode terminals, because you can quickly add tasks or ideas while coding.
