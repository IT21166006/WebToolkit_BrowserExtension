class NotesWidget {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM elements to be ready
        setTimeout(() => {
            this.loadNotes();
        }, 100);
    }

    loadNotes() {
        chrome.storage.local.get(['notes'], (result) => {
            const notes = result.notes || [];
            this.renderNotes(notes);
        });
    }

    renderNotes(notes) {
        const widgetContainer = document.querySelector('.widget-container');
        if (!widgetContainer) return;

        widgetContainer.innerHTML = `
            <div class="widget notes-widget">
                <h3>Quick Notes</h3>
                <div class="notes-content">
                    <div class="notes-input-container">
                        <input type="text" id="note-title" placeholder="Title..." class="note-title-input">
                        <textarea id="note-content" placeholder="Write your note here..." class="note-content-input"></textarea>
                        <button id="add-note" class="add-note-btn">Add Note</button>
                    </div>
                    <div class="notes-list" id="notes-list">
                        ${notes.map((note, index) => this.createNoteElement(note, index)).join('')}
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.setupEventListeners(notes);
    }

    setupEventListeners(notes) {
        const addButton = document.getElementById('add-note');
        const contentInput = document.getElementById('note-content');
        const notesList = document.getElementById('notes-list');

        if (addButton) {
            addButton.addEventListener('click', () => this.addNote(notes));
        }

        if (contentInput) {
            contentInput.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'Enter') {
                    this.addNote(notes);
                }
            });
        }

        if (notesList) {
            notesList.addEventListener('click', (e) => {
                const noteElement = e.target.closest('.note-item');
                if (!noteElement) return;

                const index = parseInt(noteElement.dataset.index);

                if (e.target.classList.contains('delete-note')) {
                    this.deleteNote(notes, index);
                } else if (e.target.classList.contains('edit-note')) {
                    this.editNote(notes, index, noteElement);
                }
            });
        }
    }

    createNoteElement(note, index) {
        return `
            <div class="note-item" data-index="${index}">
                <div class="note-header">
                    <h4>${this.escapeHtml(note.title || 'Untitled')}</h4>
                    <div class="note-actions">
                        <button class="edit-note" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#009688">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                        </button>
                        <button class="delete-note" title="Delete">×</button>
                    </div>
                </div>
                <p class="note-text">${this.escapeHtml(note.content)}</p>
                <span class="note-date">${new Date(note.date).toLocaleDateString()}</span>
            </div>
        `;
    }

    addNote(notes) {
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');

        if (!titleInput || !contentInput) return;

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (content) {
            notes.unshift({
                title: title || 'Untitled',
                content: content,
                date: new Date().toISOString()
            });

            chrome.storage.local.set({ notes: notes }, () => {
                this.renderNotes(notes);
            });

            // Clear inputs
            titleInput.value = '';
            contentInput.value = '';
        }
    }

    editNote(notes, index, noteElement) {
        const note = notes[index];
        
        noteElement.innerHTML = `
            <div class="note-edit-form">
                <input type="text" class="edit-title-input" value="${this.escapeHtml(note.title)}">
                <textarea class="edit-content-input">${this.escapeHtml(note.content)}</textarea>
                <div class="edit-actions">
                    <button class="save-edit">Save</button>
                    <button class="cancel-edit">Cancel</button>
                </div>
            </div>
        `;

        const saveBtn = noteElement.querySelector('.save-edit');
        const cancelBtn = noteElement.querySelector('.cancel-edit');

        saveBtn.addEventListener('click', () => {
            const newTitle = noteElement.querySelector('.edit-title-input').value.trim();
            const newContent = noteElement.querySelector('.edit-content-input').value.trim();
            
            if (newContent) {
                notes[index] = {
                    ...note,
                    title: newTitle || 'Untitled',
                    content: newContent,
                    date: new Date().toISOString()
                };

                chrome.storage.local.set({ notes: notes }, () => {
                    this.renderNotes(notes);
                });
            }
        });

        cancelBtn.addEventListener('click', () => {
            this.renderNotes(notes);
        });
    }

    deleteNote(notes, index) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes.splice(index, 1);
            chrome.storage.local.set({ notes: notes }, () => {
                this.renderNotes(notes);
            });
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

// Initialize the widget
const notesWidget = new NotesWidget(); 