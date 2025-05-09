class UIController {
  constructor() {
    this.taskFactory = new TaskFactory();
    this.taskSubject = new TaskSubject();
    this.notifications = [];
    this.taskManager = new TaskManager(); // Singleton
    this.currentSortStrategy = new SortByDateStrategy();

    // Inicializar observadores
    this.initObservers();

    // Configurar manipuladores de eventos
    this.setupEventListeners();
  }

  // Inicializar os observadores com base nas configurações do usuário
  initObservers() {
    if (document.getElementById("screen-observer").checked) {
      this.taskSubject.addObserver(
        new ScreenObserver(this.addNotification.bind(this))
      );
    }
    if (document.getElementById("email-observer").checked) {
      this.taskSubject.addObserver(
        new EmailObserver(this.addNotification.bind(this))
      );
    }
    if (document.getElementById("log-observer").checked) {
      this.taskSubject.addObserver(
        new LogObserver(this.addNotification.bind(this))
      );
    }
    // Adicione outros observers customizados aqui, se necessário
  }

  // Configurar manipuladores de eventos para a interface do usuário
  setupEventListeners() {
    // Formulário de criação de tarefa
    document.getElementById("task-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.createTask();
    });

    // Delegação de eventos para botões de status, exclusão e exportação CSV
    document.getElementById("tasks-container").addEventListener("click", (e) => {
      if (e.target.classList.contains("status-btn")) {
        const taskId = parseInt(e.target.getAttribute("data-task-id"));
        const status = e.target.getAttribute("data-status");
        this.updateTaskStatus(taskId, status);
      }
      if (e.target.classList.contains("delete-btn")) {
        const taskId = parseInt(e.target.getAttribute("data-task-id"));
        this.deleteTask(taskId);
      }
      if (e.target.classList.contains("export-csv-btn")) {
        const taskId = parseInt(e.target.getAttribute("data-task-id"));
        this.exportTaskToCSV(taskId);
      }
    });

    // Aplicação de decoradores
    document
      .getElementById("apply-decorators")
      .addEventListener("click", () => {
        this.applyDecorators();
      });

    // Atualização de observadores
    document
      .getElementById("screen-observer")
      .addEventListener("change", this.updateObservers.bind(this));
    document
      .getElementById("email-observer")
      .addEventListener("change", this.updateObservers.bind(this));
    document
      .getElementById("log-observer")
      .addEventListener("change", this.updateObservers.bind(this));

    // Estratégia de ordenação (Strategy)
    document.getElementById("sort-strategy").addEventListener("change", (e) => {
      const value = e.target.value;
      if (value === "type") {
        this.currentSortStrategy = new SortByTypeStrategy();
      } else {
        this.currentSortStrategy = new SortByDateStrategy();
      }
      this.renderTasks();
    });
  }

  // Criar uma nova tarefa usando o Factory Method e adicionar ao Singleton
  createTask() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const taskType = document.getElementById("task-type").value;

    if (!title) {
      alert("Por favor, insira um título para a tarefa.");
      return;
    }

    const task = this.taskFactory.createTask(taskType, title, description);
    this.taskManager.addTask(task); // Singleton

    this.renderTasks();
    document.getElementById("task-form").reset();
  }

  // Atualizar o status de uma tarefa e notificar os observadores
  updateTaskStatus(taskId, status) {
    const task = this.findTaskById(taskId);
    if (task) {
      task.setStatus(status);
      this.taskSubject.notifyObservers(task, status);
      this.renderTasks();
    }
  }

  // Excluir uma tarefa
  deleteTask(taskId) {
    const tasks = this.taskManager.getTasks();
    const index = tasks.findIndex((task) => task.getId() === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
      this.renderTasks();
    }
  }

  // Exportar tarefa para CSV usando Adapter
  exportTaskToCSV(taskId) {
    const task = this.findTaskById(taskId);
    if (!task) return;
    const adapter = new TaskCSVAdapter(task);
    const csv = adapter.toCSV(true);
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `tarefa_${taskId}.csv`;
    link.click();
}


  // Aplicar decoradores à tarefa selecionada
  applyDecorators() {
    const selectElement = document.getElementById("decorate-task-select");
    const taskId = parseInt(selectElement.value);

    if (!taskId) {
      alert("Por favor, selecione uma tarefa para aplicar os decoradores.");
      return;
    }

    let task = this.findTaskById(taskId);
    if (!task) return;

    if (document.getElementById("high-priority").checked) {
      task = new HighPriorityDecorator(task);
    }
    if (document.getElementById("color-label").checked) {
      const color = document.getElementById("color-select").value;
      task = new ColorLabelDecorator(task, color);
    }
    if (document.getElementById("due-date").checked) {
      const dueDate = document.getElementById("due-date-input").value;
      if (dueDate) {
        task = new DueDateDecorator(task, dueDate);
      }
    }
    if (document.getElementById("is-optional").checked) {
      task = new OptionalTaskDecorator(task);
    }
    // Adicione outros decoradores customizados aqui, se necessário

    // Atualizar a tarefa na lista do Singleton
    const tasks = this.taskManager.getTasks();
    const index = tasks.findIndex((t) => t.getId() === taskId);
    if (index !== -1) {
      tasks[index] = task;
      this.renderTasks();
    }
  }

  // Atualizar os observadores com base nas caixas de seleção
  updateObservers() {
    this.taskSubject = new TaskSubject();
    this.initObservers();
  }

  // Adicionar uma notificação à lista
  addNotification(notification) {
    this.notifications.push(notification);
    this.renderNotifications();
  }

  // Renderizar a lista de tarefas na interface do usuário
  renderTasks() {
    const container = document.getElementById("tasks-container");
    let tasks = this.taskManager.getTasks();
    tasks = this.currentSortStrategy.sort(tasks);

    if (tasks.length === 0) {
      container.innerHTML = `
        <div class="list-group-item text-center text-muted">
          Nenhuma tarefa criada ainda
        </div>
      `;
      document.getElementById("decorate-task-select").innerHTML = `
        <option value="">Selecione uma tarefa...</option>
      `;
      return;
    }

    container.innerHTML = "";
    let selectOptions = '<option value="">Selecione uma tarefa...</option>';

    tasks.forEach((task) => {
      container.innerHTML += `
        ${task.getHtmlRepresentation()}
        <button class="btn btn-sm btn-outline-secondary export-csv-btn" data-task-id="${task.getId()}">Exportar CSV</button>
      `;
      selectOptions += `<option value="${task.getId()}">${task.getTitle()}</option>`;
    });

    document.getElementById("decorate-task-select").innerHTML = selectOptions;
  }

  // Renderizar notificações na interface do usuário
  renderNotifications() {
    const container = document.getElementById("notifications-container");

    if (this.notifications.length === 0) {
      container.innerHTML = `
        <div class="list-group-item text-center text-muted">
          Nenhuma notificação ainda
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    const recentNotifications = [...this.notifications].reverse().slice(0, 10);
    recentNotifications.forEach((notification) => {
      container.innerHTML += notification.getHtmlRepresentation();
    });
  }

  // Encontrar uma tarefa pelo ID usando o Singleton
  findTaskById(id) {
    return this.taskManager.getTasks().find((task) => task.getId() === id);
  }
}
