/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

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

document.addEventListener("DOMContentLoaded", function () {
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
        nowPlaying.textContent = "Now playing: " + track.title;
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

    // initial load (not shuffled until the button is pressed)
    loadCurrent();

    const colorPicker = new iro.ColorPicker("#color-picker-container", {
    width: 220,
    color: "#bd5d38",
    borderWidth: 1,
    borderColor: "#dee2e6",
    layout: [
        {
            component: iro.ui.Wheel,
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: "value"
            }
        }
    ]
});

//ADD FOR COLOR PICKER
//const hexDisplay = document.getElementById("hex-display");
//const colorSwatch = document.getElementById("color-swatch");
//const submitColorBtn = document.getElementById("submitColorBtn");
//const submitConfirm = document.getElementById("submitConfirm");

//colorPicker.on("color:change", function(color) {
    //hexDisplay.textContent = color.hexString;
    //colorSwatch.style.backgroundColor = color.hexString;
    //submitConfirm.style.display = "none";
//});

//submitColorBtn.addEventListener("click", function() {
    //const currentTrack = tracks[playOrder[currentIndex]];
    //const chosenColor = colorPicker.color.hexString;

    //console.log("track:", currentTrack.title, "color:", chosenColor);

    // placeholder for future backend submission:
    // fetch("/submit-color", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ track: currentTrack.title, color: chosenColor })
    // });

    //submitConfirm.style.display = "block";
//});
//END ADD FOR COLOR PICKER

});

//const colorPicker = new iro.ColorPicker("#color-picker-container", {
  //width: 200,
  //color: "#bd5d38",
//});

//colorPicker.on("color:change", function(color) {
 // console.log(color.hexString); // e.g. "#ff0000"
//});
