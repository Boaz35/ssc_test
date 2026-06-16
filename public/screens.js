/* screens.js — data model for every frame + the prototype navigation graph.
   IDs match the Figma node IDs so the graph maps 1:1 to the original prototype.
   Reactions extracted from Figma:
     1:2597 intro      --click btn--> 1:2744
     1:2675 login      --click create--> 1:2597
     1:2744 q age      --click opt--> 1:2796 (selected state)
     1:2796 q age sel  --click next--> 1:2843
     1:2843 q ...      --click opt--> 1:2894
     1:2894 q sel      --click next--> 1:2945
     1:2945 q          --click opt--> 1:2998
     1:2998 q sel      --click next--> 1:3051 (moms)
     1:3051 moms       --click next--> 1:3211
     1:3211 q goal     --click opt--> 1:3263
     1:3263 q sel      --click next--> 1:3315
     1:3315 q          --click opt--> 1:3366
     1:3366 q sel      --click next--> 1:3531 (glad)
     1:3531 glad       --click next--> 1:3588
     1:3588 q          --click opt--> 1:3641
     1:3641 q sel      --click next--> 1:3694 (consultant hero)
     1:3694 hero       --click next--> 1:3755 (quote — end)
*/

const A = 'assets/';

// Shared question option sets (text pulled from Figma)
const AGE_OPTS = ['0-3 months', '4-6 months', '7-12 months', '13-28 months'];
const GOAL_OPTS = ['Less overnight wakeups', 'Easier bedtime', 'Consistent sleep schedule', 'Better naps'];

window.SCREENS = {
  '1:2675': {
    type: 'login', kind: 'gradient',
    title: 'Welcome to Smart Sleep Coach',
    subtitle: 'Login with your email to access your personalized plan',
    next: '1:2597'
  },
  '1:2597': {
    type: 'intro', kind: 'gradient',
    title: 'We know every baby\nis different',
    subtitle: 'That\u2019s why we want to spend the next few minutes getting to know you and your baby - ensuring your experience is perfectly tailored to your family needs.',
    cta: 'Let\u2019s get started',
    next: '1:2744'
  },
  // ---- Question 1: baby age (step 1 of 4) ----
  '1:2744': { type: 'question', kind: 'dark', step: 1, progress: 0.12,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, next: '1:2796' },
  '1:2796': { type: 'question', kind: 'dark', step: 1, progress: 0.12,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, selectedIndex: 0, ctaEnabled: true, next: '1:2843' },
  // ---- Question 2 ----
  '1:2843': { type: 'question', kind: 'dark', step: 1, progress: 0.25,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, next: '1:2894' },
  '1:2894': { type: 'question', kind: 'dark', step: 1, progress: 0.25,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, selectedIndex: 1, ctaEnabled: true, next: '1:2945' },
  // ---- Question 3 ----
  '1:2945': { type: 'question', kind: 'dark', step: 1, progress: 0.37,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, next: '1:2998' },
  '1:2998': { type: 'question', kind: 'dark', step: 1, progress: 0.37,
    q: 'What is your baby\u2019s age?', options: AGE_OPTS, selectedIndex: 2, ctaEnabled: true, next: '1:3051' },
  // ---- Interstitial: social proof ----
  '1:3051': { type: 'moms', kind: 'gradient', progress: 0.5,
    title: '600,000+ first-time moms like you',
    subtitle: 'have chosen Smart Sleep Coach to help their baby sleep better',
    photo: A + 'photo_moms.png',
    next: '1:3211' },
  // ---- Question 4: goal (step 2) ----
  '1:3211': { type: 'question', kind: 'dark', step: 2, progress: 0.6,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, next: '1:3263' },
  '1:3263': { type: 'question', kind: 'dark', step: 2, progress: 0.6,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, selectedIndex: 0, ctaEnabled: true, next: '1:3315' },
  // ---- Question 5 ----
  '1:3315': { type: 'question', kind: 'dark', step: 2, progress: 0.72,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, next: '1:3366' },
  '1:3366': { type: 'question', kind: 'dark', step: 2, progress: 0.72,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, selectedIndex: 2, ctaEnabled: true, next: '1:3531' },
  // ---- Interstitial: we're glad ----
  '1:3531': { type: 'glad', kind: 'gradient', progress: 0.85,
    title: 'We\u2019re glad you\u2019re here!',
    subtitle: 'The first weeks with a newborn can be truly magical, but when sleep isn\u2019t going as planned it can be challenging too.',
    footnote: 'We\u2019ll help you navigate and improve your baby\u2019s sleep.',
    hero: A + 'hero_glad.png',
    next: '1:3588' },
  // ---- Question 6 ----
  '1:3588': { type: 'question', kind: 'dark', step: 3, progress: 0.9,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, next: '1:3641' },
  '1:3641': { type: 'question', kind: 'dark', step: 3, progress: 0.9,
    q: 'What is your main goal for your baby\u2019s sleep?', options: GOAL_OPTS, selectedIndex: 1, ctaEnabled: true, next: '1:3694' },
  // ---- Consultant hero ----
  '1:3694': { type: 'consultant', kind: 'gradient', progress: 1,
    title: 'Meet Pampers Chief\nBaby Sleep Consultant',
    subtitle: 'Consulted with thousands of families',
    avatar: A + 'mandy.png',
    name: 'Mandy Treeby',
    role: 'Certified Sleep Consultant and Mom of Two',
    next: '1:3755' },
  // ---- Final quote (end of flow) ----
  '1:3755': { type: 'consultant', kind: 'gradient', progress: 1,
    title: 'Meet Pampers Chief\nBaby Sleep Consultant',
    subtitle: 'Consulted with thousands of families',
    avatar: A + 'mandy.png',
    name: 'Mandy Treeby',
    role: 'Certified Sleep Consultant and Mom of Two',
    end: true }
};

window.START_SCREEN = '1:2597'; // intro (login is reachable but flow starts at intro)
