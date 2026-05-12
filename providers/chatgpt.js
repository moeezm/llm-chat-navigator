window.__chatNavProviders = window.__chatNavProviders || {};

window.__chatNavProviders.chatgpt = {
  name: 'ChatGPT',

  getObserveTarget() {
    return document.getElementById('thread');
  },

  getUserMessages() {
    return document.querySelectorAll('div[data-testid="collapsible-user-message-content"]');
  },

  getMessageText(element) {
    const child = element.children[0];
    return child ? child.innerText : '';
  },

  getScrollOffset() {
    const header = document.querySelector('header');
    return header ? header.getBoundingClientRect().height : 0;
  },

  getBackgroundColor() {
    const sidebar = document.getElementById('stage-slideover-sidebar');
    if (!sidebar) return null;
    const bg = getComputedStyle(sidebar).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
      return bg;
    }
    return null;
  },
};
