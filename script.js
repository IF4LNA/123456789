let currentScreen = 'loading';
let tetrisGame = null;
let gameScore = 0;
let gameLevel = 1;
let gameLines = 0;
let typewriterInterval = null;
let isTyping = false;
let currentPhotoIndex = 0;
let currentMusicIndex = 0;
let isPlaying = false;
let playbackInterval = null;
// 1. DATA FOTO & PLAYLIST DATA
const myPhotos = [
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80', caption: 'Your Beautiful Smile' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80', caption: 'Special Moments' },
    { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80', caption: 'Forever Happy' }
];

const playlistsData = {
    1: {
        embedUrl: 'https://open.spotify.com/embed/playlist/5PpGN28r8C18awMBvrW9oF?utm_source=generator', // Ganti dengan ID asli
        name: 'Birthday Special Mix',
        description: 'Lagu-lagu spesial untuk hari istimewa kamu ✨'
    },
    2: {
        embedUrl: 'https://open.spotify.com/embed/playlist/013ChJa6IXL11g1kQebQso?utm_source=generator',
        name: 'what i like',
        description: 'Koleksi lagu cinta terbaik untuk kita ❤️'
    },
    // 3: {
    //     embedUrl: 'https://open.spotify.com/embed/playlist/ID_PLAYLIST_3',
    //     name: 'Happy Memories',
    //     description: 'Lagu-lagu yang mengingatkan kenangan indah 🌟'
    // }
};

// 2. TEAR ACTION & TAKE PHOTO (Tetap seperti sebelumnya)
function tearAction() {
    const bottom = document.getElementById('bottomPart');
    const mainCard = document.getElementById('mainCard');
    const camera = document.getElementById('cameraSection');
    mainCard.classList.add('shaking');
    setTimeout(() => {
        mainCard.classList.remove('shaking');
        bottom.classList.add('is-torn');
        setTimeout(() => {
            mainCard.style.opacity = '0';
            setTimeout(() => {
                mainCard.style.display = 'none';
                camera.style.display = 'flex';
                setTimeout(() => camera.style.opacity = '1', 50);
            }, 500);
        }, 600);
    }, 300);
}

async function takePhoto() {
    const shutter = document.getElementById('shutter');
    const camera = document.getElementById('cameraSection');
    const newPage = document.getElementById('newPage');
    shutter.classList.add('flash-active');
    setTimeout(() => {
        shutter.classList.remove('flash-active');
        camera.style.opacity = '0';
        setTimeout(() => {
            camera.style.display = 'none';
            document.body.style.overflowY = 'auto'; 
            newPage.style.display = 'block';
            setTimeout(() => {
                newPage.style.opacity = '1';
                renderPolaroids();
            }, 100);
        }, 500);
    }, 400);
}

async function renderPolaroids() {
    const gallery = document.getElementById('polaroidGallery');
    const surprise = document.getElementById('surpriseContainer');
    for (let p of myPhotos) {
        const rotate = Math.random() * 10 - 5;
        const pol = document.createElement('div');
        pol.className = 'polaroid-frame';
        pol.style.setProperty('--rotate-deg', `${rotate}deg`);
        pol.innerHTML = `
            <div class="polaroid-content"><img src="${p.src}" class="w-full h-full object-cover"></div>
            <p class="cursive text-xl mt-4 text-center text-gray-700">${p.caption}</p>`;
        gallery.appendChild(pol);
        await new Promise(r => setTimeout(r, 400));
        pol.classList.add('printed');
        await new Promise(r => setTimeout(r, 1000));
    }
    setTimeout(() => {
        surprise.classList.remove('opacity-0');
        surprise.style.opacity = '1';
        surprise.style.pointerEvents = 'auto';
    }, 500);
}

