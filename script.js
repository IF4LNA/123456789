// 1. KONFIGURASI FOTO & PLAYLIST
// Ganti URL 'src' dengan link foto asli Hafizha
const myPhotos = [
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80', caption: 'Your Beautiful Smile' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80', caption: 'Special Moments' },
    { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80', caption: 'Forever Happy' }
];

// Ganti link ini dengan link 'Embed' dari playlist Spotify yang sudah Anda buat
const spotifyEmbedLink = "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator";

// 2. ANIMASI SOBEK TIKET
function tearAction() {
    const bottom = document.getElementById('bottomPart');
    const mainCard = document.getElementById('mainCard');
    const camera = document.getElementById('cameraSection');

    // Menambah efek getar sebelum sobek
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

// 3. ANIMASI KLIK KAMERA
async function takePhoto() {
    const shutter = document.getElementById('shutter');
    const camera = document.getElementById('cameraSection');
    const newPage = document.getElementById('newPage');

    // Efek Flash Putih
    shutter.classList.add('flash-active');
    
    setTimeout(() => {
        shutter.classList.remove('flash-active');
        camera.style.opacity = '0';
        
        setTimeout(() => {
            camera.style.display = 'none';
            // Izinkan scroll agar bisa melihat galeri ke bawah
            document.body.style.overflowY = 'auto'; 
            newPage.style.display = 'block';
            setTimeout(() => {
                newPage.style.opacity = '1';
                renderPolaroids();
            }, 100);
        }, 500);
    }, 400);
}

// 4. RENDER POLAROID (MUNCUL SATU PER SATU)
async function renderPolaroids() {
    const gallery = document.getElementById('polaroidGallery');
    const surprise = document.getElementById('surpriseContainer');

    for (let i = 0; i < myPhotos.length; i++) {
        const p = myPhotos[i];
        const rotate = Math.random() * 10 - 5; // Rotasi acak agar terlihat natural
        
        const pol = document.createElement('div');
        pol.className = 'polaroid-frame';
        pol.style.setProperty('--rotate-deg', `${rotate}deg`);
        pol.innerHTML = `
            <div class="polaroid-content">
                <img src="${p.src}" class="w-full h-full object-cover">
            </div>
            <p class="cursive text-xl mt-4 text-center text-gray-700">${p.caption}</p>
        `;
        
        gallery.appendChild(pol);
        
        // Delay kecil agar animasi CSS 'printed' berjalan
        await new Promise(r => setTimeout(r, 400));
        pol.classList.add('printed');
        
        // Jeda waktu sebelum foto berikutnya muncul
        await new Promise(r => setTimeout(r, 1000));
    }

    // Munculkan tombol surprise setelah foto terakhir selesai dicetak
    setTimeout(() => {
        surprise.classList.remove('opacity-0');
        surprise.style.opacity = '1';
        surprise.style.pointerEvents = 'auto';
    }, 500);
}

// 5. HANDLE SURPRISE CLICK (KONFETI & MUSIK)
function handleSurpriseClick() {
    // Jalankan efek Konfeti
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    const musicContainer = document.getElementById('musicContainer');
    const spotifyPlayer = document.getElementById('spotify-player');

    // Memasukkan link Spotify hanya saat tombol diklik (Lazy Load)
    if (!spotifyPlayer.src) {
        spotifyPlayer.src = spotifyEmbedLink;
    }

    // Menampilkan Container Musik dengan animasi
    musicContainer.classList.remove('hidden');
    setTimeout(() => {
        musicContainer.classList.remove('opacity-0');
        musicContainer.style.opacity = '1';
        
        // Scroll otomatis ke bawah agar player Spotify terlihat
        musicContainer.scrollIntoView({ behavior: 'smooth' });
    }, 100);
}