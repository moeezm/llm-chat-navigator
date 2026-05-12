window.__chatNavProviders = window.__chatNavProviders || {};

window.__chatNavProviders.claude = {
  name: 'Claude',

  getObserveTarget() {
    const inputContainer = document.querySelector('div[data-chat-input-container="true"]');
    if (!inputContainer) return null;
    const parent = inputContainer.parentElement;
    for (const child of parent.children) {
      if (child !== inputContainer && !child.classList.contains('sr-only')) {
        return child;
      }
    }
    return null;
  },

  getUserMessages() {
    return document.querySelectorAll('[data-testid="user-message"]');
  },

  getMessageText(element) {
    const paragraphs = element.querySelectorAll(':scope > p');
    return Array.from(paragraphs).map(p => p.textContent).join('\n');
  },

  getScrollOffset() {
    const header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height : 0;
  },

  getBackgroundColor() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return null;
    const parent = mainContent.parentElement;
    for (const child of parent.children) {
      if (child !== mainContent) {
        const bg = getComputedStyle(child).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          return bg;
        }
      }
    }
    return null;
  },
};