// 3. LOGIKA SURPRISE & MUSIC PLAYER
function handleSurpriseClick() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

    const galleryWrapper = document.getElementById('galleryWrapper');
    const musicPage = document.getElementById('musicPage');

    // Sembunyikan Galeri
    galleryWrapper.style.transition = "opacity 0.8s ease, transform 0.8s ease";
    galleryWrapper.style.opacity = "0";
    galleryWrapper.style.transform = "translateY(-20px)";

    setTimeout(() => {
        galleryWrapper.classList.add('hidden');
        musicPage.classList.remove('hidden');
        
        // Inisialisasi Player Musik
        initializeMusicPlayer();

        setTimeout(() => {
            musicPage.classList.remove('opacity-0');
            musicPage.style.opacity = "1";
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    }, 800);
}

function initializeMusicPlayer() {
    const musicContent = document.querySelector('.music-content');
    if (!musicContent) return;

    // Gunakan template literal untuk mendefinisikan seluruh struktur agar tidak ada yang terhapus
    musicContent.innerHTML = `
        <div class="spotify-container">
            <div class="spotify-header mb-4">
                <div class="cursive text-3xl text-blue-main">♪ Our Playlist</div>
            </div>
            <div class="spotify-embed-container mb-6">
                <iframe id="spotify-iframe" style="border-radius:0px; border: 2px solid black;" 
                        src="" width="100%" height="200" frameBorder="0" 
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
                </iframe>
            </div>
            <div class="playlist-controls flex flex-wrap justify-center gap-2 mb-6">
                <button class="playlist-btn active" data-playlist="1">PlayList 1</button>
                <button class="playlist-btn" data-playlist="2">PlayList 2</button>
            </div>
            <div class="music-info text-sm uppercase font-bold tracking-widest text-gray-600 mb-6">
                <div class="current-playlist text-blue-main mb-1">Now Playing: ...</div>
                <div class="playlist-description italic">Memuat lagu...</div>
            </div>
            
            <button onclick="goToTetris()" class="mt-4 bg-black text-white px-8 py-3 font-black uppercase text-xs hover:bg-blue-main transition shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                Next: Play Game 🎮
            </button>
        </div>
    `;

    // Pasang kembali event listener untuk tombol playlist
    const playlistBtns = musicContent.querySelectorAll('.playlist-btn');
    playlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playlistBtns.forEach(b => b.classList.remove('active', 'bg-blue-main', 'text-white'));
            this.classList.add('active', 'bg-blue-main', 'text-white');
            loadSpotifyPlaylist(this.getAttribute('data-playlist'));
        });
    });

    // Load playlist pertama secara default
    loadSpotifyPlaylist(1);
}

function loadSpotifyPlaylist(num) {
    const iframe = document.getElementById('spotify-iframe');
    const title = document.querySelector('.current-playlist');
    const desc = document.querySelector('.playlist-description');
    const data = playlistsData[num];

    if (iframe && data) {
        iframe.style.opacity = '0.5';
        iframe.src = data.embedUrl;
        title.textContent = `Now Playing: ${data.name}`;
        desc.textContent = data.description;
        iframe.onload = () => iframe.style.opacity = '1';
    }
}

// --- STATE TAMBAHAN ---

// --- NAVIGASI KE TETRIS ---
function goToTetris() {
    const musicPage = document.getElementById('musicPage');
    const tetrisPage = document.getElementById('tetrisPage');

    musicPage.style.opacity = "0";
    setTimeout(() => {
        musicPage.classList.add('hidden');
        tetrisPage.classList.remove('hidden');
        setTimeout(() => {
            tetrisPage.classList.remove('opacity-0');
            tetrisPage.style.opacity = "1";
            initializeTetris();
            startTetrisGame();
        }, 50);
    }, 500);
}

// Tambahkan tombol NEXT di dalam kontainer musik (index.html bagian music-content)
// Gunakan fungsi initializeMusicPlayer untuk menambahkan tombol tersebut secara dinamis:
// musicContent.innerHTML += `<button onclick="goToTetris()" class="mt-8 bg-black text-white px-6 py-2 font-black uppercase text-xs">Next: Play Game 🎮</button>`;

