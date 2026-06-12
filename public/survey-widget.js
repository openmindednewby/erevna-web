/**
 * Erevna Embeddable Survey Widget Loader
 *
 * Usage:
 *   <div data-survey-widget data-survey-id="YOUR_SURVEY_ID" data-origin="https://your-app.com"></div>
 *   <script src="https://your-app.com/survey-widget.js"></script>
 *
 * Attributes:
 *   data-survey-widget - Required. Marks the element as a widget container.
 *   data-survey-id     - Required. The public survey/template external ID.
 *   data-origin        - Required. The SaaS application origin (protocol + host).
 *   data-width         - Optional. iframe width (default: "100%").
 *   data-height        - Optional. iframe height in px (default: 600).
 *   data-theme         - Optional. "light" or "dark" theme override.
 *   data-accent-color  - Optional. Hex accent color override.
 */
(function () {
  'use strict';

  var DEFAULT_WIDTH = '100%';
  var DEFAULT_HEIGHT = 600;
  var MESSAGE_TYPE = 'survey-widget-resize';

  function initWidgets() {
    var containers = document.querySelectorAll('[data-survey-widget]');
    for (var i = 0; i < containers.length; i++) {
      createWidget(containers[i]);
    }
  }

  function createWidget(container) {
    var surveyId = container.getAttribute('data-survey-id');
    var origin = container.getAttribute('data-origin');
    if (!surveyId || !origin) return;

    var width = container.getAttribute('data-width') || DEFAULT_WIDTH;
    var height = parseInt(container.getAttribute('data-height'), 10) || DEFAULT_HEIGHT;
    var theme = container.getAttribute('data-theme') || '';
    var accentColor = container.getAttribute('data-accent-color') || '';

    var params = ['embed=1'];
    if (theme) params.push('theme=' + encodeURIComponent(theme));
    if (accentColor) params.push('accentColor=' + encodeURIComponent(accentColor));

    var src = origin + '/public/survey/embed/' + encodeURIComponent(surveyId) + '?' + params.join('&');

    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = width;
    iframe.style.height = height + 'px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'Embedded Survey');
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');

    container.appendChild(iframe);

    window.addEventListener('message', function (event) {
      if (event.origin !== origin) return;
      var data = event.data;
      if (data && data.type === MESSAGE_TYPE && typeof data.height === 'number') {
        iframe.style.height = data.height + 'px';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }
})();
