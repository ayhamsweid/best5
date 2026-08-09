INSERT INTO "Post" (
  "id", "title_ar", "title_en", "slug_ar", "slug_en",
  "excerpt_ar", "excerpt_en", "content_ar", "content_en",
  "content_blocks_json", "cover_image_url", "status",
  "published_at", "content_reviewed_at", "author_id", "category_id",
  "seo_title_ar", "seo_title_en", "seo_desc_ar", "seo_desc_en",
  "og_image_url", "related_post_ids", "updated_at"
)
VALUES (
  'b8d25f61-4c87-46da-9f30-5a6b7c8d9e01',
  'رسوم المدارس الدولية في إسطنبول 2026–2027: مقارنة 5 ميزانيات',
  'International School Fees in Istanbul 2026–2027: 5 Budgets',
  'رسوم-المدارس-الدولية-في-إسطنبول-2026-2027',
  'international-school-fees-in-istanbul-2026-2027',
  'قارن 5 نماذج رسوم رسمية للمدارس الدولية في إسطنبول، مع ما يشمله السعر والرسوم الإضافية وتكلفة السنة الأولى.',
  'Compare 5 official Istanbul international-school fee profiles, including published tuition, inclusions, extras and first-year charges.',
  '<p>دليل Best5 ثنائي اللغة لخمسة نماذج رسوم منشورة رسميًا للعام 2026–2027.</p>',
  '<p>A bilingual Best5 guide to five officially published 2026–2027 fee profiles.</p>',
  $json$
[
  {
    "id": "n012-fees-method",
    "type": "guide",
    "data": {
      "title": { "en": "Five fee profiles—not a quality ranking", "ar": "خمسة نماذج رسوم وليست ترتيبًا لجودة المدارس" },
      "content": {
        "en": "This Best5 guide compares five official 2026–2027 fee profiles checked on 28 July 2026. They are ordered by the lowest published annual starting figure, not by teaching quality. IICS Marmara and Hisar are shown separately because their published early-years and primary fees differ, although both belong to IICS.\n\nAll figures stay in the schools’ published US-dollar currency. A static lira conversion would quickly become misleading. Fees, discounts, tax and availability can change, so request a dated written quotation for the child’s exact grade and campus before paying.",
        "ar": "يقارن دليل Best5 خمسة نماذج رسوم رسمية للعام 2026–2027 تم التحقق منها في 28 يوليو 2026. رُتبت حسب أقل سعر سنوي ابتدائي منشور، وليس حسب جودة التعليم. ويظهر فرعا مرمرة وحصار في IICS كنموذجين منفصلين لأن رسوم السنوات المبكرة والابتدائية المنشورة تختلف، رغم أنهما تابعان للمدرسة نفسها.\n\nأبقينا الأرقام بالدولار كما نشرتها المدارس، لأن تحويلًا ثابتًا إلى الليرة سيصبح مضللًا سريعًا. قد تتغير الرسوم والخصومات والضريبة وتوفر المقاعد؛ لذلك اطلب عرضًا مكتوبًا ومؤرخًا لصف طفلك وفرعه قبل الدفع."
      }
    }
  },
  {
    "id": "n012-total-budget-checklist",
    "type": "guide",
    "data": {
      "title": { "en": "Build the real first-year budget", "ar": "احسب ميزانية السنة الأولى الحقيقية" },
      "content": {
        "en": "Start with tuition, then add every compulsory application, assessment, registration, seat-reservation and capital fee. Check whether VAT, lunch, books, uniform, devices, transport, trips and external examinations are included. Ask which charges are refundable and whether a discount applies only to tuition or to the whole invoice.\n\nCompare the same grade and payment date. Brights separates tuition and supplies inside its annual total; Istanbul International states that lunch, books, assessment and VAT are included; MEF publishes tuition plus food; IICS excludes transport and specified devices, exams and trips. These totals therefore must not be compared as if they bought identical packages.",
        "ar": "ابدأ بالقسط ثم أضف كل رسوم الطلب والتقييم والتسجيل وحجز المقعد والمساهمة الرأسمالية الإلزامية. تحقق من شمول ضريبة القيمة المضافة والغداء والكتب والزي والأجهزة والنقل والرحلات والامتحانات الخارجية. واسأل عن المبالغ القابلة للاسترداد وما إذا كان الخصم يطبق على القسط فقط أم كامل الفاتورة.\n\nقارن الصف نفسه وتاريخ الدفع نفسه. تفصل Brights القسط والمستلزمات داخل مجموعها السنوي؛ وتذكر Istanbul International شمول الغداء والكتب والتقييم والضريبة؛ وتنشر MEF القسط مع الطعام؛ بينما تستثني IICS النقل وأجهزة وامتحانات ورحلات محددة. لذلك لا تمثل هذه المجاميع حزمًا متطابقة."
      }
    }
  },
  {
    "id": "n012-fees-quick-picks",
    "type": "cards",
    "data": {
      "title": { "en": "Quick budget takeaways", "ar": "خلاصة الميزانية السريعة" },
      "cards": [
        {
          "icon": "WalletCards",
          "title": { "en": "Lowest published starting total", "ar": "أقل مجموع ابتدائي منشور" },
          "label": { "en": "Brights: $6,950", "ar": "Brights: ‏6,950 دولارًا" },
          "note": { "en": "Preschool annual total; a new student also pays a one-time $150 enrollment fee.", "ar": "المجموع السنوي للروضة؛ ويدفع الطالب الجديد 150 دولارًا للتسجيل مرة واحدة." }
        },
        {
          "icon": "BadgeCheck",
          "title": { "en": "Broadest stated inclusions", "ar": "أوسع شمول معلن" },
          "label": { "en": "Istanbul International", "ar": "Istanbul International" },
          "note": { "en": "The published schedule includes tuition, lunch, books/materials, assessment and VAT.", "ar": "يشمل الجدول المنشور القسط والغداء والكتب والمواد والتقييم وضريبة القيمة المضافة." }
        },
        {
          "icon": "CircleDollarSign",
          "title": { "en": "Largest first-year add-ons", "ar": "أكبر إضافات السنة الأولى" },
          "label": { "en": "IICS Grade 1+", "ar": "IICS من الصف الأول" },
          "note": { "en": "$300 application, $1,200 registration and $8,000 capital levy for a new Grade 1+ student.", "ar": "300 دولار للطلب و1,200 للتسجيل و8,000 مساهمة رأسمالية للطالب الجديد من الصف الأول." }
        }
      ]
    }
  },
  {
    "id": "n012-fees-comparison",
    "type": "comparison",
    "data": {
      "title": { "en": "Five published 2026–2027 fee profiles", "ar": "خمسة نماذج رسوم منشورة للعام 2026–2027" },
      "headers": [
        { "en": "Fee profile", "ar": "نموذج الرسوم" },
        { "en": "Published annual range", "ar": "النطاق السنوي المنشور" },
        { "en": "What is included", "ar": "ما يشمله السعر" },
        { "en": "Important extras", "ar": "إضافات مهمة" }
      ],
      "rows": [
        [{ "en": "Brights", "ar": "Brights" }, { "en": "$6,950–$9,900", "ar": "6,950–9,900 دولار" }, { "en": "Tuition, seat reservation and listed supplies", "ar": "القسط وحجز المقعد والمستلزمات المذكورة" }, { "en": "$150 new enrollment; transport not stated as included", "ar": "150 دولارًا تسجيل جديد؛ النقل غير مذكور ضمن الشمول" }],
        [{ "en": "Istanbul International", "ar": "Istanbul International" }, { "en": "$21,500–$32,750", "ar": "21,500–32,750 دولارًا" }, { "en": "Tuition, lunch, books/materials, assessment and VAT", "ar": "القسط والغداء والكتب والمواد والتقييم والضريبة" }, { "en": "Confirm transport and any optional exams", "ar": "أكد النقل وأي امتحانات اختيارية" }],
        [{ "en": "MEF International", "ar": "MEF الدولية" }, { "en": "$23,610–$46,265", "ar": "23,610–46,265 دولارًا" }, { "en": "Tuition, food and VAT", "ar": "القسط والطعام والضريبة" }, { "en": "$1,250 application + $4,250 registration for new applicants", "ar": "1,250 دولارًا للطلب + 4,250 للتسجيل للمتقدم الجديد" }],
        [{ "en": "IICS Marmara", "ar": "IICS مرمرة" }, { "en": "$23,000–$48,900", "ar": "23,000–48,900 دولار" }, { "en": "Tuition, VAT, materials, catering and listed activities", "ar": "القسط والضريبة والمواد والطعام والأنشطة المذكورة" }, { "en": "New-student fees; transport, specified devices/exams/trips excluded", "ar": "رسوم الطالب الجديد؛ النقل وأجهزة وامتحانات ورحلات محددة مستثناة" }],
        [{ "en": "IICS Hisar", "ar": "IICS حصار" }, { "en": "$25,200–$48,900", "ar": "25,200–48,900 دولار" }, { "en": "Tuition, VAT, materials, catering and listed activities", "ar": "القسط والضريبة والمواد والطعام والأنشطة المذكورة" }, { "en": "Same IICS new-student charges and exclusions", "ar": "رسوم الطالب الجديد والاستثناءات نفسها في IICS" }]
      ]
    }
  },
  {
    "id": "n012-fee-brights",
    "type": "restaurant",
    "data": {
      "rank": 1,
      "name": { "en": "Brights International School fee profile", "ar": "نموذج رسوم مدرسة Brights الدولية" },
      "location": { "en": "Istanbul", "ar": "إسطنبول" },
      "description": {
        "en": "Brights publishes the lowest starting total in this five-profile comparison: $6,950 for preschool. The annual totals rise to $7,950 for primary, $9,000 for middle and $9,900 for high school. Each total combines a $300 seat reservation, tuition and a supplies amount covering the listed books, notebooks, learning resources, uniform, stationery, trips and class activities. A newly enrolled student also pays a one-time, non-refundable $150 enrollment fee.",
        "ar": "تنشر Brights أقل مجموع ابتدائي ضمن هذه النماذج الخمسة: 6,950 دولارًا للروضة. ويرتفع المجموع السنوي إلى 7,950 للابتدائي و9,000 للمتوسط و9,900 للثانوي. يجمع كل مجموع 300 دولار لحجز المقعد مع القسط ومبلغ للمستلزمات يشمل الكتب والدفاتر والموارد والزي والقرطاسية والرحلات والأنشطة الصفية المذكورة. ويدفع الطالب الجديد أيضًا 150 دولارًا للتسجيل مرة واحدة وغير قابلة للاسترداد."
      },
      "coverUrl": "/uploads/Best_5_International_Schools_in_Istanbul_result.webp",
      "address": { "en": "Confirm the current campus on the school’s official contact page.", "ar": "أكد الفرع الحالي عبر صفحة الاتصال الرسمية للمدرسة." },
      "distance": { "en": "Obtain a separate transport quote if required.", "ar": "اطلب عرض نقل منفصلًا عند الحاجة." },
      "hours": { "en": "Published 2026–2027 registration policy checked 28 July 2026.", "ar": "تم فحص سياسة التسجيل المنشورة للعام 2026–2027 في 28 يوليو 2026." },
      "price": { "en": "$6,950–$9,900 annual total; new enrollment $150 extra.", "ar": "مجموع سنوي 6,950–9,900 دولار؛ يضاف 150 دولارًا للتسجيل الجديد." },
      "pros": [
        { "en": "Transparent grade-band breakdown", "ar": "تفصيل واضح حسب المرحلة" },
        { "en": "Listed supplies included in the published total", "ar": "المستلزمات المذكورة داخلة في المجموع المنشور" }
      ],
      "cons": [
        { "en": "Discounts generally apply to tuition, not every component", "ar": "الخصومات تطبق عمومًا على القسط لا كل المكونات" },
        { "en": "Confirm transport and refund exposure separately", "ar": "أكد النقل ومخاطر الاسترداد منفصلين" }
      ],
      "lastChecked": { "en": "Official 2026–2027 policy checked 28 July 2026", "ar": "تم التحقق من السياسة الرسمية للعام 2026–2027 في 28 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Brights+International+School+Istanbul",
      "actionButtons": [{ "id": "brights-fees", "url": "https://brightsint.school/wp-content/uploads/2026/05/Detailed-Registration-Policy-26-27.pdf", "label": { "en": "Open the official fee policy", "ar": "افتح سياسة الرسوم الرسمية" }, "visible": true, "clickable": true }]
    }
  },
  {
    "id": "n012-fee-istanbul-international",
    "type": "restaurant",
    "data": {
      "rank": 2,
      "name": { "en": "Istanbul International School fee profile", "ar": "نموذج رسوم Istanbul International School" },
      "location": { "en": "Istanbul", "ar": "إسطنبول" },
      "description": {
        "en": "The 2026–2027 schedule starts at $21,500 for early years. It lists $26,400 for grades 1–4, $26,800 for grade 5, $27,850 for grades 6–7, $28,300 for grade 8 and $30,200–$32,750 across grades 9–12. The school states that tuition, lunch, books/materials, assessment and VAT are included. It also lists the minimum required Cambridge examinations for specified grades as included; families should confirm the exact examinations attached to their child’s grade.",
        "ar": "يبدأ جدول 2026–2027 من 21,500 دولار للسنوات المبكرة، ويذكر 26,400 للصفوف 1–4 و26,800 للصف الخامس و27,850 للصفين 6–7 و28,300 للصف الثامن و30,200–32,750 للصفوف 9–12. وتذكر المدرسة شمول القسط والغداء والكتب والمواد والتقييم وضريبة القيمة المضافة، كما تذكر شمول الحد الأدنى من امتحانات Cambridge المطلوبة لصفوف محددة؛ ويجب تأكيد الامتحانات الدقيقة الخاصة بصف الطفل."
      },
      "coverUrl": "/uploads/Best_5_International_Schools_in_Istanbul_result.webp",
      "address": { "en": "Confirm the assigned campus during assessment.", "ar": "أكد الفرع المحدد أثناء التقييم." },
      "distance": { "en": "Transport is not treated as included in this comparison.", "ar": "لا تعتبر هذه المقارنة النقل داخل السعر." },
      "hours": { "en": "Full payment and installment deadlines are date-sensitive.", "ar": "مواعيد الدفع الكامل والأقساط مرتبطة بالتاريخ." },
      "price": { "en": "$21,500–$32,750, with stated core inclusions.", "ar": "21,500–32,750 دولارًا مع الشمول الأساسي المعلن." },
      "pros": [
        { "en": "Lunch, books/materials, assessment and VAT stated as included", "ar": "الغداء والكتب والمواد والتقييم والضريبة مذكورة ضمن الشمول" },
        { "en": "Detailed fee by grade", "ar": "رسوم مفصلة حسب الصف" }
      ],
      "cons": [
        { "en": "Confirm transport and optional examination costs", "ar": "أكد النقل وتكاليف الامتحانات الاختيارية" },
        { "en": "Late payment can trigger a surcharge", "ar": "قد يترتب على التأخر في الدفع مبلغ إضافي" }
      ],
      "lastChecked": { "en": "Official fee page checked 28 July 2026", "ar": "تم التحقق من صفحة الرسوم الرسمية في 28 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Istanbul+International+School",
      "actionButtons": [{ "id": "iis-fees", "url": "https://www.istanbulint.com/school-fees/", "label": { "en": "Open the official fee schedule", "ar": "افتح جدول الرسوم الرسمي" }, "visible": true, "clickable": true }]
    }
  },
  {
    "id": "n012-fee-mef",
    "type": "restaurant",
    "data": {
      "rank": 3,
      "name": { "en": "MEF International School Istanbul fee profile", "ar": "نموذج رسوم مدرسة MEF الدولية في إسطنبول" },
      "location": { "en": "Ulus, Beşiktaş", "ar": "أولوس، بشكتاش" },
      "description": {
        "en": "MEF’s published tuition-plus-food total, including VAT, starts at $23,610 for preschool and reaches $46,265 for IB2. Kindergarten is $33,460; primary is $41,600; middle and high-school bands range from $42,915 to $46,120, while IB1 is $45,165. A new applicant also pays a non-refundable $1,250 application fee and $4,250 registration fee. The annual placement payment is a component of the published annual total, not an additional amount to add twice.",
        "ar": "يبدأ مجموع MEF المنشور للقسط والطعام شامل الضريبة من 23,610 دولار للروضة ويصل إلى 46,265 لبرنامج IB2. تبلغ الحضانة 33,460 والابتدائي 41,600، وتتراوح المرحلتان المتوسطة والثانوية بين 42,915 و46,120، بينما تبلغ IB1 نحو 45,165. ويدفع المتقدم الجديد أيضًا 1,250 دولارًا للطلب و4,250 للتسجيل، وكلاهما غير قابل للاسترداد. دفعة حجز المكان السنوية جزء من المجموع السنوي المنشور وليست مبلغًا إضافيًا يحسب مرتين."
      },
      "coverUrl": "/uploads/Best_5_International_Schools_in_Istanbul_result.webp",
      "address": { "en": "Ulus campus, Beşiktaş / Istanbul", "ar": "فرع أولوس، بشكتاش / إسطنبول" },
      "distance": { "en": "Request the current transport-zone quote separately.", "ar": "اطلب عرض منطقة النقل الحالي منفصلًا." },
      "hours": { "en": "Payment plan and early-payment deadline are published in the fee PDF.", "ar": "خطة الدفع وموعد الخصم المبكر منشوران في ملف الرسوم." },
      "price": { "en": "$23,610–$46,265 tuition + food total; $5,500 new-applicant fees.", "ar": "23,610–46,265 دولارًا للقسط والطعام؛ و5,500 دولار رسوم متقدم جديد." },
      "pros": [
        { "en": "Food and VAT included in the published annual total", "ar": "الطعام والضريبة داخل المجموع السنوي المنشور" },
        { "en": "Clear grade and IB fee table", "ar": "جدول واضح حسب الصف وبرنامج IB" }
      ],
      "cons": [
        { "en": "Substantial non-refundable new-applicant charges", "ar": "رسوم كبيرة وغير قابلة للاسترداد للمتقدم الجديد" },
        { "en": "Transport requires a separate check", "ar": "النقل يحتاج إلى تحقق منفصل" }
      ],
      "lastChecked": { "en": "Official 2026–2027 PDF checked 28 July 2026", "ar": "تم التحقق من ملف 2026–2027 الرسمي في 28 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=MEF+International+School+Istanbul",
      "actionButtons": [{ "id": "mef-fees", "url": "https://www.mefis.k12.tr/istanbul/downloads/mef-is-istanbul-tuitions-and-fees-2026-2027.pdf", "label": { "en": "Open the official fee PDF", "ar": "افتح ملف الرسوم الرسمي" }, "visible": true, "clickable": true }]
    }
  },
  {
    "id": "n012-fee-iics-marmara",
    "type": "restaurant",
    "data": {
      "rank": 4,
      "name": { "en": "IICS Marmara Campus fee profile", "ar": "نموذج رسوم فرع مرمرة في IICS" },
      "location": { "en": "Hadımköy", "ar": "حديم كوي" },
      "description": {
        "en": "Marmara tuition, including VAT, is $23,000 for EY3–4, $37,200 for EY5, $41,200 for grades 1–3, $42,800 for grades 4–5, $45,900 for grades 6–8, $47,400 for grades 9–10 and $48,900 for grades 11–12. For a new grade 1+ student, add the published $300 application, $1,200 registration and $8,000 capital levy. The schedule includes materials, catering, listed trips and many activities, while transport, grades 6–12 MacBooks and specified examinations and trips are excluded.",
        "ar": "يبلغ قسط فرع مرمرة شامل الضريبة 23,000 دولار لـEY3–4 و37,200 لـEY5 و41,200 للصفوف 1–3 و42,800 للصفين 4–5 و45,900 للصفوف 6–8 و47,400 للصفين 9–10 و48,900 للصفين 11–12. للطالب الجديد من الصف الأول، أضف 300 دولار للطلب و1,200 للتسجيل و8,000 للمساهمة الرأسمالية. يشمل الجدول المواد والطعام والرحلات المذكورة وأنشطة عديدة، ويستثني النقل وأجهزة MacBook للصفوف 6–12 وامتحانات ورحلات محددة."
      },
      "coverUrl": "/uploads/Best_5_International_Schools_in_Istanbul_result.webp",
      "address": { "en": "Marmara Campus, Hadımköy / Istanbul", "ar": "فرع مرمرة، حديم كوي / إسطنبول" },
      "distance": { "en": "Transport is excluded; obtain a route-specific quote.", "ar": "النقل مستثنى؛ اطلب عرضًا خاصًا بالمسار." },
      "hours": { "en": "Full-payment discount has a dated deadline.", "ar": "خصم الدفع الكامل مرتبط بموعد محدد." },
      "price": { "en": "$23,000–$48,900 tuition; new Grade 1+ charges total $9,500.", "ar": "قسط 23,000–48,900 دولار؛ رسوم الجديد من الصف الأول مجموعها 9,500 دولار." },
      "pros": [
        { "en": "VAT, materials and catering included", "ar": "الضريبة والمواد والطعام مشمولة" },
        { "en": "Every grade band published", "ar": "كل المراحل منشورة بوضوح" }
      ],
      "cons": [
        { "en": "High one-time charges for new Grade 1+ students", "ar": "رسوم مرتفعة مرة واحدة للجديد من الصف الأول" },
        { "en": "Transport, specified devices and exams excluded", "ar": "النقل وأجهزة وامتحانات محددة مستثناة" }
      ],
      "lastChecked": { "en": "Official Marmara PDF checked 28 July 2026", "ar": "تم التحقق من ملف مرمرة الرسمي في 28 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=IICS+Marmara+Campus",
      "actionButtons": [{ "id": "iics-marmara-fees", "url": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Marmara-Campus-School-Fees-for-Individual-SY-2026-27-.pdf", "label": { "en": "Open the official Marmara PDF", "ar": "افتح ملف رسوم مرمرة الرسمي" }, "visible": true, "clickable": true }]
    }
  },
  {
    "id": "n012-fee-iics-hisar",
    "type": "restaurant",
    "data": {
      "rank": 5,
      "name": { "en": "IICS Hisar Campus fee profile", "ar": "نموذج رسوم فرع حصار في IICS" },
      "location": { "en": "Rumelihisarı", "ar": "روملي حصاري" },
      "description": {
        "en": "Hisar tuition, including VAT, is $25,200 for EY3–4, $39,900 for EY5, $43,900 for grades 1–3, $42,800 for grades 4–5, $45,900 for grades 6–8, $47,400 for grades 9–10 and $48,900 for grades 11–12. The same IICS one-time application, registration and grade 1+ capital charges apply. Hisar is not a separate school ranking entry: it is shown as a distinct fee profile so families do not apply Marmara’s lower early-grade figures to the wrong campus.",
        "ar": "يبلغ قسط فرع حصار شامل الضريبة 25,200 دولار لـEY3–4 و39,900 لـEY5 و43,900 للصفوف 1–3 و42,800 للصفين 4–5 و45,900 للصفوف 6–8 و47,400 للصفين 9–10 و48,900 للصفين 11–12. وتطبق رسوم IICS نفسها للطلب والتسجيل والمساهمة الرأسمالية من الصف الأول. حصار ليس مدرسة منفصلة في ترتيب الجودة؛ بل يظهر كنموذج رسوم مستقل حتى لا تطبق الأسرة أرقام مرمرة الأقل للسنوات المبكرة على الفرع الخطأ."
      },
      "coverUrl": "/uploads/Best_5_International_Schools_in_Istanbul_result.webp",
      "address": { "en": "Hisar Campus, Rumelihisarı / Istanbul", "ar": "فرع حصار، روملي حصاري / إسطنبول" },
      "distance": { "en": "Verify which grade is actually delivered at this campus.", "ar": "تحقق من المرحلة المقدمة فعليًا في هذا الفرع." },
      "hours": { "en": "Fee schedule is for individual payers in 2026–2027.", "ar": "جدول الرسوم للدفع الفردي في 2026–2027." },
      "price": { "en": "$25,200–$48,900 tuition; same IICS one-time charges.", "ar": "قسط 25,200–48,900 دولار؛ ورسوم IICS نفسها لمرة واحدة." },
      "pros": [
        { "en": "VAT, materials and catering included", "ar": "الضريبة والمواد والطعام مشمولة" },
        { "en": "Campus-specific official schedule", "ar": "جدول رسمي خاص بالفرع" }
      ],
      "cons": [
        { "en": "Early-grade tuition differs from Marmara", "ar": "رسوم المراحل المبكرة تختلف عن مرمرة" },
        { "en": "Same major new-student and exclusion checks as IICS Marmara", "ar": "نفس فحوص رسوم الجديد والاستثناءات المهمة في مرمرة" }
      ],
      "lastChecked": { "en": "Official Hisar PDF checked 28 July 2026", "ar": "تم التحقق من ملف حصار الرسمي في 28 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=IICS+Hisar+Campus",
      "actionButtons": [{ "id": "iics-hisar-fees", "url": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Hisar-Individual-Fee.pdf", "label": { "en": "Open the official Hisar PDF", "ar": "افتح ملف رسوم حصار الرسمي" }, "visible": true, "clickable": true }]
    }
  },
  {
    "id": "n012-fees-faq",
    "type": "faq",
    "data": {
      "title": { "en": "International school fee questions", "ar": "أسئلة رسوم المدارس الدولية" },
      "items": [
        { "q": { "en": "How much are international school fees in Istanbul in 2026–2027?", "ar": "كم تبلغ رسوم المدارس الدولية في إسطنبول 2026–2027؟" }, "a": { "en": "In these five official profiles, published annual starting figures range from $6,950 to $25,200, while upper-grade totals reach $48,900. The range is not like-for-like because inclusions and one-time charges differ.", "ar": "تتراوح الأسعار السنوية الابتدائية المنشورة في هذه النماذج الرسمية الخمسة بين 6,950 و25,200 دولار، وتصل رسوم الصفوف العليا إلى 48,900 دولار. المقارنة ليست متطابقة لأن الشمول والرسوم لمرة واحدة تختلف." } },
        { "q": { "en": "Are meals, books and VAT included?", "ar": "هل الطعام والكتب والضريبة مشمولة؟" }, "a": { "en": "It depends on the school. Istanbul International states lunch, books/materials, assessment and VAT are included; MEF includes food and VAT; IICS includes VAT, materials and catering; Brights includes listed supplies. Confirm the current invoice.", "ar": "يختلف ذلك حسب المدرسة. تذكر Istanbul International شمول الغداء والكتب والمواد والتقييم والضريبة؛ وتشمل MEF الطعام والضريبة؛ وتشمل IICS الضريبة والمواد والطعام؛ وتشمل Brights المستلزمات المذكورة. أكد الفاتورة الحالية." } },
        { "q": { "en": "What extra charges should a new student expect?", "ar": "ما الرسوم الإضافية المتوقعة للطالب الجديد؟" }, "a": { "en": "Common extras include application, assessment, registration, seat reservation, capital levy, transport, devices and external examinations. For example, MEF lists $5,500 in application and registration charges, while IICS lists $9,500 for application, registration and capital levy for a new Grade 1+ student.", "ar": "تشمل الإضافات الشائعة الطلب والتقييم والتسجيل وحجز المقعد والمساهمة الرأسمالية والنقل والأجهزة والامتحانات الخارجية. مثلًا تنشر MEF مبلغ 5,500 دولار للطلب والتسجيل، وتنشر IICS مبلغ 9,500 دولار للطلب والتسجيل والمساهمة الرأسمالية للجديد من الصف الأول." } },
        { "q": { "en": "Which is the cheapest international school in Istanbul?", "ar": "ما أرخص مدرسة دولية في إسطنبول؟" }, "a": { "en": "This article does not make that citywide claim. Brights has the lowest published starting total among these five profiles, but the final family cost depends on grade, eligibility, transport, compulsory extras and what the package includes.", "ar": "لا تدعي هذه المقالة تحديد الأرخص في المدينة كلها. لدى Brights أقل مجموع ابتدائي منشور بين هذه النماذج الخمسة، لكن تكلفة الأسرة النهائية تعتمد على الصف والأهلية والنقل والإضافات الإلزامية وما تشمله الحزمة." } },
        { "q": { "en": "Should I convert USD school fees to Turkish lira?", "ar": "هل أحول الرسوم بالدولار إلى الليرة التركية؟" }, "a": { "en": "Use the school’s invoicing currency and ask which exchange-rate and payment-date rule applies. A static conversion in an article can become inaccurate quickly, so this guide preserves the officially published USD figures.", "ar": "استخدم عملة فاتورة المدرسة واسأل عن قاعدة سعر الصرف وتاريخ الدفع. قد يصبح التحويل الثابت في المقالة غير دقيق سريعًا، لذلك يحافظ هذا الدليل على أرقام الدولار المنشورة رسميًا." } }
      ]
    }
  },
  {
    "id": "n012-school-fees-internal-links",
    "type": "internalLinks",
    "data": {
      "title": { "en": "Compare curricula before comparing price", "ar": "قارن المناهج قبل مقارنة السعر" },
      "items": [
        { "url": { "en": "/en/blog/best-5-international-schools-in-istanbul", "ar": "/ar/blog/أفضل-5-مدارس-دولية-في-إسطنبول" }, "label": { "en": "Best 5 international schools hub", "ar": "دليل أفضل 5 مدارس دولية" } },
        { "url": { "en": "/en/blog/best-5-british-schools-in-istanbul-2026", "ar": "/ar/blog/أفضل-5-مدارس-بريطانية-في-إسطنبول-2026" }, "label": { "en": "Compare British-curriculum schools", "ar": "قارن مدارس المنهج البريطاني" } },
        { "url": { "en": "/en/blog/best-5-american-schools-in-istanbul-2026", "ar": "/ar/blog/أفضل-5-مدارس-أمريكية-في-إسطنبول-2026" }, "label": { "en": "Compare American-curriculum schools", "ar": "قارن مدارس المنهج الأمريكي" } },
        { "url": { "en": "/en/blog/best-5-ib-schools-in-istanbul-2026", "ar": "/ar/blog/أفضل-5-مدارس-ib-في-إسطنبول-2026" }, "label": { "en": "Compare IB schools", "ar": "قارن مدارس IB" } }
      ]
    }
  },
  {
    "id": "n012-school-fees-source-links",
    "type": "internalLinks",
    "data": {
      "title": { "en": "Official 2026–2027 fee sources", "ar": "مصادر الرسوم الرسمية 2026–2027" },
      "items": [
        { "url": { "en": "https://brightsint.school/wp-content/uploads/2026/05/Detailed-Registration-Policy-26-27.pdf", "ar": "https://brightsint.school/wp-content/uploads/2026/05/Detailed-Registration-Policy-26-27.pdf" }, "label": { "en": "Brights official registration policy", "ar": "سياسة تسجيل Brights الرسمية" } },
        { "url": { "en": "https://www.istanbulint.com/school-fees/", "ar": "https://www.istanbulint.com/school-fees/" }, "label": { "en": "Istanbul International official fees", "ar": "رسوم Istanbul International الرسمية" } },
        { "url": { "en": "https://www.mefis.k12.tr/istanbul/downloads/mef-is-istanbul-tuitions-and-fees-2026-2027.pdf", "ar": "https://www.mefis.k12.tr/istanbul/downloads/mef-is-istanbul-tuitions-and-fees-2026-2027.pdf" }, "label": { "en": "MEF official fee PDF", "ar": "ملف رسوم MEF الرسمي" } },
        { "url": { "en": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Marmara-Campus-School-Fees-for-Individual-SY-2026-27-.pdf", "ar": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Marmara-Campus-School-Fees-for-Individual-SY-2026-27-.pdf" }, "label": { "en": "IICS Marmara official fee PDF", "ar": "ملف رسوم IICS مرمرة الرسمي" } },
        { "url": { "en": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Hisar-Individual-Fee.pdf", "ar": "https://www.iics.k12.tr/wp-content/uploads/2026/06/Hisar-Individual-Fee.pdf" }, "label": { "en": "IICS Hisar official fee PDF", "ar": "ملف رسوم IICS حصار الرسمي" } }
      ]
    }
  }
]
  $json$::jsonb,
  '/uploads/Best_5_International_Schools_in_Istanbul_result.webp',
  'PUBLISHED',
  TIMESTAMPTZ '2026-07-28T22:30:00Z',
  TIMESTAMPTZ '2026-07-28T22:30:00Z',
  '1643bb61-6cdb-48c6-8a03-d791622c9de5',
  '0c9ed30e-a0ce-491d-a3d2-1574d2fc0500',
  'رسوم المدارس الدولية في إسطنبول 2026–2027',
  'International School Fees Istanbul 2026–2027',
  'قارن 5 نماذج رسوم مدارس دولية في إسطنبول لعام 2026–2027، مع القسط والطعام والكتب والضريبة ورسوم التسجيل والنقل وتكلفة السنة الأولى.',
  'Compare 5 Istanbul international school fee profiles for 2026–2027, including tuition, meals, books, VAT, registration and first-year extras.',
  '/uploads/Best_5_International_Schools_in_Istanbul_result.webp',
  ARRAY[
    '223911b1-a01e-496f-bab3-95b56fb6a4ea',
    'f0c64db7-8035-4ae9-b173-bc49f5268ea4',
    'c74a1d0b-a56c-48eb-99ec-94c69029bf97',
    '7a4c3d92-9e17-47ba-8fa2-1d0f2b3c4e55'
  ],
  NOW()
);

UPDATE "Post"
SET
  "content_blocks_json" = (
    SELECT jsonb_agg(
      CASE WHEN block->>'id' = 'seo-links-schools-general' THEN
        jsonb_set(block, '{data,items}', COALESCE(block#>'{data,items}', '[]'::jsonb) ||
          jsonb_build_array(jsonb_build_object(
            'url', jsonb_build_object('en', '/en/blog/international-school-fees-in-istanbul-2026-2027', 'ar', '/ar/blog/رسوم-المدارس-الدولية-في-إسطنبول-2026-2027'),
            'label', jsonb_build_object('en', 'International school fees in Istanbul', 'ar', 'رسوم المدارس الدولية في إسطنبول')
          )))
      ELSE block END ORDER BY position
    )
    FROM jsonb_array_elements("content_blocks_json") WITH ORDINALITY AS items(block, position)
  ),
  "related_post_ids" = array_append("related_post_ids", 'b8d25f61-4c87-46da-9f30-5a6b7c8d9e01'),
  "updated_at" = NOW()
WHERE "id" = '223911b1-a01e-496f-bab3-95b56fb6a4ea'
  AND NOT ('b8d25f61-4c87-46da-9f30-5a6b7c8d9e01' = ANY("related_post_ids"));

UPDATE "Post"
SET
  "content_blocks_json" = (
    SELECT jsonb_agg(
      CASE WHEN block->>'id' = 'n009-british-schools-internal-links' THEN
        jsonb_set(block, '{data,items}', COALESCE(block#>'{data,items}', '[]'::jsonb) ||
          jsonb_build_array(jsonb_build_object(
            'url', jsonb_build_object('en', '/en/blog/international-school-fees-in-istanbul-2026-2027', 'ar', '/ar/blog/رسوم-المدارس-الدولية-في-إسطنبول-2026-2027'),
            'label', jsonb_build_object('en', 'Compare international school fees', 'ar', 'قارن رسوم المدارس الدولية')
          )))
      ELSE block END ORDER BY position
    )
    FROM jsonb_array_elements("content_blocks_json") WITH ORDINALITY AS items(block, position)
  ),
  "related_post_ids" = array_append("related_post_ids", 'b8d25f61-4c87-46da-9f30-5a6b7c8d9e01'),
  "updated_at" = NOW()
WHERE "id" = 'f0c64db7-8035-4ae9-b173-bc49f5268ea4'
  AND NOT ('b8d25f61-4c87-46da-9f30-5a6b7c8d9e01' = ANY("related_post_ids"));

UPDATE "Post"
SET
  "content_blocks_json" = (
    SELECT jsonb_agg(
      CASE WHEN block->>'id' = 'n010-american-schools-internal-links' THEN
        jsonb_set(block, '{data,items}', COALESCE(block#>'{data,items}', '[]'::jsonb) ||
          jsonb_build_array(jsonb_build_object(
            'url', jsonb_build_object('en', '/en/blog/international-school-fees-in-istanbul-2026-2027', 'ar', '/ar/blog/رسوم-المدارس-الدولية-في-إسطنبول-2026-2027'),
            'label', jsonb_build_object('en', 'Compare international school fees', 'ar', 'قارن رسوم المدارس الدولية')
          )))
      ELSE block END ORDER BY position
    )
    FROM jsonb_array_elements("content_blocks_json") WITH ORDINALITY AS items(block, position)
  ),
  "related_post_ids" = array_append("related_post_ids", 'b8d25f61-4c87-46da-9f30-5a6b7c8d9e01'),
  "updated_at" = NOW()
WHERE "id" = 'c74a1d0b-a56c-48eb-99ec-94c69029bf97'
  AND NOT ('b8d25f61-4c87-46da-9f30-5a6b7c8d9e01' = ANY("related_post_ids"));

UPDATE "Post"
SET
  "content_blocks_json" = (
    SELECT jsonb_agg(
      CASE WHEN block->>'id' = 'n011-ib-schools-internal-links' THEN
        jsonb_set(block, '{data,items}', COALESCE(block#>'{data,items}', '[]'::jsonb) ||
          jsonb_build_array(jsonb_build_object(
            'url', jsonb_build_object('en', '/en/blog/international-school-fees-in-istanbul-2026-2027', 'ar', '/ar/blog/رسوم-المدارس-الدولية-في-إسطنبول-2026-2027'),
            'label', jsonb_build_object('en', 'Compare international school fees', 'ar', 'قارن رسوم المدارس الدولية')
          )))
      ELSE block END ORDER BY position
    )
    FROM jsonb_array_elements("content_blocks_json") WITH ORDINALITY AS items(block, position)
  ),
  "related_post_ids" = array_append("related_post_ids", 'b8d25f61-4c87-46da-9f30-5a6b7c8d9e01'),
  "updated_at" = NOW()
WHERE "id" = '7a4c3d92-9e17-47ba-8fa2-1d0f2b3c4e55'
  AND NOT ('b8d25f61-4c87-46da-9f30-5a6b7c8d9e01' = ANY("related_post_ids"));