// Tetris Game Functions
function initializeTetris() {
    const canvas = document.getElementById('tetris-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Calculate much larger canvas size
    const gameContainer = document.querySelector('.tetris-game');
    if (gameContainer) {
        const containerRect = gameContainer.getBoundingClientRect();
        
        // Much larger maximum dimensions - use almost all available space
        const maxWidth = containerRect.width - 15; // Only 15px margin
        const maxHeight = containerRect.height - 15; // Only 15px margin
        
        // Maintain aspect ratio (approximately 1:2 for Tetris)
        const aspectRatio = 1 / 2;
        let canvasWidth = Math.min(maxWidth, maxHeight * aspectRatio);
        let canvasHeight = canvasWidth / aspectRatio;
        
        // If height is too tall, adjust based on height
        if (canvasHeight > maxHeight) {
            canvasHeight = maxHeight;
            canvasWidth = canvasHeight * aspectRatio;
        }
        
        // Ensure minimum reasonable size
        canvasWidth = Math.max(canvasWidth, 500);
        canvasHeight = Math.max(canvasHeight, 600);
        
        canvas.width = Math.floor(canvasWidth);
        canvas.height = Math.floor(canvasHeight);
        
        console.log('Container size:', containerRect.width, 'x', containerRect.height);
        console.log('Canvas size:', canvas.width, 'x', canvas.height);
    } else {
        // Much larger fallback dimensions
        canvas.width = 500; // Increased significantly
        canvas.height = 600; // Increased significantly
    }
    
    // Calculate block size - ensure it's large enough to see clearly
    const blockSize = Math.max(Math.floor(canvas.width / 10), 25); // Minimum 25px blocks
    const boardHeight = Math.floor(canvas.height / blockSize);
    
    tetrisGame = {
        canvas: canvas,
        ctx: ctx,
        board: createEmptyBoard(10, boardHeight),
        currentPiece: null,
        gameRunning: false,
        dropTime: 0,
        lastTime: 0,
        dropInterval: 1000,
        blockSize: blockSize,
        boardWidth: 10,
        boardHeight: boardHeight
    };
    
    console.log('Block size:', blockSize, 'Board:', tetrisGame.boardWidth, 'x', tetrisGame.boardHeight);
    
    updateTetrisStats();
    drawTetrisBoard();
    addTetrisListeners();
}

function createEmptyBoard(width, height) {
    const board = [];
    for (let y = 0; y < height; y++) {
        board[y] = [];
        for (let x = 0; x < width; x++) {
            board[y][x] = 0;
        }
    }
    return board;
}

function drawTetrisBoard() {
    if (!tetrisGame) return;
    
    const { ctx, canvas, board, blockSize } = tetrisGame;
    
    // Clear canvas with proper background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw more visible grid lines for larger canvas
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1; // Thicker lines for better visibility
    
    // Vertical lines
    for (let x = 0; x <= tetrisGame.boardWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * blockSize, 0);
        ctx.lineTo(x * blockSize, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= board.length; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * blockSize);
        ctx.lineTo(canvas.width, y * blockSize);
        ctx.stroke();
    }
    
    // Draw placed blocks
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] !== 0) {
                drawBlock(x, y, getBlockColor(board[y][x]));
            }
        }
    }
    
    // Draw current piece
    if (tetrisGame.currentPiece) {
        drawPiece(tetrisGame.currentPiece);
    }
    
    // Draw prominent border around play area
    ctx.strokeStyle = '#9bbc0f';
    ctx.lineWidth = 4; // Much thicker border
    ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
}

