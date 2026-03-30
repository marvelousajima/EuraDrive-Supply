document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================
     1. PRODUCT GALLERY (Click & Swipe)
     ========================================== */
  document.querySelectorAll(".product").forEach((product) => {
    const img = product.querySelector(".product-img");
    const counter = product.querySelector(".gallery-count");
    if (!img || !img.dataset.images) return;

    const images = img.dataset.images.split(",");
    let index = 0;
    let startX = 0;

    if (counter) counter.textContent = `1 / ${images.length}`;

    const updateImage = () => {
      img.style.opacity = "0.7";
      setTimeout(() => {
        img.src = images[index].trim();
        img.style.opacity = "1";
        if (counter) counter.textContent = `${index + 1} / ${images.length}`;
      }, 100);
    };

    img.addEventListener("click", () => {
      index = (index + 1) % images.length;
      updateImage();
    });

    img.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );
    img.addEventListener("touchend", (e) => {
      let endX = e.changedTouches[0].clientX;
      let diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) index = (index + 1) % images.length;
        else index = (index - 1 + images.length) % images.length;
        updateImage();
      }
    });
  });

  /* ==========================================
     2. CART & WHATSAPP LOGIC
     ========================================== */
  let cart = [];
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartTotalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");

  // Function to Refresh the UI
  function updateCartUI() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    // Update Red Bubble
    if (countEl) {
      countEl.innerText = cart.length;
      countEl.style.display = cart.length > 0 ? "flex" : "none";
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML =
        '<p class="empty-msg">Your garage is empty.</p>';
    }

    cart.forEach((item, index) => {
      total += item.price;
      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
        <div style="flex:1">
          <strong>${item.name}</strong><br>
          <span style="color:var(--primary-red)">$${item.price.toLocaleString()}</span>
        </div>
        <button onclick="removeFromCart(${index})" style="color:#888; border:none; background:none; cursor:pointer; font-size:0.8rem;">Remove</button>
      `;
      cartItemsContainer.appendChild(itemEl);
    });

    cartTotalEl.innerText = total.toLocaleString();
  }

  // Add to Cart Action
  function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    toggleCart(true); // Open drawer on add
  }

  // Remove Item Action
  window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
  };

  // Listen for Add to Cart Buttons
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", (e) => {
      const product = e.target.closest(".product");
      const name = product.querySelector("h3").innerText;
      const priceText = product.querySelector(".price").innerText;
      const price = parseInt(priceText.replace(/[^0-9]/g, ""));
      addToCart(name, price);
    });
  });

  // WHATSAPP CHECKOUT
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Please add some parts to your garage first!");
        return;
      }

      // CHANGE THIS TO YOUR ACTUAL WHATSAPP NUMBER
      const myNumber = "17074004367";

      let message =
        "Hello EuraDrive Supply! I want to order these parts:%0a%0a";
      cart.forEach((item, i) => {
        message += `${i + 1}. *${
          item.name
        }* - $${item.price.toLocaleString()}%0a`;
      });

      const totalValue = cartTotalEl.innerText;
      message += `%0a*Total: $${totalValue}*%0a%0aAre these still available?`;

      window.open(`https://wa.me/${myNumber}?text=${message}`, "_blank");
    });
  }

  /* ==========================================
     3. UI CONTROLS (Drawers & Menus)
     ========================================== */
  function toggleCart(isOpen) {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.toggle("open", isOpen);
      cartOverlay.classList.toggle("open", isOpen);
    }
  }

  const cartTrigger =
    document.getElementById("cart-trigger") ||
    document.querySelector(".cart-icon");
  if (cartTrigger) cartTrigger.onclick = () => toggleCart(true);
  if (document.getElementById("close-cart"))
    document.getElementById("close-cart").onclick = () => toggleCart(false);
  if (cartOverlay) cartOverlay.onclick = () => toggleCart(false);

  // Hamburger Menu
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (hamburger) {
    hamburger.onclick = (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("active");
    };
  }

  // Live Search
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll(".product").forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        card.style.display = title.includes(query) ? "block" : "none";
      });
    });
  }
});
// 1. CATEGORY FILTERING
const catButtons = document.querySelectorAll(".cat-btn, .cat-link");
catButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const category = btn.getAttribute("data-category");

    document.querySelectorAll(".product").forEach((prod) => {
      if (
        category === "all" ||
        prod.getAttribute("data-category") === category
      ) {
        prod.style.display = "block";
      } else {
        prod.style.display = "none";
      }
    });
  });
});

