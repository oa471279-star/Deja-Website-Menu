/* app.js — الدوال المشتركة: الهيدر والفوتر، حساب الأسعار، بطاقة المنتج، الأيقونات، التنبيهات. */
const DEJA = (() => {
  /* ------------------------------ أيقونات SVG ------------------------------ */
  const P = {
    cart: '<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.6 12.2a1.5 1.5 0 0 0 1.5 1.2h8.6a1.5 1.5 0 0 0 1.5-1.1L21 8H6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4zM13.5 6.5l4 4"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    flame: '<path d="M12 3c1 3.500-3 5-3 9a3 3 0 0 0 6 0c0-1.500-.7-2.500-1.500-3.500C14.500 9 17 11 17 14.500a5 5 0 0 1-10 0C7 9 11 7 12 3z"/>',
    star: '<path d="m12 3 2.700 5.600 6.100.8-4.500 4.200 1.100 6.100L12 16.800 6.600 19.700l1.100-6.100L3.200 9.400l6.100-.8z"/>',
    whatsapp: '<path d="M4 20l1.300-4.200A8 8 0 1 1 8.400 18.800L4 20z"/><path d="M9.200 8.800c.3 2.800 2.700 5.200 5.600 5.600l1.200-1.300-2-1-.9.700c-.9-.4-1.700-1.200-2.100-2.100l.7-.9-1-2z"/>',
    truck: '<path d="M2 6h11v10H2zM13 9h4l3 3v4h-7M6 19a1.500 1.500 0 1 0 0-.01M17 19a1.500 1.500 0 1 0 0-.01"/>',
    store: '<path d="M4 9l1.500-5h13L20 9M4 9v11h16V9M4 9a2.700 2.700 0 0 0 5.300 0 2.700 2.700 0 0 0 5.400 0A2.700 2.700 0 0 0 20 9M10 20v-5h4v5"/>',
    arrow: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    phone: '<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5zM3 13l9 5 9-5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3.500 6h.01M3.500 12h.01M3.500 18h.01"/>',
    facebook: '<path d="M14 8h2.500V4.500H14A4 4 0 0 0 10 8.500V11H7.500v3.500H10V21h3.500v-6.500H16l.5-3.500h-3V8.700c0-.4.200-.7.500-.7z"/>',
    instagram: '<rect x="3.500" y="3.500" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.200 6.800h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  };
  const icon = (n, cls = "") => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${P[n] || ""}</svg>`;

  /* -------------------------------- أدوات -------------------------------- */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = n => Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const money = n => `${fmt(n)} <span class="cur">${SITE.currency}</span>`;
  const moneyText = n => `${fmt(n)} ${SITE.currency}`;
  // توحيد النص العربي للبحث (إزالة التشكيل وتوحيد الهمزات والياء والتاء المربوطة)
  const norm = s => String(s || "").toLowerCase().replace(/[\u064B-\u065F\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/\s+/g, " ").trim();

  const categories = () => CATEGORIES.filter(c => c.enabled !== false).sort((a, b) => a.order - b.order);
  const categoryByKey = k => CATEGORIES.find(c => c.key === k);
  const activeProducts = () => { const keys = new Set(categories().map(c => c.key)); return PRODUCTS.filter(p => keys.has(p.category)); };
  const getProduct = id => PRODUCTS.find(p => p.id === +id);
  const hasSizes = p => Array.isArray(p.sizes) && p.sizes.length > 0;
  const hasExtras = p => Array.isArray(p.extras) && p.extras.length > 0;
  const minPrice = p => hasSizes(p) ? Math.min(...p.sizes.map(s => s.price)) : p.price;
  const sizeOf = (p, id) => hasSizes(p) ? (p.sizes.find(s => s.id === id) || p.sizes[0]) : null;
  const extraPrice = (ex, sizeId) => ex.priceBySize ? (ex.priceBySize[sizeId] ?? 0) : (ex.price || 0);
  const extrasFor = (p, sizeId) => (p.extras || []).filter(ex => !ex.priceBySize || ex.priceBySize[sizeId] != null);
  const unitPrice = (p, sizeId, extraIds = []) => {
    const base = hasSizes(p) ? sizeOf(p, sizeId).price : p.price;
    const ex = extrasFor(p, sizeId).filter(e => extraIds.includes(e.id)).reduce((t, e) => t + extraPrice(e, sizeId), 0);
    return base + ex;
  };

  /* حساب أسطر السلة من data.js (لا يتم تخزين أسعار في السلة) */
  function resolveCart() {
    const lines = [];
    Cart.load().forEach(item => {
      const p = getProduct(item.id);
      if (!p || !categoryByKey(p.category) || categoryByKey(p.category).enabled === false) { lines.push({ item, missing: true }); return; }
      const size = sizeOf(p, item.size);
      const sizeId = size ? size.id : "";
      const extras = extrasFor(p, sizeId).filter(e => item.extras.includes(e.id));
      const unit = unitPrice(p, sizeId, extras.map(e => e.id));
      lines.push({ item, product: p, size, extras, unit, subtotal: unit * item.qty, unavailable: p.available === false });
    });
    return lines;
  }
  function totals() {
    const lines = resolveCart().filter(l => !l.missing && !l.unavailable);
    return { lines, qty: lines.reduce((n, l) => n + l.item.qty, 0), subtotal: lines.reduce((t, l) => t + l.subtotal, 0) };
  }

  /* ----------------------------- عرض المنتجات ----------------------------- */
  function imageHTML(p, cls = "") {
    const src = p.image ? esc(p.image) : "";
    return `<div class="media ${cls}"><div class="ph" aria-hidden="true"><img src="assets/images/decorations/mark.png" alt=""></div>` +
      (src ? `<img class="pimg" src="${src}" alt="${esc(p.name)}" loading="lazy" decoding="async" data-fallback>` : "") + `</div>`;
  }
  function priceHTML(p) {
    return hasSizes(p) && p.sizes.length > 1 ? `<span class="from">يبدأ من</span> ${money(minPrice(p))}` : money(minPrice(p));
  }
  function sizeChips(p) {
    if (!hasSizes(p) || p.sizes.length < 2) return hasSizes(p) ? `<ul class="chips"><li>${esc(p.sizes[0].label)} فقط</li></ul>` : "";
    return `<ul class="chips">${p.sizes.map(s => `<li>${esc(s.label)} ${fmt(s.price)}</li>`).join("")}</ul>`;
  }
  function productCard(p) {
    const needsChoice = hasSizes(p) || hasExtras(p);
    const off = p.available === false;
    const badge = off ? `<span class="badge badge-off">غير متاح</span>` : p.badge ? `<span class="badge">${p.badge === "حار" ? icon("flame") : ""}${esc(p.badge)}</span>` : "";
    const action = off
      ? `<button class="btn btn-ghost btn-sm" disabled>غير متاح حاليًا</button>`
      : needsChoice
        ? `<a class="btn btn-sm" href="product.html?id=${p.id}">اختار طلبك</a>`
        : `<button class="btn btn-sm" type="button" data-quick-add="${p.id}">${icon("plus")}أضف للسلة</button>`;
    return `<article class="card ${off ? "is-off" : ""}">
      <a class="card-media" href="product.html?id=${p.id}" aria-label="${esc(p.name)}">${imageHTML(p)}${badge}</a>
      <div class="card-body">
        <h3 class="card-title"><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
        ${p.description ? `<p class="card-desc">${esc(p.description)}</p>` : ""}
        ${sizeChips(p)}
        <div class="card-foot"><div class="price">${priceHTML(p)}</div>${action}</div>
      </div></article>`;
  }

  /* ------------------------------- تنبيهات ------------------------------- */
  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("aria-live", "polite"); document.body.appendChild(t); }
    t.innerHTML = icon("check") + `<span>${esc(msg)}</span>`;
    t.classList.add("show"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }

  /* --------------------------- الهيدر والفوتر --------------------------- */
  function renderChrome(active) {
    const links = [["index.html", "الرئيسية", "home"], ["menu.html", "المنيو", "menu"], ["cart.html", "السلة", "cart"]];
    const nav = links.map(([h, t, k]) => `<a href="${h}" ${active === k ? 'aria-current="page"' : ""}>${t}</a>`).join("");
    const header = document.getElementById("site-header");
    if (header) header.innerHTML = `<div class="wrap bar">
      <a class="brand" href="index.html" aria-label="${SITE.name} — الرئيسية"><img src="assets/images/logo/logo-red.png" alt="${SITE.name}" width="712" height="184"></a>
      <nav class="nav" id="nav" aria-label="التنقل الرئيسي">${nav}<a class="nav-cta" href="menu.html">اطلب دلوقتي</a></nav>
      <div class="bar-actions">
        <a class="cart-link" href="cart.html" aria-label="السلة"><span class="sr">السلة</span>${icon("cart")}<span class="cart-count" data-cart-count hidden>0</span></a>
        <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav" aria-label="القائمة">${icon("menu")}</button>
      </div></div>`;
    const btn = header && header.querySelector(".menu-btn");
    if (btn) btn.addEventListener("click", () => {
      const open = header.classList.toggle("open"); btn.setAttribute("aria-expanded", open);
      btn.innerHTML = icon(open ? "close" : "menu");
    });
    const footer = document.getElementById("site-footer");
    if (footer) footer.innerHTML = `<div class="wrap foot">
      <div class="foot-brand"><img src="assets/images/logo/logo-cream.png" alt="${SITE.name}" width="712" height="184" loading="lazy">
        <p class="foot-slogan">${SITE.slogan}</p></div>
      <div class="foot-col"><h2>تصفح</h2><a href="index.html">الرئيسية</a><a href="menu.html">المنيو</a><a href="cart.html">السلة</a></div>
      <div class="foot-col"><h2>اطلب</h2><a class="foot-wa" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener">${icon("whatsapp")}<span dir="ltr">0${SITE.whatsapp.slice(2)}</span></a>
        <p class="foot-note">الطلب يُرسل عبر واتساب، ويُعتبر مؤكدًا بعد استلام المطعم للرسالة.</p>
        <ul class="social" aria-label="صفحات ديجا على السوشيال ميديا">
          <li><a href="${esc(SITE.facebook)}" target="_blank" rel="noopener noreferrer" aria-label="صفحة ديجا على فيسبوك (تفتح في تبويب جديد)">${icon("facebook")}</a></li>
          <li><a href="${esc(SITE.instagram)}" target="_blank" rel="noopener noreferrer" aria-label="صفحة ديجا على انستجرام (تفتح في تبويب جديد)">${icon("instagram")}</a></li>
        </ul></div></div>
      <div class="foot-end"><div class="wrap">${SITE.name} — ${SITE.sloganEn}</div>
        <div class="wrap dev-credit"><p>Designed &amp; Developed by <a href="https://oa471279-star.github.io/omar-samir/" target="_blank" rel="noopener noreferrer">Omar Samir</a></p></div></div>`;
    updateCount();
  }
  function updateCount() {
    const n = Cart.count();
    document.querySelectorAll("[data-cart-count]").forEach(el => { el.textContent = n; el.hidden = n === 0; });
  }
  Cart.onChange(updateCount);

  /* احتياطي الصور: إن لم توجد صورة المنتج تبقى بطاقة ديجا البديلة ظاهرة */
  document.addEventListener("error", e => {
    const el = e.target;
    if (el && el.tagName === "IMG" && el.hasAttribute("data-fallback")) el.remove();
  }, true);

  /* إضافة سريعة من البطاقات */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-quick-add]");
    if (!b) return;
    const p = getProduct(b.dataset.quickAdd);
    if (!p || p.available === false) return;
    Cart.add({ id: p.id, qty: 1 });
    toast(`تمت إضافة ${p.name} إلى السلة`);
  });

  /* كشف تدريجي للأقسام (يحترم تقليل الحركة) */
  function reveal() {
    const els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  return { icon, esc, fmt, money, moneyText, norm, categories, categoryByKey, activeProducts, getProduct, hasSizes, hasExtras, minPrice, sizeOf, extraPrice, extrasFor, unitPrice, resolveCart, totals, productCard, imageHTML, toast, renderChrome, updateCount, reveal };
})();