function drawBlock(x, y, color) {
    if (!tetrisGame) return;
    
    const { ctx, blockSize } = tetrisGame;
    const padding = Math.max(2, Math.floor(blockSize * 0.08)); // Larger padding for bigger blocks
    
    // Main block with rounded corners effect
    ctx.fillStyle = color;
    ctx.fillRect(
        x * blockSize + padding, 
        y * blockSize + padding, 
        blockSize - padding * 2, 
        blockSize - padding * 2
    );
    
    // Enhanced 3D effect for larger blocks
    if (blockSize > 20) {
        const effectSize = Math.max(2, Math.floor(blockSize * 0.12));
        
        // Highlight (top and left edges) - brighter for better visibility
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(x * blockSize + padding, y * blockSize + padding, blockSize - padding * 2, effectSize);
        ctx.fillRect(x * blockSize + padding, y * blockSize + padding, effectSize, blockSize - padding * 2);
        
        // Shadow (bottom and right edges) - darker for better contrast
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x * blockSize + padding, y * blockSize + blockSize - padding - effectSize, blockSize - padding * 2, effectSize);
        ctx.fillRect(x * blockSize + blockSize - padding - effectSize, y * blockSize + padding, effectSize, blockSize - padding * 2);
        
        // Inner border for more definition
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(
            x * blockSize + padding, 
            y * blockSize + padding, 
            blockSize - padding * 2, 
            blockSize - padding * 2
        );
    }
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(piece.x + x, piece.y + y, getBlockColor(value));
            }
        });
    });
}

function getBlockColor(type) {
    const colors = {
        1: '#ff4757', // I-piece - bright red
        2: '#2ed573', // O-piece - bright green
        3: '#3742fa', // T-piece - bright blue
        4: '#ff6b35', // S-piece - bright orange
        5: '#ffa502', // Z-piece - bright yellow
        6: '#a55eea', // J-piece - bright purple
        7: '#26d0ce'  // L-piece - bright cyan
    };
    return colors[type] || '#ffffff';
}

function createTetrisPiece() {
    const pieces = [
        { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], x: 3, y: 0 }, // I
        { shape: [[2,2],[2,2]], x: 4, y: 0 }, // O
        { shape: [[0,3,0],[3,3,3],[0,0,0]], x: 3, y: 0 }, // T
        { shape: [[0,4,4],[4,4,0],[0,0,0]], x: 3, y: 0 }, // S
        { shape: [[5,5,0],[0,5,5],[0,0,0]], x: 3, y: 0 }, // Z
        { shape: [[6,0,0],[6,6,6],[0,0,0]], x: 3, y: 0 }, // J
        { shape: [[0,0,7],[7,7,7],[0,0,0]], x: 3, y: 0 }  // L
    ];
    
    return pieces[Math.floor(Math.random() * pieces.length)];
}

function startTetrisGame() {
    if (!tetrisGame) return;
    
    tetrisGame.gameRunning = true;
    tetrisGame.currentPiece = createTetrisPiece();
    gameScore = 0;
    gameLevel = 1;
    gameLines = 0;
    updateTetrisStats();
    
    tetrisGameLoop();
}

function tetrisGameLoop(time = 0) {
    if (!tetrisGame || !tetrisGame.gameRunning) return;
    
    const deltaTime = time - tetrisGame.lastTime;
    tetrisGame.lastTime = time;
    tetrisGame.dropTime += deltaTime;
    
    if (tetrisGame.dropTime > tetrisGame.dropInterval) {
        moveTetrisPiece('down');
        tetrisGame.dropTime = 0;
    }
    
    drawTetrisBoard();
    requestAnimationFrame(tetrisGameLoop);
}

function moveTetrisPiece(direction) {
    if (!tetrisGame || !tetrisGame.currentPiece) return;
    
    const piece = tetrisGame.currentPiece;
    let newX = piece.x;
    let newY = piece.y;
    
    switch(direction) {
        case 'left':
            newX = piece.x - 1;
            break;
        case 'right':
            newX = piece.x + 1;
            break;
        case 'down':
            newY = piece.y + 1;
            break;
    }
    
    if (isValidMove(piece.shape, newX, newY)) {
        piece.x = newX;
        piece.y = newY;
    } else if (direction === 'down') {
        placePiece();
        clearLines();
        tetrisGame.currentPiece = createTetrisPiece();
        
        if (!isValidMove(tetrisGame.currentPiece.shape, tetrisGame.currentPiece.x, tetrisGame.currentPiece.y)) {
            gameOver();
        }
    }
}

