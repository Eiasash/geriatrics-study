/**
 * Lightweight toast notification to replace alert() calls.
 * Usage: showToast('message') or showToast('message', 'error')
 */
(function () {
  var container = null;

  function getContainer() {
    if (container) return container;
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText =
      'position:fixed;top:1rem;left:50%;transform:translateX(-50%);z-index:99999;display:flex;flex-direction:column;align-items:center;gap:0.5rem;pointer-events:none;';
    document.body.appendChild(container);
    return container;
  }

  function showToast(msg, type) {
    var el = document.createElement('div');
    var bg = type === 'error' ? '#dc2626' : type === 'warning' ? '#d97706' : '#059669';
    el.textContent = msg;
    el.style.cssText =
      'background:' + bg + ';color:#fff;padding:0.75rem 1.5rem;border-radius:0.5rem;' +
      'font-size:0.95rem;box-shadow:0 4px 12px rgba(0,0,0,0.2);opacity:0;transition:opacity 0.3s;' +
      'pointer-events:auto;max-width:90vw;text-align:center;direction:rtl;';
    getContainer().appendChild(el);
    requestAnimationFrame(function () { el.style.opacity = '1'; });
    setTimeout(function () {
      el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 300);
    }, 3000);
  }

  window.showToast = showToast;
})();
