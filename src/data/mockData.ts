export interface MockComment {
  id: string;
  commenter: string;
  text: string;
}

export interface MockPost {
  id: string;
  authorName: string;
  authorRole: 'admin' | 'user';
  timeBn: string;
  timeEn: string;
  contentBn: string;
  contentEn: string;
  image: string;
  likes: number;
  likedByUser: boolean;
  comments: MockComment[];
}

export interface LegalLaw {
  id: string;
  categoryBn: string;
  categoryEn: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  summaryEn: string;
  pointsBn: string[];
  pointsEn: string[];
}

export const DEFAULT_POSTS: MockPost[] = [
  {
    id: 'post-1',
    authorName: 'দি ইনভেস্টিগেশন',
    authorRole: 'admin',
    timeBn: '২ ঘণ্টা আগে',
    timeEn: '2 hours ago',
    contentBn: 'যৌতুক একটি সামাজিক ব্যাধি। কোনো নারী যৌতুকের কারণে হেনস্থার শিকার হলে অবিলম্বে জাতীয় হেল্পলাইন ১০৯ অথবা লিগ্যাল এইড নম্বর ১৬৪৩০-এ যোগাযোগ করুন। আইনের আশ্রয় নেওয়া আপনার নাগরিক অধিকার। আমাদের আইনি অধিকার গাইড ট্যাবটি দেখুন বিস্তারিত জানতে।',
    contentEn: 'Dowry is a social evil. If any woman faces harassment due to dowry, contact the national helpline 109 or legal aid 16430 immediately. Seeking legal help is your civic right. Check our Legal Rights Guide tab for more details.',
    image: '',
    likes: 42,
    likedByUser: false,
    comments: [
      { id: 'c-1-1', commenter: 'তানজিনা আক্তার', text: 'অত্যন্ত গুরুত্বপূর্ণ তথ্য। ধন্যবাদ দি ইনভেস্টিগেশন-কে সচেতনতা তৈরির জন্য।' },
      { id: 'c-1-2', commenter: 'রাফসান হাবিব', text: 'বাল্যবিবাহ ও যৌতুকের বিরুদ্ধে পাড়ায় পাড়ায় প্রতিরোধ গড়ে তোলা উচিত।' }
    ]
  },
  {
    id: 'post-2',
    authorName: 'দি ইনভেস্টিগেশন',
    authorRole: 'admin',
    timeBn: '১ দিন আগে',
    timeEn: '1 day ago',
    contentBn: 'আসন্ন আগামী ৫ই জুলাই সকাল ১০টায় "নাগরিক নিরাপত্তা ও ডিজিটাল সাক্ষরতা" বিষয়ে আমাদের একটি অনলাইন সেমিনার অনুষ্ঠিত হবে। সেমিনারে সাইবার হ্যারাসমেন্ট প্রতিরোধ ও আইনি প্রতিকার নিয়ে ঢাকা মেট্রোপলিটন পুলিশের সাইবার ক্রাইম ইউনিটের কর্মকর্তারা আলোচনা করবেন। সকলের অংশগ্রহণ কাম্য।',
    contentEn: 'Our upcoming online seminar on "Citizen Safety and Digital Literacy" will be held on July 5th at 10 AM. Officers from the Cyber Crime Unit of Dhaka Metropolitan Police will discuss preventing cyber harassment and legal remedies. Everyone is welcome to attend.',
    image: '',
    likes: 128,
    likedByUser: false,
    comments: [
      { id: 'c-2-1', commenter: 'শায়লা পারভীন', text: 'নিবন্ধন করার লিংকটি শেয়ার করলে ভালো হতো।' },
      { id: 'c-2-2', commenter: 'দি ইনভেস্টিগেশন (সম্পাদকীয় সেল)', text: 'সেমিনারের আগের দিন নিবন্ধনের লিংকটি এই পেজে প্রকাশ করা হবে।' }
    ]
  }
];

