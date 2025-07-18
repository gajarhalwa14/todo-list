import "./styles.css";
import openIcon from "./icons/open-in-new.svg";
import trashIcon from "./icons/trash-can-outline.svg";

class TaskItem {
    constructor(title, description, dueDate, priority, projectType) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.projectType = projectType;
        this.isCompleted = false;
    }

    equals(otherTaskItem) {
        return this.title === otherTaskItem.title;
    }
}

class Project {

    constructor(title) {
        this.title = title;
        this.projectTasksArr = [];
    }

    addTaskItem(taskItem) {
        this.projectTasksArr.push(taskItem);
    }

    deleteTaskItem(taskItem) {
        this.projectTasksArr = this.projectTasksArr.filter(item => !(item.equals(taskItem)));
    }

    markTaskItemComplete(taskItem) {
        let index = 0;
        while (index != this.projectTasksArr.length) {
            if (this.projectTasksArr[index].equals(taskItem)) {
                this.projectTasksArr[index].isCompleted = true;
                break;
            }
            index++;
        }
    }

    getTaskItems() {
        if (this.projectTasksArr.length === 0) {
            console.log("No tasks in the project!");
        }
        else {
            this.projectTasksArr.forEach((taskItem) => {
                console.log(`${taskItem.title}: Due ${taskItem.dueDate} with a ${taskItem.priority} priority.`);
            })
        }
    }
}

const projectList = (function() {
    let projectArr = [];
    const general = new Project("General");
    projectArr.push(general);

    const addProject = (newProject) => {
        projectArr.push(newProject);
    }

    const deleteProject = (deletedProject) => {
        projectArr = projectArr.filter((project) => project.title !== deletedProject.title);
    }

    const addTaskToProject = (newTask, projectName) => {
        let index = 0;
        while (index !== projectArr.length) {
            if (projectArr[index].title === projectName) {
                projectArr[index].addTaskItem(newTask);
                break;
            }
            index++;
        }
    }

    const deleteTaskFromProject = (deletedTask, projectName) => {
        let index = 0;
        while (index !== projectArr.length) {
            if (projectArr[index].title === projectName) {
                projectArr[index].deleteTaskItem(deletedTask);
                break;
            }
            index++;
        }
    }

    const getProjects = () => {
        projectArr.forEach((project) => {
            console.log(`${project.title}:\n${project.getTaskItems()}`)
        })
    }

    const markTaskComplete = (task, projectName) => {
        let index = 0;
        while (index !== projectArr.length) {
            if (projectArr[index].title === projectName) {
                projectArr[index].markTaskItemComplete(task);
                break;
            }
            index++;
        }
    }

    return {addProject, deleteProject, addTaskToProject, deleteTaskFromProject, getProjects, markTaskComplete, projectArr};
})();

function displayInfoModal(task, projectTitle) {
    const infoDialog = document.createElement("dialog");
    infoDialog.setAttribute("id", "info-dialog");

    document.body.appendChild(infoDialog);

    const infoHeader = document.createElement("div");
    infoHeader.setAttribute("class", "info-header");
    infoHeader.innerText = task.title;

    infoDialog.appendChild(infoHeader);

    const infoContent = document.createElement("div");
    infoContent.setAttribute("class", "info-content");

    infoDialog.appendChild(infoContent);

    const infoDescription = document.createElement("div");
    infoDescription.innerText = task.description;

    infoContent.appendChild(infoDescription);

    const infoDueDate = document.createElement("div");
    infoDueDate.innerText = `Due Date: ${task.dueDate}`;

    infoContent.appendChild(infoDueDate);

    const infoPriority = document.createElement("div");
    infoPriority.innerText = `Priority: ${task.priority}`;

    infoContent.appendChild(infoPriority);

    const infoProjectType = document.createElement("div");
    infoProjectType.innerText = `Project: ${task.projectType}`;

    infoContent.appendChild(infoProjectType);

    const infoCompletion = document.createElement("div");
    infoCompletion.innerText = task.isCompleted ? "Completed" : "Not Completed";

    infoContent.appendChild(infoCompletion);

    const infoButtons = document.createElement("div");
    infoButtons.setAttribute("class", "info-buttons");

    infoContent.appendChild(infoButtons);

    function closeInfoDialog(event) {
        const button = event.target;
        infoDialog.close(button.value);
    }

    const infoDoneBtn = document.createElement("button");
    infoDoneBtn.setAttribute("id", "info-done-btn");
    infoDoneBtn.setAttribute("value", "done");
    infoDoneBtn.innerText = "Done";

    infoButtons.appendChild(infoDoneBtn);

    if (!task.isCompleted) {
        const infoCompletionBtn = document.createElement("button");
        infoCompletionBtn.setAttribute("id", "info-completion-btn");
        infoCompletionBtn.setAttribute("value", "mark-complete");
        infoCompletionBtn.innerText = "Mark Complete";

        infoCompletionBtn.addEventListener("click", closeInfoDialog);

        infoButtons.appendChild(infoCompletionBtn);
    }

    infoDoneBtn.addEventListener("click", closeInfoDialog);
    
    infoDialog.addEventListener("close", () => {
        if (infoDialog.returnValue === "mark-complete") {
            projectList.markTaskComplete(task, projectTitle);
            loadProjects();
        }
        document.body.removeChild(infoDialog);
    });

    return infoDialog;
}

