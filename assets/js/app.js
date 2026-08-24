/* ==========================================================================
   PROJENIC DESIGN - Interactive JavaScript Core (White & Orange Theme)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initCalculator();
  initPortfolioFilter();
});

/* --------------------------------------------------------------------------
   Sticky Header on Scroll
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.querySelector('.nav-links');

  if (btn && nav) {
    btn.addEventListener('click', () => {
      if (nav.style.display === 'flex') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'flex';
        nav.style.flexDirection = 'column';
        nav.style.position = 'absolute';
        nav.style.top = '70px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.background = '#ffffff';
        nav.style.padding = '24px';
        nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        nav.style.borderBottom = '1px solid var(--border-color)';
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Interactive Calculator Logic
   -------------------------------------------------------------------------- */
function initCalculator() {
  const standType = document.getElementById('standType');
  const sizeRange = document.getElementById('sizeRange');
  const sizeValue = document.getElementById('sizeValue');
  const estimatePrice = document.getElementById('estimatePrice');

  const baseRates = {
    wood: { min: 3500, max: 4800 },
    maxima: { min: 2400, max: 3200 },
    modular: { min: 1500, max: 2200 }
  };

  function updateEstimate() {
    const size = parseInt(sizeRange.value);
    const type = standType.value;
    sizeValue.textContent = `${size} m²`;

    const rate = baseRates[type] || baseRates.wood;
    const minVal = (size * rate.min).toLocaleString('tr-TR');
    const maxVal = (size * rate.max).toLocaleString('tr-TR');

    estimatePrice.textContent = `₺${minVal} - ₺${maxVal}`;
  }

  if (sizeRange && standType) {
    sizeRange.addEventListener('input', updateEstimate);
    standType.addEventListener('change', updateEstimate);
    updateEstimate();
  }
}

function sendQuoteRequest() {
  const size = document.getElementById('sizeRange').value;
  const type = document.getElementById('standType').options[document.getElementById('standType').selectedIndex].text;
  const city = document.getElementById('cityName').value || 'Belirtilmedi';

  openCallModal();
  const msgInput = document.getElementById('contactMsg');
  if (msgInput) {
    msgInput.value = `[Teklif Talebi]: ${type} - ${size} m² - Şehir/Fuar: ${city}`;
  }
}

/* --------------------------------------------------------------------------
   Portfolio Category Filter
   -------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

function filterCategory(categoryName) {
  const btn = document.querySelector(`.filter-btn[data-filter="${categoryName}"]`);
  if (btn) {
    btn.click();
  }
}

/* --------------------------------------------------------------------------
   Lightbox Modal
   -------------------------------------------------------------------------- */
function openLightbox(imgSrc, title, sub) {
  const modal = document.getElementById('lightboxModal');
  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const subEl = document.getElementById('lightboxSub');

  img.src = imgSrc;
  titleEl.textContent = title;
  subEl.textContent = sub;

  modal.classList.add('active');
}

function closeLightbox() {
  document.getElementById('lightboxModal').classList.remove('active');
}

/* --------------------------------------------------------------------------
   "Sizi Arayalım" Modal Handlers
   -------------------------------------------------------------------------- */
function openCallModal() {
  document.getElementById('callModal').classList.add('active');
}

function closeCallModal() {
  document.getElementById('callModal').classList.remove('active');
}

function handleCallSubmit(e) {
  e.preventDefault();
  const phone = document.getElementById('callPhone').value;
  if (phone) {
    alert(`Teşekkürler! ${phone} numaranız kaydedildi. Mimar ekibimiz en kısa sürede sizi arayacaktır.`);
    closeCallModal();
    document.getElementById('callForm').reset();
  }
}

function handleContactSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('contactName').value;
  alert(`Teşekkürler Sayın ${name}, mesajınız bize ulaştı. En kısa sürede tarafınıza dönüş yapılacaktır.`);
  document.getElementById('contactForm').reset();
}
