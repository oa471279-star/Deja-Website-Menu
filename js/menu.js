/* menu.js — صفحة المنيو: تُبنى بالكامل من data.js (بحث، تصفية، ترتيب). */
(function () {
  const root = document.getElementById("menu-root");
  const pills = document.getElementById("pills");
  const q = document.getElementById("q");
  const sort = document.getElementById("sort");
  const cats = DEJA.categories();
  const params = new URLSearchParams(location.search);
  const state = { cat: cats.some(c => c.key === params.get("cat")) ? params.get("cat") : "all", q: "", sort: "default" };

  function drawPills() {
    const items = [{ key: "all", name: "الكل" }, ...cats];
    pills.innerHTML = items.map(c => `<button class="pill" type="button" data-cat="${c.key}" aria-pressed="${state.cat === c.key}">${DEJA.esc(c.name)}</button>`).join("");
  }
  const price = p => DEJA.minPrice(p);
  function ordered(list) {
    if (state.sort === "asc") return [...list].sort((a, b) => price(a) - price(b));
    if (state.sort === "desc") return [...list].sort((a, b) => price(b) - price(a));
    return list;
  }
  function draw() {
    const term = DEJA.norm(state.q);
    const matches = p => !term || DEJA.norm(p.name + " " + p.description).includes(term);
    const shown = cats.filter(c => state.cat === "all" || c.key === state.cat);
    let total = 0, html = "";
    shown.forEach(c => {
      const list = ordered(PRODUCTS.filter(p => p.category === c.key && matches(p)));
      if (!list.length) return;
      total += list.length;
      html += `<section class="menu-section" id="cat-${c.key}" aria-labelledby="h-${c.key}"><h2 id="h-${c.key}">${DEJA.esc(c.name)}</h2><div class="grid">${list.map(DEJA.productCard).join("")}</div></section>`;
    });
    if (!total) {
      html = `<div class="empty"><img src="assets/images/mascot/chef-tray.png" alt="" loading="lazy"><h2>مفيش نتائج</h2><p>جرّب كلمة تانية أو اختار قسم مختلف.</p><button class="btn btn-sm" type="button" id="reset">عرض كل المنيو</button></div>`;
    } else {
      html = `<p class="count-note">${total} صنف</p>` + html;
    }
    root.innerHTML = html;
  }
  pills.addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    state.cat = b.dataset.cat; drawPills(); draw();
    history.replaceState(null, "", state.cat === "all" ? "menu.html" : `menu.html?cat=${state.cat}`);
  });
  q.addEventListener("input", () => { state.q = q.value; draw(); });
  sort.addEventListener("change", () => { state.sort = sort.value; draw(); });
  root.addEventListener("click", e => {
    if (e.target.id === "reset") { state.cat = "all"; state.q = ""; q.value = ""; drawPills(); draw(); }
  });
  Cart.onChange(() => document.querySelectorAll(".cart-count").forEach(el => { el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }));
  drawPills(); draw();
})();
