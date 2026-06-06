
(function () {
  "use strict";

  const cfg = window.INVITATION_CONFIG;
  if (!cfg) {
    console.error("config.js를 불러오세요.");
    return;
  }

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

  let surpriseAudioCtx = null;
  function ensureSurpriseAudioContext() {
    if (surpriseAudioCtx) return surpriseAudioCtx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    surpriseAudioCtx = new AC();
    return surpriseAudioCtx;
  }

  /** 숨은 사진용 — sound 파일이 없을 때 짧은 효과음 */
  function playChime() {
    const ctx = ensureSurpriseAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    o.type = "sine";
    const t0 = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    o.start(t0);
    o.stop(t0 + 0.33);
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
      greetEl.innerHTML = g.lines
        .map((line) => {
          const safeLine = String(line || "");
          if (!safeLine) return "<p></p>";
          const first = safeLine.charAt(0);
          const rest = safeLine.slice(1);
          return `<p><span class="greeting__initial">${first}</span>${rest}</p>`;
        })
        .join("");
    }
    const names = document.getElementById("names-block");
    if (names) {
      const sep = '<span class="names-block__sep">*</span>';
      const gp = g.groomParents || [];
      const bp = g.brideParents || [];
      const gParents =
        gp.length >= 2
          ? `<span>${gp[0]}</span>${sep}<span>${gp[1]}</span>`
          : g.groomLine || "";
      const bParents =
        bp.length >= 2
          ? `<span>${bp[0]}</span>${sep}<span>${bp[1]}</span>`
          : g.brideLine || "";
      const gName = g.groomName || "";
      const bName = g.brideName || "";
      names.innerHTML = `
        <div class="names-block__parents-row">
          <div class="names-block__parent-pair">${gParents}</div>
          <div class="names-block__parent-pair">${bParents}</div>
        </div>
        <div class="names-block__couple-row">
          <span class="names-block__groom">${gName}</span>
          <span class="names-block__heart" aria-hidden="true">♥</span>
          <span class="names-block__bride">${bName}</span>
        </div>
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
                  <span class="contact-list__role">${p.role}</span>
                  <span class="contact-list__name">${p.name}</span>
                </div>
                <div class="contact-list__actions">
                  <a class="contact-list__icon-btn" href="tel:${String(p.phone).replace(/[^0-9+]/g, "")}">
                    <img src="images/phone.png" alt="전화" width="22" height="22" loading="lazy" decoding="async" />
                  </a>
                  <a class="contact-list__icon-btn" href="sms:${String(p.phone).replace(/[^0-9+]/g, "")}">
                    <img src="images/message.png" alt="문자" width="22" height="22" loading="lazy" decoding="async" />
                  </a>
                </div>
              </li>
            `
              )
              .join("")}
          </ul>
        </div>
      `;
    }

    const modal = document.getElementById("family-contact-modal");
    const openBtn = document.getElementById("btn-family-contact");
    const closeBtn = document.getElementById("family-contact-close");
    const backdrop = document.getElementById("family-contact-backdrop");
    let openingTimer = null;
    let bodyRendered = false;

    function ensureBody() {
      if (bodyRendered) return;
      bodyRendered = true;
      body.innerHTML = block(fc.groomSide) + block(fc.brideSide);
    }

    function openModal() {
      ensureBody();
      if (openingTimer) clearTimeout(openingTimer);
      openBtn.disabled = true;
      openBtn.classList.add("is-waiting");
      modal.classList.remove("is-open");
      modal.hidden = false;
      openingTimer = setTimeout(() => {
        document.body.style.overflow = "hidden";
        modal.classList.add("is-open");
        closeBtn.focus();
        openBtn.disabled = false;
        openBtn.classList.remove("is-waiting");
      }, 220);
    }

    function closeModal() {
      if (openingTimer) {
        clearTimeout(openingTimer);
        openingTimer = null;
      }
      modal.hidden = true;
      modal.classList.remove("is-open");
      openBtn.disabled = false;
      openBtn.classList.remove("is-waiting");
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
    if (t) {
      t.textContent = "";
      t.classList.add("hero__float-title--typing");
      const text = h.title || "";
      let idx = 0;
      const timer = setInterval(() => {
        idx += 1;
        t.textContent = text.slice(0, idx);
        if (idx >= text.length) {
          clearInterval(timer);
          setTimeout(() => t.classList.remove("hero__float-title--typing"), 900);
        }
      }, 140);
    }
    if (s) s.textContent = h.subtitle;
    if (v) v.textContent = h.venueLine;
  }

  function initHeroFlowerRain() {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const opts = cfg.heroEffects || {};
    if (!opts.enabled) return;
    const count = Math.max(4, Math.min(12, Number(opts.petalCount) || 7));
    const petals = ["✽"];
    const layer = document.createElement("div");
    layer.className = "hero-flower-rain";
    layer.style.setProperty("--fall-distance", `${hero.offsetHeight + 120}px`);
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const node = document.createElement("span");
      node.className = "hero-flower-rain__petal";
      node.textContent = petals[i % petals.length];
      node.style.left = `${Math.random() * 100}%`;
      node.style.animationDelay = `${Math.random() * 12}s`;
      node.style.animationDuration = `${11 + Math.random() * 8}s`;
      node.style.opacity = `${0.2 + Math.random() * 0.3}`;
      node.style.setProperty("--drift-x", `${-12 + Math.random() * 24}px`);
      frag.appendChild(node);
    }
    layer.appendChild(frag);
    hero.appendChild(layer);
  }

  function initSurprisePhotos() {
    const surprise = cfg.surprisePhotos || {};
    if (!surprise.enabled) return;

    const modal = document.getElementById("surprise-modal");
    const dim = document.getElementById("surprise-dim");
    const closeBtn = document.getElementById("surprise-close");
    const img = document.getElementById("surprise-img");

    if (!modal || !dim || !closeBtn || !img) return;

    const hotspots = Array.isArray(surprise.hotspots) ? surprise.hotspots : [];
    if (!hotspots.length) return;

    const soundPaths = Array.isArray(surprise.sounds) ? surprise.sounds : [];
    function playSound() {
      if (!soundPaths.length) {
        playChime();
        return;
      }
      const sound = soundPaths[Math.floor(Math.random() * soundPaths.length)];
      const audio = new Audio(sound);
      audio.volume = 0.85;
      audio.play().catch(() => playChime());
    }

    function openTargetPhoto(photoPath) {
      if (!photoPath) return;
      img.src = resolveImage(photoPath);
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      playSound();
    }

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      img.removeAttribute("src");
    }

    function mountHotspot(spot, idx, parent) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hidden-hotspot";
      btn.setAttribute("aria-label", spot.label || `숨은 요소 ${idx + 1}`);
      btn.style.left = `${spot.x}%`;
      btn.style.top = `${spot.y}%`;
      btn.style.width = `${spot.width || spot.size || 28}px`;
      btn.style.height = `${spot.height || spot.size || 28}px`;

      if (spot.icon) {
        btn.style.backgroundImage = `url("${resolveImage(spot.icon)}")`;
      } else {
        btn.textContent = "•";
      }

      btn.addEventListener("click", () => openTargetPhoto(spot.content));
      parent.appendChild(btn);
    }

    function mountSectionHotspots(sectionId, spots) {
      const parent = document.getElementById(sectionId);
      if (!parent) return;
      parent.classList.add("hidden-hotspot-anchor");
      spots.forEach((spot, idx) => mountHotspot(spot, idx, parent));
    }

    const bySection = {};
    hotspots.forEach((spot) => {
      const sectionId = spot.section || "hero";
      (bySection[sectionId] ||= []).push(spot);
    });

    if ("IntersectionObserver" in window) {
      Object.entries(bySection).forEach(([sectionId, spots]) => {
        const parent = document.getElementById(sectionId);
        if (!parent) return;
        const obs = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            mountSectionHotspots(sectionId, spots);
            obs.disconnect();
          },
          { rootMargin: "120px" }
        );
        obs.observe(parent);
      });
    } else {
      Object.entries(bySection).forEach(([sectionId, spots]) => mountSectionHotspots(sectionId, spots));
    }

    closeBtn.addEventListener("click", closeModal);
    dim.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (!modal.hidden && e.key === "Escape") closeModal();
    });
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
    let done = false;
    let lastDay = -1;
    let lastHour = -1;
    let lastMin = -1;
    let lastSec = -1;

    function tick() {
      const diff = target - Date.now();

      if (diff <= 0) {
        if (!done) {
          done = true;
          if (digits) digits.hidden = true;
          if (label) label.hidden = true;
          if (elDone) {
            elDone.hidden = false;
            elDone.textContent = "저희 결혼식 날이에요 💍";
          }
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

      if (elDays && day !== lastDay) {
        lastDay = day;
        elDays.textContent = String(day);
      }
      if (elHours && hour !== lastHour) {
        lastHour = hour;
        elHours.textContent = pad2(hour);
      }
      if (elMins && min !== lastMin) {
        lastMin = min;
        elMins.textContent = pad2(min);
      }
      if (elSecs && sec !== lastSec) {
        lastSec = sec;
        elSecs.textContent = pad2(sec);
      }
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
        <img src="${galleryUrls[i]}" alt="갤러리 ${i + 1}" loading="lazy" decoding="async" width="400" height="400" />
      </button>
    `
      )
      .join("");
  }

  function fillLightboxSocial() {
    const gs = cfg.gallerySocial || cfg.instagram;
    if (!gs) return;
    const user = document.getElementById("lightbox-ig-user");
    const likes = document.getElementById("lightbox-ig-likes");
    const cap = document.getElementById("lightbox-ig-caption");
    if (user) {
      const u = gs.username || "";
      user.textContent = u.startsWith("@") ? u : u ? `@${u}` : "";
    }
    if (likes) likes.textContent = gs.likedBy || "";
    if (cap) cap.textContent = gs.caption || "";
  }

  function loadLightboxAvatar() {
    const gs = cfg.gallerySocial || cfg.instagram;
    const av = document.getElementById("lightbox-ig-avatar");
    if (!gs || !av || av.dataset.loaded) return;
    av.src = resolveImage(gs.avatar);
    av.dataset.loaded = "1";
  }

  function setupLightbox() {
    const lb = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const close = document.getElementById("lightbox-close");
    const prev = document.getElementById("lightbox-prev");
    const next = document.getElementById("lightbox-next");
    const counter = document.getElementById("lightbox-counter");
    let index = 0;

    fillLightboxSocial();

    function update() {
      if (!galleryUrls.length) return;
      img.src = galleryUrls[index];
      counter.textContent = `${index + 1} / ${galleryUrls.length}`;
    }

    function open(i) {
      index = i;
      loadLightboxAvatar();
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

    const dim = document.getElementById("lightbox-dim");
    close.addEventListener("click", closeLb);
    if (dim) dim.addEventListener("click", closeLb);
    prev.addEventListener("click", (e) => {
      e.stopPropagation();
      index = (index - 1 + galleryUrls.length) % galleryUrls.length;
      update();
    });
    next.addEventListener("click", (e) => {
      e.stopPropagation();
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
        // 손가락이 2개 이상이면(확대 제스처 등) 로직을 실행하지 않음
        if (e.touches.length > 1) {
          touchStartX = 0;
          return;
        }
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );
    lb.addEventListener(
      "touchend",
      (e) => {
        // 확대 중이었거나, 손가락이 아직 화면에 남아있다면(두 손가락 중 하나를 뗀 경우 등) 무시
        if (touchStartX === 0 || e.touches.length > 0) return;

        const dx = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) next.click();
        else prev.click();

        touchStartX = 0; // 초기화
      },
      { passive: true }
    );
  }

  function buildMapEmbedUrl(L) {
    if (!L) return "";
    const provider = L.mapEmbedProvider || "osm";
    const lat = Number(L.lat);
    const lng = Number(L.lng);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);

    if (provider === "custom" && L.mapEmbedUrl) {
      return L.mapEmbedUrl;
    }

    if (provider === "google" && hasCoords) {
      return `https://maps.google.com/maps?q=${lat},${lng}&hl=ko&z=16&output=embed`;
    }

    if (hasCoords) {
      const padLng = 0.007;
      const padLat = 0.007;
      const bbox = `${lng - padLng},${lat - padLat},${lng + padLng},${lat + padLat}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lng}`;
    }

    if (L.mapEmbedUrl) {
      try {
        const url = new URL(L.mapEmbedUrl);
        const q = url.searchParams.get("q");
        if (q) url.searchParams.set("q", q);
        if (!url.searchParams.has("hl")) url.searchParams.set("hl", "ko");
        if (!url.searchParams.has("z")) url.searchParams.set("z", "16");
        if (!url.searchParams.has("output")) url.searchParams.set("output", "embed");
        return url.toString();
      } catch (e) {
        return L.mapEmbedUrl;
      }
    }

    return "";
  }

  function buildKakaoMapUrl(L) {
    if (L.kakaoMapUrl) return L.kakaoMapUrl;
    const lat = Number(L.lat);
    const lng = Number(L.lng);
    const label = encodeURIComponent(L.venueName || "예식장");
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return `https://map.kakao.com/link/map/${label},${lat},${lng}`;
    }
    return `https://map.kakao.com/link/search/${encodeURIComponent(L.address || L.venueName || "")}`;
  }

  function renderLocation() {
    const L = cfg.location;
    document.getElementById("location-title").textContent = L.titleKo;
    document.getElementById("location-venue").textContent = L.venueName;
    document.getElementById("location-address").textContent = L.address;
    const iframe = document.getElementById("map-iframe");
    const embedUrl = buildMapEmbedUrl(L);
    const mapFrame = document.getElementById("map-frame");
    if (iframe && embedUrl) {
      const loadMap = () => {
        if (iframe.dataset.loaded) return;
        iframe.dataset.loaded = "1";
        iframe.src = embedUrl;
      };
      if ("IntersectionObserver" in window && mapFrame) {
        const obs = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            loadMap();
            obs.disconnect();
          },
          { rootMargin: "240px" }
        );
        obs.observe(mapFrame);
      } else {
        loadMap();
      }
    }

    const kakao = buildKakaoMapUrl(L);
    const mapExternal = document.getElementById("map-open-external");
    if (mapExternal) mapExternal.href = kakao;

    const d = L.directions;
    document.getElementById("direction-list").innerHTML = `
      <dl>
        <dt>🚇 지하철
        <dd>${d.subway}</dd>
        <dt>🚌 버스
        <dd>${d.bus}</dd>
        <dt>🅿 주차
        <dd>${d.parking}</dd>
      </dl>
    `;

    const addrEnc = encodeURIComponent(L.address);

    const kakaoNav = kakao;
    const naver = `https://map.naver.com/v5/search/${addrEnc}`;
    const google = `https://maps.app.goo.gl/M7rYMq6dSnA11WT56`;

    document.getElementById("nav-apps").innerHTML = `
      <a class="nav-app" href="${kakaoNav}" target="_blank" rel="noopener">카카오맵</a>
      <a class="nav-app" href="${naver}" target="_blank" rel="noopener">네이버 지도</a>
      <a class="nav-app" href="${google}" target="_blank" rel="noopener">구글 지도</a>
    `;
  }

  function initMusic() {
    const audio = document.getElementById("bgm-audio");
    const btn = document.getElementById("music-toggle");
    const zoomBtn = document.getElementById("btn-font-zoom");
    const musicCfg = cfg.music || {};
    const src = musicCfg.src;
    if (!audio || !btn) return;

    function toggleZoom() {
      const next = !document.documentElement.classList.contains("font-zoom");
      document.documentElement.classList.toggle("font-zoom", next);
      document.body.classList.toggle("font-zoom", next);
      if (!zoomBtn) return;
      zoomBtn.setAttribute("aria-pressed", next ? "true" : "false");
      zoomBtn.textContent = next ? "가- 기본 글씨" : "가+ 큰 글씨";
    }

    if (zoomBtn) zoomBtn.addEventListener("click", toggleZoom);

    const useAudioFile = Boolean(src);
    if (useAudioFile) {
      audio.src = src;
      audio.volume = typeof musicCfg.volume === "number" ? musicCfg.volume : 0.32;
    }
    btn.hidden = !useAudioFile;

    btn.addEventListener("click", async () => {
      if (!useAudioFile) return;
      if (audio.paused) {
        try {
          await audio.play();
          btn.classList.add("is-playing");
          btn.setAttribute("aria-pressed", "true");
        } catch (e) {}
      } else {
        audio.pause();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-pressed", "false");
      }
    });
  }

  function renderFinalNote() {
    const n = cfg.finalNote;
    if (!n) return;
    const img = document.getElementById("final-note-img");
    const text = document.getElementById("final-note-text");
    if (img) {
      img.src = resolveImage(n.image);
      img.alt = "마지막 안내 이미지";
    }
    if (text) text.textContent = n.text || "";
  }

  function applyCustomFonts() {
    const fonts = cfg.fonts || {};
    if (fonts.sans) document.documentElement.style.setProperty("--font-sans", fonts.sans);
    if (fonts.serif) document.documentElement.style.setProperty("--font-serif", fonts.serif);
    if (fonts.hero) document.documentElement.style.setProperty("--font-orbit", fonts.hero);
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
    const msg = document.getElementById("footer-msg");
    const contacts = document.getElementById("footer-contacts");
    if (!msg || !contacts || !f) return;
    msg.textContent = f.message || "";
    if (f.groomPhone && f.bridePhone) {
      contacts.innerHTML = `
      <a class="footer__link" href="tel:${f.groomPhone.replace(/[^0-9+]/g, "")}">신랑에게 연락하기 · ${f.groomPhone}</a>
      <a class="footer__link" href="tel:${f.bridePhone.replace(/[^0-9+]/g, "")}">신부에게 연락하기 · ${f.bridePhone}</a>
    `;
    } else {
      contacts.innerHTML = "";
    }
  }

  function bindHeroButtons() {
    const loc = document.getElementById("btn-to-location");
    if (loc) loc.addEventListener("click", () => scrollToId("location"));
  }

  applyCustomFonts();
  renderHero();
  initHeroFlowerRain();
  renderGreeting();
  renderFamilyContactModal();
  renderWeddingDay();
  initCountdown();
  renderQuickActions();
  renderGallery();
  setupLightbox();
  initMusic();
  renderLocation();
  renderAccounts();
  renderFinalNote();
  renderFooter();
  bindHeroButtons();
  initSurprisePhotos();
})();