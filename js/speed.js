class SpeedWidget {
    constructor() {
        this.widgetContainer = document.querySelector('.widget-container');
        this.init();
    }

    init() {
        this.renderSpeedTest();
        this.startSpeedTest();
    }

    renderSpeedTest() {
        this.widgetContainer.innerHTML = `
            <div class="widget speed-widget">
                <h3>Speed Test</h3>
                <div class="speed-content">
                    <div class="speed-metrics">
                        <div class="metric">
                            <span class="label">Download</span>
                            <span id="download-speed">--</span>
                            <span class="unit">Mbps</span>
                        </div>
                        <div class="metric">
                            <span class="label">Upload</span>
                            <span id="upload-speed">--</span>
                            <span class="unit">Mbps</span>
                        </div>
                        <div class="metric">
                            <span class="label">Ping</span>
                            <span id="ping">--</span>
                            <span class="unit">ms</span>
                        </div>
                    </div>
                    <button id="start-test" class="speed-test-btn">Start Test</button>
                    <div id="progress-bar" class="progress-bar">
                        <div class="progress"></div>
                    </div>
                </div>
            </div>
        `;

        // Add event listener to start button
        document.getElementById('start-test').addEventListener('click', () => {
            this.startSpeedTest();
        });
    }

    async startSpeedTest() {
        const downloadSpeedElement = document.getElementById('download-speed');
        const uploadSpeedElement = document.getElementById('upload-speed');
        const pingElement = document.getElementById('ping');
        const startButton = document.getElementById('start-test');
        const progressBar = document.querySelector('.progress');

        startButton.disabled = true;
        startButton.textContent = 'Testing...';

        try {
            // Test ping
            const pingStart = performance.now();
            await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
            const pingEnd = performance.now();
            const ping = Math.round(pingEnd - pingStart);
            pingElement.textContent = ping;

            // Update progress
            progressBar.style.width = '33%';

            // Test download speed
            const downloadSpeed = await this.measureDownloadSpeed();
            downloadSpeedElement.textContent = downloadSpeed.toFixed(2);

            // Update progress
            progressBar.style.width = '66%';

            // Test upload speed
            const uploadSpeed = await this.measureUploadSpeed();
            uploadSpeedElement.textContent = uploadSpeed.toFixed(2);

            // Complete progress
            progressBar.style.width = '100%';

        } catch (error) {
            console.error('Speed test failed:', error);
            downloadSpeedElement.textContent = 'Error';
            uploadSpeedElement.textContent = 'Error';
            pingElement.textContent = 'Error';
        }

        startButton.disabled = false;
        startButton.textContent = 'Start Test';
        
        // Reset progress bar after a delay
        setTimeout(() => {
            progressBar.style.width = '0%';
        }, 1000);
    }

    async measureDownloadSpeed() {
        const startTime = performance.now();
        const fileSize = 5 * 1024 * 1024; // 5MB test file
        const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${fileSize}`);
        const data = await response.blob();
        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = fileSize * 8;
        const speedBps = bitsLoaded / durationInSeconds;
        const speedMbps = speedBps / (1024 * 1024);
        return speedMbps;
    }

    async measureUploadSpeed() {
        const startTime = performance.now();
        const fileSize = 2 * 1024 * 1024; // 2MB test file
        const testData = new Blob([new ArrayBuffer(fileSize)]);
        
        await fetch('https://speed.cloudflare.com/__up', {
            method: 'POST',
            body: testData
        });

        const endTime = performance.now();
        const durationInSeconds = (endTime - startTime) / 1000;
        const bitsLoaded = fileSize * 8;
        const speedBps = bitsLoaded / durationInSeconds;
        const speedMbps = speedBps / (1024 * 1024);
        return speedMbps;
    }
}

// Add these styles to your style.css
const styles = `
    .speed-content {
        padding: 15px;
    }

    .speed-metrics {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 20px;
    }

    .metric {
        text-align: center;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 8px;
    }

    .metric .label {
        display: block;
        color: #666;
        font-size: 12px;
        margin-bottom: 5px;
    }

    .metric span:not(.label):not(.unit) {
        font-size: 24px;
        font-weight: bold;
        color: #2196F3;
    }

    .metric .unit {
        font-size: 12px;
        color: #666;
        margin-left: 2px;
    }

    .speed-test-btn {
        width: 100%;
        padding: 10px;
        background: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
    }

    .speed-test-btn:hover {
        background: #1976D2;
    }

    .speed-test-btn:disabled {
        background: #ccc;
        cursor: not-allowed;
    }

    .progress-bar {
        margin-top: 15px;
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
    }

    .progress {
        width: 0%;
        height: 100%;
        background: #2196F3;
        transition: width 0.3s ease;
    }
`;

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 