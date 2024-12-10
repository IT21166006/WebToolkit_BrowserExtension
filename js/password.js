class PasswordWidget {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM elements to be ready
        setTimeout(() => {
            this.setupEventListeners();
            this.generatePassword(); // Generate initial password
        }, 100);
    }

    setupEventListeners() {
        const lengthSlider = document.getElementById('password-length');
        const lengthValue = document.getElementById('length-value');
        const generateBtn = document.getElementById('generate-password');
        const copyBtn = document.getElementById('copy-password');
        const checkboxes = ['uppercase', 'lowercase', 'numbers', 'symbols'];

        if (lengthSlider && lengthValue) {
            lengthSlider.addEventListener('input', () => {
                lengthValue.textContent = lengthSlider.value;
            });
            lengthSlider.addEventListener('change', () => this.generatePassword());
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePassword());
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyToClipboard());
        }

        // Add event listeners to checkboxes
        checkboxes.forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.addEventListener('change', () => {
                    // Ensure at least one checkbox is checked
                    const anyChecked = checkboxes.some(cbId => 
                        document.getElementById(cbId)?.checked
                    );
                    if (!anyChecked) {
                        checkbox.checked = true;
                        alert('At least one option must be selected');
                    } else {
                        this.generatePassword();
                    }
                });
            }
        });
    }

    generatePassword() {
        const lengthInput = document.getElementById('password-length');
        const passwordInput = document.getElementById('generated-password');
        
        if (!lengthInput || !passwordInput) return;

        const length = parseInt(lengthInput.value);
        const useUppercase = document.getElementById('uppercase')?.checked ?? true;
        const useLowercase = document.getElementById('lowercase')?.checked ?? true;
        const useNumbers = document.getElementById('numbers')?.checked ?? true;
        const useSymbols = document.getElementById('symbols')?.checked ?? true;

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = '';
        let password = '';
        const requiredChars = [];

        // Build character set and collect required characters
        if (useUppercase) {
            chars += uppercase;
            requiredChars.push(this.getRandomChar(uppercase));
        }
        if (useLowercase) {
            chars += lowercase;
            requiredChars.push(this.getRandomChar(lowercase));
        }
        if (useNumbers) {
            chars += numbers;
            requiredChars.push(this.getRandomChar(numbers));
        }
        if (useSymbols) {
            chars += symbols;
            requiredChars.push(this.getRandomChar(symbols));
        }

        // Fill remaining length with random characters
        for (let i = requiredChars.length; i < length; i++) {
            password += this.getRandomChar(chars);
        }

        // Add required characters and shuffle
        password = this.shuffleString(requiredChars.join('') + password);
        password = password.slice(0, length); // Ensure correct length

        passwordInput.value = password;
    }

    getRandomChar(str) {
        return str.charAt(Math.floor(Math.random() * str.length));
    }

    shuffleString(str) {
        const array = str.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    async copyToClipboard() {
        const passwordInput = document.getElementById('generated-password');
        if (!passwordInput?.value) return;

        try {
            await navigator.clipboard.writeText(passwordInput.value);
            this.showCopyFeedback();
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    }

    showCopyFeedback() {
        const copyBtn = document.getElementById('copy-password');
        if (!copyBtn) return;

        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#4CAF50">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
        `;
        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
        }, 1500);
    }
}

// Initialize the widget
const passwordWidget = new PasswordWidget(); 