// 2. CLICK TO OPEN PRODUCT DETAIL
const prodModal = document.getElementById("product-modal");
document.querySelectorAll(".product-img").forEach((img) => {
  img.addEventListener("dblclick", () => {
    // Or use a 'View Details' button
    const parent = img.closest(".product");

    document.getElementById("detail-title").innerText =
      parent.querySelector("h3").innerText;
    document.getElementById("detail-price").innerText =
      parent.querySelector(".price").innerText;
    document.getElementById("detail-img").src = img.src;
    document.getElementById("detail-desc").innerText =
      "Technical specs for " +
      parent.querySelector("h3").innerText +
      ". Tested and guaranteed functional.";

    prodModal.style.display = "flex";
  });
});

document.getElementById("close-product").onclick = () =>
  (prodModal.style.display = "none");

/* ==========================================
   4. TRACKING MODAL LOGIC (FINAL PRO VERSION)
   ========================================== */
const trackModal = document.getElementById("tracking-modal");
// Using a Class selector so BOTH desktop and mobile links work
const trackTriggers = document.querySelectorAll(".track-trigger");
const closeTracking = document.getElementById("close-tracking");
const findOrderBtn = document.getElementById("find-order-btn");
const trackResultDisplay = document.getElementById("track-result-display");

// Open Modal when clicking ANY link with the class 'track-trigger'
trackTriggers.forEach((trigger) => {
  trigger.onclick = (e) => {
    e.preventDefault();
    trackModal.style.display = "flex";

    // Silently close the mobile menu if it's open
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) mobileMenu.classList.remove("active");
  };
});

// Close Modal when clicking the 'X'
if (closeTracking) {
  closeTracking.onclick = () => {
    trackModal.style.display = "none";
    trackResultDisplay.style.display = "none";
  };
}

// Close Modal when clicking outside the white box (on the dark overlay)
window.addEventListener("click", (event) => {
  if (event.target === trackModal) {
    trackModal.style.display = "none";
  }
});

// Search Functionality
if (findOrderBtn) {
  findOrderBtn.onclick = () => {
    const orderIdInput = document.getElementById("order-id-input");
    const orderId = orderIdInput.value.trim().toUpperCase();

    // Mock Database
    const mockOrders = {
      "#EDS-101": {
        status: "Shipped",
        carrier: "FedEx",
        link: "https://www.fedex.com",
      },
      "#EDS-777": {
        status: "Out for Delivery",
        carrier: "DHL",
        link: "https://www.dhl.com",
      },
    };

    if (mockOrders[orderId]) {
      const data = mockOrders[orderId];
      trackResultDisplay.style.display = "block";
      trackResultDisplay.innerHTML = `
           <div style="text-align:left; padding:10px; border-left:4px solid var(--primary-red); background: #f9f9f9; border-radius: 4px;">
               <p><strong>Order:</strong> ${orderId}</p>
               <p><strong>Status:</strong> <span class="status-badge" style="background:#25d366; color:white; padding:2px 8px; border-radius:4px; font-size:0.8rem;">${data.status}</span></p>
               <p><strong>Carrier:</strong> ${data.carrier}</p>
               <a href="${data.link}" target="_blank" style="color:var(--primary-red); font-weight:bold; text-decoration:none;">Track on ${data.carrier} →</a>
           </div>
         `;
    } else {
      trackResultDisplay.style.display = "block";
      trackResultDisplay.innerHTML = `<p style="color:red; font-size:0.9rem;">Order ID not found. Try #EDS-101 to test.</p>`;
    }
  };
}
/* ==========================================
   HAMBURGER AUTO-CLOSE & FILTER LOGIC
   ========================================== */
const mobileMenu = document.getElementById("mobile-menu");

