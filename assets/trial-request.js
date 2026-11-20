(function () {
  'use strict';
  var form = document.getElementById('contactForm');
  if (!form || !window.fetch || !window.AbortController) return;
  var button = form.querySelector('button[type="submit"]');
  var status = document.getElementById('trialRequestStatus');
  var help = document.getElementById('trialRequestHelp');
  var originalLabel = button.textContent;
  var pending = false;
  var activeFingerprint = null;
  var requestId = null;

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    pending = true;
    button.disabled = true;
    button.textContent = 'Sending your request…';
    form.setAttribute('aria-busy', 'true');
    help.hidden = true;
    status.hidden = false;
    status.className = 'trial-request-status';
    status.textContent = 'Sending your request. Please keep this page open.';

    var controller = new AbortController();
    var deadline = setTimeout(function () { controller.abort(); }, 12000);
    var slowNotice = setTimeout(function () {
      status.textContent = 'This is taking longer than usual. We are checking your request…';
    }, 4000);

    try {
      var payload = Object.fromEntries(new FormData(form).entries());
      delete payload._next;
      var fingerprint = JSON.stringify(payload);
      if (fingerprint !== activeFingerprint) {
        requestId = Array.from(crypto.getRandomValues(new Uint8Array(16)), function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
        activeFingerprint = fingerprint;
      }
      payload.request_id = requestId;
      var response = await fetch('https://issues-test.publicationflow.com/trial-request.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      var result = await response.json();
      if (!response.ok || !result || (result.success !== true && result.success !== 'true')) {
        var requestError = new Error('Request service did not confirm receipt');
        if (result && typeof result.message === 'string') requestError.publicMessage = result.message;
        throw requestError;
      }
      clearTimeout(deadline);
      clearTimeout(slowNotice);
      status.textContent = 'Request received. Opening your free trial access page…';
      window.location.assign('/contact/thanks/');
    } catch (error) {
      clearTimeout(deadline);
      clearTimeout(slowNotice);
      pending = false;
      button.disabled = false;
      button.textContent = originalLabel;
      form.removeAttribute('aria-busy');
      status.className = 'trial-request-status trial-request-error';
      status.textContent = error.name === 'AbortError'
        ? 'The request service is taking too long. We could not confirm receipt. Your entries are still here; please try again or email us below.'
        : (error.publicMessage || 'We could not confirm your request. Your entries are still here. Please try again or email us below.');
      help.hidden = false;
      status.focus();
    }
  });
})();
