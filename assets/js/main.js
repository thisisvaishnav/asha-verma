/* Asha Verma — site behaviour. No dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  }

  function navIsOpen() {
    return !!toggle && toggle.getAttribute('aria-expanded') === 'true';
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!navIsOpen());
    });

    nav.addEventListener('click', function (event) {
      if (event.target && event.target.closest && event.target.closest('a')) {
        setNav(false);
      }
    });

    document.addEventListener('click', function (event) {
      if (!navIsOpen()) return;
      if (event.target && event.target.closest && event.target.closest('.site-header')) return;
      setNav(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && navIsOpen()) {
        setNav(false);
        toggle.focus();
      }
    });

    var wide = window.matchMedia('(min-width: 768px)');
    var onWide = function () { if (wide.matches) setNav(false); };
    if (wide.addEventListener) { wide.addEventListener('change', onWide); }
    else if (wide.addListener) { wide.addListener(onWide); }
  }

  /* ---------------------------------------- hide contact bar while typing */
  var formWrap = document.getElementById('consultation');
  var root = document.documentElement;

  if (formWrap) {
    formWrap.addEventListener('focusin', function () {
      root.classList.add('is-form-focused');
    });
    formWrap.addEventListener('focusout', function (event) {
      if (!formWrap.contains(event.relatedTarget)) {
        root.classList.remove('is-form-focused');
      }
    });
  }

  /* ------------------------------------------------------------- form */
  var form = document.getElementById('consultation-form');
  if (!form) return;

  form.noValidate = true;

  var result = document.getElementById('form-result');
  var summary = document.getElementById('form-summary');
  var waSend = document.getElementById('wa-send');
  var editBtn = document.getElementById('form-edit');
  var submitBtn = document.getElementById('form-submit');
  var submitLabel = submitBtn ? submitBtn.querySelector('.btn__label') : null;
  var formError = document.getElementById('e-form');

  var WHATSAPP_NUMBER = '918299012290';
  var FORM_ENDPOINT = 'https://formspree.io/f/xzedgywk';
  var SEND_TIMEOUT_MS = 15000;

  var nameInput = document.getElementById('f-name');
  var mobileInput = document.getElementById('f-mobile');
  var messageInput = document.getElementById('f-message');
  var consentInput = document.getElementById('f-consent');

  function radios(name) {
    return Array.prototype.slice.call(form.querySelectorAll('input[name="' + name + '"]'));
  }

  function checkedValue(name) {
    var group = radios(name);
    for (var i = 0; i < group.length; i++) {
      if (group[i].checked) return group[i].value;
    }
    return '';
  }

  function markError(controls, errorId, message) {
    var errorEl = document.getElementById(errorId);
    var list = Array.isArray(controls) ? controls : [controls];
    list.forEach(function (control) {
      var wrap = control.closest('.field');
      if (message) {
        control.setAttribute('aria-invalid', 'true');
        if (wrap) wrap.classList.add('has-error');
      } else {
        control.removeAttribute('aria-invalid');
        if (wrap) wrap.classList.remove('has-error');
      }
    });
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.hidden = !message;
    }
    return !message;
  }

  function validateName() {
    var value = nameInput.value.trim();
    return markError(
      nameInput,
      'e-name',
      value.length >= 2 ? '' : 'Enter your name. Use at least 2 characters.'
    );
  }

  function validateMobile() {
    var value = mobileInput.value.trim();
    if (!value) {
      return markError(mobileInput, 'e-mobile', 'Enter your mobile number.');
    }
    var digits = value.replace(/[^0-9]/g, '');
    var hasLetter = /[A-Za-z]/.test(value);
    var ok = !hasLetter && digits.length >= 10 && digits.length <= 15;
    return markError(
      mobileInput,
      'e-mobile',
      ok ? '' : 'Enter a valid mobile number. Use 10 to 15 digits.'
    );
  }

  function validateGroup(name, errorId, message) {
    var group = radios(name);
    return markError(group, errorId, checkedValue(name) ? '' : message);
  }

  function validateConsent() {
    return markError(
      consentInput,
      'e-consent',
      consentInput.checked ? '' : 'Tick the box so Asha can contact you.'
    );
  }

  nameInput.addEventListener('input', function () {
    if (nameInput.getAttribute('aria-invalid')) validateName();
  });

  mobileInput.addEventListener('input', function () {
    if (mobileInput.getAttribute('aria-invalid')) validateMobile();
  });

  ['contact_method', 'requirement'].forEach(function (name) {
    radios(name).forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (radio.getAttribute('aria-invalid')) {
          if (name === 'contact_method') {
            validateGroup(name, 'e-contact', 'Choose how Asha should contact you.');
          } else {
            validateGroup(name, 'e-req', 'Choose Health, Life, or Both.');
          }
        }
      });
    });
  });

  consentInput.addEventListener('change', function () {
    if (consentInput.getAttribute('aria-invalid')) validateConsent();
  });

  function addRow(list, term, description) {
    var row = document.createElement('div');
    var dt = document.createElement('dt');
    var dd = document.createElement('dd');
    dt.textContent = term;
    dd.textContent = description;
    row.appendChild(dt);
    row.appendChild(dd);
    list.appendChild(row);
  }

  function setSending(sending) {
    if (!submitBtn) return;
    submitBtn.disabled = sending;
    submitBtn.setAttribute('aria-busy', String(sending));
    if (submitLabel) submitLabel.textContent = sending ? 'Sending…' : 'Send my enquiry';
  }

  function clearFormError() {
    if (!formError) return;
    formError.textContent = '';
    formError.hidden = true;
  }

  function showFormError(withWhatsAppLink) {
    if (!formError) return;
    formError.textContent = 'The email could not be sent. Check your internet connection and try again.';
    if (withWhatsAppLink) {
      formError.appendChild(document.createTextNode(' You can also '));
      var link = document.createElement('a');
      link.href = waSend.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'send the same message on WhatsApp';
      formError.appendChild(link);
      formError.appendChild(document.createTextNode('.'));
    }
    formError.hidden = false;
  }

  function sendByEmail(payload) {
    var controller = typeof AbortController === 'function' ? new AbortController() : null;
    var timer = null;
    if (controller) timer = setTimeout(function () { controller.abort(); }, SEND_TIMEOUT_MS);

    return fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    }).then(function (response) {
      if (timer) clearTimeout(timer);
      if (response.ok) return true;
      return response
        .json()
        .catch(function () { return {}; })
        .then(function (data) {
          var reason = (data && data.error) ||
            (data && data.errors && data.errors[0] && data.errors[0].message) ||
            'send failed';
          throw new Error(reason);
        });
    }).catch(function (error) {
      if (timer) clearTimeout(timer);
      throw error;
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearFormError();

    var valid = [
      validateName(),
      validateMobile(),
      validateGroup('contact_method', 'e-contact', 'Choose how Asha should contact you.'),
      validateGroup('requirement', 'e-req', 'Choose Health, Life, or Both.'),
      validateConsent()
    ];

    if (valid.indexOf(false) !== -1) {
      var firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var name = nameInput.value.trim();
    var mobile = mobileInput.value.trim();
    var method = checkedValue('contact_method');
    var requirement = checkedValue('requirement');
    var message = messageInput.value.trim();

    var lines = [
      'Hello Asha, I filled in the consultation form on your website.',
      'Name: ' + name,
      'Mobile number: ' + mobile,
      'Preferred contact method: ' + method,
      'Insurance requirement: ' + requirement
    ];
    if (message) lines.push('Message: ' + message);

    waSend.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

    if (typeof fetch !== 'function') {
      form.submit();
      return;
    }

    setSending(true);

    var payload = {
      name: name,
      mobile: mobile,
      contact_method: method,
      requirement: requirement,
      message: message,
      _subject: 'New website enquiry from ' + name
    };

    sendByEmail(payload)
      .then(function () {
        setSending(false);
        summary.textContent = '';
        addRow(summary, 'Name', name);
        addRow(summary, 'Mobile number', mobile);
        addRow(summary, 'Contact by', method);
        addRow(summary, 'Requirement', requirement);
        if (message) addRow(summary, 'Message', message);

        form.hidden = true;
        result.hidden = false;
        result.focus();
        result.scrollIntoView({ block: 'nearest' });
      })
      .catch(function () {
        setSending(false);
        showFormError(true);
        formError.focus();
      });
  });

  editBtn.addEventListener('click', function () {
    result.hidden = true;
    form.hidden = false;
    clearFormError();
    nameInput.focus();
    form.scrollIntoView({ block: 'nearest' });
  });
})();
