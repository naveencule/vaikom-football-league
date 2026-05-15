const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ2FuQ_g8uV1v2-HTiBht4hlrUDrNaeFRPKe0eL-0nU-pgXq9Wj8rvHSBuuOIj3jVkKg69TC_KYoYby/pub?output=csv';

async function loadGallery() {
    try {
        const response = await fetch(CSV_URL);
        const csv = await response.text();
        const rows = csv.split('\n').slice(1).filter(r => r.trim());
        const container = document.getElementById('player-container');
        container.innerHTML = '';

        rows.forEach(row => {
            const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!cols || cols.length < 5) return;

            const name = cols[1].replace(/"/g, '');
            const ageInfo = cols[2].replace(/"/g, '');
            
            // This mirrors your AppSheet SUBSTITUTE logic
            const fixDriveLink = (url) => {
                if (!url) return 'https://placehold.co/400x400?text=No+Image';
                let cleanUrl = url.replace(/"/g, '').trim();
                
                // Convert 'open' or 'file/d/' links into direct thumbnails
                return cleanUrl
                    .replace("open?id=", "thumbnail?id=")
                    .replace(/\/file\/d\/(.+?)\/(view|edit).*/, "thumbnail?id=$1")
                    .replace(/\/file\/d\/(.+?)\/.*/, "thumbnail?id=$1");
            };

            const playerPhoto = fixDriveLink(cols[3]); // Column for Player Photo
            const idProof = fixDriveLink(cols[4]);    // Column for Aadhaar/ID Proof

            container.innerHTML += `
                <div class="swiper-slide px-4">
                    <div class="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col h-full max-h-[750px]">
                        <div class="h-1/2 relative bg-black">
                            <img src="${playerPhoto}" class="w-full h-full object-cover">
                            <div class="absolute bottom-6 left-6">
                                <h2 class="text-3xl font-black text-white">${name}</h2>
                                <p class="text-zinc-400 text-xs uppercase tracking-widest">${ageInfo}</p>
                            </div>
                        </div>
                        <div class="p-8 space-y-4">
                            <p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Government ID Proof</p>
                            <div class="w-full aspect-video bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-700">
                                <img src="${idProof}" class="w-full h-full object-contain p-2">
                            </div>
                            <a href="${idProof.replace('thumbnail', 'open')}" target="_blank" class="block w-full py-3 bg-zinc-800 text-center rounded-xl text-[10px] font-bold uppercase tracking-widest border border-zinc-700">
                                View Original ID ↗
                            </a>
                        </div>
                    </div>
                </div>`;
        });

        // Initialize Swiper
        new Swiper(".mySwiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            navigation: { nextEl: ".swiper-next", prevEl: ".swiper-prev" },
        });

    } catch (e) {
        console.error("Sync Error:", e);
    }
}
loadGallery();