// Handle Category Clicks (Inside Hamburger)
document.querySelectorAll(".cat-link").forEach((link) => {
  link.addEventListener("click", () => {
    const category = link.getAttribute("data-category");

    // 1. Filter the products
    document.querySelectorAll(".product").forEach((product) => {
      if (
        category === "all" ||
        product.getAttribute("data-category") === category
      ) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });

    // 2. CLOSE the hamburger menu
    if (mobileMenu) {
      mobileMenu.classList.remove("active");
    }

    // 3. Scroll smoothly to products so they see the change
    document
      .getElementById("product-grid")
      .scrollIntoView({ behavior: "smooth" });
  });
});

// Ensure the Hamburger Toggle still works
const hamburger = document.getElementById("hamburger");
if (hamburger) {
  hamburger.onclick = (e) => {
    e.stopPropagation();
    mobileMenu.classList.toggle("active");
  };
}

// Close menu if clicking anywhere else on the screen
document.addEventListener("click", (event) => {
  const isClickInside =
    mobileMenu.contains(event.target) || hamburger.contains(event.target);
  if (!isClickInside && mobileMenu.classList.contains("active")) {
    mobileMenu.classList.remove("active");
  }
});
/* ==========================================
   NEWSLETTER POPUP LOGIC
   ========================================== */
window.addEventListener("load", () => {
  const newsModal = document.getElementById("newsletter-modal");
  const closeNews = document.getElementById("close-news");
  const newsForm = document.getElementById("newsletter-form");

  // 1. Check if user has seen it this session
  const hasSeenNewsletter = sessionStorage.getItem("newsletterShown");

  if (!hasSeenNewsletter) {
    // Show after 3 seconds for a better user experience
    setTimeout(() => {
      newsModal.style.display = "flex";
    }, 3000);
  }

  // 2. Close and set "Seen" flag
  if (closeNews) {
    closeNews.onclick = () => {
      newsModal.style.display = "none";
      sessionStorage.setItem("newsletterShown", "true");
    };
  }

  // 3. Handle Form Submission
  if (newsForm) {
    newsForm.onsubmit = (e) => {
      e.preventDefault();
      const email = document.getElementById("news-email").value;
      console.log("Newsletter Signup:", email);

      alert("Thanks for joining! Watch your inbox.");
      newsModal.style.display = "none";
      sessionStorage.setItem("newsletterShown", "true");
    };
  }
});
/* ==========================================
   EXPANDED FLOATING REVIEWS (12 ENTRIES)
   ========================================== */
const reviews = [
  {
    name: "Jason R.",
    text: "Found a rare Cummins engine here. Fast shipping to Texas!",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Sarah M.",
    text: "Transmission arrived exactly as described. Saved me $1200 vs the dealership.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Mike T.",
    text: "Best customer service for Euro parts I've found yet. Very knowledgeable.",
    stars: "⭐⭐⭐⭐",
  },
  {
    name: "Kevin L.",
    text: "Verified SRT wheels. Packaging was top tier, no scratches at all.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "David W.",
    text: "Fast response on WhatsApp. Helped me find the right ECU for my build.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Robert H.",
    text: "Ordered a steering rack last week, arrived in 3 days. Impressive speed.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Elena G.",
    text: "The LED headlight assembly was plug-and-play. Great quality OEM part.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Marcus P.",
    text: "Got a full Brembo brake kit. Hard to find these prices elsewhere.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Julian S.",
    text: "Body panels were paint-matched perfectly. Packed very securely.",
    stars: "⭐⭐⭐⭐",
  },
  {
    name: "Chris B.",
    text: "First time buying a used motor online, EuraDrive made it easy and stress-free.",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Antonio R.",
    text: "Turbocharger works like a charm. Boost is back to normal!",
    stars: "⭐⭐⭐⭐⭐",
  },
  {
    name: "Victor M.",
    text: "Found a replacement dash for my vintage project. Absolute lifesaver.",
    stars: "⭐⭐⭐⭐⭐",
  },
];

