MathJax = {
  tex: { inlineMath: {'[+]': [['$', '$']]} },
  options: {
    enableMenu: false
  },
  output: { displayOverflow: 'linebreak' },
  startup: {
    ready: () => {
      MathJax.startup.defaultReady();

      document.addEventListener('copy', (event) => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) return;

        const range = sel.getRangeAt(0);
        const fragment = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(fragment);

        div.querySelectorAll('mjx-math[data-latex]').forEach(el => {
          const tex = el.getAttribute('data-latex');
          const display = el.tagName === 'MJX-DISPLAY' || el.hasAttribute('display');
          const replacement = display ? `\\[${tex}\\]` : `\\(${tex}\\)`;
          el.replaceWith(document.createTextNode(replacement));
        });

        event.clipboardData.setData('text/plain', div.textContent);
        event.preventDefault();
      });
    }
  }
};
