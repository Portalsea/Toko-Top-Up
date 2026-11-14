import { databaseGame, adminFees } from "./database.js";

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

// 3. Tangkap elemen-elemen penting di HTML halaman detail
const titleElement = document.getElementById("game-title");
const bannerImg = document.getElementById("game-banner");
const nominalGrid = document.getElementById("nominal-grid");
const userIdLabel = document.getElementById("user-id-label");
const userIdInput = document.getElementById("user-id");
const serverIdContainer = document.getElementById("server-id-container");

// Helper: Mengubah string harga "Rp 15.000" menjadi angka murni
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
}

// Helper: Format angka kembali ke format Rupiah (contoh: Rp 15.000)
function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}

// Simpan teks default awal badge pembayaran (misal: "Instan", "Cek Otomatis")
document.querySelectorAll(".payment-item").forEach((item) => {
    const tagElement = item.querySelector(".pay-tag");
    if (tagElement) {
        item.setAttribute("data-default-text", tagElement.innerText);
    }
});

// Fungsi untuk memperbarui harga di semua metode pembayaran secara dinamis
function updatePaymentPrices(basePrice) {
    document.querySelectorAll(".payment-item").forEach((item) => {
        const paymentName = item.getAttribute("data-payment");
        const tagElement = item.querySelector(".pay-tag");

        if (tagElement) {
        if (basePrice <= 0) {
            tagElement.innerText =
            item.getAttribute("data-default-text") || "Pilih Nominal";
        } else {
            const fee = adminFees[paymentName] || 0;
            const totalPrice = basePrice + fee;
            tagElement.innerText = formatRupiah(totalPrice);
        }
        }
    });
}

// 4. Eksekusi perubahan data jika game ditemukan di database
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

// Render pilihan nominal secara dinamis (DENGAN BADGE DISKON OTOMATIS)
    if (nominalGrid && data.nominals) {
        nominalGrid.innerHTML = ""; // Bersihkan kontainer
        data.nominals.forEach((item) => {
            const card = document.createElement("div");
            card.className = "nominal-card";

            let badgeHtml = "";
            let priceHtml = `<p>${item.price}</p>`;

            // Cek jika item memiliki harga asli (sedang promo/diskon)
            if (item.originalPrice) {
                const origNum = parsePrice(item.originalPrice);
                const promoNum = parsePrice(item.price);
                
                // Hitung persentase diskon secara otomatis
                let discountText = "PROMO";
                if (origNum > promoNum) {
                    const discountPercent = Math.round(((origNum - promoNum) / origNum) * 100);
                    discountText = `-${discountPercent}%`; // Hasilnya misal: "-20%"
                }

                badgeHtml = `<span class="discount-badge">${discountText}</span>`;
                priceHtml = `
                    <span class="promo-price">${item.price}</span>
                    <span class="original-price">${item.originalPrice}</span>
                `;
            }

            card.innerHTML = `
                ${badgeHtml}
                <h4>${item.name}</h4>
                <div class="price-container">
                    ${priceHtml}
                </div>
            `;

            // Efek interaktif saat nominal diklik & update harga dinamis pembayaran
            card.addEventListener("click", () => {
                document.querySelectorAll(".nominal-card").forEach((c) => c.classList.remove("selected"));
                card.classList.add("selected");

                const rawPrice = parsePrice(item.price);
                updatePaymentPrices(rawPrice);
            });

            nominalGrid.appendChild(card);
        });
    }
} else {
    if (titleElement) {
        titleElement.innerText = "Game Tidak Ditemukan";
    }
}

// 5. Interaksi pilih metode pembayaran
document.querySelectorAll(".payment-item").forEach((item) => {
    item.addEventListener("click", () => {
        document
        .querySelectorAll(".payment-item")
        .forEach((p) => p.classList.remove("selected"));
        item.classList.add("selected");
    });
});

// 6. Validasi saat tombol "Beli Sekarang" diklik
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

        // Ambil teks harga promo (elemen .promo-price jika ada, atau tag p biasa)
        const promoPriceElem =
        selectedNominal.querySelector(".promo-price") ||
        selectedNominal.querySelector("p");
        const basePriceStr = promoPriceElem ? promoPriceElem.innerText : "0";

        const paymentMethod = selectedPayment.getAttribute("data-payment");

        // Hitung total harga akhir (Harga Promo + Biaya Admin)
        const basePrice = parsePrice(basePriceStr);
        const fee = adminFees[paymentMethod] || 0;
        const finalPrice = basePrice + fee;

        alert(
        `✅ Pesanan Berhasil Dibuat!\n\n` +
            `User ID: ${userId}\n` +
            `Item: ${itemName} (${formatRupiah(finalPrice)} incl. Admin)\n` +
            `Pembayaran: ${paymentMethod}\n\n` +
            `Silakan lanjutkan pembayaran.`,
        );
    });
}

// 7. Fungsi untuk membuka/menutup kategori pembayaran (Accordion)
window.toggleCategory = function (headerElement) {
    const parentCategory = headerElement.parentElement;
    parentCategory.classList.toggle("active");
};

// --- LOGIKA POPUP MODAL CARA TRANSAKSI ---
const modal = document.getElementById("guide-modal");
const btnOpenModal = document.getElementById("btn-open-guide");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnModalOk = document.getElementById("btn-modal-ok");

if (btnOpenModal && modal) {
    btnOpenModal.addEventListener("click", () => {
        modal.classList.add("show");
    });
}

if (btnCloseModal && modal) {
    btnCloseModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

if (btnModalOk && modal) {
    btnModalOk.addEventListener("click", () => {
        modal.classList.remove("show");
    });
}

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
});