function rotateTetrisPiece() {
    if (!tetrisGame || !tetrisGame.currentPiece) return;
    
    const piece = tetrisGame.currentPiece;
    const rotatedShape = rotateMatrix(piece.shape);
    
    if (isValidMove(rotatedShape, piece.x, piece.y)) {
        piece.shape = rotatedShape;
    }
}

function isValidMove(shape, x, y) {
    if (!tetrisGame) return false;
    
    for (let py = 0; py < shape.length; py++) {
        for (let px = 0; px < shape[py].length; px++) {
            if (shape[py][px] !== 0) {
                const newX = x + px;
                const newY = y + py;
                
                // Check boundaries
                if (newX < 0 || newX >= tetrisGame.boardWidth || newY >= tetrisGame.boardHeight) {
                    return false;
                }
                
                // Check collision with placed blocks
                if (newY >= 0 && tetrisGame.board[newY] && tetrisGame.board[newY][newX] !== 0) {
                    return false;
                }
            }
        }
    }
    
    return true;
}

function placePiece() {
    if (!tetrisGame || !tetrisGame.currentPiece) return;
    
    const piece = tetrisGame.currentPiece;
    
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;
                if (boardY >= 0 && boardY < tetrisGame.board.length && boardX >= 0 && boardX < 10) {
                    tetrisGame.board[boardY][boardX] = value;
                }
            }
        });
    });
}

function clearLines() {
    if (!tetrisGame) return;
    
    let linesCleared = 0;
    
    for (let y = tetrisGame.board.length - 1; y >= 0; y--) {
        if (tetrisGame.board[y].every(cell => cell !== 0)) {
            tetrisGame.board.splice(y, 1);
            tetrisGame.board.unshift(new Array(tetrisGame.boardWidth).fill(0));
            linesCleared++;
            y++; // Check the same line again
        }
    }
    
    if (linesCleared > 0) {
        gameLines += linesCleared;
        
        // Scoring system
        const lineScores = [0, 40, 100, 300, 1200];
        gameScore += (lineScores[linesCleared] || 0) * gameLevel;
        
        // Level progression
        gameLevel = Math.floor(gameLines / 10) + 1;
        tetrisGame.dropInterval = Math.max(50, 1000 - (gameLevel - 1) * 50);
        
        updateTetrisStats();
    }
}

function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];
    
    for (let i = 0; i < cols; i++) {
        rotated[i] = [];
        for (let j = 0; j < rows; j++) {
            rotated[i][j] = matrix[rows - 1 - j][i];
        }
    }
    
    return rotated;
}

function updateTetrisStats() {
    const scoreEl = document.getElementById('score');
    const levelEl = document.getElementById('level');
    const linesEl = document.getElementById('lines');
    
    if (scoreEl) scoreEl.textContent = gameScore;
    if (levelEl) levelEl.textContent = gameLevel;
    if (linesEl) linesEl.textContent = gameLines;
}

function gameOver() {
    if (tetrisGame) {
        tetrisGame.gameRunning = false;
    }
    
    const modal = document.getElementById('game-over-modal');
    if (modal) {
        // Menghapus transparansi dan mengaktifkan interaksi klik
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
    }
}

function resetTetrisGame() {
    if (tetrisGame) {
        tetrisGame.board = createEmptyBoard(tetrisGame.boardWidth, tetrisGame.boardHeight);
        tetrisGame.currentPiece = null;
        tetrisGame.gameRunning = false;
        gameScore = 0;
        gameLevel = 1;
        gameLines = 0;
        updateTetrisStats();
        drawTetrisBoard();
    }
}

// Add window resize handler for responsive canvas
window.addEventListener('resize', function() {
    if (currentScreen === 'tetris' && tetrisGame) {
        // Reinitialize with new dimensions
        setTimeout(() => {
            initializeTetris();
        }, 100);
    }
});