function loadProjects() {
    const mainContentDiv = document.querySelector(".main-content");
    mainContentDiv.replaceChildren();
    projectList.projectArr.map((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.setAttribute("class", "main-content-project");

        const projectHeaderDiv = document.createElement("div");
        projectHeaderDiv.setAttribute("class", "main-content-project-header");
        projectHeaderDiv.innerText = project.title;

        projectDiv.appendChild(projectHeaderDiv);

        const projectTasksDiv = document.createElement("div");
        projectTasksDiv.setAttribute("class", "main-content-project-tasks");

        projectDiv.appendChild(projectTasksDiv);

        project.projectTasksArr.map((task) => {
            const taskItemDiv = document.createElement("div");
            taskItemDiv.setAttribute("class", "main-content-project-item");
            if (task.isCompleted) {
                taskItemDiv.setAttribute("class", "main-content-project-item completed");
            }

            const trashImg = document.createElement("img");
            trashImg.setAttribute("src", trashIcon);
            trashImg.addEventListener("click", () => {
                projectTasksDiv.removeChild(taskItemDiv);
                projectList.deleteTaskFromProject(task, project.title);
            });

            taskItemDiv.appendChild(trashImg);

            const taskTitleTextDiv = document.createElement("div");
            taskTitleTextDiv.setAttribute("class", "task-title-text");
            taskTitleTextDiv.innerText = task.title;

            taskItemDiv.appendChild(taskTitleTextDiv);

            const taskPriorityDiv = document.createElement("div");
            switch (task.priority) {
                case "high":
                    taskPriorityDiv.setAttribute("class", "task-priority high");
                    break;
                case "medium":
                    taskPriorityDiv.setAttribute("class", "task-priority medium");
                    break;
                case "low":
                    taskPriorityDiv.setAttribute("class", "task-priority low");
                    break;
            }
            taskPriorityDiv.innerText = task.priority;

            taskItemDiv.appendChild(taskPriorityDiv);

            const openModalImg = document.createElement("img");
            openModalImg.setAttribute("src", openIcon);
            openModalImg.addEventListener("click", () => {
                console.log("test");
                const infoDialog = displayInfoModal(task, project.title);
                infoDialog.showModal();
            })

            taskItemDiv.appendChild(openModalImg);

            projectTasksDiv.appendChild(taskItemDiv);
        });

        // loadTasks(project.projectTasksArr, projectTasksDiv);
        
        mainContentDiv.appendChild(projectDiv);

    }) 
}

