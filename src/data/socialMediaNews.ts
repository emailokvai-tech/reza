export interface SocialMediaPost {
  id: string;
  portalName: string;
  portalUsername: string;
  portalLogo: string;
  isVerified: boolean;
  timeAgo: string;
  content: string;
  hashtags: string[];
  likes: number;
  commentsCount: number;
  shares: number;
  comments: Array<{ id: string; author: string; text: string; date: string }>;
  sourceUrl: string;
}

// Portals data
const PORTALS = [
  { name: "বিবিসি বাংলা", username: "@BBCBangla", logo: "B", isVerified: true },
  { name: "প্রথম আলো", username: "@ProthomAlo", logo: "P", isVerified: true },
  { name: "ডয়চে ভেলে বাংলা", username: "@dw_bengali", logo: "D", isVerified: true },
  { name: "দ্য ডেইলি স্টার", username: "@dailystarnews", logo: "S", isVerified: true },
  { name: "যুগান্তর", username: "@JugantorOfficial", logo: "J", isVerified: true },
  { name: "কালের কণ্ঠ", username: "@KalerKantho", logo: "K", isVerified: true },
  { name: "সময় নিউজ", username: "@SomoyNews", logo: "T", isVerified: true },
  { name: "Vulture Eyes", username: "@vultureeyes", logo: "V", isVerified: true }
];

