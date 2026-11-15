const carousel = document.querySelector(".banner");
const bannerImage = carousel && carousel.querySelector(".banner-img");
const bannerButtons = Array.from(document.querySelectorAll(".progress-bar"));
const bannerSlides = [
    {
        src: "IMG/Banner/banner-topup.svg",
        alt: "Top up game tanpa ribet dengan YUDACYA"
    },
    {
        src: "IMG/Banner/banner-promo.svg",
        alt: "Temukan game dan voucher favoritmu di YUDACYA"
    },
    {
        src: "IMG/Banner/banner-gaming.svg",
        alt: "Isi saldo dan lanjut bermain bersama YUDACYA"
    }
];

if (!carousel || !bannerImage || bannerButtons.length !== bannerSlides.length) {
    throw new Error("Banner carousel markup is incomplete.");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let activeSlide = 0;
let autoplayTimer;
let changeTimer;

function showBanner(index) {
    activeSlide = index;
    window.clearTimeout(changeTimer);
    bannerImage.classList.add("is-changing");

    changeTimer = window.setTimeout(() => {
        bannerImage.src = bannerSlides[activeSlide].src;
        bannerImage.alt = bannerSlides[activeSlide].alt;
        bannerImage.classList.remove("is-changing");
    }, 180);

    bannerButtons.forEach((button, buttonIndex) => {
        button.setAttribute("aria-pressed", String(buttonIndex === activeSlide));
    });
}

function startAutoplay() {
    window.clearInterval(autoplayTimer);

    if (
        reducedMotion.matches ||
        document.hidden ||
        carousel.matches(":hover") ||
        carousel.contains(document.activeElement)
    ) {
        return;
    }

    autoplayTimer = window.setInterval(() => {
        showBanner((activeSlide + 1) % bannerSlides.length);
    }, 6000);
}

bannerButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        showBanner(index);
        startAutoplay();
    });
});

carousel.addEventListener("pointerenter", startAutoplay);
carousel.addEventListener("pointerleave", startAutoplay);
carousel.addEventListener("focusin", startAutoplay);
carousel.addEventListener("focusout", startAutoplay);
document.addEventListener("visibilitychange", startAutoplay);
reducedMotion.addEventListener("change", startAutoplay);

startAutoplay();