// Event Listeners
function addEventListeners() {
    // Menu buttons
    const menuButtons = document.querySelectorAll('.menu-btn');
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                showScreen(page);
            }
        });
    });
    
    // Back buttons
    const backButtons = document.querySelectorAll('.back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                showScreen(page);
            }
        });
    });
    
    // Start button
    const startBtn = document.querySelector('.start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            if (currentScreen === 'main') {
                showScreen('message');
            }
        });
    }
    
    // Continue buttons
    const continueButtons = document.querySelectorAll('.continue-btn');
    continueButtons.forEach(button => {
        button.addEventListener('click', function() {
            handleContinueNavigation();
        });
    });
    
    // Skip button
    const skipBtn = document.querySelector('.skip-btn');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            skipTypewriter();
        });
    }
    
    // Modal buttons
    const confirmBtn = document.getElementById('confirm-btn');
    const okBtn = document.getElementById('ok-btn');
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            document.getElementById('game-over-modal').classList.remove('active');
            document.getElementById('final-message-modal').classList.add('active');
        });
    }
    
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            document.getElementById('final-message-modal').classList.remove('active');
            showScreen('main');
            resetTetrisGame();
        });
    }
    
    // Keyboard controls
    document.addEventListener('keydown', function(event) {
        if (currentScreen === 'tetris' && tetrisGame && tetrisGame.gameRunning) {
            switch(event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    moveTetrisPiece('left');
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    moveTetrisPiece('right');
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    moveTetrisPiece('down');
                    break;
                case 'ArrowUp':
                case ' ':
                    event.preventDefault();
                    rotateTetrisPiece();
                    break;
            }
        }
    });
}

function addTetrisListeners() {
    const leftBtn = document.getElementById('left-btn');
    const rightBtn = document.getElementById('right-btn');
    const rotateBtn = document.getElementById('rotate-btn');
    
    if (leftBtn) {
        leftBtn.addEventListener('click', function() {
            moveTetrisPiece('left');
        });
    }
    
    if (rightBtn) {
        rightBtn.addEventListener('click', function() {
            moveTetrisPiece('right');
        });
    }
    
    if (rotateBtn) {
        rotateBtn.addEventListener('click', function() {
            rotateTetrisPiece();
        });
    }
}

function skipTo(target) {
    const mainCard = document.getElementById('mainCard');
    const camera = document.getElementById('cameraSection');
    const newPage = document.getElementById('newPage');
    const galleryWrapper = document.getElementById('galleryWrapper');
    const musicPage = document.getElementById('musicPage');
    const tetrisPage = document.getElementById('tetrisPage'); // ID halaman tetris anda

    // Sembunyikan semua elemen awal
    mainCard.style.display = 'none';
    camera.style.display = 'none';
    
    // Tampilkan container utama
    newPage.style.display = 'block';
    setTimeout(() => newPage.style.opacity = '1', 50);
    document.body.style.overflowY = 'auto';

    // Reset visibility semua sub-halaman
    galleryWrapper.classList.add('hidden');
    musicPage.classList.add('hidden');
    if(tetrisPage) tetrisPage.classList.add('hidden');

    // Aktifkan halaman yang dipilih
    if (target === 'gallery') {
        galleryWrapper.classList.remove('hidden');
        renderPolaroids();
    } else if (target === 'music') {
        musicPage.classList.remove('hidden');
        musicPage.style.opacity = '1';
        initializeMusicPlayer();
    } else if (target === 'tetris' && tetrisPage) {
        tetrisPage.classList.remove('hidden');
        tetrisPage.style.opacity = '1';
        initializeTetris(); // Inisialisasi game tetris anda
        startTetrisGame();
    }
}

function confirmGameOver() {
    const gameOverModal = document.getElementById('game-over-modal');
    const finalModal = document.getElementById('final-message-modal');

    // Sembunyikan modal game over
    gameOverModal.classList.add('opacity-0', 'pointer-events-none');
    
    // Tampilkan modal pesan cinta terakhir (Inget Ya!)
    if (finalModal) {
        finalModal.classList.remove('hidden');
        setTimeout(() => {
            finalModal.classList.add('opacity-100');
        }, 10);
    }
}