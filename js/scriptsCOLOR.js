/*!
* Start Bootstrap - Based on Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

history.scrollRestoration = "manual";

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});


window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});


    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });


document.addEventListener("DOMContentLoaded", async function () {

const audioFileInput = document.getElementById("audioFileInput");
const uploadAudioBtn = document.getElementById("uploadAudioBtn");
const uploadStatus = document.getElementById("uploadStatus");
const recordBtn = document.getElementById("recordBtn");
const stopBtn = document.getElementById("stopBtn");
const submitRecordingBtn = document.getElementById("submitRecordingBtn");
const recordingPreview = document.getElementById("recordingPreview");
const submitColorBtn = document.getElementById("submitColorBtn");

let mediaRecorder;
let audioChunks = [];
let recordedBlob = null;

// helper to show status
function showStatus(msg) {
    if (uploadStatus) {
        uploadStatus.textContent = msg;
        uploadStatus.style.display = "block";
    }
}


// FILE UPLOAD HANDLER
if (uploadAudioBtn) {
    uploadAudioBtn.addEventListener("click", async function() {

        if (!audioFileInput || !audioFileInput.files[0]) {
            showStatus("Please select a file first.");
            return;
        }

        const file = audioFileInput.files[0];
        showStatus("uploading...");

        try {
            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const response = await fetch("/.netlify/functions/submit-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fileName: file.name,
                    fileData: base64,
                    contentType: file.type
                })
            });

            const data = await response.json();

            if (data.success) {
                showStatus("received. thank you.");
                audioFileInput.value = "";
            } else {
                showStatus("something went wrong. try again.");
                console.error("Upload error:", data.error);
            }
        } catch (err) {
            showStatus("something went wrong. try again.");
            console.error("Upload failed:", err);
        }
    });
}

function getSupportedMimeType() {
    const types = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }
    return '';
}

// RECORDING HANDLER
if (recordBtn) {
    recordBtn.addEventListener("click", async function() {
        if (typeof MediaRecorder === 'undefined') {
            showStatus("recording not supported in this browser. please upload a file instead.");
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mimeType = getSupportedMimeType();

            mediaRecorder = new MediaRecorder(stream, { mimeType });
            audioChunks = [];
            recordedBlob = null;
            recordingPreview.style.display = "none";
            submitRecordingBtn.style.display = "none";

            mediaRecorder.addEventListener("dataavailable", e => {
                audioChunks.push(e.data);
            });

            mediaRecorder.addEventListener("stop", () => {
                // reuse mimeType from outer scope, don't redeclare
                recordedBlob = new Blob(audioChunks, { type: mimeType });

                const url = URL.createObjectURL(recordedBlob);
                if (recordingPreview) {
                    recordingPreview.src = url;
                    recordingPreview.style.display = "block";
                }
                submitRecordingBtn.style.display = "inline-block";
                stream.getTracks().forEach(track => track.stop());
                uploadStatus.innerHTML = "Recording ready.<br>Press 'submit recording' to upload or 'record directly' to re-record.";
                uploadStatus.style.display = "block";
            });

            mediaRecorder.start();
            recordBtn.style.display = "none";
            stopBtn.style.display = "block";
            showStatus("recording...");

        } catch (err) {
            console.error("Microphone error:", err);
            showStatus("microphone access denied.");
        }
    });}

    if (stopBtn) {
    stopBtn.addEventListener("click", function() {
        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }

        stopBtn.style.display = "none";

        if (recordBtn) {
            recordBtn.style.display = "block";
        }
    });
}

// SUBMIT RECORDING HANDLER
if (submitRecordingBtn) {
    submitRecordingBtn.addEventListener("click", async function() {
        if (!recordedBlob) {
            showStatus("no recording found.");
            return;
        }

        showStatus("uploading...");

        try {
            const mimeType = getSupportedMimeType();
            const ext = mimeType.includes("mp4") ? ".m4a" : mimeType.includes("ogg") ? ".ogg" : ".webm";
            const fileName = `recording-${Date.now()}${ext}`;
            const contentType = mimeType;

            const base64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result.split(",")[1]);
                reader.onerror = reject;
                reader.readAsDataURL(recordedBlob);
            });

            const response = await fetch("/.netlify/functions/submit-audio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fileName, fileData: base64, contentType })
            });

            const data = await response.json();

            if (data.success) {
                showStatus("received. thank you.");
                recordedBlob = null;
                if (recordingPreview) {
                    recordingPreview.style.display = "none";
                }

                if (submitRecordingBtn) {
                    submitRecordingBtn.style.display = "none";
                }
            } else {
                showStatus("something went wrong. try again.");
                console.error("Recording upload error:", data.error);
            }
        } catch (err) {
            showStatus("something went wrong. try again.");
            console.error("Recording upload failed:", err);
        }
    });
}

    // TRACKS
let tracks = [];

const needsTracks =
    document.getElementById("messagePlayer") ||
    document.getElementById("trackCarousel") ||
    document.getElementById("submitColorBtn");
    console.log("needsTracks:", needsTracks);

if (needsTracks) {

    try {
        const response = await fetch("/.netlify/functions/get-tracks");

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        tracks = data.tracks;

    } catch (err) {

        console.error("Failed to load tracks:", err);

        tracks = [
            { title: "Chicago, 2026 (1)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone007_mp3.mp3" },
            { title: "Chicago, 2026 (2)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone010_mp3.mp3" },
            { title: "Chicago, 2026 (3)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone011_mp3.mp3" },
            { title: "Chicago, 2026 (4)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone018_mp3.mp3" },
            { title: "Chicago, 2026 (5)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone023_mp3.mp3" },
            { title: "Chicago, 2026 (6)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone027_mp3.mp3" },
            { title: "Chicago, 2026 (7)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone031_mp3.mp3" },
            { title: "Chicago, 2026 (8)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone032_mp3.mp3" },
            { title: "Chicago, 2026 (9)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone033_mp3.mp3" },
            { title: "Chicago, 2026 (10)", src: "https://zzuyrrnscxkzejkfqkxc.supabase.co/storage/v1/object/public/calls/Telephone035_mp3.mp3" },
        ];
    }

if (!tracks || tracks.length === 0) {
    console.error("No tracks loaded");
    return;
}

}

    let playOrder = tracks.map((_, i) => i);
    let currentIndex = Math.floor(Math.random() * tracks.length);

    const savedIndex = sessionStorage.getItem("startIndex");
    const savedOrder = sessionStorage.getItem("playOrder");
    if (savedIndex && savedOrder) {
        currentIndex = parseInt(savedIndex);
        playOrder = JSON.parse(savedOrder);
        sessionStorage.removeItem("startIndex");
        sessionStorage.removeItem("playOrder");
    }

    // PLAYER ELEMENTS
    const player = document.getElementById("messagePlayer");
    const source = document.getElementById("messageSource");
    const nowPlaying = document.getElementById("nowPlaying");
    const playlistEl = document.getElementById("playlist");
    const shuffleBtn = document.getElementById("shuffleBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function shuffleArray(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    function renderPlaylist() {
        if (!playlistEl) return;
        playlistEl.innerHTML = "";
        playOrder.forEach((trackIndex, orderIndex) => {
            const track = tracks[trackIndex];
            const li = document.createElement("li");
            li.className = "list-group-item list-group-item-action";
            li.style.cursor = "pointer";
            li.textContent = track.title;
            if (orderIndex === currentIndex) {
                li.classList.add("active");
            }
            li.addEventListener("click", () => {
                currentIndex = orderIndex;
                loadCurrent();
                player.play();
            });
            playlistEl.appendChild(li);
        });
    }

    function loadCurrent() {

    if (!player || !source || !nowPlaying) {
        return;
    }

    const track = tracks[playOrder[currentIndex]];

    source.src = track.src;
    player.load();
    nowPlaying.textContent = track.title;

    renderPlaylist();
}

if (shuffleBtn) {
    shuffleBtn.addEventListener("click", () => {
        playOrder = shuffleArray(playOrder);
        currentIndex = 0;
        loadCurrent();
        player.play();
    });
}

if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + playOrder.length) % playOrder.length;
        loadCurrent();
        player.play();
    });
}

    if (nextBtn){    
    nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % playOrder.length;
            loadCurrent();
            player.play();
        })};

    if (player && source && nowPlaying) {
    loadCurrent();
}

    // COLOR PICKER
let colorPicker = null;

if (document.getElementById("color-picker-container")) {
    colorPicker = new iro.ColorPicker("#color-picker-container", {
        color: "#ffffff",
        borderWidth: 2,
        borderColor: "#989898",
        layout: [
            { component: iro.ui.Wheel },
            {
                component: iro.ui.Slider,
                options: { sliderType: "value" }
            }
        ]
    });
}


function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    const toHex = v => Math.round((v + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getLuminance(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const [rs, gs, bs] = [r, g, b].map(c =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(hex1, hex2) {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function getAccessibleComplement(bgHex) {
    const { h, s } = hexToHSL(bgHex);
    const complementHue = (h + 180) % 360;

    // try a range of lightness values, keep the one closest to
    // "natural" mid-lightness that still passes WCAG AA (4.5:1)
    let best = null;
    for (let l = 5; l <= 95; l += 5) {
        const candidate = hslToHex(complementHue, Math.max(s, 40), l);
        const ratio = contrastRatio(candidate, bgHex);
        if (ratio >= 4.5) {
            if (!best || Math.abs(l - 50) < Math.abs(best.l - 50)) {
                best = { hex: candidate, l };
            }
        }
    }
    // fallback to black/white if nothing in the hue passes (rare)
    return best ? best.hex : (getLuminance(bgHex) > 0.5 ? "#212529" : "#f8f9fa");
}

const hexDisplay = document.getElementById("hex-display");
const pickerView = document.getElementById("aboutColor");

if (colorPicker) {
    colorPicker.on("color:change", function(color) {
        if (hexDisplay) {
            hexDisplay.textContent = color.hexString;
        }

        if (pickerView) {
            pickerView.style.backgroundColor = color.hexString;
            pickerView.style.transition = "background-color 0.2s ease";

            const textColor = getAccessibleComplement(color.hexString);
            pickerView.style.color = textColor;

                        document.querySelectorAll(".dynamic-text").forEach(el => {
                el.style.color = textColor;
            });
        }
    });
}

if (submitColorBtn && colorPicker) {
    submitColorBtn.addEventListener("click", async function() {
        const currentTrack = tracks[playOrder[currentIndex]];
        const chosenColor = colorPicker.color.hexString;

        sessionStorage.setItem("submittedColor", chosenColor);
        sessionStorage.setItem("trackTitle", currentTrack.title);
        sessionStorage.setItem("nextIndex", (currentIndex + 1) % playOrder.length);
        sessionStorage.setItem("playOrder", JSON.stringify(playOrder));

        fetch("/.netlify/functions/submit-color", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                track: currentTrack.title,
                color: chosenColor
            })
        });

        window.location.href = "colorcluster.html";
    });
}



});
