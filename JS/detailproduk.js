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
const serverIdLabel = document.getElementById("server-id-label");
const serverIdInput = document.getElementById("server-id");
const accountGuideTitle = document.getElementById("account-guide-title");
const accountGuideDescription = document.getElementById("account-guide-desc");
const accountGuideExample = document.getElementById("account-guide-example");
const accountGuideNote = document.getElementById("account-guide-note");
const accountStepTitle = document.getElementById("account-step-title");
const nominalStepTitle = document.getElementById("nominal-step-title");
const transactionGuideTitle = document.getElementById("transaction-guide-title");
const transactionGuideSteps = document.getElementById("transaction-guide-steps");
const modalGuideTitle = document.getElementById("modal-guide-title");
const modalGuideSteps = document.getElementById("modal-guide-steps");
let userIdFormat = "numeric";
let serverIdFormat = "numeric";
let serverIdRequired = false;
let productType = "topup";

function renderInstructionList(listElement, instructions) {
    if (!listElement) return;

    listElement.replaceChildren(
        ...instructions.map((instruction) => {
            const listItem = document.createElement("li");
            listItem.textContent = instruction;
            return listItem;
        }),
    );
}

// Helper: Mengubah string harga "Rp 15.000" menjadi angka murni
function parsePrice(priceStr) {
    if (!priceStr) return 0;
    return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
}

// Helper: Format angka kembali ke format Rupiah (contoh: Rp 15.000)
function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}

function configureIdInput(input, format = "numeric") {
    if (!input) return;

    input.type = format === "email" ? "email" : "text";
    input.inputMode =
        format === "numeric" ? "numeric" : format === "email" ? "email" : "text";
    if (format !== "numeric") {
        input.removeAttribute("pattern");
        if (format === "email") {
            input.autocomplete = "email";
            input.autocapitalize = "none";
        }
        return;
    }

    input.autocomplete = "off";
    input.pattern = "[0-9]*";
    input.addEventListener("input", (event) => {
        const target = event.currentTarget;
        const cursorPosition = target.selectionStart ?? target.value.length;
        const digitsBeforeCursor = target.value
            .slice(0, cursorPosition)
            .replace(/\D/g, "").length;
        const numericValue = target.value.replace(/\D/g, "");

        if (target.value !== numericValue) {
            target.value = numericValue;
            target.setSelectionRange(digitsBeforeCursor, digitsBeforeCursor);
        }
    });
}

// Helper: Menghitung besar biaya admin berdasarkan tipe (percent / flat)
function calculateAdminFee(basePrice, paymentName) {
    const feeConfig = adminFees[paymentName];
    if (!feeConfig) return 0;

    if (feeConfig.type === "percent") {
        return Math.ceil((basePrice * feeConfig.value) / 100);
    }
    return feeConfig.value;
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
            const fee = calculateAdminFee(basePrice, paymentName);
            const totalPrice = basePrice + fee;
            tagElement.innerText = formatRupiah(totalPrice);
        }
        }
    });
}

