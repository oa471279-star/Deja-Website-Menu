/* cart.js — صفحة السلة: تعديل الكميات والخيارات، الحساب، نموذج بيانات العميل، وإرسال الطلب إلى واتساب. */
(function () {
  const root = document.getElementById("cart-root");
  const dlg = document.getElementById("dlg");
  const form = { type: "delivery", name: "", phone: "", address: "", details: "", notes: "" };
  let sent = false;

  function lineHTML(l) {
    if (l.missing) return `<article class="line is-bad"><div class="media"><div class="ph"><img src="assets/images/decorations/mark.png" alt=""></div></div><div><h3>صنف لم يعد في المنيو</h3><p class="warn">تم حذفه من المنيو ولن يُضاف للطلب.</p></div><div class="line-side"><button class="icon-btn danger" type="button" data-rm="${DEJA.esc(l.item.key)}">${DEJA.icon("trash")}حذف</button></div></article>`;
    const p = l.product, i = l.item;
    const meta = [l.size && p.sizes.length > 1 ? l.size.label : "", ...l.extras.map(e => "+ " + e.name)].filter(Boolean).join(" • ");
    return `<article class="line ${l.unavailable ? "is-bad" : ""}">
      <a href="product.html?id=${p.id}">${DEJA.imageHTML(p)}</a>
      <div><h3><a href="product.html?id=${p.id}">${DEJA.esc(p.name)}</a></h3>
        ${meta ? `<p class="meta">${DEJA.esc(meta)}</p>` : ""}
        ${i.note ? `<p class="meta">ملاحظة: ${DEJA.esc(i.note)}</p>` : ""}
        <p class="unit">سعر الوحدة: ${DEJA.money(l.unit)}</p>
        ${l.unavailable ? `<p class="warn">هذا الصنف غير متاح حاليًا ولن يُضاف للطلب.</p>` : ""}
        <div class="line-actions"><a class="icon-btn" href="product.html?id=${p.id}&edit=${encodeURIComponent(i.key)}">${DEJA.icon("edit")}تعديل</a><button class="icon-btn danger" type="button" data-rm="${DEJA.esc(i.key)}">${DEJA.icon("trash")}حذف</button></div></div>
      <div class="line-side"><div class="line-total">${DEJA.money(l.subtotal)}</div>
        <div class="qty" role="group" aria-label="كمية ${DEJA.esc(p.name)}"><button type="button" data-qk="${DEJA.esc(i.key)}" data-d="-1" aria-label="تقليل">${DEJA.icon("minus")}</button><output>${i.qty}</output><button type="button" data-qk="${DEJA.esc(i.key)}" data-d="1" aria-label="زيادة">${DEJA.icon("plus")}</button></div></div></article>`;
  }
  function field(id, label, type, extra = "", optional = false) {
    return `<label for="${id}">${label}${optional ? ' <span class="opt-hint">(اختياري)</span>' : ""}<input id="${id}" name="${id}" type="${type}" value="${DEJA.esc(form[id])}" ${extra}><span class="err" id="e-${id}"></span></label>`;
  }
  function render() {
    const all = DEJA.resolveCart();
    if (!all.length) {
      root.innerHTML = `<div class="empty"><img src="assets/images/mascot/chef-tray.png" alt="" width="1000" height="899"><h2>السلة فاضية</h2><p>لسه مضفتش أي صنف. افتح المنيو واختار طلبك.</p><a class="btn" href="menu.html">افتح المنيو</a></div>`;
      return;
    }
    const t = DEJA.totals();
    const fee = WhatsApp.deliveryFeeFor(form.type);
    const total = t.subtotal + fee.amount;
    const delivery = form.type === "delivery";
    const belowMin = SITE.minOrder > 0 && t.subtotal < SITE.minOrder;
    root.innerHTML = `<div class="cart-layout">
      <section aria-labelledby="h-items"><div class="cart-top"><h2 class="h2" id="h-items" style="font-size:1.8rem">الأصناف (${t.qty})</h2><button class="icon-btn danger" type="button" id="clear">${DEJA.icon("trash")}تفريغ السلة</button></div>
        <div class="lines">${all.map(lineHTML).join("")}</div></section>
      <aside><form id="order" novalidate>
        <div class="panel"><h2>بيانات الطلب</h2><div class="form-grid">
          <fieldset class="seg"><legend>نوع الطلب</legend>
            <label class="choice"><span class="name"><span class="mark"></span>${DEJA.icon("truck")} توصيل</span><input type="radio" name="type" value="delivery" ${delivery ? "checked" : ""}></label>
            <label class="choice"><span class="name"><span class="mark"></span>${DEJA.icon("store")} استلام من المطعم</span><input type="radio" name="type" value="pickup" ${!delivery ? "checked" : ""}></label></fieldset>
          ${field("name", "الاسم", "text", 'autocomplete="name" required')}
          ${field("phone", "رقم الهاتف", "tel", 'autocomplete="tel" inputmode="tel" dir="ltr" style="text-align:right" required')}
          ${delivery ? field("address", "العنوان", "text", 'autocomplete="street-address" required') + field("details", "عمارة / دور / شقة", "text", "", true) : ""}
          <label for="notes">ملاحظات إضافية <span class="opt-hint">(اختياري)</span><textarea id="notes" name="notes" maxlength="300">${DEJA.esc(form.notes)}</textarea></label>
        </div></div>
        <div class="panel"><h2>ملخص الطلب</h2>
          <div class="sum-row"><span>إجمالي المنتجات</span><span>${DEJA.money(t.subtotal)}</span></div>
          <div class="sum-row"><span>رسوم التوصيل</span><span>${fee.amount ? DEJA.money(fee.amount) : (delivery && typeof SITE.deliveryFee !== "number" ? "تُحدد حسب المنطقة" : DEJA.money(0))}</span></div>
          <div class="sum-row total"><span>الإجمالي</span><span>${DEJA.money(total)}</span></div>
          ${delivery && typeof SITE.deliveryFee !== "number" ? `<p class="sum-note">رسوم التوصيل لا تدخل في الإجمالي وتُؤكَّد من المطعم.</p>` : ""}
          ${belowMin ? `<p class="warn" style="margin-top:.6rem">الحد الأدنى للطلب ${DEJA.moneyText(SITE.minOrder)}.</p>` : ""}
          <button class="btn btn-block" type="submit" style="margin-top:1rem" ${t.lines.length && !belowMin ? "" : "disabled"}>${DEJA.icon("whatsapp")}أرسل الطلب على واتساب</button>
          ${sent ? `<p class="sent-note">تم فتح واتساب بالرسالة جاهزة. الطلب لا يُعتبر مؤكدًا إلا بعد إرسالك الرسالة واستلام المطعم لها.</p>` : ""}
        </div></form></aside></div>`;
  }
  function rerender(keepFocusId) {
    render();
    if (keepFocusId) { const el = document.getElementById(keepFocusId); if (el) { el.focus(); const v = el.value; try { el.setSelectionRange(v.length, v.length); } catch (e) {} } }
  }

  root.addEventListener("click", e => {
    const q = e.target.closest("[data-qk]");
    if (q) { const it = Cart.load().find(i => i.key === q.dataset.qk); if (it) Cart.setQty(it.key, it.qty + +q.dataset.d); return; }
    const rm = e.target.closest("[data-rm]"); if (rm) { Cart.remove(rm.dataset.rm); return; }
    if (e.target.closest("#clear")) dlg.showModal();
  });
  root.addEventListener("input", e => {
    const el = e.target; if (el.name && el.name in form && el.name !== "type") { form[el.name] = el.value; el.removeAttribute("aria-invalid"); const er = document.getElementById("e-" + el.name); if (er) er.textContent = ""; }
  });
  root.addEventListener("change", e => { if (e.target.name === "type") { form.type = e.target.value; sent = false; rerender(); } });
  root.addEventListener("submit", e => {
    e.preventDefault();
    const delivery = form.type === "delivery", errs = {};
    if (form.name.trim().length < 2) errs.name = "اكتب الاسم";
    if (!/^(\+?\d[\d\s-]{7,16})$/.test(form.phone.trim())) errs.phone = "اكتب رقم هاتف صحيح";
    if (delivery && form.address.trim().length < 5) errs.address = "اكتب العنوان بالتفصيل";
    Object.keys({ name: 1, phone: 1, address: 1 }).forEach(k => { const el = document.getElementById(k), er = document.getElementById("e-" + k); if (!el) return; if (errs[k]) { el.setAttribute("aria-invalid", "true"); er.textContent = errs[k]; } });
    const first = Object.keys(errs)[0];
    if (first) { document.getElementById(first).focus(); return; }
    if (!DEJA.totals().lines.length) return;
    const customer = { type: form.type, name: form.name.trim(), phone: form.phone.trim(), address: form.address.trim(), details: form.details.trim(), notes: form.notes.trim() };
    const link = WhatsApp.url(customer);
    const w = window.open(link, "_blank");   // لا نستخدم noopener هنا لأنه يجعل النتيجة null دائمًا
    if (w) { try { w.opener = null; } catch (err) {} } else location.href = link;  // إن حُجبت النافذة نفتح واتساب في نفس التبويب
    sent = true; rerender();
  });
  document.getElementById("dlg-no").addEventListener("click", () => dlg.close());
  document.getElementById("dlg-yes").addEventListener("click", () => { Cart.clear(); dlg.close(); });
  Cart.onChange(() => { sent = false; const ae = document.activeElement; rerender(ae && ae.id && root.contains(ae) && ae.tagName !== "BUTTON" ? ae.id : null); });
  render();
})();
