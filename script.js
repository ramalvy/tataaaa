document.addEventListener('DOMContentLoaded', () => {

    // --- Elemen Global ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('aesthetic-menu-overlay');
    const closeMenuBtn = document.getElementById('close-menu-btn'); // Tombol close di overlay (opsional)
    const menuLinks = menuOverlay.querySelectorAll('.overlay-nav-aesthetic a');
    const body = document.body;
    const pageContainer = document.getElementById('page-container');
    const allPages = pageContainer ? pageContainer.querySelectorAll('.page-section') : [];
    let intersectionObserver; // Deklarasi Observer

    // --- Fungsi Helper Menu ---
    function openMenu() {
        if (menuOverlay) menuOverlay.classList.add('active');
        if (menuToggle) menuToggle.classList.add('active');
        body.classList.add('menu-open');
    }

    function closeMenu() {
        if (menuOverlay) menuOverlay.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // --- Setup Event Listener Menu ---
    if (menuToggle && menuOverlay) {
        // Klik tombol burger
        menuToggle.addEventListener('click', () => {
            body.classList.contains('menu-open') ? closeMenu() : openMenu();
        });

        // Klik tombol close 'X' di overlay (jika digunakan)
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', closeMenu);
        }

        // Klik di luar area link pada overlay
        menuOverlay.addEventListener('click', (event) => {
             if (event.target === menuOverlay) { // Pastikan klik di background overlay
                 closeMenu();
             }
        });

        // Tekan tombol Escape
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && body.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }

    // --- Setup Page Navigation ---
    if (menuLinks.length > 0 && allPages.length > 0 && pageContainer) {
        menuLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const targetId = link.getAttribute('data-target');
                if (!targetId) return; // Keluar jika tidak ada target

                let targetFound = false;
                allPages.forEach(page => {
                    if (('#' + page.id) === targetId) {
                        page.classList.add('active');
                        targetFound = true;
                        // Cek animasi untuk halaman baru
                        checkScrollAnimations(page);
                    } else {
                        page.classList.remove('active');
                        // Reset animasi di halaman non-aktif
                        page.querySelectorAll('.scroll-pixel-in').forEach(el => el.classList.remove('visible'));
                    }
                });

                if (targetFound) {
                    // Scroll ke atas setelah halaman diganti
                    window.scrollTo({ top: 0, behavior: 'auto' });
                }

                // Tutup menu overlay
                closeMenu();
            });
        });
    } else {
        console.warn("Page sections or menu links not found correctly.");
    }

    // --- Setup Scroll Animation ---
    function setupScrollObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Butuh 20% elemen terlihat
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Hanya animasi sekali
                }
            });
        };

        // Buat observer baru
        intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
    }

    // Fungsi untuk mengamati elemen pada container (halaman) yg aktif
    function checkScrollAnimations(container) {
        if (!intersectionObserver || !(container instanceof Element)) {
            // console.log("Observer not ready or container invalid", container);
            return;
        }

        // Cari elemen yg belum punya kelas 'visible' (indikasi belum dianimasikan)
        // dan punya kelas 'scroll-pixel-in'
        const elementsToObserve = container.querySelectorAll('.scroll-pixel-in:not(.visible)');

        // console.log(`Found ${elementsToObserve.length} elements to observe in #${container.id}`);

        elementsToObserve.forEach(el => {
            // Pastikan kelas visible dihapus jika ada logic unobserve/re-observe
             el.classList.remove('visible'); // Pastikan reset state
            intersectionObserver.observe(el);
        });
    }

    // --- Inisialisasi Saat DOM Siap ---
    setupScrollObserver(); // Siapkan observer

    // Temukan halaman awal yg aktif
    const initialActivePage = pageContainer ? pageContainer.querySelector('.page-section.active') : null;
    if (initialActivePage) {
        // console.log(`Initial active page: #${initialActivePage.id}`);
        // Langsung cek animasi untuk halaman yg sudah terlihat saat load
        checkScrollAnimations(initialActivePage);
    } else {
        // console.warn("No initial active page found.");
         // Jika tidak ada yg aktif, aktifkan yg pertama secara default?
         if(allPages.length > 0) {
            allPages[0].classList.add('active');
            checkScrollAnimations(allPages[0]);
         }
    }

}); // Akhir DOMContentLoaded