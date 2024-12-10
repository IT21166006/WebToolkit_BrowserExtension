class HistoryWidget {
    constructor() {
        this.historyList = document.getElementById('history-list');
        // Default icon for history items (globe icon in base64)
        this.defaultIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMjE5NkYzIj48cGF0aCBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6Ii8+PHBhdGggZD0iTTEyLjUgN0gxMXY2bDUuMjUgMy4xNS43NS0xLjIzLTQuNS0yLjY3eiIvPjwvc3ZnPg==";
        this.init();
    }

    init() {
        this.loadHistory();
        // Refresh history every 30 seconds
        setInterval(() => this.loadHistory(), 30000);
    }

    loadHistory() {
        // Get the last hour of history
        const oneHourAgo = new Date().getTime() - 3600000;
        
        chrome.history.search({
            text: '',              // Return all history items
            startTime: oneHourAgo, // From the last hour
            maxResults: 10         // Limit to 10 items
        }, (historyItems) => {
            this.renderHistory(historyItems);
        });
    }

    renderHistory(historyItems) {
        if (!historyItems || historyItems.length === 0) {
            this.historyList.innerHTML = '<p>No recent history</p>';
            return;
        }

        this.historyList.innerHTML = historyItems.map(item => `
            <div class="history-item">
                <img src="${this.defaultIcon}" alt="history" width="16" height="16">
                <a href="${item.url}" title="${item.title}" target="_blank">
                    ${this.truncateText(item.title || item.url, 40)}
                </a>
                <span class="history-time">${this.getTimeAgo(item.lastVisitTime)}</span>
                <button class="delete-history" data-url="${item.url}">×</button>
            </div>
        `).join('');

        // Add event listeners for delete buttons
        const deleteButtons = this.historyList.querySelectorAll('.delete-history');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const url = e.target.dataset.url;
                this.deleteHistoryItem(url);
                e.stopPropagation();
            });
        });
    }

    deleteHistoryItem(url) {
        chrome.history.deleteUrl({ url: url }, () => {
            this.loadHistory(); // Refresh the list after deletion
        });
    }

    truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength 
            ? text.substring(0, maxLength) + '...' 
            : text;
    }

    getTimeAgo(timestamp) {
        const now = new Date().getTime();
        const diff = now - timestamp;
        
        // Convert milliseconds to minutes
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        return new Date(timestamp).toLocaleDateString();
    }
}

const historyWidget = new HistoryWidget(); 