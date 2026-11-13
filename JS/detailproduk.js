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

// 3. Database informasi game (Lengkap dengan data input dan nominalnya)
const databaseGame = {
    valorant: {
        title: "Valorant Points",
        developer: "Riot Games",
        banner: "../IMG/Asset/Valorant.webp",
        userIdLabel: "Riot ID",
        userIdPlaceholder: "Contoh: Nama#TAG",
        showServerId: false, // Valorant tidak butuh server ID
        nominals: [
        { name: "125 VP", price: "Rp 15.000" },
        { name: "420 VP", price: "Rp 45.000" },
        { name: "700 VP", price: "Rp 75.000" },
        { name: "1375 VP", price: "Rp 145.000" },
        ],
    },
    "mobile-legends": {
        title: "Mobile Legends Diamonds",
        developer: "Moonton",
        banner: "../IMG/Asset/mobilelegends.webp",
        userIdLabel: "User ID",
        userIdPlaceholder: "Contoh: 12345678",
        showServerId: true, // Mobile Legends butuh server ID
        nominals: [
        { name: "50 Diamonds", price: "Rp 12.000" },
        { name: "100 Diamonds", price: "Rp 23.000" },
        { name: "250 Diamonds", price: "Rp 55.000" },
        { name: "500 Diamonds", price: "Rp 110.000" },
        ],
    },
    "honor-of-kings": {
        title: "Honor of Kings Tokens",
        developer: "Level Infinite",
        banner: "../IMG/Asset/HOK.webp",
        userIdLabel: "User ID",
        userIdPlaceholder: "Contoh: 12345678",
        showServerId: false,
        nominals: [
        { name: "80 Tokens", price: "Rp 15.000" },
        { name: "240 Tokens", price: "Rp 45.000" },
        { name: "400 Tokens", price: "Rp 75.000" },
        ],
    },
    "free-fire": {
        title: "Free Fire Diamonds",
        developer: "Garena",
        banner: "../IMG/Asset/FreeFire.webp",
        userIdLabel: "Player ID",
        userIdPlaceholder: "Contoh: 123456789",
        showServerId: false,
        nominals: [
        { name: "70 Diamonds", price: "Rp 10.000" },
        { name: "140 Diamonds", price: "Rp 20.000" },
        { name: "355 Diamonds", price: "Rp 50.000" },
        ],
    },
};

// 4. Tangkap elemen-elemen penting di HTML halaman detail
const titleElement = document.getElementById("game-title");
const bannerImg = document.getElementById("game-banner");
const nominalGrid = document.getElementById("nominal-grid");
const userIdLabel = document.getElementById("user-id-label");
const userIdInput = document.getElementById("user-id");
const serverIdContainer = document.getElementById("server-id-container");

// 5. Eksekusi perubahan data jika game ditemukan di database
if (gameKey && databaseGame[gameKey]) {
const data = databaseGame[gameKey];

  // Ubah teks judul & banner
if (titleElement) titleElement.innerText = `Top Up ${data.title}`;
if (bannerImg && data.banner) bannerImg.src = data.banner;

  // Ubah Label dan Placeholder User ID secara dinamis
if (userIdLabel && data.userIdLabel) {
    userIdLabel.innerText = data.userIdLabel;
}
if (userIdInput && data.userIdPlaceholder) {
    userIdInput.placeholder = data.userIdPlaceholder;
}

  // Atur tampil / sembunyinya Server ID
    if (serverIdContainer) {
        if (data.showServerId) {
        serverIdContainer.style.display = "flex";
        } else {
        serverIdContainer.style.display = "none";
        }
    }

  // Render pilihan nominal secara dinamis
if (nominalGrid && data.nominals) {
    nominalGrid.innerHTML = ""; // Bersihkan kontainer
    data.nominals.forEach((item) => {
        const card = document.createElement("div");
        card.className = "nominal-card";
        card.innerHTML = `
                    <h4>${item.name}</h4>
                    <p>${item.price}</p>
                `;

        // Efek interaktif saat nominal diklik
        card.addEventListener("click", () => {
            document
            .querySelectorAll(".nominal-card")
            .forEach((c) => c.classList.remove("selected"));
            card.classList.add("selected");
        });

        nominalGrid.appendChild(card);
        });
}
} else {
if (titleElement) {
    titleElement.innerText = "Game Tidak Ditemukan";
}
}

// 6. Interaksi pilih metode pembayaran
document.querySelectorAll(".payment-item").forEach((item) => {
    item.addEventListener("click", () => {
        document
        .querySelectorAll(".payment-item")
        .forEach((p) => p.classList.remove("selected"));
        item.classList.add("selected");
    });
});

// 7. Validasi saat tombol "Beli Sekarang" diklik
const btnCheckout = document.getElementById("btn-checkout");
if (btnCheckout) {
    btnCheckout.addEventListener("click", () => {
        const userId = document.getElementById("user-id").value.trim();
        const selectedNominal = document.querySelector(".nominal-card.selected");
        const selectedPayment = document.querySelector(".payment-item.selected");

        if (!userId) {
        alert("Harap masukkan User ID terlebih dahulu!");
        return;
        }
        if (!selectedNominal) {
        alert("Silakan pilih nominal top-up terlebih dahulu!");
        return;
        }
        if (!selectedPayment) {
        alert("Silakan pilih metode pembayaran!");
        return;
        }

        const itemName = selectedNominal.querySelector("h4").innerText;
        const itemPrice = selectedNominal.querySelector("p").innerText;
        const paymentMethod = selectedPayment.getAttribute("data-payment");

        alert(
        `✅ Pesanan Berhasil Dibuat!\n\n` +
            `User ID: ${userId}\n` +
            `Item: ${itemName} (${itemPrice})\n` +
            `Pembayaran: ${paymentMethod}\n\n` +
            `Silakan lanjutkan pembayaran.`,
        );
    });
}
