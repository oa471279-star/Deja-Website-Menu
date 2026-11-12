/* whatsapp.js — بناء رسالة الطلب بالعربية وفتح واتساب. الطلب يُرسله العميل بنفسه ولا يتم تأكيده تلقائيًا. */
const WhatsApp = (() => {
  function deliveryFeeFor(type) {
    if (type !== "delivery") return { amount: 0, text: "0 " + SITE.currency + " (استلام من المطعم)" };
    if (typeof SITE.deliveryFee === "number") return { amount: SITE.deliveryFee, text: DEJA.moneyText(SITE.deliveryFee) };
    return { amount: 0, text: "تُحدد حسب المنطقة" };
  }
  function buildMessage(customer) {
    const { lines, subtotal } = DEJA.totals();
    const fee = deliveryFeeFor(customer.type);
    const total = subtotal + fee.amount;
    const out = [];
    out.push(`طلب جديد من ${SITE.name}`, "", "بيانات العميل:");
    out.push(`الاسم: ${customer.name}`, `رقم الهاتف: ${customer.phone}`);
    out.push(`العنوان: ${customer.type === "delivery" ? customer.address + (customer.details ? " — " + customer.details : "") : "-"}`);
    out.push(`نوع الطلب: ${customer.type === "delivery" ? "توصيل" : "استلام من المطعم"}`, "", "تفاصيل الطلب:", "");
    lines.forEach(l => {
      out.push(`${l.product.name}${l.size && DEJA.hasSizes(l.product) && l.product.sizes.length > 1 ? " (" + l.size.label + ")" : ""} × ${l.item.qty}`);
      if (l.extras.length) out.push(`الإضافات: ${l.extras.map(e => e.name).join("، ")}`);
      if (l.item.note) out.push(`ملاحظات الصنف: ${l.item.note}`);
      out.push(`السعر: ${DEJA.moneyText(l.subtotal)}`, "");
    });
    out.push("----------------", `إجمالي المنتجات: ${DEJA.moneyText(subtotal)}`, `رسوم التوصيل: ${fee.text}`, `الإجمالي النهائي: ${DEJA.moneyText(total)}`);
    if (customer.type === "delivery" && typeof SITE.deliveryFee !== "number") out.push("(رسوم التوصيل تُضاف حسب المنطقة)");
    out.push("", `ملاحظات إضافية: ${customer.notes || "-"}`, "", `شكراً لاختيارك ${SITE.name}.`);
    return out.join("\n");
  }
  const url = customer => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(buildMessage(customer))}`;
  return { buildMessage, url, deliveryFeeFor };
})();
