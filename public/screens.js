/* screens.js — data model + navigation graph.
   NOTE: The source Figma prototype represented each question as TWO frames
   (unselected state + selected state) chained as separate navigation steps,
   which made the flow appear "stuck" on the same question. Here those state
   pairs are collapsed into ONE interactive screen each: tapping an option
   selects it in place (SMART_ANIMATE feedback) and Next advances to the next
   distinct screen. Original Figma node IDs retained on each kept screen. */

var A = 'assets/';
var AGE_OPTS  = ['0-3 months', '4-6 months', '7-12 months', '13-28 months'];
var GOAL_OPTS = ['Less overnight wakeups', 'Easier bedtime', 'Consistent sleep schedule', 'Better naps'];

window.SCREENS = {
  // Secondary entry point (reachable from the intro "Log in" link)
  '1:2675': {
    type: 'login', kind: 'gradient',
    title: 'Welcome to Smart Sleep Coach',
    subtitle: 'Login with your email to access your personalized plan',
    next: '1:2597'
  },

  // 0 — Intro
  '1:2597': {
    type: 'intro', kind: 'gradient',
    title: 'We know every baby\nis different',
    subtitle: 'That\u2019s why we want to spend the next few minutes getting to know you and your baby - ensuring your experience is perfectly tailored to your family needs.',
    cta: 'Let\u2019s get started',
    next: '1:2744'
  },

  // 1 — Question: baby age  (step 1 of 4)
  '1:2744': {
    type: 'question', kind: 'dark', progress: 0.25,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS,
    next: '1:3051'
  },

  // 2 — Interstitial: social proof  (step 2)
  '1:3051': {
    type: 'moms', kind: 'gradient', progress: 0.5,
    title: '600,000+ first-time moms like you',
    subtitle: 'have chosen Smart Sleep Coach to help their baby sleep better',
    photo: A + 'photo_moms.png',
    next: '1:3211'
  },

  // 3 — Question: main sleep goal  (step 2\u20133)
  '1:3211': {
    type: 'question', kind: 'dark', progress: 0.6,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS,
    next: '1:3531'
  },

  // 4 — Interstitial: we're glad  (step 3)
  '1:3531': {
    type: 'glad', kind: 'gradient', progress: 0.75,
    title: 'We\u2019re glad you\u2019re here!',
    subtitle: 'The first weeks with a newborn can be truly magical, but when sleep isn\u2019t going as planned it can be challenging too.',
    footnote: 'We\u2019ll help you navigate and improve your baby\u2019s sleep.',
    hero: A + 'hero_glad.png',
    next: '1:3588'
  },

  // 5 — Question: follow-up goal detail  (step 4)
  '1:3588': {
    type: 'question', kind: 'dark', progress: 0.9,
    q: 'Which sleep challenge matters most right now?', options: GOAL_OPTS,
    next: '1:3694'
  },

  // 6 — Consultant hero  (step 4)
  '1:3694': {
    type: 'consultant', kind: 'gradient', progress: 1,
    title: 'Meet Pampers Chief\nBaby Sleep Consultant',
    subtitle: 'Consulted with thousands of families',
    avatar: A + 'mandy.png',
    name: 'Mandy Treeby',
    role: 'Certified Sleep Consultant and Mom of Two',
    cta: 'Build my plan',
    end: true
  }
};

window.START_SCREEN = '1:2597';