function loadTasks(projectArr, projectTasksDiv) {
    projectTasksDiv.replaceChildren();
    projectArr.map((task) => {
        const taskItemDiv = document.createElement("div");
        taskItemDiv.setAttribute("class", "main-content-project-item");

        const trashImg = document.createElement("img");
        trashImg.setAttribute("src", trashIcon);

        taskItemDiv.appendChild(trashImg);

        const taskTitleTextDiv = document.createElement("div");
        taskTitleTextDiv.setAttribute("class", "task-title-text");
        taskTitleTextDiv.innerText = task.title;

        taskItemDiv.appendChild(taskTitleTextDiv);

        const taskPriorityDiv = document.createElement("div");
        switch (task.priority) {
            case "high":
                taskPriorityDiv.setAttribute("class", "task-priority high");
                break;
            case "medium":
                taskPriorityDiv.setAttribute("class", "task-priority medium");
                break;
            case "low":
                taskPriorityDiv.setAttribute("class", "task-priority low");
                break;
        }
        taskPriorityDiv.innerText = task.priority;

        taskItemDiv.appendChild(taskPriorityDiv);

        const openModalImg = document.createElement("img");
        openModalImg.setAttribute("src", openIcon);

        taskItemDiv.appendChild(openModalImg);

        projectTasksDiv.appendChild(taskItemDiv);
    });
}

function DOMController() {

    const newProjectBtn = document.querySelector("#new-project-btn");
    const newTaskBtn = document.querySelector("#new-task-btn");

    const newProjectDialog = document.querySelector(".new-project-dialog");
    const newTaskDialog = document.querySelector(".new-task-dialog");

    const newProjectForm = document.querySelector(".new-project-dialog form");
    const newTaskForm = document.querySelector(".new-task-dialog form");

    const taskProjectTypeDropdown = document.querySelector("#project-type");
    

    newProjectBtn.addEventListener("click", () => {
        newProjectDialog.showModal();
    });

    newTaskBtn.addEventListener("click", () => {
        newTaskDialog.showModal();
        taskProjectTypeDropdown.replaceChildren();
        projectList.projectArr.map((project) => {
            const newOption = document.createElement("option");
            newOption.setAttribute("value", project.title);
            newOption.innerText = project.title;
            taskProjectTypeDropdown.appendChild(newOption);
        })
    });

    function closeProjectDialog(event) {
        const button = event.target;
        event.preventDefault();
        if (button.value === "cancel") {
            newProjectDialog.close(button.value);
        }
        else {
            (!newProjectForm.checkValidity() ? newProjectForm.reportValidity() : newProjectDialog.close(button.value));
        }
    }

    function closeTaskDialog(event) {
        const button = event.target;
        event.preventDefault();
        if (button.value === "cancel") {
            newTaskDialog.close(button.value);
        }
        else {
            (!newTaskForm.checkValidity() ? newTaskForm.reportValidity() : newTaskDialog.close(button.value));
        }
    }

    const submitProjectDialogBtn = document.querySelector("#submit-project-btn");
    const cancelProjectDialogBtn = document.querySelector("#cancel-project-btn");

    submitProjectDialogBtn.addEventListener("click", closeProjectDialog);
    cancelProjectDialogBtn.addEventListener("click", closeProjectDialog);

    const submitTaskDialogBtn = document.querySelector("#submit-task-btn");
    const cancelTaskDialogBtn = document.querySelector("#cancel-task-btn");

    submitTaskDialogBtn.addEventListener("click", closeTaskDialog);
    cancelTaskDialogBtn.addEventListener("click", closeTaskDialog);

    newProjectDialog.addEventListener("close", (e) => {
        console.log(e);
        if (newProjectDialog.returnValue === "cancel") {
            console.log("project cancel button clicked!");
        }
        else {
            const newProject = new Project(e.target.children[0][0].value);
            projectList.addProject(newProject);
            loadProjects();
        }
        newProjectForm.reset();
    });

    newTaskDialog.addEventListener("close", (e) => {
        console.log(e);
        if (newTaskDialog.returnValue === "cancel") {
            console.log("task cancel button clicked!");
        }
        else {
            const newTask = new TaskItem(e.target.children[0][0].value, e.target.children[0][1].value,
                e.target.children[0][2].value, e.target.children[0][3].value, e.target.children[0][4].value
            );
            projectList.addTaskToProject(newTask, e.target.children[0][4].value);
            loadProjects();
        }
        newTaskForm.reset();
    });

    loadProjects();
}

DOMController();





