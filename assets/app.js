import './stimulus_bootstrap.js';
import './styles/app.css';

console.log('This log comes from assets/app.js - welcome to AssetMapper! 🎉');

/* =========================================================
   MENU DROPDOWN (ton code, inchangé)
========================================================= */
function initDropdown() {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdown = document.querySelector('.dropdown');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  const nav = document.querySelector('nav');

  function isMobile() { return window.innerWidth <= 480; }
  function isTablet() { return window.innerWidth > 480 && window.innerWidth <= 768; }

  function positionMenu() {
    if (!dropdownToggle || !dropdownMenu) return;

    const isExpanded = dropdownToggle.getAttribute('aria-expanded') === 'true';

    if (isMobile()) {
      dropdownMenu.classList.toggle('show', isExpanded);
      return;
    }

    if (isExpanded) {
      const toggleRect = dropdownToggle.getBoundingClientRect();
      const menuWidth = dropdownMenu.offsetWidth || 200;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = toggleRect.bottom + 8;
      let right = viewportWidth - toggleRect.right;
      let left = 'auto';

      const menuHeight = dropdownMenu.offsetHeight || 150;
      if (top + menuHeight > viewportHeight) {
        top = toggleRect.top - menuHeight - 8;
      }

      if (right + menuWidth > viewportWidth) {
        right = 'auto';
        left = viewportWidth - toggleRect.left;
      }

      dropdownMenu.style.top = top + 'px';
      dropdownMenu.style.right = typeof right === 'number' ? right + 'px' : right;
      dropdownMenu.style.left = left;
      dropdownMenu.style.position = 'fixed';
    }
  }

  if (dropdownToggle && dropdown && dropdownMenu) {
    dropdownToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      setTimeout(positionMenu, 10);
    });

    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
          positionMenu();
        }
      }, 150);
    });

    let scrollTimeout;
    window.addEventListener('scroll', function() {
      if (isMobile()) return;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (dropdownToggle.getAttribute('aria-expanded') === 'true') {
          positionMenu();
        }
      }, 50);
    }, true);

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        if (isMobile()) dropdownMenu.classList.remove('show');
      }
    });
  }

  if (nav && 'ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(() => {});
    resizeObserver.observe(nav);
  }

  if ('IntersectionObserver' in window) {
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    document.querySelectorAll('footer [class^="footer-part-"]').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }
}

