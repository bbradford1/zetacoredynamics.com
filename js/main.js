(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initMobileNav();
    initContactForm();
    initHeaderShadowOnScroll();
  });

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('primary-nav');
    if (!toggle || !links) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      links.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      setOpen(open);
    });

    links.addEventListener('click', function (e) {
      var target = e.target;
      if (target && target.tagName === 'A') setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    var mq = window.matchMedia('(min-width: 769px)');
    var handleMq = function (event) { if (event.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', handleMq);
    else if (mq.addListener) mq.addListener(handleMq);
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = form.querySelector('.form-status');
    var submitBtn = form.querySelector('.form-submit');

    function setStatus(msg, kind) {
      if (!status) return;
      status.textContent = msg;
      status.classList.remove('success', 'error');
      if (kind === 'success') status.classList.add('success');
      else if (kind === 'error') status.classList.add('error');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot tripwire — if a bot filled it, silently succeed
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) { form.reset(); return; }

      var endpoint = form.getAttribute('action');
      if (!endpoint || endpoint.indexOf('REPLACE_WITH_FORMSPREE_ID') !== -1) {
        setStatus('Form endpoint not configured yet. Please email info@zetacoredynamics.com directly.', 'error');
        return;
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      setStatus('');

      fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (resp) {
        if (resp.ok) {
          form.reset();
          setStatus('Thanks! Your message was received. We will be in touch at the email you provided.', 'success');
          if (status && status.scrollIntoView) status.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          resp.json().then(function (data) {
            var msg = (data && data.errors && data.errors[0] && data.errors[0].message)
              ? data.errors[0].message
              : 'Something went wrong. Please email info@zetacoredynamics.com directly.';
            setStatus(msg, 'error');
          }).catch(function () {
            setStatus('Something went wrong. Please email info@zetacoredynamics.com directly.', 'error');
          });
        }
      }).catch(function () {
        setStatus('Network error. Please email info@zetacoredynamics.com directly.', 'error');
      }).then(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
      });
    });
  }

  function initHeaderShadowOnScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var ticking = false;
    function update() {
      ticking = false;
      if (window.scrollY > 8) nav.style.boxShadow = '0 1px 12px rgba(11,31,58,0.06)';
      else nav.style.boxShadow = 'none';
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }
})();
