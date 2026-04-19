(function () {
  "use strict";

  const cfg = window.INVITATION_CONFIG;
  if (!cfg) {
    console.error("config.js를 불러오세요.");
    return;
  }

  /** 지도 위 핀 안에 들어가는 신랑·신부 일러스트(SVG) */
  const COUPLE_PIN_SVG = `
<svg class="couple-pin-svg" viewBox="0 0 72 96" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ef5350"/>
      <stop offset="100%" style="stop-color:#c62828"/>
    </linearGradient>
  </defs>
  <path fill="url(#pinGrad)" d="M36 4C20.5 4 8 16.8 8 32.5c0 14.5 28 55.5 28 55.5s28-41 28-55.5C64 16.8 51.5 4 36 4z"/>
  <circle cx="36" cy="31" r="22" fill="#fff" stroke="rgba(0,0,0,0.06)" stroke-width="1"/>
  <!-- 신랑 -->
  <g transform="translate(22 18)">
    <circle cx="7" cy="7" r="5.5" fill="#455a64"/>
    <ellipse cx="7" cy="15" rx="6" ry="2.5" fill="#455a64"/>
    <path d="M3 17h8v11H3z" fill="#37474f"/>
  </g>
  <!-- 신부 -->
  <g transform="translate(38 17)">
    <path d="M8 4c-3 0-5.5 2.4-5.5 5.5 0 3 2.5 5.5 5.5 5.5s5.5-2.5 5.5-5.5C13.5 6.4 11 4 8 4z" fill="#ffe0b2"/>
    <path d="M2 14l6 14 6-14c-1.8-1.2-4-1.8-6-1.8s-4.2.6-6 1.8z" fill="#f8bbd0"/>
    <path d="M5 10h6l-1 4H6z" fill="#fff"/>
  </g>
</svg>`;

  function seedFromString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function resolveImage(path) {
    if (cfg.useDemoPlaceholders && typeof cfg.demoPlaceholder === "function") {
      return cfg.demoPlaceholder(seedFromString(path));
    }
    return path;
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showToast(message) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = message;
    t.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => t.classList.remove("is-visible"), 2200);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast("복사되었습니다.");
    } catch (e) {
      showToast("복사에 실패했습니다.");
    }
  }

  function buildCalendar(year, month, highlightDay) {
    const first = new Date(year, month - 1, 1);
    const lastDate = new Date(year, month, 0).getDate();
    const startWeekday = first.getDay();

    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    let html = '<table class="calendar" role="grid"><thead><tr>';
    weekdays.forEach((d) => {
      html += `<th scope="col">${d}</th>`;
    });
    html += "</tr></thead><tbody><tr>";

    let day = 1;
    for (let i = 0; i < 42; i++) {
      if (i > 0 && i % 7 === 0) html += "</tr><tr>";
      if (i < startWeekday || day > lastDate) {
        html += '<td><span class="is-muted">&nbsp;</span></td>';
      } else {
        const isHi = day === highlightDay;
        const inner = isHi
          ? `<span class="is-today" aria-label="예식일"><span class="heart" title="Wedding Day">♥</span></span>`
          : String(day);
        html += `<td>${inner}</td>`;
        day++;
      }
    }
    html += "</tr></tbody></table>";
    return html;
  }

  function renderGreeting() {
    const g = cfg.greeting;
    const greetEl = document.getElementById("greeting-content");
    if (greetEl) {
      greetEl.innerHTML = g.lines.map((line) => `<p>${line}</p>`).join("");
    }
    const names = document.getElementById("names-block");
    if (names) {
      names.innerHTML = `
        <p class="names-block__line">${g.groomLine}</p>
        <p class="names-block__line names-block__line--spaced">${g.brideLine}</p>
      `;
    }
  }

  function renderFamilyContactModal() {
    const body = document.getElementById("family-contact-body");
    if (!body || !cfg.familyContacts) return;

    const fc = cfg.familyContacts;
    function block(side) {
      return `
        <div class="contact-side">
          <h3 class="contact-side__label">${side.label}</h3>
          <ul class="contact-list">
            ${side.people
              .map(
                (p) => `
              <li class="contact-list__item">
                <div class="contact-list__who">
                  <span class="contact-list__name">${p.name}</span>
                  <span class="contact-list__role">${p.role}</span>
                </div>
                <a class="contact-list__tel" href="tel:${String(p.phone).replace(/[^0-9+]/g, "")}">${p.phone}</a>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    }

    body.innerHTML = block(fc.groomSide) + block(fc.brideSide);

    const modal = document.getElementById("family-contact-modal");
    const openBtn = document.getElementById("btn-family-contact");
    const closeBtn = document.getElementById("family-contact-close");
    const backdrop = document.getElementById("family-contact-backdrop");

    function openModal() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      openBtn.focus();
    }

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (!modal.hidden && e.key === "Escape") closeModal();
    });
  }

  function renderHero() {
    const h = cfg.hero;
    const img = document.querySelector(".hero__img");
    if (img) {
      img.src = resolveImage(h.image);
      img.alt = "웨딩 메인 사진";
    }
    const t = document.getElementById("hero-title");
    const s = document.getElementById("hero-subtitle");
    const v = document.getElementById("hero-venue");
    if (t) t.textContent = h.title;
    if (s) s.textContent = h.subtitle;
    if (v) v.textContent = h.venueLine;
  }

  function renderMapPin() {
    const el = document.getElementById("map-pin-illustration");
    if (el) el.innerHTML = COUPLE_PIN_SVG;
  }

  function renderProfiles() {
    const p = cfg.profiles;
    const gi = document.getElementById("profile-groom-img");
    const bi = document.getElementById("profile-bride-img");
    if (gi) {
      gi.src = resolveImage(p.groom.image);
      gi.alt = p.groom.name;
    }
    if (bi) {
      bi.src = resolveImage(p.bride.image);
      bi.alt = p.bride.name;
    }
    document.getElementById("profile-groom-name").textContent = p.groom.name;
    document.getElementById("profile-bride-name").textContent = p.bride.name;
    document.getElementById("profile-groom-msg").textContent = p.groom.message;
    document.getElementById("profile-bride-msg").textContent = p.bride.message;
  }

  function getWeddingInstant() {
    const w = cfg.weddingDay;
    if (w.dateTimeISO) return new Date(w.dateTimeISO);
    const hour = w.hour != null ? w.hour : 17;
    const minute = w.minute != null ? w.minute : 40;
    return new Date(w.year, w.month - 1, w.day, hour, minute, 0);
  }

  function renderWeddingDay() {
    const w = cfg.weddingDay;
    document.getElementById("wedding-day-title").textContent = w.title;
    const monthEl = document.getElementById("wedding-month-label");
    if (monthEl) monthEl.textContent = w.monthLabel || `${w.month}월`;

    const calRoot = document.getElementById("calendar-root");
    if (calRoot) {
      calRoot.innerHTML = buildCalendar(w.year, w.month, w.day);
    }
    const meta = document.getElementById("wedding-day-meta");
    if (meta) {
      meta.innerHTML = `
        <p><strong>${w.year}. ${String(w.month).padStart(2, "0")}. ${String(w.day).padStart(2, "0")}</strong></p>
        <p>${w.weekdayLabel}</p>
        <p>${w.venueName}</p>
        <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">${w.address}</p>
      `;
    }
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function initCountdown() {
    const target = getWeddingInstant().getTime();
    const elDays = document.getElementById("cd-days");
    const elHours = document.getElementById("cd-hours");
    const elMins = document.getElementById("cd-mins");
    const elSecs = document.getElementById("cd-secs");
    const elDone = document.getElementById("countdown-done");
    const digits = document.querySelector(".countdown__digits");
    const label = document.querySelector(".countdown__label");

    function tick() {
      const now = Date.now();
      let diff = target - now;

      if (diff <= 0) {
        if (digits) digits.hidden = true;
        if (label) label.hidden = true;
        if (elDone) {
          elDone.hidden = false;
          elDone.textContent = "저희 결혼식 날이에요 💍";
        }
        return;
      }

      if (elDone) elDone.hidden = true;
      if (digits) digits.hidden = false;
      if (label) label.hidden = false;

      const sec = Math.floor(diff / 1000) % 60;
      const min = Math.floor(diff / 60000) % 60;
      const hour = Math.floor(diff / 3600000) % 24;
      const day = Math.floor(diff / 86400000);

      if (elDays) elDays.textContent = String(day);
      if (elHours) elHours.textContent = pad2(hour);
      if (elMins) elMins.textContent = pad2(min);
      if (elSecs) elSecs.textContent = pad2(sec);
    }

    tick();
    setInterval(tick, 1000);
  }

  function googleCalendarUrl() {
    const w = cfg.weddingDay;
    const start = getWeddingInstant();
    const end = new Date(start.getTime() + 3 * 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const title = encodeURIComponent(`${w.venueName} 결혼식`);
    const details = encodeURIComponent(w.address);
    const loc = encodeURIComponent(w.address);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(
      end
    )}&details=${details}&location=${loc}`;
  }

  function renderQuickActions() {
    const root = document.getElementById("quick-actions");
    if (!root) return;

    const likedKey = "invite-liked";
    const isLiked = localStorage.getItem(likedKey) === "1";

    root.innerHTML = `
      <button type="button" class="qa-btn" id="qa-copy" title="청첩장 링크 복사" aria-label="청첩장 링크 복사">🔗</button>
      <a class="qa-btn" id="qa-cal" href="${googleCalendarUrl()}" target="_blank" rel="noopener" title="구글 캘린더" aria-label="구글 캘린더에 추가">📅</a>
      <button type="button" class="qa-btn" id="qa-gallery" title="갤러리로 이동" aria-label="갤러리로 이동">🖼️</button>
      <button type="button" class="qa-btn" id="qa-like" title="좋아요" aria-label="좋아요" aria-pressed="${isLiked}">❤️</button>
    `;

    document.getElementById("qa-copy").addEventListener("click", () => {
      copyText(window.location.href.split("#")[0]);
    });
    document.getElementById("qa-gallery").addEventListener("click", () => scrollToId("gallery"));
    const likeBtn = document.getElementById("qa-like");
    likeBtn.addEventListener("click", () => {
      const next = localStorage.getItem(likedKey) === "1" ? "0" : "1";
      localStorage.setItem(likedKey, next);
      likeBtn.setAttribute("aria-pressed", next === "1" ? "true" : "false");
      showToast(next === "1" ? "마음을 담았어요." : "취소했습니다.");
    });
    if (isLiked) likeBtn.setAttribute("aria-pressed", "true");
  }

  let galleryUrls = [];

  function renderGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid) return;
    galleryUrls = cfg.gallery.map((p) => resolveImage(p));
    grid.innerHTML = cfg.gallery
      .map(
        (path, i) => `
      <button type="button" class="gallery-item" data-index="${i}" aria-label="사진 ${i + 1} 크게 보기">
        <img src="${galleryUrls[i]}" alt="갤러리 ${i + 1}" loading="lazy" width="400" height="400" />
      </button>
    `
      )
      .join("");

    const dots = document.createElement("div");
    dots.className = "gallery-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.innerHTML = '<span class="is-active"></span><span></span><span></span>';
    grid.after(dots);
  }

  function setupLightbox() {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const close = document.getElementById("lightbox-close");
    const prev = document.getElementById("lightbox-prev");
    const next = document.getElementById("lightbox-next");
    const counter = document.getElementById("lightbox-counter");
    let index = 0;

    function update() {
      if (!galleryUrls.length) return;
      img.src = galleryUrls[index];
      counter.textContent = `${index + 1} / ${galleryUrls.length}`;
    }

    function open(i) {
      index = i;
      update();
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeLb() {
      lb.hidden = true;
      document.body.style.overflow = "";
      img.removeAttribute("src");
    }

    document.getElementById("gallery-grid").addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery-item");
      if (!btn) return;
      open(parseInt(btn.dataset.index, 10));
    });

    close.addEventListener("click", closeLb);
    prev.addEventListener("click", () => {
      index = (index - 1 + galleryUrls.length) % galleryUrls.length;
      update();
    });
    next.addEventListener("click", () => {
      index = (index + 1) % galleryUrls.length;
      update();
    });

    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLb();
    });

    document.addEventListener("keydown", (e) => {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") prev.click();
      if (e.key === "ArrowRight") next.click();
    });

    let touchStartX = 0;
    lb.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    lb.addEventListener(
      "touchend",
      (e) => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) next.click();
        else prev.click();
      },
      { passive: true }
    );
  }

  function renderLocation() {
    const L = cfg.location;
    document.getElementById("location-title").textContent = L.titleKo;
    document.getElementById("location-venue").textContent = L.venueName;
    document.getElementById("location-address").textContent = L.address;
    const iframe = document.getElementById("map-iframe");
    if (iframe && L.mapEmbedUrl) {
      iframe.src = L.mapEmbedUrl;
    }

    const d = L.directions;
    document.getElementById("direction-list").innerHTML = `
      <dl>
        <dt>🚇 지하철</dt>
        <dd>${d.subway}</dd>
        <dt>🚌 버스</dt>
        <dd>${d.bus}</dd>
        <dt>🅿 주차</dt>
        <dd>${d.parking}</dd>
      </dl>
    `;

    const nameEnc = encodeURIComponent(L.venueName);
    const addrEnc = encodeURIComponent(L.address);
    const lat = L.lat;
    const lng = L.lng;

    const kakao = `https://map.kakao.com/link/map/${nameEnc},${lat},${lng}`;
    const naver = `https://map.naver.com/v5/search/${addrEnc}`;
    const google = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    const tmap = `https://tmap.co.kr/tmap3/mobileRoute.jsp?searchKeyword=${addrEnc}`;

    document.getElementById("nav-apps").innerHTML = `
      <a class="nav-app" href="${kakao}" target="_blank" rel="noopener">카카오맵</a>
      <a class="nav-app" href="${naver}" target="_blank" rel="noopener">네이버 지도</a>
      <a class="nav-app" href="${tmap}" target="_blank" rel="noopener">T map</a>
      <a class="nav-app" href="${google}" target="_blank" rel="noopener">구글 지도</a>
    `;
  }

  function renderInstagram() {
    const ig = cfg.instagram;
    document.getElementById("ig-avatar").src = resolveImage(ig.avatar);
    document.getElementById("ig-post").src = resolveImage(ig.postImage);
    document.getElementById("ig-user").textContent = ig.username;
    document.getElementById("ig-likes").textContent = ig.likedBy;
    document.getElementById("ig-caption").textContent = ig.caption;
  }

  function renderMeal() {
    const m = cfg.meal;
    document.getElementById("meal-title").textContent = m.title;
    document.getElementById("meal-img").src = resolveImage(m.image);
    document.getElementById("meal-img").alt = m.title;
    document.getElementById("meal-text").textContent = m.text;
  }

  function renderAccounts() {
    const a = cfg.accounts;
    document.getElementById("accounts-title").textContent = a.title;

    function banksHtml(side, key) {
      return side.banks
        .map(
          (row, i) => `
        <div class="bank-row">
          <div class="bank-row__info">
            <strong>${row.bank}</strong> ${row.number}<br />
            <span style="color:var(--text-muted);font-size:0.78rem">${row.holder}</span>
          </div>
          <button type="button" class="bank-row__copy" data-copy="${row.number.replace(/-/g, "")}" data-label="${key}-${i}">
            복사
          </button>
        </div>
      `
        )
        .join("");
    }

    document.getElementById("accounts-accordion").innerHTML = `
      <div class="acc-item" data-acc>
        <button type="button" class="acc-item__head" aria-expanded="false">${a.groomSide.label}</button>
        <div class="acc-item__body">${banksHtml(a.groomSide, "groom")}</div>
      </div>
      <div class="acc-item" data-acc>
        <button type="button" class="acc-item__head" aria-expanded="false">${a.brideSide.label}</button>
        <div class="acc-item__body">${banksHtml(a.brideSide, "bride")}</div>
      </div>
    `;

    document.getElementById("accounts-accordion").addEventListener("click", (e) => {
      const copyBtn = e.target.closest(".bank-row__copy");
      if (copyBtn && copyBtn.dataset.copy) {
        copyText(copyBtn.dataset.copy);
        return;
      }
      const head = e.target.closest(".acc-item__head");
      if (!head) return;
      const item = head.closest(".acc-item");
      const open = item.classList.contains("is-open");
      document.querySelectorAll(".acc-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector(".acc-item__head").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        head.setAttribute("aria-expanded", "true");
      }
    });
  }

  function renderFooter() {
    const f = cfg.footer;
    document.getElementById("footer-msg").textContent = f.message;
    document.getElementById("footer-contacts").innerHTML = `
      <a class="footer__link" href="tel:${f.groomPhone.replace(/[^0-9+]/g, "")}">신랑에게 연락하기 · ${f.groomPhone}</a>
      <a class="footer__link" href="tel:${f.bridePhone.replace(/[^0-9+]/g, "")}">신부에게 연락하기 · ${f.bridePhone}</a>
    `;
  }

  function bindHeroButtons() {
    const loc = document.getElementById("btn-to-location");
    if (loc) loc.addEventListener("click", () => scrollToId("location"));
  }

  renderHero();
  renderGreeting();
  renderFamilyContactModal();
  renderMapPin();
  renderProfiles();
  renderWeddingDay();
  initCountdown();
  renderQuickActions();
  renderGallery();
  setupLightbox();
  renderLocation();
  renderInstagram();
  renderMeal();
  renderAccounts();
  renderFooter();
  bindHeroButtons();
})();