// Seed templates for programmatic expansion to 105+ unique posts
const TOPICS = [
  {
    type: "success",
    title: "ময়মনসিংহের নারী উদ্যোক্তার অভাবনীয় সাফল্য",
    template: "ময়মনসিংহের ফুলপুরের অজপাড়াগাঁ থেকে শুরু করে আজ সফল দুগ্ধ খামারী হিসেবে আত্মপ্রকাশ করেছেন সুফিয়া খাতুন। মাত্র ২টি গাভী নিয়ে শুরু করা তার খামার আজ ৩০টি গাভীতে উন্নীত হয়েছে। সুফিয়া বলেন, 'সমাজ অনেক কথাই বলেছিল, কিন্তু আমি দমে যাইনি।' আজ তিনি স্বাবলম্বী এবং গ্রামের ৫ জন অসহায় নারীর কর্মসংস্থান করেছেন।",
    hashtags: ["নারীউদ্যোক্তা", "ময়মনসিংহ", "সাফল্যগাথা", "স্বাবলম্বী"],
    comments: [
      { author: "সালমা রহমান", text: "সুফিয়া আপা আমাদের গর্ব! ময়মনসিংহকে আপনি অনেক উঁচুতে নিয়ে গেছেন।" },
      { author: "আরিফ হোসেন", text: "উদ্যমী নারীদের জন্য সরকার ও ব্যাংকগুলোর সহজ ঋণের ব্যবস্থা করা উচিত।" }
    ]
  },
  {
    type: "rights",
    title: "ময়মনসিংহে বাল্যবিবাহ রুখে দিল স্কুলছাত্রীরা",
    template: "ময়মনসিংহের নান্দাইলে অষ্টম শ্রেণীর এক ছাত্রীর বাল্যবিবাহের আয়োজন বন্ধ করেছে তারই সহপাঠীরা। বিয়ের কার্ড ও আয়োজন দেখে তারা গোপনে উপজেলা নির্বাহী কর্মকর্তা (ইউএনও) এবং 'দি ইনভেস্টিগেশন' এর বিশেষ খবর ডেস্কে অভিযোগ দায়ের করে। প্রশাসন এসে তাৎক্ষণিকভাবে বিয়ে বন্ধ করে এবং অভিভাবকদের কাছ থেকে ১৮ বছরের আগে বিয়ে না দেওয়ার মুচলেকা গ্রহণ করে।",
    hashtags: ["বাল্যবিবাহ_রুধুন", "ময়মনসিংহ", "কিশোরী_শক্তি", "আইনি_অধিকার"],
    comments: [
      { author: "তাহমিনা বেগম", text: "কিশোরী ছাত্রীদের এই সাহসিকতাকে লাল সালাম! এভাবেই রুখতে হবে অন্যায়।" },
      { author: "অ্যাডভোকেট জসিম", text: "বাল্যবিবাহের সাথে জড়িত কাজী ও অভিভাবকদেরও শাস্তির আওতায় আনা দরকার।" }
    ]
  },
  {
    type: "deprived",
    title: "যৌতুকের নির্মম শিকার গৃহবধূ স্বপ্নার ন্যায়বিচারের লড়াই",
    template: "ময়মনসিংহের স্বপ্না সরকার বিয়ের পর থেকেই স্বামী ও শ্বশুরবাড়ির যৌতুকের মানসিক ও শারীরিক নির্যাতনের শিকার হচ্ছিলেন। অবশেষে তিনি সাহসী সিদ্ধান্ত নিয়ে আদালতের দ্বারস্থ হয়েছেন। স্বপ্না বলেন, 'অনেক কেঁদেছি, আর নয়। এবার অপরাধীদের উপযুক্ত শাস্তি নিশ্চিত করেই ছাড়ব।' মামলাটির আইনি দেখভাল করছে দি ইনভেস্টিগেশন-এর লিগ্যাল এইড প্যানেল।",
    hashtags: ["যৌতুক_নিরোধ_আইন", "স্বপ্না_সরকার", "ময়মনসিংহ", "ন্যায়বিচার"],
    comments: [
      { author: "রানী মালা", text: "স্বপ্না আপা, আমরা ভুক্তভোগীরা আপনার সাথে আছি। নরপশুদের উপযুক্ত বিচার চাই।" },
      { author: "মেহেদী হাসান", text: "যৌতুক চাওয়াই একটি জঘন্য অপরাধ। সমাজে এদের বয়কট করা উচিত।" }
    ]
  },
  {
    type: "success",
    title: "তৃণমূলের হস্তশিল্পে স্বাবলম্বী ময়মনসিংহের ১০০ নারী",
    template: "হস্তশিল্প তৈরি করে নিজেদের ভাগ্য পরিবর্তন করেছেন ময়মনসিংহের ঈশ্বরগঞ্জের ১০০ জন গ্রাম্য গৃহবধূ। নিজেদের তৈরি শতরঞ্জি, নকশিকাঁথা ও পাটের তৈরি ব্যাগ এখন বিদেশেও রপ্তানি হচ্ছে। উদ্যোক্তা রেহানা পারভীন বলেন, 'আজকে আমরা কেউ আর স্বামীর বাপের বাড়ির মুখাপেক্ষী নই। আমাদের নিজেদের একটা শক্ত অর্থনৈতিক ভিত্তি গড়ে উঠেছে।'",
    hashtags: ["হস্তশিল্প", "অর্থনৈতিক_মুক্তি", "নারী_ক্ষমতায়ন", "ময়মনসিংহ"],
    comments: [
      { author: "জেসমিন আক্তার", text: "দারুণ উদ্যোগ! আমাদের দেশের গ্রামীণ নারীরাই আমাদের মূল শক্তি।" },
      { author: "করিম আলী", text: "এসব পন্যের প্রসারে অনলাইন মার্কেটপ্লেস অনেক বড় ভূমিকা রাখতে পারে।" }
    ]
  },
  {
    type: "legal",
    title: "বিনামূল্যে আইনি পরামর্শ শিবিরের সফল আয়োজন",
    template: "আইনি অধিকার ও সুরক্ষা সম্পর্কে সচেতনতা বৃদ্ধির লক্ষ্যে ময়মনসিংহের ভালুকায় দি ইনভেস্টিগেশন-এর উদ্যোগে দিনব্যাপী লিগ্যাল এইড ক্লিনিক অনুষ্ঠিত হয়েছে। এতে প্রায় ২০০ জন সুবিধাবঞ্চিত নারী পারিবারিক আইন, দেনমোহর, যৌতুক ও খোরপোষ সংক্রান্ত জটিল সমস্যার তাৎক্ষণিক পরামর্শ পেয়েছেন। অ্যাডভোকেট নাসরিন বলেন, 'আইন জানাটাই সুরক্ষার প্রথম ধাপ।'",
    hashtags: ["লিগ্যাল_এইড", "বিনামূল্যে_আইনি_সেবা", "আইন_জানুন", "ভালুকা"],
    comments: [
      { author: "মরিয়ম নেসা", text: "খুবই দরকারি উদ্যোগ ছিল। আমাদের গ্রামে অনেকেই দেনমোহরের আইন সম্পর্কে জানে না।" },
      { author: "সুমন চৌধুরী", text: "উপজেলা পর্যায়ে প্রতি মাসেই এমন পরামর্শ শিবিরের আয়োজন করা প্রয়োজন।" }
    ]
  }
];

