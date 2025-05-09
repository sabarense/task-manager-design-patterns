// js/models/task-manager.js
class TaskManager {
    constructor() {
        if (TaskManager.instance) return TaskManager.instance;
        this.tasks = [];
        TaskManager.instance = this;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getTasks() {
        return this.tasks;
    }
}