export const LEGAL_DATA: LegalLaw[] = [
  {
    id: 'law-1',
    categoryBn: 'যৌতুক বিরোধী আইন',
    categoryEn: 'Anti-Dowry Law',
    titleBn: 'যৌতুক নিরোধ আইন, ২০১৮',
    titleEn: 'Dowry Prohibition Act, 2018',
    summaryBn: 'বাংলাদেশে যৌতুক দাবি করা, গ্রহণ করা বা প্রদান করা একটি শাস্তিযোগ্য ফৌজদারি অপরাধ। এই আইনের আওতায় ভুক্তভোগীরা তাৎক্ষণিক প্রতিকার পেতে পারেন।',
    summaryEn: 'Demanding, receiving, or giving dowry is a punishable criminal offense in Bangladesh. Victims can seek immediate legal recourse under this act.',
    pointsBn: [
      'যৌতুক দাবি বা গ্রহণ করার শাস্তি সর্বোচ্চ ৫ বছর এবং সর্বনিম্ন ১ বছর কারাদণ্ড অথবা অনধিক ৫০,০০০ টাকা অর্থদণ্ড বা উভয় দণ্ড।',
      'যৌতুক আদান-প্রদানে সহায়তা বা চুক্তি করার ক্ষেত্রেও সমান শাস্তির বিধান রয়েছে।',
      'যৌতুকের মিথ্যা মামলা দায়ের করলেও অভিযোগকারীর সর্বোচ্চ ৫ বছর কারাদণ্ড বা অনধিক ৫০,০০০ টাকা জরিমানা হতে পারে।'
    ],
    pointsEn: [
      'Penalty for demanding or receiving dowry is max 5 years and min 1 year of imprisonment, or a fine up to BDT 50,000, or both.',
      'Aiding, abetting, or contracting for dowry carries the same penalty.',
      'Filing a false dowry case can lead to max 5 years of imprisonment or a fine up to BDT 50,000 for the complainant.'
    ]
  },
  {
    id: 'law-2',
    categoryBn: 'পারিবারিক সুরক্ষা',
    categoryEn: 'Domestic Protection',
    titleBn: 'পারিবারিক সহিংসতা প্রতিরোধ ও সুরক্ষা আইন, ২০১০',
    titleEn: 'Domestic Violence Prevention Act, 2010',
    summaryBn: 'পারিবারিক সহিংসতার শিকার নারী ও শিশুদের সুরক্ষায় পারিবারিক আদালত ও ম্যাজিস্ট্রেটকে তাৎক্ষণিক অন্তর্বর্তীকালীন আদেশ এবং পুনর্বাসনের নির্দেশনা দেওয়ার ক্ষমতা দেওয়া হয়েছে।',
    summaryEn: 'To protect women and children from domestic violence, family courts and magistrates are empowered to issue immediate protection orders and rehabilitation directions.',
    pointsBn: [
      'পারিবারিক সহিংসতা বলতে শারীরিক, মানসিক, যৌন ও আর্থিক যেকোনো নির্যাতনকে বোঝায়।',
      'আদালত ভুক্তভোগীর জন্য আবাসন নিশ্চিতকরণ, চিকিৎসা খরচ এবং নিরাপত্তার জন্য পুলিশ প্রোটেকশন অর্ডার দিতে পারেন।',
      'সুরক্ষা আদেশ (Protection Order) লঙ্ঘনকারীকে প্রথমবার লঙ্ঘনের জন্য সর্বোচ্চ ৬ মাস কারাদণ্ড বা ২০,০০০ টাকা জরিমানা করা হতে পারে।'
    ],
    pointsEn: [
      'Domestic violence includes physical, psychological, sexual, and economic abuse.',
      'The court can issue orders securing accommodation, medical expenses, and police protection for the victim.',
      'Violating a protection order carries a penalty of max 6 months of imprisonment or BDT 20,000 fine for the first offense.'
    ]
  },
  {
    id: 'law-3',
    categoryBn: 'নির্যাতন দমন',
    categoryEn: 'Violence Prevention',
    titleBn: 'নারী ও শিশু নির্যাতন দমন আইন, ২০০০',
    titleEn: 'Prevention of Oppression Against Women & Children Act, 2000',
    summaryBn: 'ধর্ষণ, অপহরণ, এসিড হামলা এবং যৌতুকের কারণে সৃষ্ট গুরুতর জখম ও মৃত্যুর অপরাধে কঠোর শাস্তির বিধান সম্বলিত বিশেষ ট্রাইব্যুনাল গঠনের আইন।',
    summaryEn: 'Law establishing special tribunals with strict penalty provisions for crimes like rape, abduction, acid assault, and severe injury/death due to dowry.',
    pointsBn: [
      'ধর্ষণ বা ধর্ষণের কারণে মৃত্যুর সর্বোচ্চ শাস্তি যাবজ্জীবন কারাদণ্ড থেকে মৃত্যুদণ্ড।',
      'যৌতুকের কারণে মৃত্যু ঘটানোর শাস্তি মৃত্যুদণ্ড এবং গুরুতর জখম করার শাস্তি যাবজ্জীবন সশ্রম কারাদণ্ড।',
      'এই আইনের অধীনে দায়ের করা মামলার বিচার বিশেষ ট্রাইব্যুনালে ১৮০ কার্যদিবসের মধ্যে শেষ করার বাধ্যবাক্কতা রয়েছে।'
    ],
    pointsEn: [
      'Max penalty for rape or death caused by rape ranges from life imprisonment to death penalty.',
      'Death caused by dowry carries death penalty, and causing severe injury carries life imprisonment.',
      'Cases filed under this act must be tried in special tribunals within 180 working days.'
    ]
  },
  {
    id: 'law-4',
    categoryBn: 'বাল্যবিবাহ নিরোধ',
    categoryEn: 'Child Marriage prevention',
    titleBn: 'বাল্যবিবাহ নিরোধ আইন, ২০১৭',
    titleEn: 'Child Marriage Restraint Act, 2017',
    summaryBn: '১৮ বছরের কম বয়সী মেয়ে এবং ২১ বছরের কম বয়সী ছেলের বিবাহ বাল্যবিবাহ হিসেবে গণ্য হয় এবং এটি প্রতিরোধে কঠোর আইন রয়েছে।',
    summaryEn: 'Marriage of girls under 18 and boys under 21 is considered child marriage, and strict laws exist to prevent and penalize it.',
    pointsBn: [
      'বাল্যবিবাহ সম্পন্ন করলে বর-কনে এবং বিবাহের সাথে সংশ্লিষ্ট অভিভাবক ও কাজী সকলের অনূর্ধ্ব ২ বছর কারাদণ্ড বা ১ লক্ষ টাকা অর্থদণ্ড বা উভয় দণ্ড হতে পারে।',
      'যেকোনো সচেতন নাগরিক উপজেলা নির্বাহী কর্মকর্তা (UNO) বা নির্বাহী ম্যাজিস্ট্রেটকে অবহিত করে বাল্যবিবাহ বন্ধ করার তাৎক্ষণিক আদেশ জারি করাতে পারেন।',
      'ইউপি সদস্য বা স্থানীয় প্রশাসন খবর পাওয়ামাত্র বিয়ে বন্ধ করতে পুলিশি সাহায্য আহ্বান করতে বাধ্য।'
    ],
    pointsEn: [
      'Conducting child marriage can penalize the groom/bride (if adult), guardians, and officiant (Kazi) with up to 2 years of jail, or BDT 100,000 fine, or both.',
      'Any citizen can report to the UNO or Executive Magistrate to secure an immediate injunction against child marriage.',
      'Local government representatives or administration are bound to seek police help to halt the marriage once informed.'
    ]
  },
  {
    id: 'law-5',
    categoryBn: 'সাইবার সুরক্ষা',
    categoryEn: 'Cyber Safety',
    titleBn: 'সাইবার হয়রানি ও আইনি প্রতিকার (ডিজিটাল নিরাপত্তা)',
    titleEn: 'Cyber Harassment & Digital Protection',
    summaryBn: 'অনলাইনে কোনো নারীর আপত্তিকর ছবি প্রকাশ, ফেক আইডি তৈরি বা ব্ল্যাকমেইলিংয়ের মতো অপকর্মের শাস্তি ডিজিটাল নিরাপত্তা আইনে করা হয়।',
    summaryEn: 'Publishing offensive photos of women online, creating fake profiles, or blackmailing are punishable offenses under Digital Security/Cyber Acts.',
    pointsBn: [
      'অনুমতি ছাড়া কোনো নারীর ব্যক্তিগত ছবি বা ভিডিও ইন্টারনেটে প্রকাশ করা গুরুতর অপরাধ, যার শাস্তি অনূর্ধ্ব ৫ বছর কারাদণ্ড।',
      'ফেক ফেসবুক অ্যাকাউন্ট তৈরি করে সম্মানহানি করলে অপরাধীর ৩ বছর পর্যন্ত কারাদণ্ড হতে পারে।',
      'হয়রানির শিকার হলে তথ্য-প্রমাণ ও স্ক্রিনশটসহ নিকটস্থ থানায় বা সিআইডির সাইবার সেলে (cyber@cid.gov.bd) অভিযোগ দায়ের করা যায়।'
    ],
    pointsEn: [
      'Publishing a woman\'s private images/videos online without consent is a serious offense punishable by up to 5 years in jail.',
      'Creating fake profiles to defame or harass carries a penalty of up to 3 years of imprisonment.',
      'Victims should keep screenshots and logs and report to the local police or CID Cyber Unit (cyber@cid.gov.bd).'
    ]
  }
];
