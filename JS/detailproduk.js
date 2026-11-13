// 1. Menangkap semua card produk di halaman utama (index.html)
document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => {
    const targetUrl = card.getAttribute("data-link");
    if (targetUrl) {
        window.location.href = targetUrl;
    }
    });
});

// 2. Ambil parameter '?game=' dari URL browser
const urlParams = new URLSearchParams(window.location.search);
const gameKey = urlParams.get("game");

// 3. Database informasi game
const databaseGame = {
    valorant: {
    title: "Valorant Points",
    developer: "Riot Games",
    banner: "../IMG/Asset/Valorant.webp",
    },
    "mobile-legends": {
    title: "Mobile Legends Diamonds",
    developer: "Moonton",
    banner: "../IMG/Asset/mobilelegends.webp",
    },
    "honor-of-kings": {
    title: "Honor of Kings Tokens",
    developer: "Level Infinite",
    banner: "../IMG/Asset/HOK.webp",
    },
    "free-fire": {
    title: "Free Fire Diamonds",
    developer: "Garena",
    banner: "../IMG/Asset/FreeFire.webp",
    },
};

// 4. Update elemen HTML di halaman detail secara otomatis (Judul & Banner)
const titleElement = document.getElementById("game-title");
const bannerImg = document.getElementById("game-banner");

if (gameKey && databaseGame[gameKey]) {
    const data = databaseGame[gameKey];

  // Ubah teks judul
    if (titleElement) {
    titleElement.innerText = `Top Up ${data.title}`;
    }

  // Ubah gambar banner secara otomatis jika elemennya ada di HTML
    if (bannerImg && data.banner) {
    bannerImg.src = data.banner;
    }

    console.log("Menampilkan halaman detail untuk:", data.title);
} else {
    if (titleElement) {
    titleElement.innerText = "Game Tidak Ditemukan";
    }
}
