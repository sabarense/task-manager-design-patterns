// js/patterns/strategy.js
class SortStrategy {
    sort(tasks) { 
        return tasks; 
    }
}

class SortByDateStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => a.getCreatedAt().getTime() - b.getCreatedAt().getTime());
    }
}

class SortByTypeStrategy extends SortStrategy {
    sort(tasks) {
        return [...tasks].sort((a, b) => a.getType().localeCompare(b.getType()));
    }
}
