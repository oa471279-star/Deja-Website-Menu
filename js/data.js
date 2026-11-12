/* ==========================================================================
   DEJA — الملف المركزي لبيانات الموقع  (js/data.js)
   --------------------------------------------------------------------------
   هذا هو الملف الوحيد الذي تعدّل فيه المنتجات والأقسام والإعدادات.
   لا توجد لوحة تحكم ولا قاعدة بيانات: أي تعديل هنا يظهر تلقائيًا في كل صفحات الموقع.

   --------------------------------------------------------------------------
   إضافة منتج جديد
   --------------------------------------------------------------------------
   // لإضافة منتج جديد: انسخ قالب المنتج التالي، غيّر البيانات، ثم أضفه داخل قائمة المنتجات.

   {
     id: 100,                                  // رقم مميز: لا تكرره
     name: "اسم المنتج",
     category: "pizza",                        // مفتاح (key) قسم موجود في قائمة CATEGORIES
     description: "وصف المنتج",                // اتركه "" إن لم يوجد وصف
     price: 100,                               // السعر (للمنتج بدون أحجام)
     image: "assets/images/products/اسم-الصورة.jpg",
     available: true,                          // false = يظهر "غير متاح" ولا يمكن طلبه
     featured: false,                          // true = يظهر في "المنتجات المميزة" بالرئيسية
     extras: [],                               // إضافات اختيارية، مثال: [{ id: "cheese", name: "جبنة إضافية", price: 15 }]
   },

   اختياري: sizes لمنتج له أحجام (يحل محل price):
     sizes: [ { id: "M", label: "ميديم", price: 170 }, { id: "L", label: "لارج", price: 199 } ],
   اختياري: سعر إضافة يختلف حسب الحجم:
     extras: [ { id: "stuffed", name: "حشو الأطراف", priceBySize: { M: 50, L: 60 } } ]
   اختياري: badge: "الأكثر مبيعًا"   (شارة صغيرة فوق المنتج)

   --------------------------------------------------------------------------
   إضافة صورة منتج
   --------------------------------------------------------------------------
   1) ضع الصورة داخل المجلد assets/images/products/  (يفضل JPG أو WebP، عرض 800px تقريبًا، أقل من 150KB).
   2) اكتب مسارها في حقل image للمنتج، مثال:  image: "assets/images/products/four-season.jpg"
   إن لم تكن الصورة موجودة يعرض الموقع بطاقة بديلة بهوية ديجا بدل صورة مكسورة.

   --------------------------------------------------------------------------
   إضافة قسم جديد
   --------------------------------------------------------------------------
   أضف عنصرًا في قائمة CATEGORIES بمفتاح (key) جديد، ثم استخدم نفس المفتاح في حقل category للمنتجات.
   ========================================================================== */

/* ------------------------------ إعدادات عامة ------------------------------ */
const SITE = {
  name: "DEJA",
  nameAr: "ديجا",
  slogan: "بنعملها صح في ديجا",
  sloganEn: "WE DO IT RIGHT IN DEJA",
  whatsapp: "201043381841",        // بالصيغة الدولية بدون + أو أصفار (الرقم المحلي 01043381841)
  currency: "ج.م",
  // رسوم التوصيل: لم تُذكر في قائمة الطعام، لذلك لم يتم افتراض رقم.
  //   null = "تُحدد حسب المنطقة" (لا تُضاف للإجمالي)،   أو اكتب رقمًا مثل 20
  deliveryFee: null,
  // الحد الأدنى للطلب (0 = بدون حد أدنى)
  minOrder: 0,
  // روابط السوشيال ميديا (تظهر في الفوتر). استبدل القيمتين برابطي الصفحتين الرسميتين.
facebook: "https://www.facebook.com/share/1EF3F46uhm/?mibextid=wwXIfr",
instagram: "https://www.instagram.com/deja.restaurant.eg",
  intro: "بيتزا، برجر، باجت ووجبات استربس مقرمشة. اختار طلبك وابعته على واتساب.",
};

/* -------------------------------- الأقسام -------------------------------- */
// key: يُستخدم في category للمنتجات | order: ترتيب العرض | enabled: false لإخفاء القسم
const CATEGORIES = [
  { key: "pizza",    name: "بيتزا ديجا",          order: 1, enabled: true, image: "" },
  { key: "meals",    name: "وجبات ديجا",          order: 2, enabled: true, image: "" },
  { key: "baguette", name: "باجت ديجا",           order: 3, enabled: true, image: "" },
  { key: "beef",     name: "برجر لحمة",           order: 4, enabled: true, image: "" },
  { key: "chicken",  name: "برجر فراخ",           order: 5, enabled: true, image: "" },
  { key: "sides",    name: "مقبلات وصوصات ديجا",  order: 6, enabled: true, image: "" },
];

