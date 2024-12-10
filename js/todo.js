class TodoWidget {
    constructor() {
        this.todoInput = document.getElementById('todo-input');
        this.addButton = document.getElementById('add-todo');
        this.todoList = document.getElementById('todo-list');
        this.todos = [];

        this.init();
    }

    init() {
        this.loadTodos();
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
        this.todoList.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (!li) return;
            
            if (e.target.classList.contains('delete-btn')) {
                const todoId = parseInt(li.dataset.id);
                this.deleteTodo(todoId);
            }
            
            if (e.target.type === 'checkbox') {
                const todoId = parseInt(li.dataset.id);
                this.toggleTodo(todoId);
            }
        });
    }

    loadTodos() {
        chrome.storage.local.get(['todos'], (result) => {
            this.todos = result.todos || [];
            this.renderTodos();
        });
    }

    saveTodos() {
        chrome.storage.local.set({ todos: this.todos });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (text) {
            this.todos.push({
                id: Date.now(),
                text,
                completed: false
            });
            this.todoInput.value = '';
            this.saveTodos();
            this.renderTodos();
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => 
            todo.id === id ? {...todo, completed: !todo.completed} : todo
        );
        this.saveTodos();
        this.renderTodos();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    renderTodos() {
        this.todoList.innerHTML = this.todos.map(todo => `
            <li data-id="${todo.id}">
                <label>
                    <input type="checkbox" 
                           ${todo.completed ? 'checked' : ''}>
                    <span style="${todo.completed ? 'text-decoration: line-through' : ''}">${todo.text}</span>
                </label>
                <button class="delete-btn">×</button>
            </li>
        `).join('');
    }
}

const todoWidget = new TodoWidget(); 