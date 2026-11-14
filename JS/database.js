export const adminFees = {
    "QRIS": 500,
    "GoPay": 1000,
    "DANA": 1000,
    "OVO": 1000,
    "ShopeePay": 1000,
    "BCA VA": 4000,
    "Mandiri VA": 4000,
    "BNI VA": 4000,
    "BRI VA": 4000,
    "Alfamart": 2500,
    "Indomaret": 2500
};

export const databaseGame = {
    "valorant": {
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
        { name: "12 Diamonds", price: "Rp 3.942", originalPrice: "Rp 4.183" },
        { name: "50 Diamonds", price: "Rp 16.993" },
        { name: "100 Diamonds", price: "Rp 31.150" },
        { name: "257 Diamonds", price: "Rp 79.301" },
        { name: "512 Diamonds", price: "Rp 156.907" },
        { name: "750 Diamonds", price: "Rp 226.028" },
        { name: "1050 Diamonds", price: "Rp 314.415" },
        { name: "1750 Diamonds", price: "Rp 521.200" },
        { name: "2180 Diamonds", price: "Rp 618.736" },
        { name: "2536 Diamonds", price: "Rp 728.057" },
        { name: "3453 Diamonds", price: "Rp 997.168" },
        { name: "4030 Diamonds", price: "Rp 1.136.637" },
        { name: "4678 Diamonds", price: "Rp 1.330.946" },
        { name: "5398 Diamonds", price: "Rp 1.529.458" },
        { name: "6030 Diamonds", price: "Rp 1.599.800", originalPrice: "Rp 1.699.859" },
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
