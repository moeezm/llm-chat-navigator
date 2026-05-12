(function () {
  const SIDEBAR_ID = 'chat-nav-sidebar';
  const DEFAULTS = { sidebarWidth: '15vw', maxDisplayLength: 200, smoothScroll: true };
  let settings = { ...DEFAULTS };
  const MAX_SETUP_RETRIES = 20;
  let currentObserver = null;
  let setupTimer = null;
  let debounceTimer = null;

  function getProvider() {
    const providers = window.__chatNavProviders || {};
    const hostname = window.location.hostname;
    if (hostname.includes('claude.ai')) return providers.claude;
    if (hostname.includes('chatgpt.com')) return providers.chatgpt;
    return null;
  }

  function createSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;

    const title = document.createElement('div');
    title.className = 'chat-nav-title';
    title.textContent = 'Questions';
    sidebar.appendChild(title);

    const list = document.createElement('div');
    list.className = 'chat-nav-list';
    sidebar.appendChild(list);

    return sidebar;
  }

  function updateSidebar(provider) {
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (!sidebar) return;

    const list = sidebar.querySelector('.chat-nav-list');
    list.innerHTML = '';

    const messages = provider.getUserMessages();
    messages.forEach((msgEl) => {
      const text = provider.getMessageText(msgEl);
      if (!text.trim()) return;

      const item = document.createElement('div');
      item.className = 'chat-nav-item';
      item.textContent = text.length > settings.maxDisplayLength ? text.substring(0, settings.maxDisplayLength) + '...' : text;
      item.title = text;
      item.addEventListener('click', () => {
        const offset = provider.getScrollOffset ? provider.getScrollOffset() : 0;
        msgEl.style.scrollMarginTop = (offset + 0) + 'px';
        msgEl.scrollIntoView({ behavior: settings.smoothScroll ? 'smooth' : 'auto', block: 'start' });
      });

      list.appendChild(item);
    });
  }

  function teardown() {
    clearTimeout(setupTimer);
    setupTimer = null;
    if (currentObserver) {
      currentObserver.disconnect();
      currentObserver = null;
    }
    const sidebar = document.getElementById(SIDEBAR_ID);
    if (sidebar) sidebar.remove();
    document.body.style.paddingRight = '';
  }

  function init() {
    const provider = getProvider();
    if (!provider) return;

    let retries = 0;
    const trySetup = () => {
      const observeTarget = provider.getObserveTarget();
      if (!observeTarget) {
        if (++retries >= MAX_SETUP_RETRIES) return;
        setupTimer = setTimeout(trySetup, 100);
        return;
      }

      teardown();

      const sidebar = createSidebar();
      sidebar.style.width = settings.sidebarWidth;
      if (provider.getBackgroundColor) {
        const bg = provider.getBackgroundColor();
        if (bg) sidebar.style.background = bg;
      }
      document.body.appendChild(sidebar);
      document.body.style.paddingRight = settings.sidebarWidth;

      updateSidebar(provider);

      currentObserver = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => updateSidebar(provider), 300);
      });
      currentObserver.observe(observeTarget, { childList: true, subtree: true });
    };

    trySetup();
  }

  // SPA navigation detection — teardown immediately, then re-init
  let lastUrl = location.href;
  new MutationObserver(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      teardown();
      setTimeout(init, 100);
    }
  }).observe(document.body, { childList: true, subtree: true });

  // Load settings then start; re-init live when settings change
  chrome.storage.sync.get(DEFAULTS, (stored) => {
    settings = { ...DEFAULTS, ...stored };
    init();
  });

  chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      settings[key] = newValue;
    }
    init();
  });
})();