// Rich datasets to generate unique combinations
const BANGLADESH_PLACES = ["ময়মনসিংহ", "ঢাকা", "চট্টগ্রাম", "রাজশাহী", "খুলনা", "সিলেট", "বরিশাল", "রংপুর", "কুমিল্লা", "গাজীপুর", "নারায়ণগঞ্জ", "সাভার", "নান্দাইল", "ভালুকা", "ত্রিশাল", "ফুলপুর", "গফরগাঁও", "হালুয়াঘাট"];
const NAMES = ["সাজেদা", "ফাতেমা", "খাদিজা", "আয়েশা", "তানিয়া", "শিউলি", "রোকসানা", "শাহনাজ", "নাসরিন", "ফারহানা", "রাশেদা", "ববিতা", "শামীমা", "পারভীন", "জাহানারা", "কুলসুম", "হেনা", "আফসানা"];
const INCIDENTS_DEP = [
  "যৌতুকের দাবি অমান্য করায় শারীরিক নির্যাতনের শিকার হয়েছেন এক গৃহবধূ।",
  "অনুমতি ছাড়াই স্বামীর দ্বিতীয় বিয়ের প্রতিবাদ করায় নির্যাতনের শিকার হয়ে ঘরছাড়া ৩ সন্তানের জননী।",
  "দেনমোহরের পাওনা টাকা দাবি করায় প্রাণনাশের হুমকি দেওয়া হয়েছে এক ডিভোর্সী নারীকে।",
  "অপ্রাপ্তবয়স্ক মেয়েকে জোরপূর্বক বিয়ে দেওয়ার বিরুদ্ধে অবস্থান নেওয়ায় বাবার মারধরের শিকার মা ও মেয়ে।",
  "অফিসে সহকর্মীদের মানসিক হয়রানির বিরুদ্ধে নির্ভীকভাবে অভিযোগ দায়ের করেছেন এক নারী কর্মকর্তা।"
];
const INCIDENTS_SUC = [
  "ক্ষুদ্র ঋণের সহায়তায় মুরগির খামার দিয়ে এলাকায় আলোড়ন সৃষ্টি করেছেন এক বিধবা নারী।",
  "অনলাইন বুটিক শপ খুলে প্রতি মাসে অর্ধলক্ষাধিক টাকা আয় করে পুরো পরিবারের দায়িত্ব নিয়েছেন এক কলেজ ছাত্রী।",
  "অটো রিকশা চালিয়ে সফলভাবে ৩ সন্তানের পড়াশোনার খরচ জোগাচ্ছেন এক লড়াকু মা।",
  "নিজের হস্তশিল্প কারখানায় গ্রামের ৩০ জন দুস্থ ও তালাকপ্রাপ্তা নারীদের কর্মসংস্থান গড়ে তুলেছেন এক গৃহিণী।",
  "আইটি ফ্রিল্যান্সিং শিখে স্বাবলম্বী হয়ে প্রত্যন্ত অঞ্চলের অন্য মেয়েদের প্রযুক্তি শিক্ষা দিচ্ছেন এক তরুণী।"
];
const INCIDENTS_RIG = [
  "নারী ও শিশু নির্যাতন দমন আইনের সঠিক প্রয়োগে অবশেষে গ্রেপ্তার হয়েছে যৌতুকলোভী পাষণ্ড স্বামী।",
  "সম্পত্তির ন্যায্য হিস্যা আদায়ের জন্য আইনি লড়াইয়ে জয়ী হয়েছেন ৩ কন্যা সন্তানের জননী।",
  "ইভটিজিং ও বখাটেদের উৎপাতের বিরুদ্ধে সোচ্চার হয়ে থানায় ডায়েরি করেছেন এক নির্ভীক ছাত্রী।",
  "কর্মক্ষেত্রে নিরাপদ পরিবেশ নিশ্চিতের দাবিতে মানববন্ধন করেছেন স্থানীয় গার্মেন্টস নারী শ্রমিকরা।",
  "বিবাহ বিচ্ছেদের পর সন্তানের একক হেফাজত ও খোরপোষ আদায়ের আইনি যুদ্ধে জয়ী হয়েছেন এক মা।"
];

