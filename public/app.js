/* app.js — renders screens from window.SCREENS and drives navigation
   following the extracted Figma prototype graph. ES5-friendly, no build step. */
(function () {
  'use strict';

  var stage = document.getElementById('stage');
  var history = [];

  // ---------- small DOM helpers ----------
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function svgBack() {
    return '<svg viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M6 1L1 6.5L6 12" stroke="rgb(248,247,244)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function statusBar() {
    var sb = el('div', 'statusbar');
    sb.appendChild(el('div', 'time', '9:41'));
    var icons = el('div', 'icons');
    icons.innerHTML =
      '<svg width="17" height="11" viewBox="0 0 17 11"><g fill="#fff">' +
      '<rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/>' +
      '<rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></g></svg>' +
      '<svg width="15" height="11" viewBox="0 0 15 11" fill="#fff"><path d="M7.5 2.2c2 0 3.9.8 5.3 2.1l1-1.1C12.1 1.4 9.9.5 7.5.5S2.9 1.4 1.2 3.2l1 1.1C3.6 3 5.5 2.2 7.5 2.2z"/><path d="M7.5 5.4c1.1 0 2.1.4 2.9 1.2l1-1.1c-1-1-2.4-1.6-3.9-1.6S4.6 4.5 3.6 5.5l1 1.1c.8-.8 1.8-1.2 2.9-1.2z"/><path d="M7.5 8.5l1.4-1.5c-.4-.4-.9-.6-1.4-.6s-1 .2-1.4.6L7.5 8.5z"/></svg>' +
      '<svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="2.7" fill="none" stroke="#fff" stroke-opacity=".35"/><rect x="2" y="2" width="18" height="8" rx="1.3" fill="#fff"/><rect x="23" y="4" width="1" height="4" rx=".5" fill="#fff" fill-opacity=".4"/></svg>';
    sb.appendChild(icons);
    return sb;
  }
  function homeIndicator() { return el('div', 'home-indicator'); }
  function lights() {
    var f = document.createDocumentFragment();
    f.appendChild(el('div', 'lights1'));
    f.appendChild(el('div', 'lights2'));
    return f;
  }
  function header(showBack) {
    var h = el('div', 'header');
    var back = el('button', 'back');
    back.innerHTML = svgBack();
    back.style.visibility = showBack ? 'visible' : 'hidden';
    back.onclick = goBack;
    h.appendChild(back);
    var brand = el('div', 'brand');
    brand.appendChild(el('div', 'brand-mark'));
    brand.appendChild(el('div', 'brand-name', 'Smart Sleep Coach'));
    h.appendChild(brand);
    return h;
  }
  function stepper(progress) {
    var s = el('div', 'stepper');
    // 4 segments; fill proportionally across them
    var total = 4, filled = (progress || 0) * total;
    for (var i = 0; i < total; i++) {
      var seg = el('div', 'seg');
      var amt = Math.max(0, Math.min(1, filled - i));
      var bar = el('i'); bar.style.width = (amt * 100) + '%';
      seg.appendChild(bar);
      s.appendChild(seg);
    }
    return s;
  }
  function nl2br(t) { return (t || '').replace(/\n/g, '<br>'); }

  // ---------- screen builders ----------
  function build(id) {
    var d = window.SCREENS[id];
    var s = el('div', 'screen ' + (d.kind || 'gradient'));
    s.dataset.id = id;
    if (d.kind === 'gradient') s.appendChild(lights());
    s.appendChild(statusBar());

    if (d.type === 'intro') buildIntro(s, d);
    else if (d.type === 'login') buildLogin(s, d);
    else if (d.type === 'question') buildQuestion(s, d, id);
    else if (d.type === 'moms') buildMoms(s, d);
    else if (d.type === 'glad') buildGlad(s, d);
    else if (d.type === 'consultant') buildConsultant(s, d);

    s.appendChild(homeIndicator());
    return s;
  }

  function primaryCta(label, onClick, ghost, enabled) {
    var wrap = el('div', 'cta-wrap');
    var b = el('button', 'btn ' + (ghost ? 'btn-ghost' + (enabled ? ' enabled' : '') : 'btn-primary'), label);
    b.onclick = onClick;
    wrap.appendChild(b);
    return wrap;
  }

  function buildIntro(s, d) {
    s.appendChild(header(false));
    var cf = el('div', 'center-frame');
    var copy = el('div', 'copy');
    copy.appendChild(el('h1', 'display', nl2br(d.title)));
    copy.appendChild(el('p', 'subtitle', d.subtitle));
    cf.appendChild(copy);
    s.appendChild(cf);
    s.appendChild(primaryCta(d.cta, function () { go(d.next); }));
    // secondary entry point to the Login screen (matches Figma's two-entry structure)
    var li = el('div', 'link', 'Already have an account? <u>Log in</u>');
    li.style.cssText = 'position:absolute;bottom:30px;left:0;width:100%;text-align:center;color:rgba(255,255,255,.85);font-size:14px;z-index:6;cursor:pointer;';
    li.onclick = function () { go('1:2675'); };
    s.appendChild(li);
  }

  function buildLogin(s, d) {
    s.appendChild(header(true));
    var f = el('div', 'login-form');
    var head = el('div', 'copy');
    head.style.alignItems = 'center'; head.style.display = 'flex'; head.style.flexDirection = 'column'; head.style.gap = '16px';
    head.appendChild(el('h1', 'display', d.title));
    head.appendChild(el('p', 'subtitle', d.subtitle));
    f.appendChild(head);
    var fld1 = el('div', 'field'); fld1.appendChild(elInput('Email')); f.appendChild(fld1);
    var fld2 = el('div', 'field'); fld2.appendChild(elInput('Password', 'password')); f.appendChild(fld2);
    f.appendChild(el('div', 'link', 'Forgot password?'));
    var login = el('button', 'btn btn-primary', 'Log in'); login.style.alignSelf = 'center';
    login.onclick = function () { go(d.next); };
    f.appendChild(login);
    f.appendChild(el('div', 'link', 'Need help with login?'));
    f.appendChild(el('div', 'divider', 'or'));
    var create = el('button', 'btn btn-ghost enabled', 'Create account'); create.style.alignSelf = 'center';
    create.onclick = function () { go(d.next); };
    f.appendChild(create);
    s.appendChild(f);
  }
  function elInput(ph, type) { var i = document.createElement('input'); i.placeholder = ph; if (type) i.type = type; return i; }

  function buildQuestion(s, d, id) {
    s.appendChild(header(true));
    s.appendChild(stepper(d.progress));
    var qb = el('div', 'q-block');
    qb.appendChild(el('h2', 'display sm q-title', d.q));
    var opts = el('div', 'options');
    var ctaBtn;
    d.options.forEach(function (label, i) {
      var o = el('button', 'option' + (d.selectedIndex === i ? ' selected' : ''), label);
      o.onclick = function () {
        // SMART_ANIMATE selection feedback: select this, enable Next
        var all = opts.querySelectorAll('.option');
        for (var k = 0; k < all.length; k++) all[k].classList.remove('selected');
        o.classList.add('selected');
        if (ctaBtn) { ctaBtn.classList.add('enabled'); ctaBtn.dataset.enabled = '1'; }
      };
      opts.appendChild(o);
    });
    qb.appendChild(opts);
    s.appendChild(qb);

    // Next button (ghost until a selection is made)
    var wrap = el('div', 'cta-wrap');
    ctaBtn = el('button', 'btn btn-ghost' + (d.ctaEnabled ? ' enabled' : ''), 'Next');
    ctaBtn.dataset.enabled = d.ctaEnabled ? '1' : '';
    ctaBtn.onclick = function () { if (ctaBtn.dataset.enabled) go(d.next); };
    wrap.appendChild(ctaBtn);
    s.appendChild(wrap);
  }

  function buildMoms(s, d) {
    s.appendChild(header(true));
    s.appendChild(stepper(d.progress));
    var cf = el('div', 'center-frame');
    var copy = el('div', 'copy');
    copy.appendChild(el('h1', 'display', d.title));
    copy.appendChild(el('p', 'subtitle', d.subtitle));
    cf.appendChild(copy);
    var card = el('div', 'media-card');
    var img = document.createElement('img'); img.src = d.photo; img.alt = '';
    card.appendChild(img);
    var endorse = el('div', 'endorse');
    endorse.appendChild(el('div', 'label', 'ENDORSED BY'));
    var logos = el('div', 'logos');
    var l1 = document.createElement('img'); l1.src = 'assets/pampers_logo.svg'; l1.alt = 'Pampers';
    logos.appendChild(l1);
    endorse.appendChild(logos);
    card.appendChild(endorse);
    cf.appendChild(card);
    s.appendChild(cf);
    s.appendChild(primaryCta('Next', function () { go(d.next); }));
  }

  function buildGlad(s, d) {
    s.appendChild(header(true));
    s.appendChild(stepper(d.progress));
    var cf = el('div', 'center-frame');
    var copy = el('div', 'copy');
    copy.appendChild(el('h1', 'display', d.title));
    copy.appendChild(el('p', 'subtitle', d.subtitle));
    cf.appendChild(copy);
    var card = el('div', 'media-card');
    var img = document.createElement('img'); img.src = d.hero; img.alt = '';
    card.appendChild(img);
    cf.appendChild(card);
    cf.appendChild(el('p', 'subtitle', d.footnote));
    s.appendChild(cf);
    s.appendChild(primaryCta('Next', function () { go(d.next); }));
  }

  function buildConsultant(s, d) {
    s.appendChild(header(true));
    s.appendChild(stepper(d.progress));
    var cf = el('div', 'center-frame');
    var copy = el('div', 'copy');
    copy.appendChild(el('h1', 'display', nl2br(d.title)));
    var sub = el('p', 'subtitle', d.subtitle); sub.style.color = 'rgba(255,255,255,.72)';
    copy.appendChild(sub);
    cf.appendChild(copy);
    var card = el('div', 'consultant-card');
    var av = document.createElement('img'); av.className = 'avatar'; av.src = d.avatar; av.alt = d.name;
    card.appendChild(av);
    card.appendChild(el('div', 'c-name', d.name));
    card.appendChild(el('div', 'c-role', d.role));
    cf.appendChild(card);
    s.appendChild(cf);
    if (!d.end) s.appendChild(primaryCta('Next', function () { go(d.next); }));
    else {
      var w = el('div', 'cta-wrap');
      var b = el('button', 'btn btn-primary', d.cta || 'Done');
      b.onclick = function () {
        // End of flow — show a brief confirmation, then offer restart.
        b.textContent = 'All set \u2713';
        b.disabled = true;
        setTimeout(function () {
          b.disabled = false;
          b.textContent = 'Start over';
          b.onclick = function () { history = []; go(window.START_SCREEN, true); };
        }, 1200);
      };
      w.appendChild(b); s.appendChild(w);
    }
  }

  // ---------- router ----------
  var current = null;
  function go(id, replace) {
    var next = build(id);
    if (window.SCREENS[id].kind === 'gradient' && current && !replace) next.classList.add('push-enter');
    stage.appendChild(next);
    // activate on next frame for the fade
    requestAnimationFrame(function () { next.classList.add('active'); });
    var prev = current;
    if (prev) {
      prev.classList.remove('active');
      setTimeout(function () { if (prev.parentNode) prev.parentNode.removeChild(prev); }, 350);
    }
    if (!replace && current) history.push(current.dataset.id);
    current = next;
  }
  function goBack() {
    if (!history.length) return;
    var id = history.pop();
    var prev = build(id);
    stage.appendChild(prev);
    requestAnimationFrame(function () { prev.classList.add('active'); });
    var old = current;
    old.classList.remove('active');
    setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 350);
    current = prev;
  }

  // start
  go(window.START_SCREEN, true);
})();
