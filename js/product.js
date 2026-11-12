/* product.js — صفحة تفاصيل المنتج: الحجم، الإضافات، الكمية، الملاحظات. وتعديل عنصر موجود في السلة (?edit=key). */
(function () {
  const root = document.getElementById("pd-root");
  const params = new URLSearchParams(location.search);
  const p = DEJA.getProduct(params.get("id"));
  const cat = p && DEJA.categoryByKey(p.category);
  if (!p || !cat || cat.enabled === false) {
    document.title = "المنتج غير موجود — DEJA ديجا";
    root.innerHTML = `<div class="empty"><img src="assets/images/mascot/chef-tray.png" alt=""><h1 class="h2">المنتج غير موجود</h1><p>ممكن يكون اتشال من المنيو.</p><a class="btn" href="menu.html">رجوع للمنيو</a></div>`;
    return;
  }
  const editKey = params.get("edit");
  const editing = editKey ? Cart.load().find(i => i.key === editKey && i.id === p.id) : null;
  const state = { size: editing ? editing.size : (DEJA.hasSizes(p) ? p.sizes[0].id : ""), extras: new Set(editing ? editing.extras : []), qty: editing ? editing.qty : 1, note: editing ? editing.note : "" };
  if (DEJA.hasSizes(p) && !p.sizes.some(s => s.id === state.size)) state.size = p.sizes[0].id;
  document.title = `${p.name} — DEJA ديجا`;
  const off = p.available === false;

  function extrasHTML() {
    const list = DEJA.extrasFor(p, state.size);
    state.extras.forEach(id => { if (!list.some(e => e.id === id)) state.extras.delete(id); });
    if (!list.length) return "";
    return `<fieldset class="opt"><legend>إضافات اختيارية</legend>${list.map(e => `<label class="choice check"><span class="name"><span class="mark">${DEJA.icon("check")}</span>${DEJA.esc(e.name)}</span><span class="p">+ ${DEJA.money(DEJA.extraPrice(e, state.size))}</span><input type="checkbox" name="extra" value="${DEJA.esc(e.id)}" ${state.extras.has(e.id) ? "checked" : ""}></label>`).join("")}</fieldset>`;
  }
  function sizesHTML() {
    if (!DEJA.hasSizes(p)) return "";
    return `<fieldset class="opt"><legend>${p.sizes.length > 1 ? "اختار الحجم" : "الحجم"}</legend>${p.sizes.map(s => `<label class="choice"><span class="name"><span class="mark"></span>${DEJA.esc(s.label)}</span><span class="p">${DEJA.money(s.price)}</span><input type="radio" name="size" value="${DEJA.esc(s.id)}" ${state.size === s.id ? "checked" : ""}></label>`).join("")}</fieldset>`;
  }
  function render() {
    root.innerHTML = `<nav class="crumbs" aria-label="مسار الصفحة"><a href="menu.html">المنيو</a><span aria-hidden="true">/</span><a href="menu.html?cat=${cat.key}">${DEJA.esc(cat.name)}</a><span aria-hidden="true">/</span><span>${DEJA.esc(p.name)}</span></nav>
    <div class="pd fade-in"><div>${DEJA.imageHTML(p)}</div>
      <div class="pd-info"><h1>${DEJA.esc(p.name)}</h1>
        ${p.description ? `<p class="desc">${DEJA.esc(p.description)}</p>` : ""}
        ${off ? `<div class="notice"><strong>غير متاح حاليًا.</strong> لا يمكن طلب هذا الصنف الآن.</div>` : ""}
        <div id="opts">${sizesHTML()}${extrasHTML()}</div>
        <div class="opt"><label class="lbl" for="note">ملاحظات خاصة <span class="opt-hint" style="font-weight:400;color:var(--color-muted)">(اختياري)</span></label>
          <textarea id="note" maxlength="200" placeholder="مثال: من غير بصل">${DEJA.esc(state.note)}</textarea></div>
        <div class="pd-buy">
          <div class="qty" role="group" aria-label="الكمية"><button type="button" data-q="-1" aria-label="تقليل الكمية">${DEJA.icon("minus")}</button><output id="qv" aria-live="polite">${state.qty}</output><button type="button" data-q="1" aria-label="زيادة الكمية">${DEJA.icon("plus")}</button></div>
          <button class="btn" type="button" id="add" ${off ? "disabled" : ""}></button>
        </div></div></div>`;
    sync();
  }
  function sync() {
    const unit = DEJA.unitPrice(p, state.size, [...state.extras]);
    const btn = document.getElementById("add");
    btn.innerHTML = `${DEJA.icon("cart")}${editing ? "حفظ التعديل" : "أضف للسلة"} — ${DEJA.money(unit * state.qty)}`;
    document.getElementById("qv").textContent = state.qty;
  }
  root.addEventListener("change", e => {
    if (e.target.name === "size") { state.size = e.target.value; document.getElementById("opts").innerHTML = sizesHTML() + extrasHTML(); sync(); }
    if (e.target.name === "extra") { e.target.checked ? state.extras.add(e.target.value) : state.extras.delete(e.target.value); sync(); }
  });
  root.addEventListener("input", e => { if (e.target.id === "note") state.note = e.target.value; });
  root.addEventListener("click", e => {
    const q = e.target.closest("[data-q]");
    if (q) { state.qty = Math.min(99, Math.max(1, state.qty + +q.dataset.q)); sync(); return; }
    if (e.target.closest("#add") && !off) {
      Cart.add({ id: p.id, size: state.size, extras: [...state.extras], note: state.note, qty: state.qty }, editing ? editKey : null);
      if (editing) { location.href = "cart.html"; return; }
      DEJA.toast(`تمت إضافة ${p.name} إلى السلة`);
    }
  });
  render();
})();
