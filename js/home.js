/* home.js — الصفحة الرئيسية: المميزة، الأقسام، الوجبات، ليه ديجا. كلها من data.js. */
(function () {
  const $ = id => document.getElementById(id);
  const products = DEJA.activeProducts();
  const cats = DEJA.categories();

  $("intro").textContent = SITE.intro;

  const feat = products.filter(p => p.featured);
  if (feat.length) $("featured-grid").innerHTML = feat.map(DEJA.productCard).join("");
  else $("featured").hidden = true;

  $("cat-grid").innerHTML = cats.map(c => {
    const n = PRODUCTS.filter(p => p.category === c.key).length;
    const img = c.image ? `<img class="cat-img" src="${DEJA.esc(c.image)}" alt="" loading="lazy" data-fallback>` : "";
    return `<a class="cat-tile" href="menu.html?cat=${c.key}">${img}<h3>${DEJA.esc(c.name)}</h3><span>${n} صنف ${DEJA.icon("arrow")}</span></a>`;
  }).join("");

  const mealsCat = DEJA.categoryByKey("meals");
  const meals = mealsCat && mealsCat.enabled !== false ? PRODUCTS.filter(p => p.category === "meals") : [];
  if (meals.length) {
    $("offers").hidden = false;
    $("offer-list").innerHTML = meals.map(p => `<div class="offer"><h3>${DEJA.esc(p.name)}</h3><div class="tag">${DEJA.money(DEJA.minPrice(p))}</div><p>${DEJA.esc(p.description)}</p>` +
      (p.available === false ? `<span>غير متاح حاليًا</span>` : `<button class="btn btn-cream btn-sm" type="button" data-quick-add="${p.id}">${DEJA.icon("plus")}أضف للسلة</button>`) + `</div>`).join("");
  }

  const multi = products.filter(DEJA.hasSizes).length;
  const why = [
    ["list", "منيو كامل", `${products.length} صنف في ${cats.length} أقسام: بيتزا، وجبات، باجت، برجر لحمة، برجر فراخ ومقبلات.`],
    ["layers", "اختار الحجم", `${multi} صنف بأكتر من حجم: ميديم ولارج للبيتزا، وسنجل ودبل للبرجر.`],
    ["whatsapp", "اطلب بسهولة", "الطلب بيتجهز كامل وبيتبعت على واتساب برقم المطعم."],
  ];
  $("why").innerHTML = why.map(([i, t, d]) => `<div class="why-item">${DEJA.icon(i)}<h3>${t}</h3><p>${d}</p></div>`).join("");
  DEJA.reveal();
})();
