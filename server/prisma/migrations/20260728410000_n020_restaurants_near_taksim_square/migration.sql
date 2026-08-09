INSERT INTO "Post" (
  "id", "title_ar", "title_en", "slug_ar", "slug_en",
  "excerpt_ar", "excerpt_en", "content_ar", "content_en",
  "content_blocks_json", "cover_image_url", "status",
  "published_at", "content_reviewed_at", "author_id", "category_id",
  "seo_title_ar", "seo_title_en", "seo_desc_ar", "seo_desc_en",
  "og_image_url", "related_post_ids", "updated_at"
)
VALUES (
  '405ad1e9-c40f-4ef2-b718-d23c4d5e6f89',
  'أفضل 5 مطاعم قريبة من ميدان تقسيم 2026',
  'Best 5 Restaurants Near Taksim Square (2026)',
  'أفضل-5-مطاعم-قريبة-من-ميدان-تقسيم-2026',
  'best-5-restaurants-near-taksim-square-2026',
  'قارن 5 مطاعم على بُعد نحو 5–15 دقيقة مشيًا من ميدان تقسيم حسب المطبخ والسعر والدوام والحجز ورسوم الخدمة والخريطة.',
  'Compare five restaurants roughly 5–15 minutes from Taksim Square by cuisine, price, hours, reservations, service charge and map.',
  '<p>دليل Best5 عملي لخمس تجارب مختلفة قرب ميدان تقسيم، لا قائمة من خمسة مطاعم سياحية متشابهة.</p>',
  '<p>A practical Best5 guide to five different meals near Taksim Square—not five interchangeable tourist restaurants.</p>',
  $json$
[
  {
    "id": "n020-radius",
    "type": "guide",
    "data": {
      "title": { "en": "What “near Taksim Square” means here", "ar": "ماذا يعني «قريب من ميدان تقسيم» هنا؟" },
      "content": {
        "en": "Every selection is planned within roughly 5–15 minutes on foot from the Republic Monument in normal conditions. The time is an estimate, not a navigation promise: your metro exit, crowds, crossings, luggage, hills and construction can change it. Open the map from the square immediately before walking.\n\nThe ranking balances food specialisation, useful first-party information, walking practicality, value and fit for a distinct need. It does not claim one restaurant is universally best or that a high public rating guarantees your experience.",
        "ar": "تقع الخيارات المختارة ضمن نحو 5–15 دقيقة مشيًا من نصب الجمهورية في الظروف العادية. الوقت تقديري وليس وعدًا ملاحيًا؛ فقد يغيره مخرج المترو والزحام والمعابر والحقائب والمنحدرات والأعمال. افتح الخريطة من الميدان مباشرة قبل المشي.\n\nيوازن الترتيب بين تخصص الطعام والمعلومات الرسمية المفيدة وسهولة المشي والقيمة وملاءمة حاجة مختلفة. ولا يدعي أن مطعمًا واحدًا هو الأفضل للجميع أو أن التقييم العام يضمن تجربتك."
      }
    }
  },
  {
    "id": "n020-bill-check",
    "type": "guide",
    "data": {
      "title": { "en": "Five checks before ordering in a tourist district", "ar": "خمسة فحوص قبل الطلب في منطقة سياحية" },
      "content": {
        "en": "Ask for the current priced menu before ordering and match the restaurant name and branch. Check whether bread, water, tea, appetisers or table items are complimentary or charged; whether service is included or added; and whether meat or fish is priced per portion, 100 grams or kilogram. Ask for the approximate total before a weight-priced order.\n\nKeep the itemised bill and review it before paying. If the card terminal offers conversion to your home currency, compare it with payment in Turkish lira rather than accepting automatically. For popular dinner restaurants, reserve through the official phone or page and ask which floor or seating area is booked.",
        "ar": "اطلب القائمة الحالية المسعرة قبل الطلب وطابق اسم المطعم والفرع. تحقق هل الخبز والماء والشاي والمقبلات أو عناصر الطاولة مجانية أم مدفوعة، وهل الخدمة مشمولة أم تضاف، وهل اللحم أو السمك مسعر بالحصة أو 100 غرام أو الكيلو. اطلب إجماليًا تقريبيًا قبل طلب موزون.\n\nاحتفظ بالفاتورة المفصلة وراجعها قبل الدفع. إذا عرض جهاز البطاقة التحويل إلى عملتك، فقارنه بالدفع بالليرة التركية بدل القبول تلقائيًا. وللمطاعم المزدحمة مساءً احجز عبر الهاتف أو الصفحة الرسمية واسأل أي طابق أو جلسة يشملها الحجز."
      }
    }
  },
  {
    "id": "n020-quick-picks",
    "type": "cards",
    "data": {
      "title": { "en": "Quick picks by need", "ar": "اختيارات سريعة حسب الحاجة" },
      "cards": [
        {
          "icon": "Flame",
          "title": { "en": "Turkish grill dinner", "ar": "عشاء مشاوي تركية" },
          "label": { "en": "Zübeyir Ocakbaşı", "ar": "زبير أوجاك باشي" },
          "note": { "en": "Choose the open-grill experience and reserve for dinner.", "ar": "اختر تجربة الشواء المفتوح واحجز للعشاء." }
        },
        {
          "icon": "Wallet",
          "title": { "en": "Lower-cost regional meal", "ar": "وجبة إقليمية أقل تكلفة" },
          "label": { "en": "Hayvore", "ar": "Hayvore" },
          "note": { "en": "Black Sea soups, pide, seasonal fish and daily-style dishes with recent menu evidence.", "ar": "شوربات البحر الأسود والبيدا والسمك الموسمي وأطباق يومية مع دليل أسعار حديث." }
        },
        {
          "icon": "Languages",
          "title": { "en": "Arabic-family group", "ar": "مجموعة عائلية عربية" },
          "label": { "en": "Chef Eyad", "ar": "الشيف إياد" },
          "note": { "en": "Arabic-first information, smoked meat by weight and included oriental sides.", "ar": "معلومات عربية ولحوم مدخنة بالوزن وجوانب شرقية مشمولة." }
        }
      ]
    }
  },
  {
    "id": "n020-comparison",
    "type": "comparison",
    "data": {
      "title": { "en": "Five restaurants near Taksim compared", "ar": "مقارنة خمسة مطاعم قرب تقسيم" },
      "headers": [
        { "en": "Restaurant / walk", "ar": "المطعم / المشي" },
        { "en": "Cuisine / best for", "ar": "المطبخ / الأنسب لـ" },
        { "en": "Price planning", "ar": "تخطيط السعر" },
        { "en": "Hours / critical check", "ar": "الدوام / التحقق الحاسم" }
      ],
      "rows": [
        [
          { "en": "1. Zübeyir — about 5–7 min", "ar": "1. زبير — نحو 5–7 دقائق" },
          { "en": "Ocakbaşı kebabs; grill dinner", "ar": "مشاوي أوجاك باشي؛ عشاء مشاوي" },
          { "en": "₺₺₺; request the current priced menu", "ar": "₺₺₺؛ اطلب القائمة الحالية المسعرة" },
          { "en": "Reserve dinner; ask for grill-counter or table seating", "ar": "احجز للعشاء؛ اسأل عن جلسة الشواية أو الطاولة" }
        ],
        [
          { "en": "2. Hacı Abdullah — about 12–15 min", "ar": "2. حاجي عبدالله — نحو 12–15 دقيقة" },
          { "en": "Ottoman/Turkish dishes; history and variety", "ar": "أطباق عثمانية/تركية؛ تاريخ وتنوع" },
          { "en": "₺₺₺; daily availability and prices vary", "ar": "₺₺₺؛ يتغير التوفر والسعر يوميًا" },
          { "en": "Official hours 08:00–23:00 daily; confirm special days", "ar": "الرسمي 08:00–23:00 يوميًا؛ أكد الأيام الخاصة" }
        ],
        [
          { "en": "3. Hayvore — about 12–15 min", "ar": "3. Hayvore — نحو 12–15 دقيقة" },
          { "en": "Black Sea cooking; value and regional dishes", "ar": "مطبخ البحر الأسود؛ قيمة وأطباق إقليمية" },
          { "en": "Soups from ₺150; median main around ₺550 in June record", "ar": "الشوربات من 150₺؛ وسيط الرئيسي نحو 550₺ بسجل يونيو" },
          { "en": "Reported 09:00–00:00; fish and daily dishes can sell out", "ar": "مذكور 09:00–00:00؛ قد تنفد الأسماك وأطباق اليوم" }
        ],
        [
          { "en": "4. Chef Eyad — about 7–10 min", "ar": "4. الشيف إياد — نحو 7–10 دقائق" },
          { "en": "Arabic smoked meat; families and groups", "ar": "لحوم عربية مدخنة؛ عائلات ومجموعات" },
          { "en": "Meat sold by kilogram; ask weight and total first", "ar": "اللحم يباع بالكيلو؛ اسأل عن الوزن والإجمالي أولًا" },
          { "en": "12:00–00:00; may close early when the daily meat sells out", "ar": "12:00–00:00؛ قد يغلق مبكرًا عند نفاد الكمية" }
        ],
        [
          { "en": "5. Faros Taksim — about 4–6 min", "ar": "5. Faros تقسيم — نحو 4–6 دقائق" },
          { "en": "Turkish/international; close, family and late meal", "ar": "تركي/عالمي؛ قريب وعائلي ووجبة متأخرة" },
          { "en": "₺₺₺; checked drinks menu states 10% service charge", "ar": "₺₺₺؛ قائمة المشروبات المفحوصة تذكر خدمة 10%" },
          { "en": "About 08:00–00:00; confirm restaurant, not hotel, hours", "ar": "نحو 08:00–00:00؛ أكد دوام المطعم لا الفندق" }
        ]
      ]
    }
  },
  {
    "id": "n020-zubeyir",
    "type": "restaurant",
    "data": {
      "rank": 1,
      "name": { "en": "Zübeyir Ocakbaşı", "ar": "زبير أوجاك باشي" },
      "tagline": { "en": "Best overall Turkish grill near the square", "ar": "أفضل تجربة مشاوي تركية متكاملة قرب الميدان" },
      "description": {
        "en": "Zübeyir ranks first for a focused ocakbaşı experience within a short walk of the square. Its official site traces the restaurant's grill background to 1986 and publishes the Bekar Sokak address. Go for Adana or Urfa kebab, lamb skewers or chops and a restrained selection of meze so the charcoal cooking remains the centre of the meal.\n\nThe attraction is the open-hearth atmosphere, but seating matters. Ask whether the reservation is at the grill counter, downstairs or upstairs; smoke, noise and stairs may not suit every child or mobility need. The official public page does not provide a dependable current price list, so inspect the dated menu before ordering.",
        "ar": "يتصدر زبير لتجربة أوجاك باشي مركزة على مسافة قصيرة من الميدان. يعيد موقعه الرسمي خبرة الشواء إلى عام 1986 وينشر عنوان شارع Bekar. اختر أضنة أو أورفا كباب أو شيش وقطع الضأن مع عدد محدود من المقبلات ليبقى الفحم محور الوجبة.\n\nجاذبية المكان في جو الموقد المفتوح، لكن الجلسة مهمة. اسأل هل الحجز عند الشواية أو في الطابق السفلي أو العلوي؛ فقد لا يناسب الدخان والضجيج والدرج كل طفل أو احتياج حركي. لا تنشر الصفحة الرسمية قائمة أسعار حالية موثوقة، لذا افحص القائمة المؤرخة قبل الطلب."
      },
      "coverUrl": "/uploads/Best_5_Steak_Restaurants_in_Istanbul_(2026_Guide)_result.webp",
      "address": { "en": "Şehit Muhtar, İstiklal Cd., Bekar Sok. No:28, Beyoğlu", "ar": "شهيد مختار، شارع الاستقلال، Bekar Sokak رقم 28، بيوغلو" },
      "distance": { "en": "Approximately 5–7 minutes from the Republic Monument.", "ar": "نحو 5–7 دقائق من نصب الجمهورية." },
      "hours": { "en": "Reserve and confirm the current dinner hours by phone: +90 212 293 39 51.", "ar": "احجز وأكد ساعات العشاء الحالية على ‎+90 212 293 39 51." },
      "price": { "en": "Mid-high; verify every current menu price before ordering.", "ar": "متوسط مرتفع؛ تحقق من كل سعر حالي قبل الطلب." },
      "pros": [
        { "en": "Focused charcoal-grill identity", "ar": "هوية واضحة للشواء على الفحم" },
        { "en": "Very close to Taksim Square", "ar": "قريب جدًا من ميدان تقسيم" }
      ],
      "cons": [
        { "en": "Popular dinner times need booking", "ar": "أوقات العشاء المزدحمة تحتاج حجزًا" },
        { "en": "Open-grill smoke and stairs may not suit everyone", "ar": "قد لا يناسب دخان الشواية والدرج الجميع" }
      ],
      "lastChecked": { "en": "Official site and address checked 29 July 2026", "ar": "تم فحص الموقع الرسمي والعنوان في 29 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Zubeyir+Ocakbasi+Beyoglu",
      "actionButtons": [
        { "id": "n020-zubeyir-official", "url": "https://zubeyirocakbasi.com.tr/", "label": { "en": "Open the official site", "ar": "افتح الموقع الرسمي" }, "visible": true, "clickable": true }
      ]
    }
  },
  {
    "id": "n020-haci-abdullah",
    "type": "restaurant",
    "data": {
      "rank": 2,
      "name": { "en": "Hacı Abdullah Lokantası", "ar": "مطعم حاجي عبدالله" },
      "tagline": { "en": "Best historic Ottoman-Turkish meal", "ar": "أفضل وجبة عثمانية-تركية تاريخية" },
      "description": {
        "en": "Hacı Abdullah ranks second for visitors who want cooked Turkish and Ottoman-style dishes rather than another kebab menu. The official menu spans olive-oil vegetables, stuffed dishes, lamb tandoor, beğendili kebab, stews, grills, compotes and seasonal desserts. Build a mixed table from what is actually available that day.\n\nIts official page publishes daily 08:00–23:00 hours, but availability is part of the lokanta format and some dishes or fruit desserts change. Prices are not clearly published on the official online menu. Ask the price of each selected plate, whether portions are full or half, and whether bread, pickles, compote or service adds to the bill.",
        "ar": "يحل حاجي عبدالله ثانيًا للزائر الذي يريد أطباقًا تركية وعثمانية مطبوخة بدل قائمة كباب أخرى. تشمل القائمة الرسمية خضار زيت الزيتون والمحاشي وكوزو تندير وكباب الباذنجان واليخنات والمشاوي والكومبوت والحلويات الموسمية. ابنِ طاولة متنوعة مما هو متاح فعلًا في ذلك اليوم.\n\nتنشر الصفحة الرسمية دوامًا يوميًا 08:00–23:00، لكن التوفر جزء من طبيعة اللوكانتا وتتغير بعض الأطباق أو حلويات الفاكهة. لا تنشر القائمة الرسمية أسعارًا واضحة؛ اسأل سعر كل طبق وهل الحصة كاملة أو نصف، وهل يضاف الخبز أو المخلل أو الكومبوت أو الخدمة."
      },
      "coverUrl": "/uploads/Best_5_Family_Restaurants_in_Istanbul_(2026_Guide)_result.webp",
      "address": { "en": "Hüseyinağa, Atıf Yılmaz Cd. No:9/A, Beyoğlu", "ar": "حسين آغا، شارع عاطف يلماز رقم 9/A، بيوغلو" },
      "distance": { "en": "Approximately 12–15 minutes via İstiklal and side streets.", "ar": "نحو 12–15 دقيقة عبر الاستقلال والشوارع الجانبية." },
      "hours": { "en": "Officially published as daily 08:00–23:00; verify holidays.", "ar": "منشور رسميًا يوميًا 08:00–23:00؛ تحقق في العطل." },
      "price": { "en": "Mid-high; prices and daily dishes should be confirmed at the counter/menu.", "ar": "متوسط مرتفع؛ أكد الأسعار وأطباق اليوم من القائمة/العرض." },
      "pros": [
        { "en": "Much broader than a kebab-only meal", "ar": "أوسع بكثير من وجبة كباب فقط" },
        { "en": "Strong historic Turkish-lokanta identity", "ar": "هوية تاريخية قوية للوكانتا التركية" }
      ],
      "cons": [
        { "en": "Daily availability varies", "ar": "يتغير التوفر يوميًا" },
        { "en": "Official online menu lacks current prices", "ar": "القائمة الرسمية الإلكترونية بلا أسعار حالية" }
      ],
      "lastChecked": { "en": "Official menu and hours checked 29 July 2026", "ar": "تم فحص القائمة والدوام الرسميين في 29 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Haci+Abdullah+Lokantasi+Beyoglu",
      "actionButtons": [
        { "id": "n020-haci-menu", "url": "https://haciabdullah.com.tr/menu/", "label": { "en": "Review the official menu", "ar": "راجع القائمة الرسمية" }, "visible": true, "clickable": true }
      ]
    }
  },
  {
    "id": "n020-hayvore",
    "type": "restaurant",
    "data": {
      "rank": 3,
      "name": { "en": "Hayvore", "ar": "Hayvore" },
      "tagline": { "en": "Best regional value and Black Sea cooking", "ar": "أفضل قيمة إقليمية ومطبخ البحر الأسود" },
      "description": {
        "en": "Hayvore ranks third for a more local-feeling regional meal and the clearest recent price record among these five. Its official site states that it has served Black Sea cooking in Beyoğlu since 2009. Look for black-cabbage soup, muhlama, pide, anchovy dishes when seasonal, stuffed vegetables and Laz böreği.\n\nA venue-sourced menu record dated 7 June 2026 showed soups from ₺150, special lahmacun ₺280, fish plates around ₺485–850 and a median main course near ₺550. Treat those as planning references, not guaranteed July prices. Ask what is fresh that day before ordering fish, and choose several smaller regional dishes if the group wants to explore.",
        "ar": "يحل Hayvore ثالثًا لوجبة إقليمية أقرب للطابع المحلي ولأوضح سجل أسعار حديث بين الخمسة. يذكر موقعه الرسمي أنه يقدم مطبخ البحر الأسود في بيوغلو منذ 2009. ابحث عن شوربة الكرنب الأسود والمحلّمة والبيدا وأطباق الأنشوفة في موسمها والمحاشي ولاز بوريي.\n\nأظهر سجل قائمة من مصدر المطعم بتاريخ 7 يونيو 2026 شوربات من 150₺ ولحم بعجين خاصًا بـ280₺ وأطباق سمك نحو 485–850₺ ووسيط طبق رئيسي قرب 550₺. اعتبرها مراجع تخطيط لا أسعار يوليو مضمونة. اسأل عما هو طازج قبل طلب السمك واختر عدة أطباق إقليمية أصغر إذا أرادت المجموعة الاستكشاف."
      },
      "coverUrl": "/uploads/Best_Budget_Restaurants_in_Istanbul_(2026_Guide)_result.webp",
      "address": { "en": "Kuloğlu, İstiklal Cd., Turnacıbaşı Sok. No:4, Beyoğlu", "ar": "كولوغلو، شارع الاستقلال، Turnacıbaşı Sokak رقم 4، بيوغلو" },
      "distance": { "en": "Approximately 12–15 minutes from the Republic Monument.", "ar": "نحو 12–15 دقيقة من نصب الجمهورية." },
      "hours": { "en": "Recent menu record lists 09:00–00:00; confirm same-day hours.", "ar": "يسجل مصدر حديث 09:00–00:00؛ أكد ساعات اليوم نفسه." },
      "price": { "en": "June 2026 record: soups from ₺150; median main about ₺550.", "ar": "سجل يونيو 2026: شوربات من 150₺؛ وسيط الرئيسي نحو 550₺." },
      "pros": [
        { "en": "Distinct Black Sea regional menu", "ar": "قائمة إقليمية مميزة للبحر الأسود" },
        { "en": "Useful recent price evidence", "ar": "دليل أسعار حديث مفيد" }
      ],
      "cons": [
        { "en": "Seasonal fish availability varies", "ar": "يتغير توفر السمك الموسمي" },
        { "en": "The room can feel compact at busy times", "ar": "قد تبدو الصالة ضيقة وقت الزحام" }
      ],
      "lastChecked": { "en": "Official site and June 2026 menu record checked 29 July 2026", "ar": "تم فحص الموقع الرسمي وسجل قائمة يونيو 2026 في 29 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Hayvore+Beyoglu",
      "actionButtons": [
        { "id": "n020-hayvore-official", "url": "https://www.hayvore.com.tr/", "label": { "en": "Open Hayvore's official site", "ar": "افتح موقع Hayvore الرسمي" }, "visible": true, "clickable": true }
      ]
    }
  },
  {
    "id": "n020-chef-eyad",
    "type": "restaurant",
    "data": {
      "rank": 4,
      "name": { "en": "Chef Eyad Taksim", "ar": "مطعم الشيف إياد تقسيم" },
      "tagline": { "en": "Best Arabic-family smoked-meat table", "ar": "أفضل طاولة لحوم مدخنة لعائلة عربية" },
      "description": {
        "en": "Chef Eyad ranks fourth for Arabic-speaking families and groups who want a shared smoked-meat meal close to İstiklal. Its official branch page describes lamb neck, shoulder, shanks and ribs plus brisket and asado, cooked for more than 12 hours and sold by kilogram. It states that rice, salads and oriental appetisers accompany the meat without a separate charge.\n\nThis is not a fixed-price individual plate. Ask which cuts remain, their current price per kilogram, the suggested raw or served weight for the group and the estimated total before confirming. The official page says 12:00–00:00 but warns that the branch can close early when the daily quantity sells out; reserve for an evening visit.",
        "ar": "يحل الشيف إياد رابعًا للعائلات والمجموعات الناطقة بالعربية التي تريد وجبة لحوم مدخنة مشتركة قرب الاستقلال. تصف صفحة الفرع الرسمية رقبة وكتف وموزات وريش الضأن مع البريسكت والأسادو، مطهوة أكثر من 12 ساعة ومباعة بالكيلو. وتذكر أن الأرز والسلطات والمقبلات الشرقية تقدم مع اللحم دون رسم منفصل.\n\nهذه ليست وجبة فردية بسعر ثابت. اسأل أي القطع متوفرة وسعر الكيلو الحالي والوزن المقترح للمجموعة والإجمالي المتوقع قبل التأكيد. تذكر الصفحة دوام 12:00–00:00 لكنها تحذر من إغلاق مبكر عند نفاد كمية اليوم؛ احجز للزيارة المسائية."
      },
      "coverUrl": "/uploads/Best_5_Arabic_Restaurants_in_Istanbul_(2026_Guide)_result.webp",
      "address": { "en": "Off İstiklal Street near the Koton-side entrance; use the official branch map.", "ar": "في شارع فرعي من الاستقلال قرب مدخل جهة Koton؛ استخدم خريطة الفرع الرسمية." },
      "distance": { "en": "Approximately 7–10 minutes from the square.", "ar": "نحو 7–10 دقائق من الميدان." },
      "hours": { "en": "Officially 12:00–00:00; stock can finish earlier.", "ar": "رسميًا 12:00–00:00؛ قد تنفد الكمية قبل ذلك." },
      "price": { "en": "Meat is sold per kilogram; confirm cut, weight and total before ordering.", "ar": "اللحم يباع بالكيلو؛ أكد القطعة والوزن والإجمالي قبل الطلب." },
      "pros": [
        { "en": "Arabic-first branch information and booking", "ar": "معلومات وحجز باللغة العربية" },
        { "en": "Included rice, salad and oriental sides stated officially", "ar": "أرز وسلطات وجوانب شرقية مشمولة وفق الموقع" }
      ],
      "cons": [
        { "en": "Weight pricing needs a total estimate", "ar": "التسعير بالوزن يحتاج تقديرًا للإجمالي" },
        { "en": "Popular cuts can sell out", "ar": "قد تنفد القطع المطلوبة" }
      ],
      "lastChecked": { "en": "Official Taksim branch and menu checked 29 July 2026", "ar": "تم فحص فرع تقسيم وقائمته الرسميين في 29 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Chef+Eyad+Taksim+Istanbul",
      "actionButtons": [
        { "id": "n020-chef-eyad-official", "url": "https://www.chefeyad.net/taksim", "label": { "en": "Open the official Taksim page", "ar": "افتح صفحة تقسيم الرسمية" }, "visible": true, "clickable": true }
      ]
    }
  },
  {
    "id": "n020-faros",
    "type": "restaurant",
    "data": {
      "rank": 5,
      "name": { "en": "Faros Restaurant Taksim", "ar": "مطعم Faros تقسيم" },
      "tagline": { "en": "Best close, flexible and late-serving choice", "ar": "أفضل خيار قريب ومرن ومتأخر" },
      "description": {
        "en": "Faros ranks fifth as the practical fallback when proximity, family seating and a long service window matter more than a single specialist cuisine. Its Taksim information places it about 300 metres from the square, and current listings describe Turkish, international, Italian and pizza choices with breakfast, outdoor seating, reservations and group suitability.\n\nThe official hotel restaurant page says service runs from around 08:00 to midnight. A Faros drinks menu published in 2026 explicitly states that VAT is included and a 10% service charge is added. Confirm that the same charge and current food menu apply to the exact Taksim restaurant, then check all additions before ordering.",
        "ar": "يحل Faros خامسًا كخيار عملي حين يكون القرب والجلسة العائلية وساعات الخدمة الطويلة أهم من تخصص مطبخ واحد. تضع معلومات تقسيم المكان على نحو 300 متر من الميدان، وتصف الأدلة الحالية خيارات تركية وعالمية وإيطالية وبيتزا مع فطور وجلسة خارجية وحجز وملاءمة للمجموعات.\n\nتذكر صفحة مطعم الفندق الرسمية خدمة من نحو 08:00 حتى منتصف الليل. وتنص قائمة مشروبات Faros منشورة في 2026 صراحة على شمول الضريبة وإضافة رسم خدمة 10%. أكد أن الرسم نفسه والقائمة الحالية ينطبقان على مطعم تقسيم المحدد، ثم تحقق من كل الإضافات قبل الطلب."
      },
      "coverUrl": "/uploads/Best_5_Family_Restaurants_in_Istanbul_(2026_Guide)_result.webp",
      "address": { "en": "Cumhuriyet Cd. No:31, Beyoğlu / Istanbul", "ar": "شارع الجمهورية رقم 31، بيوغلو / إسطنبول" },
      "distance": { "en": "Approximately 4–6 minutes north of the Republic Monument.", "ar": "نحو 4–6 دقائق شمال نصب الجمهورية." },
      "hours": { "en": "Approximately 08:00–00:00; confirm the restaurant's same-day hours.", "ar": "نحو 08:00–00:00؛ أكد دوام المطعم في اليوم نفسه." },
      "price": { "en": "Mid-high; checked 2026 menu states a 10% service charge.", "ar": "متوسط مرتفع؛ قائمة 2026 المفحوصة تذكر رسم خدمة 10%." },
      "pros": [
        { "en": "One of the closest full-service choices", "ar": "من أقرب خيارات الخدمة الكاملة" },
        { "en": "Flexible menu and long hours", "ar": "قائمة مرنة وساعات طويلة" }
      ],
      "cons": [
        { "en": "Less specialised than the first four", "ar": "أقل تخصصًا من الأربعة الأولى" },
        { "en": "Confirm the service charge and exact branch menu", "ar": "أكد رسم الخدمة وقائمة الفرع المحدد" }
      ],
      "lastChecked": { "en": "Official location/hours and 2026 service-charge menu checked 29 July 2026", "ar": "تم فحص الموقع/الدوام الرسمي وقائمة رسم الخدمة 2026 في 29 يوليو 2026" },
      "mapUrl": "https://maps.google.com/?q=Faros+Restaurant+Taksim+Cumhuriyet+Caddesi",
      "actionButtons": [
        { "id": "n020-faros-official", "url": "https://farostaksimhotel.com/en/page/restaurant/28", "label": { "en": "Check the official restaurant page", "ar": "تحقق من صفحة المطعم الرسمية" }, "visible": true, "clickable": true }
      ]
    }
  },
  {
    "id": "n020-faq",
    "type": "faq",
    "data": {
      "title": { "en": "Restaurants near Taksim: common questions", "ar": "أسئلة شائعة عن مطاعم قرب تقسيم" },
      "items": [
        {
          "q": { "en": "What is the best restaurant near Taksim Square for Turkish food?", "ar": "ما أفضل مطعم تركي قرب ميدان تقسيم؟" },
          "a": { "en": "Choose Zübeyir for charcoal ocakbaşı kebabs, Hacı Abdullah for Ottoman/Turkish cooked dishes, or Hayvore for Black Sea regional food. They answer different versions of “Turkish food”.", "ar": "اختر زبير لمشاوي أوجاك باشي، أو حاجي عبدالله للأطباق العثمانية/التركية المطبوخة، أو Hayvore لمطبخ البحر الأسود. فهي تجيب عن أنواع مختلفة من «الطعام التركي»." }
        },
        {
          "q": { "en": "Which restaurant is best for an Arabic-speaking family near Taksim?", "ar": "أي مطعم أنسب لعائلة ناطقة بالعربية قرب تقسيم؟" },
          "a": { "en": "Chef Eyad provides Arabic-first branch information and shared smoked meat with oriental sides. Confirm weight, total price, seating and remaining cuts before visiting.", "ar": "يوفر الشيف إياد معلومات عربية ووجبة لحوم مدخنة مشتركة مع جوانب شرقية. أكد الوزن والإجمالي والجلسة والقطع المتبقية قبل الزيارة." }
        },
        {
          "q": { "en": "Are restaurants directly on Taksim Square more expensive?", "ar": "هل المطاعم الموجودة مباشرة في ميدان تقسيم أغلى؟" },
          "a": { "en": "Prime tourist locations can carry higher prices, but location alone is not enough to judge value. Compare the current priced menu, portion, inclusions and service charge with a restaurant 5–15 minutes away.", "ar": "قد تحمل المواقع السياحية الرئيسية أسعارًا أعلى، لكن الموقع وحده لا يحكم على القيمة. قارن القائمة الحالية والحصة والمشمول ورسم الخدمة مع مطعم يبعد 5–15 دقيقة." }
        },
        {
          "q": { "en": "Do Taksim restaurants add a service charge?", "ar": "هل تضيف مطاعم تقسيم رسم خدمة؟" },
          "a": { "en": "Policies differ. Some menus state a percentage; Faros had a checked 2026 menu stating 10%. Ask whether service is included, added or optional before ordering and inspect the itemised bill.", "ar": "تختلف السياسات. تذكر بعض القوائم نسبة محددة؛ وظهرت في قائمة Faros مفحوصة لعام 2026 نسبة 10%. اسأل هل الخدمة مشمولة أو مضافة أو اختيارية وراجع الفاتورة." }
        },
        {
          "q": { "en": "Do I need a reservation near Taksim?", "ar": "هل أحتاج حجزًا قرب تقسيم؟" },
          "a": { "en": "Reserve popular dinner spots such as Zübeyir and group meals such as Chef Eyad, especially on weekends. Confirm the exact branch, time, seating area and cancellation expectation through an official contact.", "ar": "احجز للمطاعم المزدحمة مثل زبير ولوجبات المجموعات مثل الشيف إياد، خصوصًا نهاية الأسبوع. أكد الفرع والوقت ومنطقة الجلوس وسياسة الإلغاء عبر جهة رسمية." }
        }
      ]
    }
  },
  {
    "id": "n020-internal-links",
    "type": "internalLinks",
    "data": {
      "title": { "en": "Continue planning meals in Istanbul", "ar": "تابع تخطيط وجبات إسطنبول" },
      "items": [
        { "url": { "en": "/en/category/restaurants", "ar": "/ar/category/مطاعم" }, "label": { "en": "Browse the Restaurants hub", "ar": "تصفح مركز المطاعم" } },
        { "url": { "en": "/en/blog/best-budget-restaurants-in-istanbul-2026-guide", "ar": "/ar/blog/أفضل-خمس-مطاعم-اقتصادية-في-إسطنبول-2026" }, "label": { "en": "Budget restaurants in Istanbul", "ar": "مطاعم اقتصادية في إسطنبول" } },
        { "url": { "en": "/en/blog/best-5-family-restaurants-in-istanbul-2026-guide", "ar": "/ar/blog/أفضل-خمس-مطاعم-عائلية-في-إسطنبول-2026" }, "label": { "en": "Family restaurants in Istanbul", "ar": "مطاعم عائلية في إسطنبول" } },
        { "url": { "en": "/en/blog/best-5-arabic-restaurants-in-istanbul-2026-guide", "ar": "/ar/blog/أفضل-خمس-مطاعم-عربية-في-إسطنبول-2026" }, "label": { "en": "Arabic restaurants in Istanbul", "ar": "مطاعم عربية في إسطنبول" } },
        { "url": { "en": "/en/blog/best-5-steak-restaurants-in-istanbul-2026-guide", "ar": "/ar/blog/أفضل-خمس-مطاعم-ستيك-في-إسطنبول-2026" }, "label": { "en": "Steak restaurants in Istanbul", "ar": "مطاعم ستيك في إسطنبول" } },
        { "url": { "en": "/en/blog/best-fish-restaurants-in-istanbul-2026-guide", "ar": "/ar/blog/أفضل-خمس-مطاعم-سمك-في-إسطنبول-2026" }, "label": { "en": "Fish restaurants in Istanbul", "ar": "مطاعم سمك في إسطنبول" } }
      ]
    }
  },
  {
    "id": "n020-source-links",
    "type": "internalLinks",
    "data": {
      "title": { "en": "Verify each restaurant before walking", "ar": "تحقق من كل مطعم قبل المشي" },
      "items": [
        { "url": { "en": "https://zubeyirocakbasi.com.tr/", "ar": "https://zubeyirocakbasi.com.tr/" }, "label": { "en": "Zübeyir official site", "ar": "موقع زبير الرسمي" } },
        { "url": { "en": "https://haciabdullah.com.tr/menu/", "ar": "https://haciabdullah.com.tr/menu/" }, "label": { "en": "Hacı Abdullah official menu", "ar": "قائمة حاجي عبدالله الرسمية" } },
        { "url": { "en": "https://www.hayvore.com.tr/", "ar": "https://www.hayvore.com.tr/" }, "label": { "en": "Hayvore official site", "ar": "موقع Hayvore الرسمي" } },
        { "url": { "en": "https://www.chefeyad.net/taksim", "ar": "https://www.chefeyad.net/taksim" }, "label": { "en": "Chef Eyad Taksim official branch", "ar": "فرع الشيف إياد تقسيم الرسمي" } },
        { "url": { "en": "https://farostaksimhotel.com/en/page/restaurant/28", "ar": "https://farostaksimhotel.com/en/page/restaurant/28" }, "label": { "en": "Faros Taksim official restaurant page", "ar": "صفحة مطعم Faros تقسيم الرسمية" } }
      ]
    }
  }
]
  $json$::jsonb,
  '/uploads/Best_5_Family_Restaurants_in_Istanbul_(2026_Guide)_result.webp',
  'PUBLISHED',
  TIMESTAMPTZ '2026-07-29T06:30:00Z',
  TIMESTAMPTZ '2026-07-29T06:30:00Z',
  '1643bb61-6cdb-48c6-8a03-d791622c9de5',
  'b34b5873-4500-472a-bf10-e1da2a3e4e7f',
  'أفضل المطاعم القريبة من ميدان تقسيم 2026',
  'Best Restaurants Near Taksim Square: Top 5',
  'قارن أفضل 5 مطاعم قرب ميدان تقسيم حسب مسافة المشي والمطبخ والسعر والدوام والحجز ورسوم الخدمة والخريطة.',
  'Compare five restaurants near Taksim Square by walk time, cuisine, price, hours, reservations, service charge and map.',
  '/uploads/Best_5_Family_Restaurants_in_Istanbul_(2026_Guide)_result.webp',
  ARRAY[
    '0301fc00-d209-466c-8d38-ee85d4525280',
    '80a1a89a-9aaf-450a-bc3d-5907b5a4d7b2',
    '749e55f5-9a03-4036-a5bd-75d2f325c173',
    '00b0da6d-180f-464e-9855-14dcb0d35a32',
    'b42fa48f-a46a-49b4-897a-bca1b6a8d1df'
  ],
  NOW()
);