// Combine and generate 108 high-quality items to guarantee over 100 posts
export function generateSocialMediaNews(): SocialMediaPost[] {
  const posts: SocialMediaPost[] = [];
  
  // 1. Add our 5 high-fidelity custom seed templates
  TOPICS.forEach((t, i) => {
    const portal = PORTALS[i % PORTALS.length];
    posts.push({
      id: `sm-seed-${i + 1}`,
      portalName: portal.name,
      portalUsername: portal.username,
      portalLogo: portal.logo,
      isVerified: portal.isVerified,
      timeAgo: `${toBengaliNumber(i + 1)} ঘণ্টা আগে`,
      content: t.template,
      hashtags: t.hashtags,
      likes: 120 + i * 45,
      commentsCount: t.comments.length,
      shares: 30 + i * 12,
      comments: t.comments.map((c, idx) => ({
        id: `sm-seed-c-${i}-${idx}`,
        author: c.author,
        text: c.text,
        date: "৫ ঘণ্টা আগে"
      })),
      sourceUrl: `https://www.facebook.com/posts/seed-${i + 1}`
    });
  });

  // 2. Dynamically construct 103 more highly realistic posts (total 108)
  for (let i = 1; i <= 103; i++) {
    const portal = PORTALS[i % PORTALS.length];
    const place = BANGLADESH_PLACES[i % BANGLADESH_PLACES.length];
    const name = NAMES[i % NAMES.length];
    
    let content = "";
    let hashtags: string[] = [];
    let comments: Array<{ author: string; text: string }> = [];
    
    const typeSelector = i % 3;
    if (typeSelector === 0) {
      // Success post
      const detail = INCIDENTS_SUC[i % INCIDENTS_SUC.length];
      content = `${place} এলাকার অতি সাধারণ গৃহবধূ ${name} আক্তার। ${detail} ${name} বলেন, "কোনো কাজই ছোট নয়, চেষ্টা আর আত্মবিশ্বাস থাকলে নারীরা যেকোনো বাধা জয় করতে পারে।" আজ তিনি সমগ্র এলাকার এক আলোর দিশারী।`;
      hashtags = ["নারী_ক্ষমতায়ন", "সাফল্যের_গল্প", place, "লড়াকু_নারী"];
      comments = [
        { author: "নাসিমা পারভীন", text: "আপনাকে জানাই হৃদয় নিংড়ানো অভিনন্দন! আপনি আমাদের সত্যিকারের অনুপ্রেরণা।" },
        { author: "কামরুল ইসলাম", text: "নারীদের অর্থনৈতিক স্বাধীনতা সমাজ বদলের একমাত্র চাবিকাঠি।" }
      ];
    } else if (typeSelector === 1) {
      // Deprived post
      const detail = INCIDENTS_DEP[i % INCIDENTS_DEP.length];
      content = `মানবাধিকার লঙ্ঘন ও যৌতুকের করাল গ্রাস থেকে রেহাই পাচ্ছে না নিরীহ নারীরা। ${place} থেকে প্রাপ্ত সংবাদে জানা গেছে, ${name} বেগম নামে এক গৃহবধূ ${detail} ভুক্তভোগী নারী বর্তমানে স্থানীয় হাসপাতালে চিকিৎসাধীন এবং অপরাধীদের সর্বোচ্চ শাস্তির দাবি জানিয়েছেন।`;
      hashtags = ["যৌতুক_বন্ধ_করুন", "নারী_নির্যাতন", place, "অধিকারের_দাবি"];
      comments = [
        { author: "অ্যাডভোকেট শারমিন", text: "এরকম জঘন্য কাজের জন্য আসামিদের জামিন অযোগ্য ধারায় বিচার হওয়া প্রয়োজন।" },
        { author: "জয়নাল আবেদীন", text: "সামাজিক সচেতনতা ও কঠোর আইনি প্রয়োগ ছাড়া এই বর্বরতা বন্ধ হবে না।" }
      ];
    } else {
      // Rights post
      const detail = INCIDENTS_RIG[i % INCIDENTS_RIG.length];
      content = `অধিকার আদায়ের লড়াইয়ে বাংলাদেশের নারীরা পিছিয়ে নেই। ${place} থেকে এসেছে এক সাহসী সংবাদ। ${name} বেগম ${detail} তিনি প্রমাণ করেছেন যে সঠিক আইনি সহায়তা ও সাহস থাকলে কোনো নিপীড়কই পার পাবে না।`;
      hashtags = ["আইনি_লড়াই", "নারীর_অধিকার", place, "বিজয়"];
      comments = [
        { author: "তাহমিনা চৌধুরী", text: "অভিনন্দন! আপনার এই জয় অন্য শত শত নির্যাতিত বোনকে পথ দেখাবে।" },
        { author: "মেহরাব হোসেন", text: "আইনি সাহায্য পেতে আমাদের সকলের দি ইনভেস্টিগেশন-এর সাহায্য নেওয়া উচিত।" }
      ];
    }

    // Convert digit to Bengali
    const hourBn = toBengaliNumber(Math.floor(i / 4) + 2);
    
    posts.push({
      id: `sm-gen-${i}`,
      portalName: portal.name,
      portalUsername: portal.username,
      portalLogo: portal.logo,
      isVerified: portal.isVerified,
      timeAgo: `${hourBn} ঘণ্টা আগে`,
      content: content,
      hashtags: hashtags,
      likes: Math.floor(Math.random() * 250) + 15,
      commentsCount: comments.length,
      shares: Math.floor(Math.random() * 80) + 5,
      comments: comments.map((c, idx) => ({
        id: `sm-gen-c-${i}-${idx}`,
        author: c.author,
        text: c.text,
        date: "৩ ঘণ্টা আগে"
      })),
      sourceUrl: `https://www.facebook.com/posts/gen-${i}`
    });
  }

  return posts;
}

// Bengali Digit conversion helper
function toBengaliNumber(num: string | number): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}
