/* ── i18n — English / Thai translations ── */

const translations = {
  th: {
    // Nav
    navSignIn: 'เข้าสู่ระบบ',

    // Hero
    heroBadge: 'ฟรีสำหรับทุกคน',
    heroTitle1: 'เลิกถามว่า',
    heroTitle2: '"ทุกคนเสร็จหรือยัง?"',
    heroSubtitle: 'Workshop Tracker แสดงความคืบหน้าของผู้เข้าร่วมทุกคนแบบเรียลไทม์ — คุณจะรู้ทันทีว่าใครตามทัน ใครติดอยู่ และใครเสร็จแล้ว โดยไม่ต้องหยุดสอน',
    heroCtaPrimary: 'เข้าสู่ระบบเพื่อเริ่มต้น',
    heroCtaSecondary: 'ดูวิธีการทำงาน',

    // Mock dashboard
    mockParticipant: 'ผู้เข้าร่วม',
    mockStep: 'ขั้นตอน',

    // Target Profile
    targetTitle: 'สร้างมาสำหรับทุกคนที่จัดเวิร์กชอปแบบลงมือทำ',
    targetDesc: 'ไม่ว่าคุณจะสอน AWS lab, Design Sprint, อบรม Compliance หรือ Onboarding พนักงานใหม่ — ถ้าผู้เข้าร่วมต้องทำตามขั้นตอน และคุณต้องรู้ว่าใครตามทัน เครื่องมือนี้สร้างมาเพื่อคุณ',

    // Pain
    painTitle: 'เคยเป็นแบบนี้ไหม?',
    painItems: [
      'หยุดสอนทุกขั้นตอนเพื่อถามว่า "ทุกคนเสร็จหรือยัง?" — แล้วไม่มีใครตอบ',
      'เดินไปดูหน้าจอทีละคน ขณะที่คนที่เสร็จแล้วนั่งรอ',
      'สอนจบแล้วไม่รู้เลยว่าขั้นตอนไหนเป็นจุดที่คนติด',
      'เสียเวลาไปกับการติดตามความคืบหน้า มากกว่าการสอนจริงๆ',
    ],

    // How it works
    howTitle: 'วิธีการทำงาน',
    howSubtitle: '3 ขั้นตอนสู่การติดตามเวิร์กชอปแบบเรียลไทม์',
    howStep1Title: '1. สร้างเซสชัน',
    howStep1Desc: 'กำหนดขั้นตอนเวิร์กชอปตามลำดับ ตั้งชื่อเซสชันและตั้งค่าแต่ละ milestone ที่ผู้เข้าร่วมต้องทำให้เสร็จ',
    howStep2Title: '2. แชร์ลิงก์',
    howStep2Desc: 'ลิงก์เดียวทำได้ทุกอย่าง ผู้เข้าร่วมเปิดลิงก์ ใส่ชื่อ แล้วเริ่มทำได้เลย ไม่ต้องสมัครสมาชิก',
    howStep3Title: '3. ดูความคืบหน้าแบบ Live',
    howStep3Desc: 'แดชบอร์ดอัปเดตแบบเรียลไทม์ เห็นว่าใครนำหน้า ใครติดอยู่ และทุกคนเสร็จเมื่อไหร่ — ดูได้ในหน้าเดียว',

    // Uniqueness
    uniqueTitle: 'เรียลไทม์ซิงก์ที่มีโครงสร้าง',
    uniqueDesc: 'ลิงก์เดียว. ความคืบหน้าทุกคน. อัปเดตแบบ Live.',

    // Features
    featuresTitle: 'ฟีเจอร์ที่สำคัญ',
    featuresSubtitle: 'ทุกอย่างที่คุณต้องการ ไม่มีอะไรเกินจำเป็น',
    feature1Title: 'ขั้นตอนตามลำดับ',
    feature1Desc: 'ขั้นตอนปลดล็อกตามลำดับ ผู้เข้าร่วมข้ามขั้นตอนไม่ได้ — ทุกคนเรียนรู้ไปพร้อมกัน',
    feature2Title: 'บันทึกเวลาทุกขั้นตอน',
    feature2Desc: 'ทุกการเสร็จสิ้นมีการบันทึกเวลา วิเคราะห์จังหวะการสอน หาจุดคอขวด และปรับปรุงเซสชันถัดไป',
    feature3Title: 'เข้าร่วมง่าย ไม่ต้องสมัคร',
    feature3Desc: 'ผู้เข้าร่วมแค่ใส่ชื่อ — ไม่ต้องสร้างบัญชี ไม่ต้องใส่รหัสผ่าน ไม่ต้องดาวน์โหลด เริ่มได้ทันที',
    feature4Title: 'ลิงก์เดียว สองมุมมอง',
    feature4Desc: 'URL เดียวแสดงแดชบอร์ดผู้สอนและมุมมองผู้เข้าร่วม สิทธิ์กำหนดว่าคุณเห็นอะไร',

    // Objections / FAQ
    faqTitle: 'คำถามที่พบบ่อย',
    faq1Q: 'จัดเวิร์กชอปไม่บ่อย คุ้มไหมที่จะใช้?',
    faq1A: 'ไม่ต้องเรียนรู้อะไรเลย สร้างเซสชันได้ภายใน 1 นาทีทุกครั้ง',
    faq2Q: 'เรื่องความเป็นส่วนตัวของผู้เข้าร่วมล่ะ?',
    faq2A: 'ผู้เข้าร่วมใส่แค่ชื่อที่แสดง ไม่ต้องสร้างบัญชี ไม่เก็บข้อมูลส่วนบุคคล',

    // Risk reversal + CTA
    ctaTitle: 'พร้อมจัดเวิร์กชอปครั้งต่อไปหรือยัง?',
    ctaBadge1: 'ฟรีตลอด',
    ctaBadge2: 'ตั้งค่าใน 1 นาที',
    ctaBadge3: 'ผู้เข้าร่วมไม่ต้องล็อกอิน',
    ctaButton: 'เข้าสู่ระบบเพื่อเริ่มต้น',

    // Footer
    footer: 'Workshop Tracker — สร้างมาสำหรับผู้สอนที่ใส่ใจความก้าวหน้า',

    // Language toggle
    langLabel: 'EN',
  },

  en: {
    // Nav
    navSignIn: 'Sign In',

    // Hero
    heroBadge: 'Free for all workshop leaders',
    heroTitle1: 'Stop Asking',
    heroTitle2: '"Is Everyone Done?"',
    heroSubtitle: 'Workshop Tracker shows every participant\'s progress in real-time — so you know who\'s on track, who\'s stuck, and who\'s finished, without interrupting your session.',
    heroCtaPrimary: 'Sign In to Get Started',
    heroCtaSecondary: 'See How It Works',

    // Mock dashboard
    mockParticipant: 'Participant',
    mockStep: 'Step',

    // Target Profile
    targetTitle: 'Built for anyone who runs hands-on sessions',
    targetDesc: 'Whether you\'re leading an AWS lab, a design sprint, a compliance training, or an internal onboarding — if your participants need to complete steps and you need to know who\'s keeping up, this is for you.',

    // Pain
    painTitle: 'Sound familiar?',
    painItems: [
      'You pause after every step to ask "has everyone finished?" — and nobody answers',
      'You walk around checking screens one by one while the fast participants wait',
      'The session ends and you have no idea which steps were the bottleneck',
      'You spend more time tracking progress than actually teaching',
    ],

    // How it works
    howTitle: 'How It Works',
    howSubtitle: 'Three steps to real-time workshop visibility',
    howStep1Title: '1. Create Your Session',
    howStep1Desc: 'Define your workshop steps in order. Name your session and set up each milestone your participants need to complete.',
    howStep2Title: '2. Share the Link',
    howStep2Desc: 'One URL does it all. Participants open it, enter their name, and start completing steps. No sign-up friction.',
    howStep3Title: '3. Watch Progress Live',
    howStep3Desc: 'Your dashboard updates in real-time. See who\'s ahead, who\'s stuck, and when everyone finishes — all at a glance.',

    // Uniqueness
    uniqueTitle: 'Real-time sync with structure.',
    uniqueDesc: 'One link. Everyone\'s progress. Updated live.',

    // Features
    featuresTitle: 'Key Features',
    featuresSubtitle: 'Everything you need, nothing you don\'t',
    feature1Title: 'Sequential Steps',
    feature1Desc: 'Steps unlock in order. Participants can\'t skip ahead — keeping everyone on track with your curriculum.',
    feature2Title: 'Timestamped Progress',
    feature2Desc: 'Every completion is timestamped. Analyze pacing, identify bottlenecks, and improve future sessions.',
    feature3Title: 'Zero Friction Join',
    feature3Desc: 'Participants just enter a name — no accounts, no passwords, no downloads. Gets them into the action instantly.',
    feature4Title: 'One Link, Two Views',
    feature4Desc: 'Same URL serves the creator dashboard and participant view. Authorization decides what you see.',

    // Objections / FAQ
    faqTitle: 'Frequently Asked Questions',
    faq1Q: 'I only run workshops a few times a year. Is it worth it?',
    faq1A: 'No learning curve. Create a session in under a minute, every time.',
    faq2Q: 'What about participant privacy?',
    faq2A: 'Participants only enter a display name. No accounts, no personal data collected.',

    // Risk reversal + CTA
    ctaTitle: 'Ready to run your next workshop?',
    ctaBadge1: 'Totally free',
    ctaBadge2: 'Setup in 1 minute',
    ctaBadge3: 'No login for participants',
    ctaButton: 'Sign In to Get Started',

    // Footer
    footer: 'Workshop Tracker — Built for instructors who care about progress.',

    // Language toggle
    langLabel: 'TH',
  },
};

function getLang() {
  return localStorage.getItem('wt-lang') || 'th';
}

function setLang(lang) {
  localStorage.setItem('wt-lang', lang);
  applyTranslations(lang);
}

function toggleLang() {
  const current = getLang();
  const next = current === 'th' ? 'en' : 'th';
  setLang(next);
}

function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) return;

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      el.textContent = t[key];
    }
  });

  // Update all elements with data-i18n-html attribute (for innerHTML)
  document.querySelectorAll('[data-i18n-html]').forEach((el) => {
    const key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) {
      el.innerHTML = t[key];
    }
  });

  // Handle pain items list
  const painList = document.querySelector('[data-i18n-list="painItems"]');
  if (painList && t.painItems) {
    painList.innerHTML = t.painItems
      .map((item) => `<li>${item}</li>`)
      .join('');
  }

  // Update language toggle button text
  const langBtn = document.querySelector('.lang-toggle');
  if (langBtn) {
    langBtn.textContent = t.langLabel;
  }

  // Update html lang attribute
  document.documentElement.lang = lang;
}
