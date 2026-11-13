// MediaJack Systems: the little the site needs from JavaScript. Everything works without it.
(function () {
  // the menu on small screens
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a') && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = 'Menu'; toggle.focus(); }
    });
  }
  // headlights: a sign shines back at the pointer, and the closing sign lights up when it comes into view
  var still = !window.matchMedia || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!still) {
    if (matchMedia('(hover: hover)').matches) document.querySelectorAll('[data-shine]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      }, { passive: true });
      el.addEventListener('pointerleave', function () { el.style.removeProperty('--mx'); el.style.removeProperty('--my'); });
    });
    if ('IntersectionObserver' in window) document.querySelectorAll('[data-light]').forEach(function (el) {
      el.classList.add('is-dim');                                           // no measuring here: the observer reports where the sign is
      var io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { el.classList.remove('is-dim'); el.classList.add('is-lit'); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(el);
    });
  }
  // this year in the footer
  var y = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = y; });
  // "copy email address"
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var status = btn.closest('li') && btn.closest('li').querySelector('.status');
      var done = function (ok) { if (status) status.textContent = ok ? 'Copied: ' + text : 'Copy did not work here. The address is ' + text + '.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
      else done(false);
    });
  });
  // the message form: it shows only when the server says it can deliver; until then the email button stays
  var form = document.querySelector('[data-form]');
  var fallback = document.querySelector('[data-form-fallback]');
  var FAIL = 'That did not send. Call (970) 401-0185 or email jack@mediajacksystems.com instead.';
  if (form && window.fetch) {
    var note = form.querySelector('.form-status');
    var started = Date.now();
    fetch('/form/check-up').then(function (r) {
      if (r.status === 204) { form.hidden = false; if (fallback) fallback.hidden = true; }
    }).catch(function () {});
    var say = function (state, text) { note.setAttribute('data-state', state); note.textContent = text; };
    var check = function (input, ok, message) {
      var err = document.getElementById(input.id + '-error');
      input.setAttribute('aria-invalid', ok ? 'false' : 'true');
      if (err) { err.hidden = ok; err.textContent = ok ? '' : message; }
      return ok;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name, email = form.elements.email;
      var okName = check(name, name.value.trim().length > 1, 'Enter your name.');
      var okEmail = check(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), 'Enter an email address I can reply to, like name@example.com.');
      if (!okName || !okEmail) { (okName ? email : name).focus(); say('error', 'Nothing was sent yet. Fix the marked field and send again.'); return; }
      var data = { elapsed: Date.now() - started };
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) data[el.name] = el.value; });
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true; say('', 'Sending.');
      fetch('/form/check-up', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok && body.ok, body: body }; }); })
        .then(function (res) {
          btn.disabled = false;
          if (res.ok) { form.reset(); say('ok', 'Sent. I have it and I will reply by email. For anything urgent, call (970) 401-0185.'); }
          else say('error', (res.body && res.body.error) || FAIL);
        })
        .catch(function () { btn.disabled = false; say('error', FAIL); });
    });
  }
  // the eight-question self-check: runs here, in the browser; nothing is sent unless the visitor adds it to a message
  var sc = document.querySelector('[data-selfcheck]');
  if (sc) {
    sc.classList.add('js');
    var boxes = Array.prototype.slice.call(sc.querySelectorAll('input[type=checkbox]'));
    var result = sc.querySelector('[data-result]');
    var answers = function () {
      return 'My self-check answers:\n' + boxes.map(function (b, i) { return (i + 1) + '. ' + (b.checked ? 'Yes' : 'No') + ': ' + b.closest('label').textContent.trim(); }).join('\n');
    };
    var update = function () {
      var yes = 0;
      boxes.forEach(function (b) { b.closest('li').classList.toggle('is-yes', b.checked); if (b.checked) yes++; });
      sc.classList.add('is-live');
      var no = boxes.length - yes;
      var p = document.createElement('p');
      p.textContent = yes + ' of ' + boxes.length + '. ' + (no === 0 ? 'Every box ticked. Ask for the check-up anyway and I will tell you if I see it the same way.'
        : no === 1 ? 'One thing to look at. It is under the box you left empty.'
        : no + ' things to look at. Each one is under a box you left empty, and the free check-up covers them all.');
      result.textContent = ''; result.appendChild(p);
      var mail = fallback && fallback.querySelector('a[href^="mailto:"]');
      if (mail) mail.href = mail.href.split('&body=')[0] + '&body=' + encodeURIComponent('My business and website: \n\n' + answers());
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    var send = sc.querySelector('[data-send-answers]');
    if (send) send.addEventListener('click', function () {
      var msg = document.getElementById('f-message');
      if (msg && msg.value.indexOf('My self-check answers:') === -1) msg.value = answers() + (msg.value ? '\n\n' + msg.value : '');
    });
  }
})();
