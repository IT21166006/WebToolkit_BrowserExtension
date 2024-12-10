class BookmarksWidget {
    constructor() {
        this.bookmarksList = document.getElementById('bookmarks-list');
        this.defaultIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij4KPHBhdGggZmlsbD0iIzIxOTZGMyIgZD0iTTE5MiwyOC4wMDVoLTEyOGMtOC44MzcsMC0xNiw3LjE2My0xNiwxNnYxOTJjMCw2LjI1Miw0LjAyNywxMS44NTUsMTAsMTMuNzU5YzUuOTY5LDEuOTAxLDEyLjQyNS0wLjU5OCwxNS42MjItNi4wNDEgbDU0LjM3OC03Ni4zNzlsNTQuMzc4LDc2LjM3OWMzLjE5Nyw1LjQ0Myw5LjY1Myw3Ljk0MiwxNS42MjIsNi4wNDFjNS45NzMtMS45MDQsMTAtNy41MDcsMTAtMTMuNzU5di0xOTIgQzIwOCwzNS4xNjgsMjAwLjgzNywyOC4wMDUsMTkyLDI4LjAwNXoiLz4KPC9zdmc+";
        this.init();
    }

    init() {
        this.loadBookmarks();
        // Refresh bookmarks every 30 seconds
        setInterval(() => this.loadBookmarks(), 30000);
    }

    async loadBookmarks() {
        try {
            // Get the most recent bookmarks (limited to 10)
            chrome.bookmarks.getRecent(10, (bookmarks) => {
                this.renderBookmarks(bookmarks);
            });
        } catch (error) {
            this.bookmarksList.innerHTML = '<p>Failed to load bookmarks</p>';
        }
    }

    renderBookmarks(bookmarks) {
        if (!bookmarks.length) {
            this.bookmarksList.innerHTML = '<p>No bookmarks found</p>';
            return;
        }

        this.bookmarksList.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item">
                <img src="${this.defaultIcon}" alt="bookmark" width="16" height="16">
                <a href="${bookmark.url}" title="${bookmark.title}" target="_blank">
                    ${this.truncateText(bookmark.title, 40)}
                </a>
                <button class="delete-bookmark" data-id="${bookmark.id}">×</button>
            </div>
        `).join('');

        // Add event listeners for delete buttons
        const deleteButtons = this.bookmarksList.querySelectorAll('.delete-bookmark');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const bookmarkId = e.target.dataset.id;
                this.deleteBookmark(bookmarkId);
                e.stopPropagation();
            });
        });
    }

    deleteBookmark(id) {
        chrome.bookmarks.remove(id, () => {
            this.loadBookmarks(); // Refresh the list after deletion
        });
    }

    truncateText(text, maxLength) {
        return text.length > maxLength 
            ? text.substring(0, maxLength) + '...' 
            : text;
    }
}

const bookmarksWidget = new BookmarksWidget(); 