// 4. Eksekusi perubahan data jika game ditemukan di database
if (gameKey && databaseGame[gameKey]) {
    const data = databaseGame[gameKey];
    productType = data.productType || "topup";
    userIdFormat = data.userIdFormat || "numeric";

    // Ubah teks judul & banner
    if (titleElement) {
        const titlePrefix = productType === "voucher" ? "Voucher" : "Top Up";
        titleElement.innerText = `${titlePrefix} ${data.title}`;
    }
    if (bannerImg && data.banner) bannerImg.src = data.banner;
    if (accountStepTitle && productType === "voucher") {
        accountStepTitle.textContent = "Masukkan Email Penerima";
    }
    if (nominalStepTitle) {
        nominalStepTitle.textContent =
            productType === "voucher"
                ? "Pilih Nominal Voucher"
                : gameKey === "garena-shell"
                ? "Pilih Nominal Shell"
                : "Pilih Nominal Top Up";
    }

    // Ubah Label dan Placeholder User ID secara dinamis
    if (userIdLabel && data.userIdLabel) {
        userIdLabel.innerText = data.userIdLabel;
    }
    if (userIdInput && data.userIdPlaceholder) {
        userIdInput.placeholder = data.userIdPlaceholder;
    }
    configureIdInput(userIdInput, userIdFormat);

    // Atur tampil / sembunyinya Server ID
    if (serverIdLabel && data.serverIdLabel) {
        serverIdLabel.innerText = data.serverIdLabel;
    }
    if (serverIdInput && data.serverIdPlaceholder) {
        serverIdInput.placeholder = data.serverIdPlaceholder;
    }
    serverIdFormat = data.serverIdFormat || "numeric";
    configureIdInput(serverIdInput, serverIdFormat);
    serverIdRequired = Boolean(data.showServerId);
    if (serverIdContainer) {
        if (data.showServerId) {
            serverIdContainer.style.display = "flex";
        } else {
            serverIdContainer.style.display = "none";
        }
    }
    if (serverIdInput) {
        serverIdInput.required = serverIdRequired;
    }

    if (data.accountGuide) {
        if (accountGuideTitle) {
            accountGuideTitle.textContent = data.accountGuide.title;
        }
        if (accountGuideDescription) {
            accountGuideDescription.textContent = data.accountGuide.description;
        }
        if (accountGuideExample && data.accountGuide.example) {
            accountGuideExample.textContent = `Contoh: ${data.accountGuide.example}`;
            accountGuideExample.hidden = false;
        }
        if (accountGuideNote) {
            accountGuideNote.textContent = data.accountGuide.note;
        }
    }

    const instructions =
        productType === "voucher"
            ? [
                "Pilih nominal voucher yang ingin dibeli.",
                "Masukkan email aktif untuk menerima kode voucher.",
                "Pilih metode pembayaran dan klik Beli Sekarang.",
                "Selesaikan pembayaran, lalu periksa email untuk kode voucher.",
                "Tukarkan kode pada layanan terkait dan pastikan region akun sesuai.",
            ]
            : gameKey === "garena-shell"
            ? [
                    "Masukkan User ID Garena yang akan menerima Shell.",
                    "Pilih nominal Shell yang ingin dibeli.",
                    "Pilih metode pembayaran.",
                    "Klik Beli Sekarang dan selesaikan pembayaran.",
                    "Shell akan dikirim langsung ke akun Garena tersebut.",
                ]
            : null;
    if (instructions) {
        if (transactionGuideTitle) {
            transactionGuideTitle.textContent =
                productType === "voucher" ? "Cara Beli Voucher:" : "Cara Top Up Garena Shell:";
        }
        if (modalGuideTitle) {
            modalGuideTitle.textContent =
                productType === "voucher" ? "Cara Beli Voucher" : "Cara Top Up Garena Shell";
        }
        renderInstructionList(transactionGuideSteps, instructions);
        renderInstructionList(modalGuideSteps, instructions);
    }

  // Render pilihan nominal secara dinamis (DENGAN BADGE DISKON OTOMATIS)
    if (nominalGrid && data.nominals) {
        nominalGrid.innerHTML = ""; // Bersihkan kontainer
        data.nominals.forEach((item) => {
            const card = document.createElement("div");
            card.className = "nominal-card";

            const formattedPrice = formatRupiah(parsePrice(item.price));
            let badgeHtml = "";
            let priceHtml = `<p class="normal-price-text">${formattedPrice}</p>`;

        // Cek jika item memiliki harga asli (sedang promo/diskon)
            if (item.originalPrice) {
                const origNum = parsePrice(item.originalPrice);
                const promoNum = parsePrice(item.price);
                const formattedOriginalPrice = formatRupiah(origNum);

                // Hitung persentase diskon secara otomatis
                let discountText = "PROMO";
                if (origNum > promoNum) {
                const discountPercent = Math.round(
                    ((origNum - promoNum) / origNum) * 100,
                );
                discountText = `-${discountPercent}%`; // Hasilnya misal: "-20%"
                }

                badgeHtml = `<span class="discount-badge">${discountText}</span>`;
                priceHtml = `
                            <span class="promo-price">${formattedPrice}</span>
                            <span class="original-price">${formattedOriginalPrice}</span>
                        `;
            }

            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
            card.setAttribute("aria-pressed", "false");
            card.innerHTML = `
                ${badgeHtml}
                <span class="nominal-icon" aria-hidden="true">◆</span>
                <h4>${item.name}</h4>
                <div class="price-container">
                    ${priceHtml}
                </div>
                <span class="nominal-check" aria-hidden="true">✓</span>
            `;

            const selectCard = () => {
                document
                .querySelectorAll(".nominal-card")
                .forEach((c) => {
                    c.classList.remove("selected");
                    c.setAttribute("aria-pressed", "false");
                });
                card.classList.add("selected");
                card.setAttribute("aria-pressed", "true");

                const rawPrice = parsePrice(item.price);
                updatePaymentPrices(rawPrice);
            };

            card.addEventListener("click", selectCard);
            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectCard();
                }
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
        alert(`Harap masukkan ${userIdLabel ? userIdLabel.innerText : "User ID"} terlebih dahulu!`);
        return;
        }
        if (userIdFormat === "email" && !userIdInput.validity.valid) {
        alert("Masukkan alamat email penerima yang valid!");
        userIdInput.focus();
        return;
        }
        if (userIdFormat === "numeric" && !/^\d+$/.test(userId)) {
        alert("ID akun hanya boleh berisi angka untuk game ini!");
        return;
        }
        const serverId = serverIdInput ? serverIdInput.value.trim() : "";
        if (serverIdRequired && !serverId) {
        alert(`Harap masukkan ${serverIdLabel.innerText} terlebih dahulu!`);
        serverIdInput.focus();
        return;
        }
        if (serverIdRequired && serverIdFormat === "numeric" && !/^\d+$/.test(serverId)) {
        alert(`${serverIdLabel.innerText} hanya boleh berisi angka untuk game ini!`);
        serverIdInput.focus();
        return;
        }
        if (!selectedNominal) {
        alert(`Silakan pilih nominal ${productType === "voucher" ? "voucher" : "top-up"} terlebih dahulu!`);
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

        // Hitung total harga akhir (Harga Promo + Biaya Admin Dinamis)
        const basePrice = parsePrice(basePriceStr);
        const fee = calculateAdminFee(basePrice, paymentMethod);
        const finalPrice = basePrice + fee;

        alert(
        `✅ Pesanan Berhasil Dibuat!\n\n` +
            `${userIdLabel ? userIdLabel.innerText : "User ID"}: ${userId}\n` +
            `Item: ${itemName} (${formatRupiah(finalPrice)})\n` +
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