// Logic remains the same, but now pulls from this larger list!
function showRandomReview() {
  const container = document.getElementById("review-toast-container");
  if (!container) return;

  const randomIdx = Math.floor(Math.random() * reviews.length);
  const review = reviews[randomIdx];

  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
        <span class="close-review">&times;</span>
        <div class="review-stars">${review.stars}</div>
        <h4>${review.name}</h4>
        <p>"${review.text}"</p>
    `;

  container.appendChild(card);

  card.querySelector(".close-review").onclick = () => {
    card.style.animation = "fadeOut 0.4s forwards";
    setTimeout(() => card.remove(), 400);
  };

  setTimeout(() => {
    if (card.parentElement) {
      card.style.animation = "fadeOut 0.4s forwards";
      setTimeout(() => card.remove(), 400);
    }
  }, 6000);
}

// Start the cycle
setTimeout(() => {
  showRandomReview();
  setInterval(showRandomReview, 18000); // Shown every 18 seconds to feel natural
}, 4000);
/* ==========================================
   FIXED CURRENCY & LOCATION ENGINE
   ========================================== */

const currencyData = {
  USD: { symbol: "$", rate: 1.0, suffix: false },
  EUR: { symbol: "€", rate: 0.92, suffix: false },
  GBP: { symbol: "£", rate: 0.79, suffix: false },
  RON: { symbol: " lei", rate: 4.58, suffix: true },
  PLN: { symbol: " zł", rate: 3.98, suffix: true },
};

async function initCurrency() {
  const select = document.getElementById("currency-select");
  if (!select) return;

  const savedCurrency = localStorage.getItem("selectedCurrency");

  // 1. Determine which currency to show
  if (savedCurrency) {
    select.value = savedCurrency;
    applyCurrencyUpdate(savedCurrency);
  } else {
    // Auto-detect only if no preference is saved
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      let autoCurrency = "USD";

      if (data.country_code === "GB") autoCurrency = "GBP";
      else if (data.country_code === "RO") autoCurrency = "RON";
      else if (data.country_code === "PL") autoCurrency = "PLN";
      else if (["DE", "FR", "IT", "ES", "NL", "BE"].includes(data.country_code))
        autoCurrency = "EUR";

      select.value = autoCurrency;
      localStorage.setItem("selectedCurrency", autoCurrency);
      applyCurrencyUpdate(autoCurrency);
    } catch (err) {
      console.warn("Location detect failed, defaulting to USD");
      applyCurrencyUpdate("USD");
    }
  }

  // 2. Listener for manual changes
  select.addEventListener("change", (e) => {
    const val = e.target.value;
    localStorage.setItem("selectedCurrency", val);
    applyCurrencyUpdate(val);
  });
}

function applyCurrencyUpdate(currencyCode) {
  const info = currencyData[currencyCode];
  // Selects all price elements with the data-usd attribute
  const priceElements = document.querySelectorAll(".price[data-usd]");

  priceElements.forEach((el) => {
    const usdValue = parseFloat(el.getAttribute("data-usd"));

    if (!isNaN(usdValue)) {
      const converted = (usdValue * info.rate).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      if (info.suffix) {
        el.innerText = `${converted}${info.symbol}`;
      } else {
        el.innerText = `${info.symbol}${converted}`;
      }
    }
  });
}

// Call this inside your DOMContentLoaded or at the bottom of script.js
document.addEventListener("DOMContentLoaded", initCurrency);
/* ==========================================
   EURADRIVE MASTER LANGUAGE & CURRENCY ENGINE
   ========================================== */

const uiTranslations = {
  EN: {
    login: "Login",
    nav_engines: "Engines",
    nav_transmissions: "Transmissions",
    nav_wheels: "Wheels & Tires",
    "nav_electrical/ecu": "Electrical/ECU",
    nav_request_parts: "Request a Part",
    track_order: "Track My Order",
    recent_parts: "Recent Parts",
    add_to_cart: "Add to Cart",
    item_sold: "Item Sold",
    notes: "Parts shown are examples. Availability changes frequently.",
    "looking_for_a_part?": "Looking for a Part?",
    contact_message:
      "Tell us what you need. Leave your email and we’ll get back to you within the hour.",
    payment_methods: "Accepted Payment Methods",
    news_title: "Join the Garage",
    news_text: "Sign up for exclusive offers, new products, and more.",
    news_btn: "Get Early Access",
    follow_us: "Follow Us",
    shipping_partners: "Shipping Partners",
    delivery_message:
      "worldwide delivery available depending on part location.",
    return_policy: "Return Policy",
    return_policy_message:
      "Returns are accepted according to supplier terms. Parts must be unused and returned in their original condition.",
    return_policy_message_2:
      "Please contact us before sending any return to receive the correct return instructions.",
  },
  RO: {
    login: "Autentificare",
    nav_engines: "Motoare",
    nav_transmissions: "Transmisii",
    nav_wheels: "Jante și Anvelope",
    "nav_electrical/ecu": "Electrice/ECU",
    nav_request_parts: "Cerere Piesă",
    track_order: "Urmărire Comandă",
    recent_parts: "Piese Recente",
    add_to_cart: "Adaugă în Coș",
    item_sold: "Vândut",
    notes:
      "Piesele afișate sunt exemple. Disponibilitatea se schimbă frecvent.",
    "looking_for_a_part?": "Cauți o piesă?",
    contact_message:
      "Spune-ne de ce ai nevoie. Lasă-ți adresa de e-mail și îți vom răspunde în decurs de o oră.",
    payment_methods: "Metode de Plată Acceptate",
    news_title: "Alătură-te Garajului",
    news_text:
      "Abonează-te pentru oferte exclusive, produse noi și multe altele.",
    news_btn: "Obține Acces",
    follow_us: "Urmărește-ne",
    shipping_partners: "Parteneri de Livrare",
    delivery_message:
      "livrare în întreaga lume disponibilă în funcție de locația piesei.",
    return_policy: "Politica de Retur",
    return_policy_message:
      "Retururile sunt acceptate conform termenilor furnizorului. Piesele trebuie să fie nefolosite și returnate în starea lor originală.",
    return_policy_message_2:
      "Vă rugăm să ne contactați înainte de a trimite orice retur pentru a primi instrucțiunile corecte.",
  },
  PL: {
    login: "Zaloguj się",
    nav_engines: "Silniki",
    nav_transmissions: "Skrzynie biegów",
    nav_wheels: "Koła i Opony",
    "nav_electrical/ecu": "Elektryka/ECU",
    nav_request_parts: "Zatwierdź część",
    track_order: "Śledź zamówienie",
    recent_parts: "Ostatnie części",
    add_to_cart: "Dodaj do koszyka",
    item_sold: "Sprzedane",
    notes: "Pokazane części to przykłady. Dostępność często się zmienia.",
    "looking_for_a_part?": "Szukasz części?",
    contact_message:
      "Powiedz nam, czego potrzebujesz. Zostaw swój e-mail, a skontaktujemy się z Tobą w ciągu godziny.",
    payment_methods: "Akceptowane Metody Płatności",
    news_title: "Dołącz do Garażu",
    news_text:
      "Zapisz się, aby otrzymywać ekskluzywne oferty, nowości i więcej.",
    news_btn: "Uzyskaj dostęp",
    follow_us: "Obserwuj nas",
    shipping_partners: "Partnerzy wysyłkowi",
    delivery_message:
      "dostawa na cały świat dostępna w zależności od lokalizacji części.",
    return_policy: "Polityka zwrotów",
    return_policy_message:
      "Zwroty są akceptowane zgodnie z warunkami dostawcy. Części muszą być nieużywane i zwrócone w oryginalnym stanie.",
    return_policy_message_2:
      "Prosimy o kontakt przed wysłaniem zwrotu w celu otrzymania instrukcji.",
  },
  IT: {
    login: "Accedi",
    nav_engines: "Motori",
    nav_transmissions: "Trasmissioni",
    nav_wheels: "Ruote e Pneumatici",
    "nav_electrical/ecu": "Elettronica/ECU",
    nav_request_parts: "Richiedi un Ricambio",
    track_order: "Traccia il mio Ordine",
    recent_parts: "Parti Recenti",
    add_to_cart: "Aggiungi al Carrello",
    item_sold: "Venduto",
    notes:
      "Le parti mostrate sono esempi. La disponibilità cambia frequentemente.",
    "looking_for_a_part?": "Cerchi un ricambio?",
    contact_message:
      "Dicci di cosa hai bisogno. Lascia la tua email e ti risponderemo entro un'ora.",
    payment_methods: "Metodi di Pagamento Accettati",
    news_title: "Unisciti al Garage",
    news_text:
      "Iscriviti per offerte esclusive, nuovi prodotti e altro ancora.",
    news_btn: "Ottieni l'accesso",
    follow_us: "Seguici",
    shipping_partners: "Partner di Spedizione",
    delivery_message:
      "consegna in tutto il mondo disponibile a seconda della posizione del pezzo.",
    return_policy: "Politica di Reso",
    return_policy_message:
      "I resi sono accettati secondo i termini del fornitore. Le parti devono essere inutilizzate e restituite nelle loro condizioni originali.",
    return_policy_message_2:
      "Contattaci prima di spedire qualsiasi reso per ricevere le istruzioni corrette.",
  },
  ES: {
    login: "Iniciar Sesión",
    nav_engines: "Motores",
    nav_transmissions: "Transmisiones",
    nav_wheels: "Ruedas y Neumáticos",
    "nav_electrical/ecu": "Electrónica/ECU",
    nav_request_parts: "Solicitar una Pieza",
    track_order: "Rastrear mi Pedido",
    recent_parts: "Piezas Recientes",
    add_to_cart: "Añadir al Carrito",
    item_sold: "Vendido",
    notes:
      "Las piezas mostradas son ejemplos. La disponibilidad cambia con frecuencia.",
    "looking_for_a_part?": "¿Buscas una pieza?",
    contact_message:
      "Cuéntanos qué necesitas. Déjanos tu email y te contactaremos en menos de una hora.",
    payment_methods: "Métodos de Pago Aceptados",
    news_title: "Únete al Garaje",
    news_text: "Regístrate para ofertas exclusivas, nuevos productos y más.",
    news_btn: "Obtener Acceso",
    follow_us: "Síguenos",
    shipping_partners: "Socios de Envío",
    delivery_message:
      "entrega mundial disponible según la ubicación de la pieza.",
    return_policy: "Política de Devoluciones",
    return_policy_message:
      "Se aceptan devoluciones según los términos del proveedor. Las piezas deben estar sin usar y devolverse en su estado original.",
    return_policy_message_2:
      "Póngase en contacto con nosotros antes de enviar cualquier devolución para recibir las instrucciones correctas.",
  },
};

// --- CORE INITIALIZATION ---

async function initializeSiteSettings() {
  let lang = localStorage.getItem("userLanguage");
  let curr = localStorage.getItem("selectedCurrency");

  // If first visit, detect everything via IP
  if (!lang || !curr) {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();

      if (data.country_code === "RO") {
        lang = "RO";
        curr = "RON";
      } else if (data.country_code === "PL") {
        lang = "PL";
        curr = "PLN";
      } else if (data.country_code === "IT") {
        lang = "IT";
        curr = "EUR";
      } else if (["ES", "MX", "AR"].includes(data.country_code)) {
        lang = "ES";
        curr = "EUR";
      } else if (data.country_code === "GB") {
        lang = "EN";
        curr = "GBP";
      } else {
        lang = "EN";
        curr = "USD";
      }

      localStorage.setItem("userLanguage", lang);
      localStorage.setItem("selectedCurrency", curr);
    } catch (err) {
      lang = "EN";
      curr = "USD";
    }
  }

  applyUILanguage(lang);
  applyCurrencyUpdate(curr);

  // Set dropdown to match
  const currSelect = document.getElementById("currency-select");
  if (currSelect) currSelect.value = curr;
}

// --- REUSEABLE APPLY FUNCTIONS ---

function applyUILanguage(langCode) {
  const dict = uiTranslations[langCode] || uiTranslations["EN"];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerText = dict[key];
  });

  const searchBar = document.getElementById("search");
  if (searchBar)
    searchBar.placeholder = dict["search_placeholder"] || "Search parts...";
}

function applyCurrencyUpdate(currencyCode) {
  const info = currencyData[currencyCode];
  document.querySelectorAll(".price[data-usd]").forEach((el) => {
    const usdValue = parseFloat(el.getAttribute("data-usd"));
    if (!isNaN(usdValue)) {
      const converted = (usdValue * info.rate).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      el.innerText = info.suffix
        ? `${converted}${info.symbol}`
        : `${info.symbol}${converted}`;
    }
  });
}

// --- LISTENERS ---

document.getElementById("currency-select")?.addEventListener("change", (e) => {
  localStorage.setItem("selectedCurrency", e.target.value);
  applyCurrencyUpdate(e.target.value);
});

// Run everything
document.addEventListener("DOMContentLoaded", initializeSiteSettings);
