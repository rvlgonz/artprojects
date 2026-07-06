/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
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

window.addEventListener('DOMContentLoaded', event => {
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
});

document.addEventListener("DOMContentLoaded", async function () {

    // TRACKS
let tracks = [];
    try {
        const response = await fetch("/.netlify/functions/get-tracks");
        const data = await response.json();
        tracks = data.tracks;
    } catch (err) {
        console.error("Failed to load tracks, using fallback:", err);
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

    if (tracks.length === 0) {
        console.error("No tracks loaded");
        return;
    }

    let playOrder = tracks.map((_, i) => i);
    let currentIndex = 0;

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
        const track = tracks[playOrder[currentIndex]];
        source.src = track.src;
        player.load();
        nowPlaying.textContent = track.title;
        renderPlaylist();
    }

    shuffleBtn.addEventListener("click", () => {
        playOrder = shuffleArray(playOrder);
        currentIndex = 0;
        loadCurrent();
        player.play();
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + playOrder.length) % playOrder.length;
        loadCurrent();
        player.play();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % playOrder.length;
        loadCurrent();
        player.play();
    });

    // player.addEventListener("ended", () => {
    //     nextBtn.click();
    // });

    loadCurrent();

    // COLOR PICKER
    const colorPicker = new iro.ColorPicker("#color-picker-container", {
        width: 270,
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

    const hexDisplay = document.getElementById("hex-display");
    const submitColorBtn = document.getElementById("submitColorBtn");
    const submitConfirm = document.getElementById("submitConfirm");
    const pickerView = document.getElementById("aboutColor");
    const contactSheetView = document.getElementById("contactSheetView");
    const contactSheetGrid = document.getElementById("contactSheetGrid");
    const nextTrackBtn = document.getElementById("nextTrackBtn");




    colorPicker.on("color:change", function(color) {
        if (hexDisplay) hexDisplay.textContent = color.hexString;
        pickerView.style.backgroundColor = color.hexString;
        pickerView.style.transition = "background-color 0.2s ease";
        if (submitConfirm) submitConfirm.style.display = "none";
    });

async function showContactSheet(submittedColor, trackTitle) {
    // fetch real submissions for this track from supabase
    let colors = [submittedColor];

    try {
        const response = await fetch("/.netlify/functions/get-colors?track=" + encodeURIComponent(trackTitle));
        const data = await response.json();
        if (data.colors) {
            colors = data.colors;
        }
    } catch (err) {
        console.error("Failed to fetch colors:", err);
        // falls back to just showing the submitted color
    }

    pickerView.style.display = "none";
    contactSheetView.style.display = "block";
    contactSheetGrid.innerHTML = "";
    contactSheetGrid.style.display = "grid";
    contactSheetGrid.style.gap = "2px";

    requestAnimationFrame(() => {
        const n = colors.length;
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        contactSheetGrid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        contactSheetGrid.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        colors.forEach(color => {
            const tile = document.createElement("div");
            tile.style.backgroundColor = color;
            contactSheetGrid.appendChild(tile);
        });
    });
}

    // SINGLE submit handler
    submitColorBtn.addEventListener("click", async function() {
    const currentTrack = tracks[playOrder[currentIndex]];
    const chosenColor = colorPicker.color.hexString;

    console.log("track:", currentTrack.title, "color:", chosenColor);

    try {
        await fetch("/.netlify/functions/submit-color", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ track: currentTrack.title, color: chosenColor })
        });
    } catch (err) {
        console.error("Color submission failed:", err);
    }

    showContactSheet(chosenColor, currentTrack.title);
});

    nextTrackBtn.addEventListener("click", function() {
        currentIndex = (currentIndex + 1) % playOrder.length;
        loadCurrent();
        pickerView.style.backgroundColor = "";
        pickerView.style.transition = "";
        contactSheetView.style.display = "none";
        pickerView.style.display = "";
    });

}); // end DOMContentLoaded