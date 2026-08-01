/* ==========================================================================
   MODAL SYSTEM — modal.js
   Intercepts native alert() and exposes showModal() for custom notifications.
   dashboard.js is NOT modified — the override happens before it loads.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. CONFIG — maps keywords in alert messages to modal types
  ------------------------------------------------------------------ */
  var SVG = {
    success: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    error:   '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    warning: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info:    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
  };

  var TYPE_CONFIG = {
    success: {
      icon: SVG.success,
      title: 'Éxito',
      cssClass: 'modal-success'
    },
    error: {
      icon: SVG.error,
      title: 'Error',
      cssClass: 'modal-error'
    },
    warning: {
      icon: SVG.warning,
      title: 'Advertencia',
      cssClass: 'modal-warning'
    },
    info: {
      icon: SVG.info,
      title: 'Información',
      cssClass: 'modal-info'
    }
  };

  /* Keywords that map a plain-text alert message to a modal type */
  var KEYWORD_MAP = [
    { keywords: ['registrado', 'exitoso', 'éxito', 'exito', 'guardado', 'agregado', 'correcto', 'ok'], type: 'success' },
    { keywords: ['error', 'inválido', 'invalido', 'falló', 'fallo', 'incorrecto', 'no se pudo'], type: 'error'   },
    { keywords: ['advertencia', 'cuidado', 'atención', 'atencion', 'aviso'], type: 'warning' }
  ];

  /* ------------------------------------------------------------------
     2. DETECT TYPE from message text
  ------------------------------------------------------------------ */
  function detectType(message) {
    var lower = message.toLowerCase();
    for (var i = 0; i < KEYWORD_MAP.length; i++) {
      var rule = KEYWORD_MAP[i];
      for (var j = 0; j < rule.keywords.length; j++) {
        if (lower.indexOf(rule.keywords[j]) !== -1) {
          return rule.type;
        }
      }
    }
    return 'info'; // default
  }

  /* ------------------------------------------------------------------
     3. CORE: showModal(message, type)
        type: 'success' | 'error' | 'warning' | 'info'  (optional)
  ------------------------------------------------------------------ */
  window.showModal = function (message, type) {
    // Resolve type
    type = type || detectType(String(message));
    var cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;

    var backdrop = document.getElementById('appModal');
    if (!backdrop) {
      // Fallback — modal HTML not in DOM yet (should not happen)
      window._nativeAlert(message);
      return;
    }

    // Remove all previous type classes
    backdrop.classList.remove('modal-success', 'modal-error', 'modal-warning', 'modal-info');
    backdrop.classList.add(cfg.cssClass);

    // Populate content
    document.getElementById('modalIcon').innerHTML      = cfg.icon;
    document.getElementById('modalTitle').textContent   = cfg.title;
    document.getElementById('modalMessage').textContent = String(message);

    // Open
    backdrop.classList.add('is-open');

    // Focus confirm button for accessibility
    var confirmBtn = document.getElementById('modalConfirmBtn');
    if (confirmBtn) {
      setTimeout(function () { confirmBtn.focus(); }, 50);
    }
  };

  /* ------------------------------------------------------------------
     4. CLOSE LOGIC
  ------------------------------------------------------------------ */
  function closeModal() {
    var backdrop = document.getElementById('appModal');
    if (!backdrop) return;
    backdrop.classList.remove('is-open');
  }

  // Wire up close button and confirm button after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    var backdrop    = document.getElementById('appModal');
    var closeBtn    = document.getElementById('modalCloseBtn');
    var confirmBtn  = document.getElementById('modalConfirmBtn');

    if (closeBtn)   closeBtn.addEventListener('click', closeModal);
    if (confirmBtn) confirmBtn.addEventListener('click', closeModal);

    // Click on backdrop overlay (outside modal-box) also closes
    if (backdrop) {
      backdrop.addEventListener('click', function (e) {
        if (e.target === backdrop) closeModal();
      });
    }

    // Escape key closes modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });

    /* ----------------------------------------------------------------
       5. EMPTY STATE — hide/show the "no records" placeholder row
          whenever tablaTorneos content changes
    ---------------------------------------------------------------- */
    var tbody = document.getElementById('tablaTorneos');
    if (tbody) {
      var observer = new MutationObserver(function () {
        syncEmptyState(tbody);
      });
      observer.observe(tbody, { childList: true, subtree: true });
    }
  });

  /* ------------------------------------------------------------------
     6. EMPTY STATE SYNC
  ------------------------------------------------------------------ */
  function syncEmptyState(tbody) {
    var emptyRow = document.getElementById('emptyRow');
    if (!emptyRow) return;

    // Count real data rows (exclude the emptyRow itself)
    var realRows = 0;
    var rows = tbody.querySelectorAll('tr');
    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id !== 'emptyRow') realRows++;
    }

    emptyRow.style.display = realRows > 0 ? 'none' : '';
  }

  /* ------------------------------------------------------------------
     7. OVERRIDE window.alert
        Store the native function first, then replace it.
        dashboard.js calls alert("Torneo registrado") — this catches it.
  ------------------------------------------------------------------ */
  window._nativeAlert = window.alert;

  window.alert = function (message) {
    window.showModal(message);
  };

})();
