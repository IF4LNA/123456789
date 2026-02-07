// Konfigurasi Foto - Ganti URL di sini
const myPhotos = [
    { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80', caption: 'Your Beautiful Smile' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80', caption: 'Special Moments' },
    { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80', caption: 'Forever Happy' }
];

// 1. Animasi Sobek Tiket
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

// 2. Animasi Klik Kamera
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
            document.body.style.overflowY = 'auto'; // Mengizinkan scroll di halaman 2
            newPage.style.display = 'block';
            setTimeout(() => {
                newPage.style.opacity = '1';
                renderPolaroids();
            }, 100);
        }, 500);
    }, 400);
}

// 3. Render Polaroid satu per satu
async function renderPolaroids() {
    const gallery = document.getElementById('polaroidGallery');
    const surprise = document.getElementById('surpriseContainer');

    for (let i = 0; i < myPhotos.length; i++) {
        const p = myPhotos[i];
        const rotate = Math.random() * 10 - 5; // Rotasi acak -5 s/d 5 deg
        
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
        
        // Animasi cetak
        await new Promise(r => setTimeout(r, 400));
        pol.classList.add('printed');
        
        // Tunggu sebelum foto berikutnya
        await new Promise(r => setTimeout(r, 1000));
    }

    // Munculkan tombol surprise setelah semua foto selesai
    setTimeout(() => {
        surprise.classList.remove('opacity-0');
        surprise.style.opacity = '1';
        surprise.style.pointerEvents = 'auto';
    }, 500);
}

// 4. Efek Konfeti
function launchConfetti() {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });
}

