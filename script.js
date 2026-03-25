/* =========================
WAIT FOR PAGE LOAD
========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
  IMAGE GALLERY (CLICK + SWIPE)
  ========================== */

  document.querySelectorAll(".product").forEach((product) => {
    const img = product.querySelector(".product-img");
    const counter = product.querySelector(".gallery-count");

    // SAFETY CHECK (prevents crash)
    if (!img || !img.dataset.images) return;

    const images = img.dataset.images.split(",");
    let index = 0;

    let startX = 0;
    let endX = 0;

    // Only run if counter exists
    if (counter) {
      counter.textContent = `${index + 1} / ${images.length}`;
    }

    function updateImage() {
      img.src = images[index];
      if (counter) {
        counter.textContent = `${index + 1} / ${images.length}`;
      }
    }

    // CLICK
    img.addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateImage();
    });

    // TOUCH START
    img.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    // TOUCH END
    img.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;

      let diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          index = (index + 1) % images.length;
        } else {
          index = (index - 1 + images.length) % images.length;
        }
        updateImage();
      }
    });
  });

  /* =========================
  LIVE SEARCH
  ========================== */

  const searchInput = document.getElementById("search");
  const products = document.querySelectorAll(".product");
  const noResults = document.getElementById("no-results");

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      let visible = 0;

      products.forEach((product) => {
        const name =
          product.dataset.name ||
          product.querySelector("h3").textContent.toLowerCase();

        if (name.includes(query)) {
          product.style.display = "block";
          visible++;
        } else {
          product.style.display = "none";
        }
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
      }
    });
  }

  /* =========================
  PREVENT FORM RELOAD
  ========================== */

  const searchForm = document.querySelector(".nav-center form");

  if (searchForm) {
    searchForm.addEventListener("submit", (e) => e.preventDefault());
  }
});
