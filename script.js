document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Global ---
    const allScreens = document.querySelectorAll('.app-screen');
    const backButtons = document.querySelectorAll('.back-button');

    // --- Layar dan Ikon ---
    const lockScreen = document.getElementById('lock-screen');
    const homeScreen = document.getElementById('home-screen');
    const messagesApp = document.getElementById('messages-app');
    const musicApp = document.getElementById('music-app');
    const galleryApp = document.getElementById('gallery-app');
    
    const messagesAppIcon = document.getElementById('messages-app-icon');
    const musicAppIcon = document.getElementById('music-app-icon');
    const galleryAppIcon = document.getElementById('gallery-app-icon');

    // --- Fungsi Navigasi ---
    function showScreen(screenToShow) {
        allScreens.forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    // --- 1. Lock Screen Logic ---
    const statusBarTime = document.getElementById('status-bar-time');
    const lockScreenTime = document.getElementById('lock-screen-time');
    const lockScreenDate = document.getElementById('lock-screen-date');

    function updateTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;

        const options = { weekday: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-US', options);

        statusBarTime.textContent = timeString;
        lockScreenTime.textContent = timeString;
        lockScreenDate.textContent = dateString;
    }
    setInterval(updateTime, 1000);
    updateTime();

    // Unlock
    lockScreen.addEventListener('click', () => showScreen(homeScreen));

    // --- 2. Home Screen Logic (Navigasi Aplikasi) ---
    messagesAppIcon.addEventListener('click', () => {
        showScreen(messagesApp);
        // Memulai efek mengetik saat aplikasi pesan dibuka
        typeGreeting(); 
    });
    musicAppIcon.addEventListener('click', () => showScreen(musicApp));
    galleryAppIcon.addEventListener('click', () => showScreen(galleryApp));

    // Tombol kembali untuk semua aplikasi
    backButtons.forEach(button => {
        button.addEventListener('click', () => showScreen(homeScreen));
    });

    // --- 3. Messages App (Typing Effect) ---
    const greetingText = "yeeeee udah SE nihhh wkwkk selamat yaa hafizhaaaaaa  Akhirnya kamu sampai juga di garis finis setelah semua perjuangan panjang itu.Sekarang udah resmi jadi Sarjana Ekonomi jangan lupa buka aplikasi Musik dan Galeri ya!";
    const messageElement = document.getElementById('greeting-message');
    let charIndex = 0;
    let typingInterval;

    function typeWriter() {
        if (charIndex < greetingText.length) {
            messageElement.innerHTML += greetingText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            messageElement.style.borderRight = 'none'; // Hapus kursor setelah selesai
        }
    }

    // Fungsi untuk memulai/mereset typing effect
    function typeGreeting() {
        messageElement.innerHTML = ''; // Kosongkan pesan
        charIndex = 0; // Reset index
        clearInterval(typingInterval); // Hentikan interval sebelumnya jika ada
        typingInterval = setInterval(typeWriter, 50); // Kecepatan mengetik (ms)
    }

    // --- 4. Music App Logic ---
    const audioPlayer = document.getElementById('audio-player');
    const playPauseBtn = document.getElementById('play-pause-btn');

    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseBtn.classList.remove('fa-play');
            playPauseBtn.classList.add('fa-pause');
        } else {
            audioPlayer.pause();
            playPauseBtn.classList.remove('fa-pause');
            playPauseBtn.classList.add('fa-play');
        }
    });

    // --- 5. Gallery App Logic (Lightbox) ---
    const galleryItems = document.querySelectorAll('.gallery-item[src$=".jpg"]'); // Hanya untuk gambar
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            lightbox.style.display = 'flex';
            lightboxImg.src = item.src;
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
    
    // Tutup lightbox jika klik di luar gambar
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});