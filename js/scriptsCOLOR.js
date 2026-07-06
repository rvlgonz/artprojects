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

document.addEventListener("DOMContentLoaded", function () {

    // TRACKS
    const tracks = [
        { title: "Chicago, 2026 (1)", src: "assets/calls/Telephone007_mp3.mp3" },
        { title: "Chicago, 2026 (2)", src: "assets/audio/Telephone010_mp3.mp3" },
        { title: "Chicago, 2026 (3)", src: "assets/audio/Telephone011_mp3.mp3" },
        { title: "Chicago, 2026 (4)", src: "assets/audio/Telephone018_mp3.mp3" },
        { title: "Chicago, 2026 (5)", src: "assets/audio/Telephone023_mp3.mp3" },
        { title: "Chicago, 2026 (6)", src: "assets/audio/Telephone027_mp3.mp3" },
        { title: "Chicago, 2026 (7)", src: "assets/audio/Telephone031_mp3.mp3" },
        { title: "Chicago, 2026 (8)", src: "assets/audio/Telephone032_mp3.mp3" },
        { title: "Chicago, 2026 (9)", src: "assets/audio/Telephone033_mp3.mp3" },
        { title: "Chicago, 2026 (10)", src: "assets/audio/Telephone035_mp3.mp3" },
    ];

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

    player.addEventListener("ended", () => {
        nextBtn.click();
    });

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

    // DUMMY SUBMISSIONS — replace with real API data later
    const priorSubmissions = [
        { track: "Chicago, 2026 (1)", color: "#c94a2b" },
        { track: "Chicago, 2026 (1)", color: "#3a7bd5" },
        { track: "Chicago, 2026 (1)", color: "#f0c27f" },
        { track: "Chicago, 2026 (1)", color: "#a4814c" },
        { track: "Chicago, 2026 (1)", color: "#3d917b" },
        { track: "Chicago, 2026 (1)", color: "#952758" },
        { track: "Chicago, 2026 (1)", color: "#54452e" },
        { track: "Chicago, 2026 (1)", color: "#73b67a" },
        { track: "Chicago, 2026 (1)", color: "#b356a2" },
        { track: "Chicago, 2026 (1)", color: "#fb9c30" },
        { track: "Chicago, 2026 (2)", color: "#2ecc71" },
        { track: "Chicago, 2026 (3)", color: "#9b59b6" },
    ];

    colorPicker.on("color:change", function(color) {
        if (hexDisplay) hexDisplay.textContent = color.hexString;
        pickerView.style.backgroundColor = color.hexString;
        pickerView.style.transition = "background-color 0.2s ease";
        if (submitConfirm) submitConfirm.style.display = "none";
    });

function showContactSheet(submittedColor, trackTitle) {
    // Get all previous submissions for this track
    const relevant = priorSubmissions.filter(s => s.track === trackTitle);

    // Add the current submission
    relevant.push({
        track: trackTitle,
        color: submittedColor
    });

    // Switch views before measuring
    pickerView.style.display = "none";
    contactSheetView.style.display = "block";
    contactSheetView.style.backgroundColor = "#f8f9fa";

    // Clear previous tiles
    contactSheetGrid.innerHTML = "";

    // Force grid layout
    contactSheetGrid.style.display = "grid";
    contactSheetGrid.style.gap = "2px";

    // Wait one frame so the browser lays out the grid
            requestAnimationFrame(() => {

            const n = relevant.length;

            // Find a roughly square arrangement
            const cols = Math.ceil(Math.sqrt(n));
            const rows = Math.ceil(n / cols);

            contactSheetGrid.style.gridTemplateColumns =
                `repeat(${cols}, 1fr)`;

            contactSheetGrid.style.gridTemplateRows =
                `repeat(${rows}, 1fr)`;

            relevant.forEach(sub => {
                const tile = document.createElement("div");
                tile.style.backgroundColor = sub.color;
                contactSheetGrid.appendChild(tile);
            });

        });
}

    // SINGLE submit handler
    submitColorBtn.addEventListener("click", function() {
        const currentTrack = tracks[playOrder[currentIndex]];
        const chosenColor = colorPicker.color.hexString;

        console.log("track:", currentTrack.title, "color:", chosenColor);

        submitColorBtn.addEventListener("click", async function() {
            const currentTrack = tracks[playOrder[currentIndex]];
            const chosenColor = colorPicker.color.hexString;

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