/* =========================================================
   CALENDRIER + CRENEAUX (FIX Turbo + anti double init)
========================================================= */
function initReservationPage() {
  const grid = document.getElementById("calendar-grid");
  const monthEl = document.getElementById("current-month");
  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");

  const hiddenDate = document.getElementById("reservation-date");
  const slotsSection = document.getElementById("slots-section");
  const slotsDateText = document.querySelector(".slots-date");

  const slotsGrid = document.getElementById("slots-grid");
  const fromHidden = document.getElementById("reservation-from");
  const toHidden = document.getElementById("reservation-to");
  const fromSelect = document.getElementById("from-time");
  const toSelect = document.getElementById("to-time");
  const validateBtn = document.getElementById("validate-slots");

  // Pas sur la page réservation => on sort
  if (!grid || !monthEl || !prevBtn || !nextBtn) return;

  // ✅ Anti double init (Turbo peut rappeler le code)
  if (grid.dataset.initialized === "1") return;
  grid.dataset.initialized = "1";

  /* -------------------------
     CONFIG
  ------------------------- */
  let current = new Date(2026, 0, 1);

  const unavailableDays = new Set([
    "2026-01-02", "2026-01-03", "2026-01-04", "2026-01-12", "2026-01-21"
  ]);

  const allSlots = [
    "08:00","08:30","09:00","09:30","10:00","10:30","11:00",
    "11:30","12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30","18:00"
  ];

  const bookedByDate = {
    "2026-01-24": new Set(["09:30","10:00","10:30","13:30","14:00","14:30","15:00","16:00","16:30"])
  };

  const monthNames = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  const pad2 = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  function formatFr(dateISO) {
    const [y, m, d] = dateISO.split("-");
    const dt = new Date(Number(y), Number(m) - 1, Number(d));
    const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
    return `${days[dt.getDay()]} ${d} ${monthNames[dt.getMonth()]} ${y}`;
  }

  function clearSelectedDays() {
    grid.querySelectorAll(".day-btn.is-selected").forEach(b => b.classList.remove("is-selected"));
  }

  function hideSlots() {
    if (slotsSection) slotsSection.classList.add("is-hidden");
    if (slotsGrid) slotsGrid.innerHTML = "";
    if (hiddenDate) hiddenDate.value = "";
    if (fromHidden) fromHidden.value = "";
    if (toHidden) toHidden.value = "";
    if (fromSelect) fromSelect.value = "";
    if (toSelect) toSelect.value = "";
    if (validateBtn) validateBtn.disabled = true;
  }

  /* -------------------------
     CRENEAUX
  ------------------------- */
  function fillSelect(selectEl) {
    if (!selectEl) return;
    selectEl.innerHTML = `<option value="">--:--</option>`;
    allSlots.forEach(t => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      selectEl.appendChild(opt);
    });
  }

  fillSelect(fromSelect);
  fillSelect(toSelect);

  function setValidateState() {
    if (!validateBtn || !fromSelect || !toSelect) return;
    validateBtn.disabled = !(fromSelect.value && toSelect.value);
  }

  function renderSlots(dateISO) {
    if (!slotsGrid) return;
    slotsGrid.innerHTML = "";

    const booked = bookedByDate[dateISO] ?? new Set();

    allSlots.forEach(time => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.textContent = time;

      if (booked.has(time)) btn.classList.add("is-unavailable");

      btn.addEventListener("click", () => {
        if (btn.classList.contains("is-unavailable")) return;

        slotsGrid.querySelectorAll(".slot-btn.is-selected").forEach(b => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");

        if (fromSelect) fromSelect.value = time;

        const idx = allSlots.indexOf(time);
        const to = allSlots[Math.min(idx + 2, allSlots.length - 1)];
        if (toSelect) toSelect.value = to;

        setValidateState();
      });

      slotsGrid.appendChild(btn);
    });
  }

  function openSlots(dateISO) {
    if (slotsSection) slotsSection.classList.remove("is-hidden");
    if (slotsDateText) slotsDateText.textContent = formatFr(dateISO);

    if (hiddenDate) hiddenDate.value = dateISO;
    if (fromHidden) fromHidden.value = "";
    if (toHidden) toHidden.value = "";

    if (fromSelect) fromSelect.value = "";
    if (toSelect) toSelect.value = "";
    if (validateBtn) validateBtn.disabled = true;

    renderSlots(dateISO);

    slotsSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (fromSelect) fromSelect.addEventListener("change", setValidateState);
  if (toSelect) toSelect.addEventListener("change", setValidateState);

  if (validateBtn) {
    validateBtn.addEventListener("click", () => {
      if (!fromSelect?.value || !toSelect?.value) return;

      if (fromHidden) fromHidden.value = fromSelect.value;
      if (toHidden) toHidden.value = toSelect.value;

      const original = validateBtn.textContent;
      validateBtn.textContent = "OK ✔";
      setTimeout(() => (validateBtn.textContent = original), 900);
    });
  }

  /* -------------------------
     CALENDRIER
  ------------------------- */
  function renderCalendar() {
    grid.innerHTML = "";

    const year = current.getFullYear();
    const month = current.getMonth();

    monthEl.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // lundi=0 ... dimanche=6
    const mondayIndex = (firstDay.getDay() + 6) % 7;

    // cases vides avant le 1
    for (let i = 0; i < mondayIndex; i++) {
      const empty = document.createElement("div");
      empty.className = "day-empty";
      grid.appendChild(empty);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const d = new Date(year, month, day);
      const dateISO = iso(d);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "day-btn";
      btn.textContent = String(day);
      btn.dataset.date = dateISO;

      if (unavailableDays.has(dateISO)) btn.classList.add("is-unavailable");

      btn.addEventListener("click", () => {
        if (btn.classList.contains("is-unavailable")) return;

        clearSelectedDays();
        btn.classList.add("is-selected");
        openSlots(dateISO);
      });

      grid.appendChild(btn);
    }
  }

  prevBtn.addEventListener("click", () => {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    hideSlots();
    renderCalendar();
  });

  nextBtn.addEventListener("click", () => {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    hideSlots();
    renderCalendar();
  });

  hideSlots();
  renderCalendar();
}

/* =========================================================
   BOOT : DOMContentLoaded + Turbo
   (c'est LA raison du "je dois refresh")
========================================================= */
function boot() {
  initDropdown();
  initReservationPage();
}

// Chargement normal
document.addEventListener('DOMContentLoaded', boot);

// Si tu as Turbo activé (Symfony UX Turbo)
document.addEventListener('turbo:load', boot);
