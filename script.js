class ReactionGame {
    constructor() {
        // Menu elements
        this.menuContainer = document.getElementById('menu');
        this.gameContainer = document.getElementById('game');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        this.menuButton = document.getElementById('menu-button');
        
        // Game elements
        this.gameArea = document.getElementById('game-area');
        this.startButton = document.getElementById('start-button');
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.hitsElement = document.getElementById('hits');
        
        // Control elements
        this.spawnRateInput = document.getElementById('spawn-rate');
        this.despawnRateInput = document.getElementById('despawn-rate');
        this.spawnValueDisplay = document.getElementById('spawn-value');
        this.despawnValueDisplay = document.getElementById('despawn-value');
        
        this.score = 0;
        this.hits = 0;
        this.timeLeft = 60;
        this.gameInterval = null;
        this.targetInterval = null;
        this.isGameRunning = false;
        
        // Difficulty settings
        this.difficultySettings = {
            easy: { spawnRate: 1000, despawnRate: 2000 },
            medium: { spawnRate: 500, despawnRate: 1000 },
            hard: { spawnRate: 300, despawnRate: 800 }
        };
        
        // Initialize control values
        this.spawnRate = parseInt(this.spawnRateInput.value);
        this.targetLifetime = parseInt(this.despawnRateInput.value);
        
        // Add event listeners
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => this.selectDifficulty(btn.dataset.difficulty));
        });
        
        this.menuButton.addEventListener('click', () => this.returnToMenu());
        
        this.spawnRateInput.addEventListener('input', () => {
            this.spawnRate = parseInt(this.spawnRateInput.value);
            this.spawnValueDisplay.textContent = this.spawnRate;
            if (this.isGameRunning) {
                clearInterval(this.targetInterval);
                this.targetInterval = setInterval(() => {
                    this.spawnTarget();
                }, this.spawnRate);
            }
        });
        
        this.despawnRateInput.addEventListener('input', () => {
            this.targetLifetime = parseInt(this.despawnRateInput.value);
            this.despawnValueDisplay.textContent = this.targetLifetime;
        });
        
        this.startButton.addEventListener('click', () => this.startGame());
    }

    selectDifficulty(difficulty) {
        const settings = this.difficultySettings[difficulty];
        this.spawnRateInput.value = settings.spawnRate;
        this.despawnRateInput.value = settings.despawnRate;
        this.spawnValueDisplay.textContent = settings.spawnRate;
        this.despawnValueDisplay.textContent = settings.despawnRate;
        this.spawnRate = settings.spawnRate;
        this.targetLifetime = settings.despawnRate;
        
        this.menuContainer.classList.add('hidden');
        this.gameContainer.classList.remove('hidden');
    }

    returnToMenu() {
        this.endGame();
        this.menuContainer.classList.remove('hidden');
        this.gameContainer.classList.add('hidden');
    }

    startGame() {
        if (this.isGameRunning) return;
        
        this.isGameRunning = true;
        this.score = 0;
        this.hits = 0;
        this.timeLeft = 60;
        this.scoreElement.textContent = this.score;
        this.hitsElement.textContent = this.hits;
        this.timerElement.textContent = this.timeLeft;
        this.startButton.disabled = true;
        
        // Clear any existing targets
        const targets = document.querySelectorAll('.target');
        targets.forEach(target => target.remove());
        
        // Start the game timer
        this.gameInterval = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
        
        // Start spawning targets
        this.targetInterval = setInterval(() => {
            this.spawnTarget();
        }, this.spawnRate);
    }

    spawnTarget() {
        const target = document.createElement('div');
        target.className = 'target';
        
        // Random size between 30px and 60px
        const size = Math.random() * 30 + 30;
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        
        // Random position within viewport
        const maxX = window.innerWidth - size;
        const maxY = window.innerHeight - size;
        target.style.left = `${Math.random() * maxX}px`;
        target.style.top = `${Math.random() * maxY}px`;
        
        // Add click event with animation
        target.addEventListener('click', () => {
            this.score++;
            this.hits++;
            this.scoreElement.textContent = this.score;
            this.hitsElement.textContent = this.hits;
            this.removeTarget(target);
        });
        
        this.gameArea.appendChild(target);
        
        // Set timeout to remove target after lifetime
        setTimeout(() => {
            if (target.parentNode) { // Check if target still exists
                this.removeTarget(target);
            }
        }, this.targetLifetime);
    }

    removeTarget(target) {
        target.style.transform = 'scale(1.2)';
        target.style.opacity = '0';
        setTimeout(() => {
            if (target.parentNode) {
                target.remove();
            }
        }, 200);
    }

    endGame() {
        this.isGameRunning = false;
        clearInterval(this.gameInterval);
        clearInterval(this.targetInterval);
        this.startButton.disabled = false;
        
        // Clear all targets
        const targets = document.querySelectorAll('.target');
        targets.forEach(target => target.remove());
        
        alert(`Game Over!\nScore: ${this.score}\nHits: ${this.hits}`);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new ReactionGame();
}); 