let subtitles = [];
let overlay = null;
let selectedVideo = null;

function parseSRT(data) {
    const regex = /(\d+)\r?\n(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\r?\n([\s\S]*?)(?=\r?\n\r?\n|\r?\n$|$)/g;
    let matches;
    const result = [];
    while ((matches = regex.exec(data)) !== null) {
        result.push({
            start: timeToSeconds(matches[2]), end: timeToSeconds(matches[3]),
                    text: matches[4].replace(/\r?\n/g, '<br>')
        });
    }
    return result;
}

function timeToSeconds(timeString) {
    const [h, m, s] = timeString.split(':');
    const [sec, ms] = s.split(',');
    return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(sec) + parseInt(ms) / 1000;
}

// SISTEM PELACAK VIDEO
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'FIND_VIDEOS') {
        const videos = document.querySelectorAll('video');
        if (videos.length === 0) return;

        videos.forEach((v) => {
            const rect = v.getBoundingClientRect();
            const highlight = document.createElement('div');
            highlight.className = "subcrack-highlight";
            highlight.style.cssText = `
            position: absolute; top: ${rect.top + window.scrollY}px; left: ${rect.left + window.scrollX}px;
            width: ${rect.width}px; height: ${rect.height}px;
            background: rgba(0, 255, 128, 0.4); z-index: 2147483647;
            display: flex; justify-content: center; align-items: center;
            cursor: pointer; border: 4px dashed #00ff80; box-sizing: border-box;
            `;

            highlight.innerHTML = `<div style="background:#121212; color:#00ff80; padding:15px; border:2px solid #fff; font-family:sans-serif; font-weight:bold; text-align:center;">CLICK TO INJECT SUBTITLE</div>`;
            document.body.appendChild(highlight);

            highlight.addEventListener('click', (e) => {
                e.preventDefault(); e.stopPropagation();
                selectedVideo = v;
                document.querySelectorAll('.subcrack-highlight').forEach(el => el.remove());
                triggerFilePicker();
            });
        });
    }
});

function triggerFilePicker() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.srt';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            subtitles = parseSRT(ev.target.result);
            createOverlay();
            attachSync();
        };
        reader.readAsText(file);
        fileInput.remove();
    });
    fileInput.click();
}

function createOverlay() {
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = "subcrack-overlay";

    overlay.style.cssText = `
    position: fixed;
    bottom: 12%;
    left: 50%;
    transform: translateX(-50%);

    /* LOGIKA AGAR MAKSIMAL 2 BARIS */
    width: 96%;            /* Gunakan hampir seluruh lebar video (96%) */
    max-width: none;       /* Hapus batas lebar agar bisa melar */
    word-wrap: break-word; /* Tetap biarkan turun jika super panjang */
    line-height: 1.2;      /* Jarak antar baris dirapatkan agar hemat tempat */

    background: transparent !important;
    color: #ffffff !important;
    padding: 0;
    font-size: 18px;       /* Tetap 18px sesuai permintaan sebelumnya */
    font-weight: 600;
    z-index: 2147483647;
    pointer-events: none;
    text-align: center;
    border: none;
    font-family: 'Arial', sans-serif;
    display: none;

    /* Shadow agar tetap terbaca di background terang */
    text-shadow: 2px 2px 4px rgba(0,0,0,1), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
    `;
    document.body.appendChild(overlay);
}

// LOGIKA FULLSCREEN FIX
document.addEventListener('fullscreenchange', () => {
    if (!overlay || !selectedVideo) return;

    if (document.fullscreenElement) {
        // Jika fullscreen, pindahkan overlay ke dalam elemen yang sedang fullscreen
        document.fullscreenElement.appendChild(overlay);
        overlay.style.position = "absolute"; // Berubah jadi absolute di dalam container fullscreen
    } else {
        // Jika kembali normal, kembalikan ke body
        document.body.appendChild(overlay);
        overlay.style.position = "fixed";
    }
});

function attachSync() {
    if (!selectedVideo) return;
    selectedVideo.addEventListener('timeupdate', () => {
        const now = selectedVideo.currentTime;
        const currentSub = subtitles.find(s => now >= s.start && now <= s.end);
        if (currentSub) {
            overlay.textContent = currentSub.text.replace(/<br>/g, '\n');
            overlay.style.whiteSpace = "pre-wrap";
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    });
}
