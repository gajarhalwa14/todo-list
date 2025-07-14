import "./styles.css";

function createTaskItem(title, description, dueDate, priority, projectType, isCompleted) {
    const equals = (otherTaskItem) => this.title === otherTaskItem.title;
    return {title, description, dueDate, priority, projectType, isCompleted, equals};
}

function createProjects(projectTitle) {
    let projectTasksArr = [];
    const addTaskItem = (taskItem) => {
        projectTasksArr.push(taskItem);
    }
    const deleteTaskItem = (taskItem) => {
        projectTasksArr = projectTasksArr.filter(item => !(item.equals(taskItem)));
    }

    const getTaskItems = () => {
        if (projectTasksArr.length === 0) {
            console.log("No tasks in the project!");
        }
        else {
            projectTasksArr.forEach((taskItem) => {
                console.log(`${taskItem.title}: Due ${taskItem.dueDate} with a ${taskItem.priority} priority.`);
            })
        }
    }

    return {projectTitle, addTaskItem, deleteTaskItem, projectTasksArr, getTaskItems};
}

const generalProjects = createProjects("General");
const newItem = createTaskItem("Take out the Trash", "take it out!!!", "07-16-2025", "Medium", generalProjects, false);
generalProjects.addTaskItem(newItem);
generalProjects.getTaskItems();
generalProjects.deleteTaskItem(newItem);
generalProjects.getTaskItems();


