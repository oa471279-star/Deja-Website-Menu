/* storage.js — حفظ السلة فقط في LocalStorage.
   بيانات المنتجات لا تُخزن هنا أبدًا: مصدرها الوحيد js/data.js.
   تُحفظ في السلة أرقام المنتجات والاختيارات فقط، وتُحسب الأسعار والأسماء من data.js في كل مرة. */
const Cart = (() => {
  const KEY = "deja_cart_v1";
  const listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      const data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data)) return [];
      return data.filter(i => i && typeof i.key === "string" && Number.isFinite(+i.id) && +i.qty > 0)
                 .map(i => ({ key: i.key, id: +i.id, size: i.size || "", extras: Array.isArray(i.extras) ? i.extras : [], note: String(i.note || ""), qty: Math.min(99, Math.max(1, Math.floor(+i.qty))) }));
    } catch (e) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* التخزين غير متاح: تعمل السلة طوال الجلسة فقط */ }
    listeners.forEach(fn => fn(items));
  }
  function makeKey(i) {
    return [i.id, i.size || "", [...(i.extras || [])].sort().join(","), (i.note || "").trim()].join("|");
  }
  function add(entry, replaceKey) {
    let items = load();
    const item = { id: +entry.id, size: entry.size || "", extras: [...(entry.extras || [])], note: (entry.note || "").trim(), qty: Math.max(1, +entry.qty || 1) };
    item.key = makeKey(item);
    if (replaceKey) items = items.filter(i => i.key !== replaceKey);
    const same = items.find(i => i.key === item.key);
    if (same) same.qty = Math.min(99, same.qty + item.qty); else items.push(item);
    save(items);
    return item;
  }
  function setQty(key, qty) {
    const items = load();
    const it = items.find(i => i.key === key);
    if (!it) return;
    if (qty <= 0) return remove(key);
    it.qty = Math.min(99, qty); save(items);
  }
  function remove(key) { save(load().filter(i => i.key !== key)); }
  function clear() { save([]); }
  function count() { return load().reduce((n, i) => n + i.qty, 0); }
  function onChange(fn) { listeners.push(fn); }
  window.addEventListener("storage", e => { if (e.key === KEY) listeners.forEach(fn => fn(load())); });
  return { load, add, setQty, remove, clear, count, onChange };
})();
