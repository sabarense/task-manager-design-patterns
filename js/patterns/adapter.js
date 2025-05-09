// js/patterns/adapter.js
class TaskCSVAdapter {
    constructor(task) {
        this.task = task;
    }

    static escapeCSV(value) {
        if (typeof value !== 'string') value = String(value);
        
        return `"${value.replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`;
    }

    toCSV(includeHeader = false) {
        const fields = [
            this.task.getId(),
            this.task.getTitle(),
            this.task.getDescription(),
            this.task.getType(),
            this.task.getStatus(),
            this.task.getCreatedAt().toLocaleString()
        ];
        const header = [
            "ID", "Título", "Descrição", "Tipo", "Status", "Criada em"
        ];
        const csvLine = fields.map(TaskCSVAdapter.escapeCSV).join(',');
        if (includeHeader) {
            return header.map(TaskCSVAdapter.escapeCSV).join(',') + '\n' + csvLine;
        }
        return csvLine;
    }
}