/* ------------------------------- المنتجات ------------------------------- */
const IMG = "assets/images/products/";
const PIZZA_SIZES = (m, l) => [
  { id: "M", label: "ميديم", price: m },
  { id: "L", label: "لارج", price: l },
];
const BURGER_SIZES = (s, d) => [
  { id: "S", label: "سنجل", price: s },
  { id: "D", label: "دبل", price: d },
];
// حشو الأطراف للبيتزا (ميديم 50 / لارج 60 كما في القائمة)
const STUFFED_CRUST = [{ id: "stuffed-crust", name: "حشو الأطراف", priceBySize: { M: 50, L: 60 } }];

const PRODUCTS = [
  /* ---------- بيتزا ديجا (M = ميديم، L = لارج) ---------- */
  { id: 1, name: "مارجريتا", category: "pizza", description: "صوص ريد مع جبنة موتزاريلا ورشة زعتر مميزة.", sizes: PIZZA_SIZES(170, 199), image: IMG + "margreta.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 2, name: "فور تشيز", category: "pizza", description: "مزيج غني من جبنة الموتزاريلا والشيدر الأمريكي والرومي، مع صوص الريد وصوص الشيدر الكريمي لنكهة مميزة.", sizes: PIZZA_SIZES(180, 205), image: IMG + "four-cheese.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 3, name: "تشكن رانش", category: "pizza", description: "مزيج من جبنة الموتزاريلا وقطع الدجاج المشوي والتركي المدخن، مع صوص الريد وصوص الرانش الكريمي", sizes: PIZZA_SIZES(195, 240),image: IMG + "chicken-ranch.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 4, name: "تشكن باربكيو", category: "pizza", description: "مزيج من جبنة الموتزاريلا وقطع الدجاج المشوي والتركي المدخن، مع صوص الريد وصوص الباربكيو المدخن", sizes: PIZZA_SIZES(195, 240), image: IMG + "chicken-bbq.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 5, name: "تشكن ناشفيل", category: "pizza", description: "مزيج من جبنة الموتزاريلا وقطع استربس الناشفيل الحار والتركي المدخن، مع صوص الريد والسويت تشيلي وشرائح الهالبينو", sizes: PIZZA_SIZES(195, 250), image: IMG + "chicken-nashville-pizza.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 6, name: "فرايد تشكن", category: "pizza", description: "مزيج من جبنة الموتزاريلا وقطع الاستربس والتركي المدخن والبيف بيكون، مع صوص الريد والشيدر وشرائح الزيتون", sizes: PIZZA_SIZES(195, 250), image: IMG + "fried-chicken-pizza.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 7, name: "فاهيتا", category: "pizza", description: "مزيج من جبنة الموتزاريلا وشرائح الدجاج المشوي والفلفل الألوان، مع صوص الريد والباربكيو المدخن", sizes: PIZZA_SIZES(190, 270), image: IMG + "fajita-pizza.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 8, name: "سي فود", category: "pizza", description: "مزيج من الجمبري وشرائح الكابوريا وسمك الفيليه، مع جبنة الموتزاريلا والفلفل والزيتون وصوص الرانش الكريمي", sizes: PIZZA_SIZES(340, 390), image: IMG + "seafood.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 9, name: "جمبري", category: "pizza", description: "مزيج من الجمبري المشوي وجبنة الموتزاريلا، مع الفلفل والزيتون وصوص الرانش الكريمي", sizes: PIZZA_SIZES(320, 370), image: IMG + "shrimp.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 10, name: "تونة", category: "pizza", description: "مزيج من التونة المدخنة وجبنة الموتزاريلا، مع صوص الريد والفلفل الألوان والزيتون", sizes: PIZZA_SIZES(190, 230), image: IMG + "tuna.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  // الاسم كما ورد في القائمة الأصلية (ببروني). يمكن تصحيحه إلى "بيبروني" هنا.
  { id: 11, name: "ببروني", category: "pizza", description: "مزيج من شرائح البيبروني وجبنة الموتزاريلا، مع صوص الريد والهوت هاني الحار وصوص الرانش الكريمي", sizes: PIZZA_SIZES(190, 230), image: IMG + "pepperoni.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 12, name: "خضار", category: "pizza", description: "مزيج من جبنة الموتزاريلا والفلفل الألوان والأخضر والمشروم والزيتون، مع صوص الألف جزيرة", sizes: PIZZA_SIZES(160, 180), image: IMG + "veggie.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  { id: 13, name: "تيستي", category: "pizza", description: "مزيج من شرائح البيف المشوي والبيف بيكون وجبنة الموتزاريلا، مع الفلفل والزيتون وصوص التكساس", sizes: PIZZA_SIZES(199, 255), image: IMG + "tasty.jpg", available: true, featured: false, extras: STUFFED_CRUST },
  // ديجا فور سيزون متوفرة بحجم لارج فقط (حجم ميديم غير مسعّر في القائمة)
  { id: 14, name: "ديجا فور سيزون", category: "pizza", description: "أربعة أرباع بنكهات مميزة؛ ربع بالبيف المشوي، وربع بالدجاج المشوي، وربع بمزيج الأجبان الذائبة، وربع بشرائح البيبروني، لتجمع بين تنوع النكهات في تجربة واحدة.", sizes: [{ id: "L", label: "لارج", price: 280 }], badge: "الأكثر مبيعًا", image: IMG + "four-season.jpg", available: true, featured: true, extras: [{ id: "stuffed-crust", name: "حشو الأطراف", priceBySize: { L: 60 } }] },
  { id: 15, name: "بافلو", category: "pizza", description: "مزيج من البيف وجبنة الموتزاريلا، مع الهالبينو والزيتون وصوص الريد وصوص البافلو الحار", sizes: PIZZA_SIZES(199, 255), badge: "حار", image: IMG + "buffalo.jpg", available: true, featured: true, extras: STUFFED_CRUST },

  /* ---------- وجبات ديجا ---------- */
  { id: 20, name: "2x2", category: "meals", description: "وجبة مميزة تضم 4 كولا، و2 ساندوتش بيج تيستي دبل، و2 ساندوتش كريسبي تاور دبل، بالإضافة إلى تكساس فرايز وكريسبي فرايز", price: 999, image: IMG + "2x2.jpg", available: true, featured: true, extras: [] },
  { id: 21, name: "بيستي ميل", category: "meals", description: "وجبة مميزة تضم 2 كولا، وسندوتش تشيز أمريكان، وسندوتش كرانشي تشيز، مع 2 بطاطس مقرمشة", price: 399, image: IMG + "besty-meal.jpg", available: true, featured: false, extras: [] },
  { id: 22, name: "سموكي ميل", category: "meals", description: "وجبة مميزة تضم 2 كولا، وساندوتش سموكي بيف سنجل، وساندوتش تشيكن أونيون سنجل، مع 2 بطاطس مقرمشة", price: 399, image: IMG + "smoky-meal.jpg", available: true, featured: false, extras: [] },
  { id: 23, name: "استربس بوكس", category: "meals", description: "ثلاث قطع من الاستربس المتبّلة والمغطاة بطبقة مقرمشة، تُقدم مع البطاطس الذهبية وقطع الخبز، وصوص الشيدر لمذاق شهي ومميز.", price: 160, image: IMG + "strips-box.jpg", available: true, featured: false, extras: [] },
  { id: 24, name: "ناشفيل بوكس", category: "meals", description: "ثلاث قطع من الاستربس المتبّلة بتوابل الناشفيل الحارة، والمغطاة بطبقة مقرمشة، تُقدم مع البطاطس الذهبية وقطع الخبز، وصوص الشيدر وصوص السويت تشيلي لمذاق حار وغني.", price: 170, badge: "حار", image: IMG + "nashville-box.jpg", available: true, featured: true, extras: [] },
  { id: 25, name: "كيدز ميل", category: "meals", description: "وجبة أطفال تضم قطع الاستربس المقرمشة والبطاطس وصوص الشيدر وعصير البرتقال، مع إمكانية اختيار لعبة ولد أو بنت", price: 199, image: IMG + "kids-meal.jpg", available: true, featured: false, extras: [] },

  /* ---------- باجت ديجا ---------- */
  { id: 30, name: "سويت تشيلي باجت", category: "baguette", description: "استربس مقرمشة مع تركي مدخن، وصوص الشيدر والسويت تشيلي والهالبينو", price: 180, image: IMG + "sweet-chili-baguette.jpg", available: true, featured: false, extras: [] },
  { id: 31, name: "فاهيتا باجت", category: "baguette", description: "شرائح دجاج مشوية مع الفلفل الألوان والبصل وصوص الباربكيو المدخن لنكهة غنية", price: 180, image: IMG + "faheta.jpg", available: true, featured: false, extras: [] },
  { id: 32, name: "رانشي باجت", category: "baguette", description: "قطع استربس مقرمشة مع شرائح التركي المدخن وصوص الشيدر والرانش الكريمي لنكهة غنيه", price: 180, image: IMG + "ranchy-baguette.jpg", available: true, featured: false, extras: [] },
  { id: 33, name: "كرانشي باجت", category: "baguette", description: "قطع استربس مقرمشة مع الجبنة الأمريكية وصوص الشيدر والألف جزيرة لنكهة غنية", price: 170, image: IMG + "crunchy-baguette.jpg", available: true, featured: false, extras: [] },
  { id: 34, name: "ناشفيل باجت", category: "baguette", description: "قطع استربس الناشفيل الحارة مع الجبنة الأمريكية وصوص الشيدر والسويت تشيلي، ولمسة من الهالبينو لنكهة حارة", price: 180, badge: "حار", image: IMG + "nashville-baguette.jpg", available: true, featured: false, extras: [] },
  { id: 35, name: "اسموكي باجت", category: "baguette", description: "قطع استربس مقرمشة مع البيف بيكون وصوص الشيدر والباربكيو المدخن لنكهة غنية", price: 185, image: IMG + "smoky-baguette.jpg", available: true, featured: false, extras: [] },

  /* ---------- برجر لحمة (S = سنجل، D = دبل) ---------- */
  { id: 40, name: "كلاسيك بيف", category: "beef", description: "قطعة بيف مشوي مع صوص الشيدر وألف جزيرة والمايونيز، بمذاق كلاسيكي مميز.", sizes: BURGER_SIZES(160, 220), image: IMG + "classic-beef.jpg", available: true, featured: false, extras: [] },
  { id: 41, name: "بيج تيستي", category: "beef", description: "قطعة بيف مشوي مع بيف بيكون وصوص الشيدر وتكساس، بمذاق مدخن وغني.", sizes: BURGER_SIZES(160, 220), image: IMG + "big-tasty.jpg", available: true, featured: true, extras: [] },
  { id: 42, name: "بيف كارميل", category: "beef", description: "قطعة بيف مشوي مع بصل مكرمل وصوص الشيدر والباربكيو، بمذاق غني", sizes: BURGER_SIZES(160, 220), image: IMG + "beef-caramel.jpg", available: true, featured: false, extras: [] },
  { id: 43, name: "تشيز أمريكان", category: "beef", description: "قطعة بيف مشوي مع موتزاريلا ستيك وشريحة شيدر أمريكي، وصوص الشيدر والمايونيز لمذاق غني بالجبنة.", sizes: BURGER_SIZES(160, 220), image: IMG + "cheese-american.jpg", available: true, featured: false, extras: [] },
  { id: 44, name: "كريمي مشروم", category: "beef", description: "قطعه بيف مشوي مع المشروم وصوص المشروم الكريمي والشيدر، لمذاق غني وكريمي.", sizes: BURGER_SIZES(165, 230), image: IMG + "creamy-mushroom.jpg", available: true, featured: false, extras: [] },
  { id: 45, name: "إسموكي بيف", category: "beef", description: "قطعه بيف مشوي مع بيف بيكون وحلقات البصل المقرمشة وصوص الشيدر والباربكيو", sizes: BURGER_SIZES(160, 230), image: IMG + "smoky-beef.jpg", available: true, featured: false, extras: [] },
  { id: 46, name: "فاير بوس", category: "beef", description: "قطعه بيف مشوي مع موتزاريلا ستيك وصوص الشيدر والمايونيز والسويت تشيلي، بمزيج كريمي ولمسة حلوة وحارة.", sizes: BURGER_SIZES(149, 230), image: IMG + "fire-boss.jpg", available: true, featured: false, extras: [] },

  /* ---------- برجر فراخ (S = سنجل، D = دبل) ---------- */
  { id: 50, name: "كرانشي اتشيز", category: "chicken", description: "استربس + خس + خيار + صوص شيدر + قطعة شيدر+ مايونيز + موتزاريلا استيك", sizes: BURGER_SIZES(160, 199), image: IMG + "crunchy-cheese.jpg", available: true, featured: false, extras: [] },
  { id: 51, name: "تشيكن ناشفيل", category: "chicken", description: "استربس حار مع الجبنة الأمريكية والهالبينو وصوص الشيدر والسويت تشيلي لنكهة حارة", sizes: BURGER_SIZES(149, 199), badge: "حار", image: IMG + "chicken-nashville.jpg", available: true, featured: true, extras: [] },
  { id: 52, name: "كريسبي تاور", category: "chicken", description: "قطع استربس مقرمشة مع شرائح التركي وموتزاريلا ستيك وصوص الشيدر والرانش الكريمي", sizes: BURGER_SIZES(149, 190), image: IMG + "crispy-tower.jpg", available: true, featured: false, extras: [] },
  { id: 53, name: "تشكن أونين", category: "chicken", description: "قطع استربس مقرمشة مع البيف بيكون والأونيون وصوص الشيدر والباربكيو المدخن", sizes: BURGER_SIZES(149, 199), image: IMG + "chicken-onion.jpg", available: true, featured: false, extras: [] },
  { id: 54, name: "كرانش إتشلي", category: "chicken", description: "قطع استربس مقرمشة مع الهالبينو وصوص الشيدر والسويت تشيلي", sizes: BURGER_SIZES(149, 199), image: IMG + "crunch-chili.jpg", available: true, featured: false, extras: [] },
  { id: 55, name: "كرانش دوريتوس", category: "chicken", description: "استربس مقرمشة مع شريحة جبنة أمريكي وصوص الشيدر الكريمي والمايونيز وألف جزيرة، مع قرمشة الدوريتوس", sizes: BURGER_SIZES(160, 199), image: IMG + "crunch-doritos.jpg", available: true, featured: false, extras: [] },

  /* ---------- مقبلات وصوصات ديجا ---------- */
  { id: 60, name: "اتشيز فرايز", category: "sides", description: "بطاطس + صوص شيدر + هالبينو", price: 60, image: IMG + "cheese-fries.jpg", available: true, featured: false, extras: [] },
  { id: 61, name: "ناشفيل فرايز", category: "sides", description: "بطاطس مقرمشة مع قطعة استربس حارة، مغطاة بصوص الشيدر والسويت تشيلي، مع الهالبينو والجبنة الرومي لمزيج مميز من الطعم الحار والجبنة", price: 99, image: IMG + "nashville-fries.jpg", available: true, featured: false, extras: [] },
  { id: 62, name: "كرسبي فرايز", category: "sides", description: "بطاطس مقرمشة مع قطع الاستربس، مغطاة بصوص الشيدر الغني والهالبينو", price: 90, image: IMG + "crispy-fries.jpg", available: true, featured: false, extras: [] },
  { id: 63, name: "تكساس فرايز", category: "sides", description: "بطاطس مقرمشة مع قطع البيف والبيف بيكون، وصوص الشيدر والتكساس، مع الهالبينو", price: 99, image: IMG + "texas-fries.jpg", available: true, featured: false, extras: [] },
  { id: 64, name: "جريلد فرايز", category: "sides", description: "بطاطس مقرمشة مع شريحة فراخ جريل وتركي، مغطاة بصوص الشيدر والرانش", price: 90, image: IMG + "grilled-fries.jpg", available: true, featured: false, extras: [] },
  { id: 65, name: "موتزاريلا استيك", category: "sides", description: "5 قطع موتزاريلا ستيك مقرمشة مع صوص الشيدر الغني.", price: 75, image: IMG + "mozzarella-sticks.jpg", available: true, featured: false, extras: [] },
  { id: 66, name: "أونيون رينجز", category: "sides", description: "5 قطع أونيون رينجز مقرمشة مع صوص الباربكيو المدخن.", price: 70, image: IMG + "onion-rings.jpg", available: true, featured: false, extras: [] },
  { id: 67, name: "بطاطس", category: "sides", description: "", price: 40, image: IMG + "fries.jpg", available: true, featured: false, extras: [] },
  { id: 68, name: "صوص رانش", category: "sides", description: "", price: 30, image: IMG + "sauce-ranch.jpg", available: true, featured: false, extras: [] },
  { id: 69, name: "صوص شيدر", category: "sides", description: "", price: 30, image: IMG + "sauce-cheddar.jpg", available: true, featured: false, extras: [] },
  { id: 70, name: "صوص تكساس", category: "sides", description: "", price: 30, image: IMG + "sauce-texas.jpg", available: true, featured: false, extras: [] },
  { id: 71, name: "صوص سويت شيلي", category: "sides", description: "", price: 30, image: IMG + "sauce-sweet-chili.jpg", available: true, featured: false, extras: [] },
  { id: 72, name: "صوص باربيكيو", category: "sides", description: "", price: 30, image: IMG + "sauce-bbq.jpg", available: true, featured: false, extras: [] },
  { id: 73, name: "صوص ألف جزيرة", category: "sides", description: "", price: 30, image: IMG + "sauce-thousand-island.jpg", available: true, featured: false, extras: [] },
];
