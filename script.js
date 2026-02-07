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

    // Inject HTML sesuai desain playlist yang Anda minta
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
                <button class="playlist-btn active" data-playlist="1">Mix 1</button>
                <button class="playlist-btn" data-playlist="2">Mix 2</button>
                <button class="playlist-btn" data-playlist="3">Mix 3</button>
            </div>
            <div class="music-info text-sm uppercase font-bold tracking-widest text-gray-600">
                <div class="current-playlist text-blue-main mb-1">Now Playing: ...</div>
                <div class="playlist-description italic">Memuat lagu...</div>
            </div>
        </div>
    `;

    // Pasang listener tombol
    const playlistBtns = document.querySelectorAll('.playlist-btn');
    playlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            playlistBtns.forEach(b => b.classList.remove('active', 'bg-blue-main', 'text-white'));
            this.classList.add('active', 'bg-blue-main', 'text-white');
            loadSpotifyPlaylist(this.getAttribute('data-playlist'));
        });
    });

    // Load default
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